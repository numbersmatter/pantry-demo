import { Link, Outlet, json, useLoaderData } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node";
import { protectedRoute } from "~/lib/auth/auth.server";
import { ContainerPadded } from "~/components/common/containers";
import { SectionHeaderWithAddAction } from "~/components/common/section-headers";
import { DataTable } from "~/components/display/data-table";
import { driveThruTable } from "~/lib/database/drive-thru/drive-thru-tables";
import { db } from "~/lib/database/firestore.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);
  const driveThruForms = await db.drive_thru.getAll();

  const orderedForms = driveThruForms.sort((a, b) => {
    const dateA = new Date(a.created_date);
    const dateB = new Date(b.created_date);
    return dateB.getTime() - dateA.getTime();

  })

  return json({ orderedForms });
};


// const driveThruForms = [
//   {
//     staff_id: "1",
//     staff_name: "John Doe",
//     created_date: new Date().toLocaleDateString(),
//     form_id: "3"
//   }
// ]



export default function Route() {
  const { orderedForms } = useLoaderData<typeof loader>();

  const data = orderedForms.map((form) => {
    const readDate = new Date(form.created_date);
    const formattedDate = `${readDate.toLocaleDateString()} ${readDate.toLocaleTimeString()}`;

    return {
      ...form,
      form_id: form.id,
      created_date: formattedDate
    }
  })

  return (
    <>
      <SectionHeaderWithAddAction
        title="Drive Thru Forms"
        addButton={<LinkToAdd />}
      />
      <DataTable columns={driveThruTable} data={data} />
    </>
  )
}


function LinkToAdd() {
  return (
    <Link to="/drive-thru/add" className="">Add Drive Thru Form</Link>
  )
}