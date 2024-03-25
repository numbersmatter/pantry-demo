import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { programsDb } from "~/lib/database/programs/programs-crud.server";
import ProgramAreaDetails from "~/components/pages/program-areas/program-area-details";
import { protectedRoute } from "~/lib/auth/auth.server";
import { getProgramArea } from "~/lib/database/program-area/business-logic/domain.server";
import { DataTable } from "~/components/display/data-table";
import { programsOfAreaColumns } from "~/lib/database/programs/tables";


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);
  const areaID = params.areaID ?? "areaID";
  const programArea = await getProgramArea(areaID);
  const programArea_Programs = await programsDb.queryBy("program_area_id", areaID);
  return json({ programArea, programArea_Programs });
};

export default function ProgramAreaDetailsRoute() {
  const data = useLoaderData<typeof loader>();

  const programArea = {
    ...data.programArea,
    created_date: new Date(data.programArea.created_date),
  }


  return (
    <main>
      <ProgramAreaDetails programArea={programArea} />
      <DataTable
        columns={programsOfAreaColumns}
        data={data.programArea_Programs}
      />
    </main>
  )
}
