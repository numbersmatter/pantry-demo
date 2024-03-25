import { Outlet, json, useLoaderData } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node";
import { protectedRoute } from "~/lib/auth/auth.server";
import { ContainerPadded } from "~/components/common/containers";
import { SectionHeaderWithAddAction } from "~/components/common/section-headers";
import { DataTable } from "~/components/display/data-table";
import { driveThruTable } from "~/lib/database/drive-thru/drive-thru-tables";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);
  return json({});
};


const driveThruForms = [
  {
    staff_id: "1",
    staff_name: "John Doe",
    created_date: new Date().toLocaleDateString(),
    form_id: "3"
  }
]



export default function Route() {

  return (
    <ContainerPadded>
      <Outlet />
    </ContainerPadded>
  )
}


function LinkToAdd() {
  return (
    <a href="/drive-thru/new" className="btn btn-primary">Add Drive Thru Form</a>
  )
}