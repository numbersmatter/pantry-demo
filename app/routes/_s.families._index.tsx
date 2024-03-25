import { json, useLoaderData } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node";
import { SectionHeaderWithAddAction } from "~/components/common/section-headers"
import { Button } from "~/components/shadcn/ui/button"
import { DataTable } from "~/components/display/data-table";
import { FamilyIndexTable } from "~/lib/database/families/family-tables";
import { protectedRoute } from "~/lib/auth/auth.server";
import { db } from "~/lib/database/firestore.server";




export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);

  const families = await db.families.getAll();


  return json({ families });
};




export default function Route() {
  const data = useLoaderData<typeof loader>()

  const tableData = data.families.map((family) => {
    return {
      id: family.id,
      family_name: family.family_name,
      created_date: new Date(family.created_date).toLocaleDateString(),
    }
  })

  const totatlFamilies = data.families.length;

  return (
    <div>
      <SectionHeaderWithAddAction
        title={`Families (${totatlFamilies})`}
        addButton={<Button>Add</Button>}
      />
      <DataTable columns={FamilyIndexTable} data={tableData} />
      <p>Staff page content</p>
    </div>
  )
}