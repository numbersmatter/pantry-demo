import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ServicePeriodTabs } from "~/components/pages/service-periods/headers";
import { protectedRoute } from "~/lib/auth/auth.server";


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);
  const baseUrl = `/service-periods/${params.periodID}`;

  return json({ baseUrl });
};


export default function Route() {
  const { baseUrl } = useLoaderData<typeof loader>();
  console.log("url", baseUrl)
  return (
    <main>
      <ServicePeriodTabs baseUrl={baseUrl} defaultTab="" />
      <div className="mt-6" />
    </main>
  )
}