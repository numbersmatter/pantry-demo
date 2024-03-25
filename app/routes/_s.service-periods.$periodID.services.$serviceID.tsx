import { json, type ActionFunctionArgs, redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ContainerPadded } from "~/components/common/containers";
import { DataTable } from "~/components/display/data-table";
import { FoodBoxRequestInvoiceTable, ServiceInvoice } from "~/components/pages/service-transactions/service-invoice";
import { protectedRoute } from "~/lib/auth/auth.server";
import { familyDb } from "~/lib/database/families/family-crud.server";
import { FoodBoxOrder } from "~/lib/database/food-box-order/types/food-box-order-model";
import { seatsDb } from "~/lib/database/seats/seats-crud.server";
import { serviceTransactionsDb } from "~/lib/database/service-transactions/service-transactions-crud.server";
import { dollarValueConverter } from "~/lib/value-estimation/utils";

const foodBoxRequest: FoodBoxOrder = {
  id: "1",
  photo_url: "",
  notes: "",
  value_estimation_process: "other",
  value_estimation_type: "other",
  delivery_method: 'DoorDash',
  items: [
    {
      item_id: "fdsfef",
      item_name: "March 1, 2024 Menu Box",
      value: 7000,
      quantity: 1,
      type: "menu-box"
    },
    {
      item_id: "fdfac",
      item_name: "Bread Item",
      value: 300,
      quantity: 1,
      type: "individual-items"
    },

  ],
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);
  const serviceID = params["serviceID"] ?? "serviceID";

  const service = await serviceTransactionsDb.read(serviceID);
  if (!service) {
    return redirect("/service-transactions");
  }

  const seat = await seatsDb.read(service.delivered_to);
  if (!seat) {
    throw new Response("Transaction is not associated with a seat", { status: 404 });
  }

  const family = await familyDb.read(seat.family_id);
  if (!family) {
    throw new Response("Seat is not associated with a family", { status: 404 });
  }

  // const id = 

  const lineItems = foodBoxRequest

  return json({ serviceID, service, lineItems, seat, family });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return null;
};


export default function ServiceTransactionServiceIDRoute() {
  const { serviceID, service, lineItems, family, seat } = useLoaderData<typeof loader>();

  const { service_completed_date, ...rest } = service

  const serviceTransaction = {
    ...rest,
    service_created_data: new Date(service.service_created_data),
    service_updated_date: new Date(service.service_updated_date),
  }

  const familyName = family.family_name;
  const seatData = () => {
    const { unenrolled_date, ...rest } = seat;
    if (seat.unenrolled_date) {
      return {
        ...seat,
        created_date: new Date(seat.created_date),
        updated_date: new Date(seat.updated_date),
        enrolled_date: new Date(seat.enrolled_date),
        unenrolled_date: new Date(seat.unenrolled_date),
      }
    }

    return {
      ...rest,
      created_date: new Date(seat.created_date),
      updated_date: new Date(seat.updated_date),
      enrolled_date: new Date(seat.enrolled_date),
    }
  }

  const invoiceItems = lineItems.items.map((item) => {
    return {
      ...item,
      value: dollarValueConverter(item.value),
    }
  })

  return (
    <ContainerPadded>
      <ServiceInvoice
        seat={seatData()}
        service={serviceTransaction}
        familyName={familyName}
      >
        <FoodBoxRequestInvoiceTable foodBoxOrder={foodBoxRequest} />
      </ServiceInvoice>
      <pre>{JSON.stringify(lineItems, null, 2)}</pre>
    </ContainerPadded>
  )
}