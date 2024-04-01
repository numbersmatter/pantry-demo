import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { all, makeDomainFunction } from "domain-functions";
import { performMutation } from "remix-forms";
import { z } from "zod";
import ProgressPanels, { Step } from "~/components/common/progress-panels";
import { SingleButtonForm } from "~/components/common/single-button-form";
import { DataTable } from "~/components/display/data-table";
import { Button } from "~/components/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/shadcn/ui/card"
import { protectedRoute } from "~/lib/auth/auth.server";
import { db } from "~/lib/database/firestore.server";
import { TransactionRecord } from "~/lib/database/service-lists/list-actions-crud.server";
import { serviceListsDb } from "~/lib/database/service-lists/service-lists-crud.server";
import { updateSeatsCols } from "~/lib/database/service-lists/tables";
import { calculateTotalValue } from "~/lib/database/service-lists/utils";
import { ServiceTransaction } from "~/lib/database/service-transactions/types/service-trans-model";


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);
  const listID = params.listID ?? "listID";
  const serviceList = await serviceListsDb.read(listID);
  if (!serviceList) {
    throw new Response("Service List not found", { status: 404 });
  }
  const last_action = await db.bulk_list_actions.last_action(listID);

  if (!last_action) {
    throw new Error("No action found")
  }


  const all_transactions = [...last_action.records_created, ...last_action.records_updated];

  const update_records = all_transactions.filter((transaction) => {
    return serviceList.seats_array.includes(transaction.seat_id)
  })

  const update_transactions = update_records.map((transaction) => {
    return {
      seat_id: transaction.seat_id,
      transactionId: transaction.transactionId,
      current_value: transaction.value,
      new_value: calculateTotalValue(serviceList.service_items)
    }
  })

  const newSeats = serviceList.seats_array.filter((seat_id) => {
    return !all_transactions.some((transaction) => transaction.seat_id === seat_id)
  })

  const cancelled_records = all_transactions.filter((transaction) => {
    return !serviceList.seats_array.includes(transaction.seat_id)
  }).map((record) => {
    return {
      seat_id: record.seat_id,
      transactionId: record.transactionId,
      current_value: record.value,
      new_value: calculateTotalValue(serviceList.service_items)
    }
  });


  const serviceType = serviceList.service_type;
  const numberOfRecords = serviceList.seats_array.length;
  const baseUrl = `/service-lists/${listID}/update`

  const steps: Step[] = [
    { id: 'items', name: 'Menu Items', to: `${baseUrl}`, status: "complete" },
    { id: 'seat', name: 'Seat Selection', to: `${baseUrl}/seats`, status: 'complete' },
    { id: 'preview', name: 'Preview', to: `${baseUrl}/preview`, status: 'current' },
  ];

  return json({ newSeats, numberOfRecords, steps, listID, last_action, all_transactions, update_transactions, cancelled_records });
};

const schema = z.object({
  actionType: z.literal("applyUpdate"),
  last_action_id: z.string().length(20),
  serviceListID: z.string().length(20),
})

const mutation = (staff: { staff_id: string, staff_name: string }) => makeDomainFunction(schema)(
  (async (values) => {
    const serviceList = await serviceListsDb.read(values.serviceListID);
    if (!serviceList) {
      throw new Response("Service List not found", { status: 404 })
    }

    const last_action = await db.bulk_list_actions.last_action(values.serviceListID);

    if (!last_action) {
      throw new Error("No action found")
    }

    if (last_action.id !== values.last_action_id) {
      throw new Error("Last action id does not match")
    }

    const transactionValue = calculateTotalValue(serviceList.service_items)


    const all_transactions = [...last_action.records_created, ...last_action.records_updated];

    const update_records = all_transactions.filter((transaction) => {
      return serviceList.seats_array.includes(transaction.seat_id)
    })


    const update_transactions = update_records.map((transaction) => {
      return {
        seat_id: transaction.seat_id,
        transactionId: transaction.transactionId,
        current_value: transaction.value,
        new_value: calculateTotalValue(serviceList.service_items)
      }
    })

    // go through all transactions and update the value
    const updatePromises = update_transactions.map((update) => {
      db.service_transactions.update(
        update.transactionId,
        {
          value: update.new_value,
        }
      )

      const transaction_record: TransactionRecord = {
        seat_id: update.seat_id,
        transactionId: update.transactionId,
        value: update.new_value
      }
      return transaction_record;
    })

    const records_updated = await Promise.all(updatePromises);

    const newSeats = serviceList.seats_array.filter((seat_id) => {
      return !all_transactions.some((transaction) => transaction.seat_id === seat_id)
    })

    const cancelled_records = all_transactions.filter((transaction) => {
      return !serviceList.seats_array.includes(transaction.seat_id)
    });

    const cancelled_promises = cancelled_records.map((record) => {
      return db.service_transactions.update(record.transactionId, { status: "cancelled" })
    })

    await Promise.all(cancelled_promises);

    const created_seats_transactions = newSeats.map(async (seat_id) => {
      // create transaction
      const transactionData: ServiceTransaction = {
        service_type: serviceList.service_type,
        status: "pending",
        delivered_to: seat_id,
        service_created_data: new Date(),
        service_updated_date: new Date(),
        id: "",
        service_period_id: serviceList.service_period_id,
        value: transactionValue,
      }

      const transaction_id = await db.service_transactions.create(transactionData);

      const transaction_record: TransactionRecord = {
        seat_id: seat_id,
        transactionId: transaction_id,
        value: transactionValue
      }

      return transaction_record;
    })

    const created_transactions = await Promise.all(created_seats_transactions);

    const bulk_action_id = await db.bulk_list_actions.create({
      service_list_id: values.serviceListID,
      records_created: created_transactions,
      records_updated,
      records_canceled: cancelled_records,
      records_unchanged: [],
      seats_array: serviceList.seats_array,
      line_items: serviceList.service_items,
      staff,
    })

    return { bulk_action_id, serviceListID: values.serviceListID };
  })
)


export const action = async ({ request, params }: ActionFunctionArgs) => {
  let { user, staffData } = await protectedRoute(request);
  const listID = params.listID ?? "listID";
  const serviceList = await serviceListsDb.read(listID);
  if (!serviceList) {
    return json({ error: "Service List not found" }, { status: 404 });
  }

  const result = await performMutation({
    request,
    schema,
    mutation: mutation({ staff_id: user.uid, staff_name: staffData.fname }),
  });

  if (!result.success) {
    return json(result);
  }

  return redirect(`/service-lists/${listID}`);
};





export default function Route() {
  const data = useLoaderData<typeof loader>();


  return (
    <>
      <ProgressPanels steps={data.steps} />
      <PreviewCard
        serviceType="Food Box Request"
        numberOfRecords={data.numberOfRecords}
        serviceListID={data.listID}
        last_action_id={data.last_action.id}
        newSeats={data.newSeats}
        all_transactions={data.all_transactions}
        update_transactions={data.update_transactions}
      >
        <div className="prose">
          <h4>New Records</h4>
          <p>This action will create new records for:</p>
          {
            data.newSeats.length === 0 && <p>No new records will be created</p>
          }
          <ul>
            {
              data.newSeats.map((seat) => {
                return <li key={seat}>{seat}</li>
              })
            }
          </ul>
        </div>
        <div className="prose">
          <h4>Cancelled Records</h4>
          <p>This action will cancel the following records:</p>
          <DataTable columns={updateSeatsCols} data={data.cancelled_records} />
        </div>
        <div className="prose">
          <h4>Updated Records</h4>
          <p>This action will update the following records:</p>
          <DataTable columns={updateSeatsCols} data={data.update_transactions} />
        </div>
      </PreviewCard>
    </>
  )
}


function PreviewCard({
  children,
  serviceType,
  numberOfRecords,
  serviceListID,
  last_action_id,
  newSeats,
  all_transactions,
  update_transactions,
}: {
  children: React.ReactNode,
  serviceType: string,
  numberOfRecords: number,
  serviceListID: string,
  last_action_id: string,
  newSeats: string[],
  all_transactions: TransactionRecord[],
  update_transactions: { seat_id: string, transactionId: string, current_value: number, new_value: number }[]
}) {
  return (

    <Card>
      <CardHeader>
        <CardTitle> Apply This List of Services</CardTitle>
        <CardDescription>
          This applying an update will do the following:
        </CardDescription>
      </CardHeader>
      <CardContent>
        {children}



      </CardContent>
      <CardFooter className="flex flex-row justify-between" >
        <Button variant="link">Back</Button>
        <SingleButtonForm text="Apply Services">
          <input type="hidden" name="actionType" value="applyUpdate" />
          <input type="hidden" name="last_action_id" value={last_action_id} />

          <input type="hidden" name="serviceListID" value={serviceListID} />
        </SingleButtonForm>
      </CardFooter>
    </Card>
  )
}