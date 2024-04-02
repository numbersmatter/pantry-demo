import { Link, json, useLoaderData } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node";
import { db } from "~/lib/database/firestore.server";
import ProgressPanels, { Step } from "~/components/common/progress-panels";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/shadcn/ui/card";
import { DataTable } from "~/components/display/data-table";
import { serviceListItemsCols } from "~/lib/database/service-lists/tables";
import { protectedRoute } from "~/lib/auth/auth.server";
import AddMenuItemDialog from "~/components/pages/service-lists/add-menu-item-dialog";


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);
  const listID = params.listID ?? "listID"
  const serviceList = await db.service_lists.read(listID);

  if (!serviceList) {
    throw new Response("Service List not found", { status: 404 });
  }


  const actionUrl = `/service-lists/${listID}/preparing?index`
  const baseUrl = `/service-lists/${listID}/update`

  const steps: Step[] = [
    { id: 'items', name: 'Menu Items', to: `${baseUrl}`, status: 'current' },
    { id: 'seat', name: 'Seat Selection', to: `${baseUrl}/seats`, status: 'upcoming' },
    { id: 'preview', name: 'Preview', to: `${baseUrl}/preview`, status: 'upcoming' },
  ];

  return json({ user, serviceList, steps, baseUrl, actionUrl });
};









export default function Route() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <ProgressPanels steps={data.steps} />
      <Card>
        <CardHeader>
          <CardTitle>Menu Items</CardTitle>
          <CardDescription>
            Add the menu items for this service list.
          </CardDescription>
        </CardHeader>
        <DataTable
          columns={serviceListItemsCols}
          data={data.serviceList.service_items}
        />
        <CardFooter className="py-2">
          <AddMenuItemDialog actionUrl={data.actionUrl} />
        </CardFooter>
      </Card>
      <pre>{JSON.stringify(data.serviceList, null, 2)} </pre>
    </>
  )
}
