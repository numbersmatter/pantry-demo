import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { SectionHeaderWithAddAction } from "~/components/common/section-headers";
import { DataTable } from "~/components/display/data-table";
import { ServicePeriodTabs } from "~/components/pages/service-periods/headers";
import { protectedRoute } from "~/lib/auth/auth.server";
import { serviceTransactionsDb } from "~/lib/database/service-transactions/service-transactions-crud.server";
import { serviceTransactionColumns } from "~/lib/database/service-transactions/service-transactions-tables";
import { ServiceTransaction } from "~/lib/database/service-transactions/types/service-trans-model";


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);
  const baseUrl = `/service-periods/${params.periodID}`;

  const periodID = params.periodID ?? "periodID";

  const service_transactions = await serviceTransactionsDb.queryByField("service_period_id", "==", periodID);

  return json({ baseUrl, service_transactions, });
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
    <main>

      <SectionHeaderWithAddAction title="Service Transactions" addButton={<ActionButton title="Add Service" />} />
      <div className="mt-6" />
      <DataTable columns={serviceTransactionColumns} data={servicesData} />
      <pre>{JSON.stringify(service_transactions, null, 2)}</pre>
    </main>
  )
};

export function ActionButton({ title, }: { title: string, }) {
  return (
    <Link to="add"
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
    >
      {title}
    </Link>
  )
}