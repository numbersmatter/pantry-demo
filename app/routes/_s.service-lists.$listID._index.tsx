import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { Link, redirect, useLoaderData } from "@remix-run/react";
import { DataTable } from "~/components/display/data-table";
import { protectedRoute } from "~/lib/auth/auth.server";
import { db } from "~/lib/database/firestore.server";
import { serviceListsDb } from "~/lib/database/service-lists/service-lists-crud.server";
import { serviceListActionsCols } from "~/lib/database/service-lists/tables";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await protectedRoute(request);

  const listID = params.listID ?? "listID";
  const serviceList = await serviceListsDb.read(listID);
  if (!serviceList) {
    throw new Response("No service list by that ID found", { status: 404 });
  }

  // if status is "preparing" redirect to preparing page 
  if (serviceList.status === "preparing") {
    return redirect(`/service-lists/${listID}/preparing`);
  }

  const list_actions = await db.bulk_list_actions.ofServiceList(listID);

  return { list_actions, serviceList };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return null;
};

export default function RouteComponent() {
  const data = useLoaderData<typeof loader>()

  const listData = data.list_actions.map((action) => {
    return {
      created_date: new Date(action.created_date).toDateString(),
      id: action.id,
      records_created: action.records_created.length,
      records_updated: action.records_updated.length,
      records_canceled: action.records_canceled.length,
      records_unchanged: action.records_unchanged.length,
    };
  })

  return (
    <div className="prose">
      <h2>Service List: {data.serviceList.name}</h2>
      <div>
        <Link to={`/service-lists/${data.serviceList.id}/update`}>
          Update List
        </Link>
      </div>

      <h3>History</h3>
      <DataTable columns={serviceListActionsCols} data={listData} />

    </div>
  );
}