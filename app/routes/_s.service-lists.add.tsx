import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { DataTable } from "~/components/display/data-table";
import { protectedRoute } from "~/lib/auth/auth.server";
import { serviceListsDb } from "~/lib/database/service-lists/service-lists-crud.server";
import { serviceListIndexCols } from "~/lib/database/service-lists/tables";
import z from "zod";
import { makeDomainFunction } from "domain-functions";
import { servicePeriodsDb, servicePeriodToDbModel } from "~/lib/database/service-periods/service-periods-crud.server";
import { seatsDb } from "~/lib/database/seats/seats-crud.server";
import { Service } from "node_modules/@google-cloud/storage/build/esm/src/nodejs-common";
import AddServiceListForm from "~/components/pages/service-lists/add-list-form";
import { performMutation } from "remix-forms";

const schema = z.object({
  name: z.string().min(3),
  description: z.string(),
  service_period_id: z.string().length(20),
});



const mutation = makeDomainFunction(schema)(
  async (values) => {

    // Ensure the service period exists
    const service_period = await servicePeriodsDb.read(values.service_period_id);
    if (!service_period) {
      throw new Response("Service period not found");
    }


    const service_periodDbModel = servicePeriodToDbModel(service_period);

    const serviceListData = {
      name: values.name,
      description: values.description,
      service_period_id: values.service_period_id,
      service_period: service_periodDbModel,
      seats_array: [],
      service_items: [],
    }

    const serviceListId = await serviceListsDb.create({
      ...serviceListData,
      service_type: "FoodBoxOrder",
    })

    return { status: "success", serviceListData, }
  }
)


export const loader = async ({ request }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);

  const servicePeriods = await servicePeriodsDb.getAll();

  const serviceLists = await serviceListsDb.getAll();
  return json({ serviceLists, servicePeriods });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  let { user } = await protectedRoute(request);
  const result = await performMutation({
    request,
    schema,
    mutation,
  });
  if (!result.success) {
    return result;
  }

  return redirect(`/service-lists/`);
};




export default function Route() {
  let { servicePeriods } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const servicePeriodOptions = servicePeriods.map(servicePeriod => {
    return { value: servicePeriod.id, label: servicePeriod.name }
  })



  return (
    <div>
      <AddServiceListForm
        servicePeriodOptions={servicePeriodOptions}
      />
      <pre>
        {JSON.stringify(actionData, null, 2)}
      </pre>
    </div>
  );
}