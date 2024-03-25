import type { ActionFunctionArgs } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect, useLoaderData } from "@remix-run/react";
import { DataTable } from "~/components/display/data-table";
import { protectedRoute } from "~/lib/auth/auth.server";
import { serviceTransactionsDb } from "~/lib/database/service-transactions/service-transactions-crud.server";
import { serviceTransactionColumns, servicesOnSeat } from "~/lib/database/service-transactions/service-transactions-tables";


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);
  const baseUrl = `/service-periods/${params.periodID}`;

  const seatID = params.seatID ?? "seatID";

  const service_transactions = await serviceTransactionsDb.queryByField("delivered_to", "==", seatID);

  return json({ baseUrl, service_transactions, });
};


export const action = async ({ request }: ActionFunctionArgs) => {
  let { user } = await protectedRoute(request);
  const formData = await request.formData()
  const serviceID = formData.get("serviceID") as string;

  const service = await serviceTransactionsDb.read(serviceID);

  if (!service) {
    return json({ message: "Service not found" }, { status: 404 });
  }
  const url = `/service-periods/${service.service_period_id}/services/${serviceID}`;

  return redirect(url);
};




export default function Route() {
  const { baseUrl, service_transactions } = useLoaderData<typeof loader>();


  const servicesData = service_transactions.map(service => {
    return {
      id: service.id,
      delivered_to: service.delivered_to,
      status: service.status,
      created_date: service.service_created_data,
    }

  })

  return (
    <div>
      <div className="mx-auto prose">
        <h3>Seat information</h3>
      </div>
      <SeatStats />

      <DataTable columns={servicesOnSeat} data={servicesData} />

    </div>
  )

}

const stats = [
  { name: 'Total Subscribers', stat: '71,897' },
  { name: 'Avg. Open Rate', stat: '58.16%' },
  { name: 'Avg. Click Rate', stat: '24.57%' },
]

function SeatStats() {
  return (
    <div>
      <h3 className="text-base font-semibold leading-6 text-gray-900">Last 30 days</h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((item) => (
          <div key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item.stat}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
