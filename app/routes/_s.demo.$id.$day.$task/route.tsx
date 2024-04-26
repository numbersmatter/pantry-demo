import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, json, redirect, useLoaderData, useMatches, useParams } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node";
import { WeekData } from "~/lib/demo/demo-data";

import { DayTasks } from "./day-tasks";
import { protectedRoute } from "~/lib/auth/auth.server";
import { db } from "~/lib/database/firestore.server";
import { performMutation } from "remix-forms";
import { SetTaskStatusSchema, setTaskStatus } from "./domain-funcs";






export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const day = params.day as string;
  const task = params.task as string;

  const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  if (!validDays.includes(day)) {
    throw new Error(`Invalid day ${day}`);
  }

  const workDay = day as keyof WeekData['taskData']

  return json({ workDay, task });
};


export const action = async ({ request, params }: ActionFunctionArgs) => {
  await protectedRoute(request);
  const day = params.day as string;
  const weekPlanId = params.id as string;
  const taskId = params.task as string;
  const weekPlanDoc = await db.weekplan.read(weekPlanId);

  if (!weekPlanDoc) {
    throw new Error("Weekplan not found");
  }

  const cloneRequest = request.clone();
  const formData = await cloneRequest.formData();
  const action = formData.get('_action') as string;

  if (action === 'setTaskStatus') {
    const result = await performMutation({
      request,
      schema: SetTaskStatusSchema,
      mutation: setTaskStatus(weekPlanId, taskId, true),
    })
    if (!result.success) {
      return json(result)
    }

    const newUrl = `/demo/${weekPlanId}/${day}`;
    return redirect(newUrl);

  }



  return json({ success: false });
};



export default function TaskRoute() {
  const data = useLoaderData<typeof loader>();
  const params = useParams();
  const task_id = params.task as string;

  return <DayTasks task_id={task_id} />

}

