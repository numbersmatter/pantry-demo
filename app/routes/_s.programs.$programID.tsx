import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { ContainerPadded } from "~/components/common/containers";
import { HeaderTabs, SectionHeader, TabOption } from "~/components/common/header-tabs";
import { protectedRoute } from "~/lib/auth/auth.server";
import { db } from "~/lib/database/firestore.server";
import { programsDb } from "~/lib/database/programs/programs-crud.server";



export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);

  const programID = params.programID ?? "programID";

  const program = await programsDb.read(programID);
  if (!program) {
    throw new Response("Program not found", { status: 404 });
  }

  const tabs: TabOption[] = [
    { name: 'Overview', to: '', end: true },
    { name: 'Service Periods', to: 'service-periods', end: false },
  ]

  const baseUrl = `/programs/${programID}`;

  return json({ tabs, baseUrl, program });
};


export const action = async ({ request, params }: ActionFunctionArgs) => {
  let { user } = await protectedRoute(request);
  const programID = params.programID ?? "programID";
  const program = await programsDb.read(programID);
  if (!program) {
    throw new Response("Program not found", { status: 404 });
  }
  const service_period_id = await db.service_period.getLastServicePeriod(programID);

  if (!service_period_id) {
    return redirect(`/programs/${programID}/service-periods/new`);
  }

  return redirect(`/service-periods/${service_period_id}`);

};



export default function ProgramIDRoute() {
  const { program } = useLoaderData<typeof loader>();
  return (
    <>
      <SectionHeader title={program.name} text2={program.id} text3="text3" />

      <Outlet />

    </>
  )


}