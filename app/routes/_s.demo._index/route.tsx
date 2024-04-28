import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect, type ActionFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import { SingleButtonForm } from "~/components/common/single-button-form";
import { db } from "~/lib/database/firestore.server";
import { createWeekStatus } from "~/lib/database/weekplan/domain-funcs";
import { demoData } from "~/lib/demo/demo-data";
import { protectedRoute } from "~/lib/auth/auth.server";
import { getWeekPlans } from "./domain-functions";
import { useLoaderData } from "@remix-run/react";
import { SectionHeader } from "~/components/common/header-tabs";
import { DataTable } from "~/components/display/data-table";
import { weekPlanColumns } from "~/lib/database/weekplan/tables";
import { CreateNewPlan } from "./create-new-plan";
import { makeDomainFunction } from "domain-functions";
import { performMutation } from "remix-forms";

const schema = z.object({
  _action: z.literal("create"),
  title: z.string().min(3),
});

const newPlanMutation = (data: any) => makeDomainFunction(schema)(
  async (values) => {
    const weekplanId = await db.weekplan.create({
      title: values.title,
      taskData: data,
      taskStatus: {},
    });

    return weekplanId;
  }
)

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await protectedRoute(request);

  const weekplans = await getWeekPlans();



  return json({ weekplans });
};



export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.clone().formData();
  const action = formData.get("_action");
  const data = demoData

  if (action === "create") {
    const result = await performMutation({
      request,
      schema,
      mutation: newPlanMutation(data),
    })

    if (!result.success) {
      const errors = result.errors;

      return json(errors, { status: 400 })
    }


    return redirect(`/demo/${result.data}`);
  }

  return json({}, { status: 200 });
};



export default function Route() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="px-4">
      <SectionHeader title="Week Plans" text2="test" text3="" />
      <CreateNewPlan />
      <DataTable data={data.weekplans} columns={weekPlanColumns} />
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  )

}