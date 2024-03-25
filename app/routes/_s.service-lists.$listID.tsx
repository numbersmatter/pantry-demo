import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, json, redirect, useLoaderData } from "@remix-run/react";
import { StandardHeader } from "~/components/common/section-headers";
import { protectedRoute } from "~/lib/auth/auth.server";
import { serviceListsDb } from "~/lib/database/service-lists/service-lists-crud.server";



export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await protectedRoute(request);
  // check if service list exists
  // if not, throw 404
  const listID = params.listID ?? "listID";
  const serviceList = await serviceListsDb.read(listID);
  if (!serviceList) {
    throw new Response("No service list by that ID found", { status: 404 });
  }



  return json({ serviceList });
};


export default function Route() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="py-3">
      <StandardHeader
        title={data.serviceList.name}
        text2={data.serviceList.service_period.name}
        text3={data.serviceList.status}
      />

      <Outlet />
    </div>
  );
}
