import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { makeDomainFunction } from "domain-functions";
import { performMutation } from "remix-forms";
import { z } from "zod";
import ProgressPanels, { Step } from "~/components/common/progress-panels";
import { SingleButtonForm } from "~/components/common/single-button-form";
import { Button } from "~/components/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/shadcn/ui/card"
import { protectedRoute } from "~/lib/auth/auth.server";
import { serviceListsDb } from "~/lib/database/service-lists/service-lists-crud.server";
import { calculateTotalValue } from "~/lib/database/service-lists/utils";
import { serviceTransactionsDb } from "~/lib/database/service-transactions/service-transactions-crud.server";
import { ServiceTransaction } from "~/lib/database/service-transactions/types/service-trans-model";


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);
  const listID = params.listID ?? "listID";
  const serviceList = await serviceListsDb.read(listID);
  if (!serviceList) {
    throw new Response("Service List not found", { status: 404 });
  }

  if (serviceList.status === "applied") {
    return redirect(`/service-lists/${listID}`)
  }

  const serviceType = serviceList.service_type;
  const numberOfRecords = serviceList.seats_array.length;
  const baseUrl = `/service-lists/${listID}/preparing`

  const steps: Step[] = [
    { id: 'items', name: 'Menu Items', to: `${baseUrl}`, status: 'current' },
    { id: 'seat', name: 'Seat Selection', to: `${baseUrl}/seats`, status: 'upcoming' },
    { id: 'preview', name: 'Preview', to: `${baseUrl}/preview`, status: 'upcoming' },
  ];

  return json({ serviceType: "Food Box Request", numberOfRecords, steps, listID });
};

const schema = z.object({
  actionType: z.literal("applyServiceList"),
  serviceListID: z.string().length(20),
})

const mutation = makeDomainFunction(schema)(
  (async (values) => {
    const serviceList = await serviceListsDb.read(values.serviceListID);
    if (!serviceList) {
      throw new Response("Service List not found", { status: 404 })
    }

    const transactionValue = calculateTotalValue(serviceList.service_items)

    const transaction_promises = serviceList.seats_array.map(async (seat) => {
      // create transaction
      const transactionData: ServiceTransaction = {
        service_type: serviceList.service_type,
        status: "pending",
        delivered_to: seat,
        service_created_data: new Date(),
        service_updated_date: new Date(),
        id: "",
        service_period_id: serviceList.service_period_id,
        value: transactionValue,
      }

      return serviceTransactionsDb.create(
        transactionData
      );
    })

    const transactions = await Promise.all(transaction_promises);

    await serviceListsDb.update(
      values.serviceListID,
      { status: "applied" }
    )

    console.log(values);
    return transactions;
  })
)


export const action = async ({ request, params }: ActionFunctionArgs) => {
  let { user } = await protectedRoute(request);
  const listID = params.listID ?? "listID";
  const serviceList = await serviceListsDb.read(listID);
  if (!serviceList) {
    return json({ error: "Service List not found" }, { status: 404 });
  }

  const result = await performMutation({
    request,
    schema,
    mutation,
  });

  return json({ result });
};





export default function Route() {
  const data = useLoaderData<typeof loader>();


  return (
    <>
      <ProgressPanels steps={data.steps} />
      <PreviewCard
        serviceType="Food Box Request"
        numberOfRecords={2}
        serviceListID={data.listID}
      />
    </>
  )
}


function PreviewCard({
  serviceType,
  numberOfRecords,
  serviceListID
}: {
  serviceType: string,
  numberOfRecords: number,
  serviceListID: string
}) {
  return (

    <Card>
      <CardHeader>
        <CardTitle> Apply This List of Services</CardTitle>
        <CardDescription>
          This will create individual service transactions for your seats selected.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>This action will create {serviceType} transactions on {numberOfRecords.toString()} records</p>

      </CardContent>
      <CardFooter className="flex flex-row justify-between" >
        <Button variant="link">Back</Button>
        <SingleButtonForm text="Apply Services">
          <input type="hidden" name="actionType" value="applyServiceList" />
          <input type="hidden" name="serviceListID" value={serviceListID} />
        </SingleButtonForm>
      </CardFooter>
    </Card>
  )
}