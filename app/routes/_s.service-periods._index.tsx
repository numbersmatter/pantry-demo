import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { SectionHeaderWithAddAction } from "~/components/common/section-headers";
import { DataTable } from "~/components/display/data-table";
import { Button } from "~/components/shadcn/ui/button";
import { protectedRoute } from "~/lib/auth/auth.server";
import { servicePeriodsDb } from "~/lib/database/service-periods/service-periods-crud.server";
import { servicePeriodsOfProgramColumns } from "~/lib/database/service-periods/tables";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);
  const servicePeriods = await servicePeriodsDb.getAll();


  return json({ servicePeriods });
};




export default function Route() {
  const { servicePeriods } = useLoaderData<typeof loader>();
  return (
    <div className="pb-10">
      <SectionHeaderWithAddAction title="Service Periods" addButton={<Button>Add service period</Button>} />
      <div className="mt-6" />
      <DataTable columns={servicePeriodsOfProgramColumns} data={servicePeriods} />

    </div>
  )
}
