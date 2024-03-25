import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DataTable } from "~/components/display/data-table";
import { programAreaColumns, ProgramAreasTableCol } from "~/components/pages/program-areas/columns";
import { authenticator, protectedRoute } from "~/lib/auth/auth.server";
import { getProgramAreas } from "~/lib/database/program-area/business-logic/domain.server";


export const loader = async ({ request }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);

  const programAreasDb = await getProgramAreas();



  return json({ user, db: programAreasDb });
};


export default function ProgramAreasIndex() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <DataTable columns={programAreaColumns} data={data.db} />
    </div>
  )
}