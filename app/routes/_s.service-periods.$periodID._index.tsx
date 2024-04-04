import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import DataCards from "~/components/pages/home/data-cards";
import { ServicePeriodTabs } from "~/components/pages/service-periods/headers";
import { protectedRoute } from "~/lib/auth/auth.server";
import { db } from "~/lib/database/firestore.server";
import { reportServicePeriodDashboard } from "~/lib/domain-logic/service-period-dashboard";


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);
  const service_period_id = params.periodID ?? "periodID";
  const service_period = await db.service_period.read(service_period_id);
  if (!service_period) {
    throw new Response("No service period by that ID found", { status: 404 });
  }
  const baseUrl = `/service-periods/${params.periodID}`;
  const stats = await reportServicePeriodDashboard(service_period_id);

  return json({ baseUrl, stats });
};


export default function Route() {
  const { baseUrl, stats } = useLoaderData<typeof loader>();


  return (
    <main>
      <ServicePeriodTabs baseUrl={baseUrl} defaultTab="" />
      <div className="mt-6" />
      <div className="prose">
        <h3>Dashboard</h3>
        <DataCards stats={stats} />
      </div>
    </main>
  )
}