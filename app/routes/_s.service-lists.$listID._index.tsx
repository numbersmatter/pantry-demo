import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import { protectedRoute } from "~/lib/auth/auth.server";
import { serviceListsDb } from "~/lib/database/service-lists/service-lists-crud.server";

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

  return {};

};

export const action = async ({ request }: ActionFunctionArgs) => {
  return null;
};

export default function RouteComponent() {
  const data = useLoaderData<typeof loader>()
  return (
    <div>
      <h1>Service List</h1>
      <p>Service List ID: { }</p>

    </div>
  );
}