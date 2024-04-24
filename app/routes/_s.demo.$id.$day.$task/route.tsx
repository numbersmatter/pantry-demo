import { Form, json, useLoaderData, useMatches, useParams } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node";
import { ProgressSteps, Step } from "./progress";
import { TaskCard } from "./task-card";
import { WeekData } from "~/lib/demo/demo-data";
import { Vstep } from "../_s.demo.$id.$day._index/steps";
import { TaskDrawer } from "./taskdrawer";
import { useState } from "react";
import { Button } from "~/components/shadcn/ui/button";
import { FormNumberField } from "~/components/forms/number-field";
import { DayTasks } from "./day-tasks";




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


export default function TaskRoute() {
  const data = useLoaderData<typeof loader>();
  const params = useParams();
  const task_id = params.task as string;

  return <DayTasks task_id={task_id} />

}

