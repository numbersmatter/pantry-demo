import type { ActionFunctionArgs } from "@remix-run/node";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useActionData, useLoaderData } from "@remix-run/react";
import { SectionHeaderWithAddAction } from "~/components/common/section-headers";
import { SingleButtonForm } from "~/components/common/single-button-form";
import { DataTable } from "~/components/display/data-table";
import { protectedRoute } from "~/lib/auth/auth.server";
import { serviceListsDb } from "~/lib/database/service-lists/service-lists-crud.server";
import { serviceListIndexCols } from "~/lib/database/service-lists/tables";
import { ServiceListOLDDbModel } from "~/lib/database/service-lists/types";




export const loader = async ({ request }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);

  const serviceLists = await serviceListsDb.getAll();
  return json({ serviceLists });
};


export const action = async ({ request }: ActionFunctionArgs) => {
  let { user } = await protectedRoute(request);



  return json({});
};


export default function Route() {
  let { serviceLists } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();


  return (
    <div>
      <SectionHeaderWithAddAction
        title="Service Lists"
        addButton={<LinkToAdd />}
      />
      <DataTable columns={serviceListIndexCols} data={serviceLists} />
    </div>
  );
}

function UpdateServiceLists() {

  return (
    <SingleButtonForm

      text="Modify Service Lists"
    >
      <input type="hidden" readOnly name="action" value="modify" />
    </SingleButtonForm>
  )
}

function LinkToAdd() {
  return (
    <Link to="/service-lists/add" className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">New Service List</Link>

  )
}