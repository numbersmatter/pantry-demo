import { Form, json, useLoaderData, useMatches } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node";
import { ProgressSteps, Step } from "./progress";
import { TaskCard } from "./task-card";
import { WeekData } from "~/lib/demo/demo-data";
import { Vstep } from "../_s.demo.$id.$day._index/steps";
import { TaskDrawer } from "./taskdrawer";
import { useState } from "react";
import { Button } from "~/components/shadcn/ui/button";
import { FormNumberField } from "~/components/forms/number-field";




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
  const [open, setOpen] = useState(false)

  const matches = useMatches();
  const dataRoute = "routes/_s.demo.$id"
  const weekPlan = matches.find(m => m.id === dataRoute)?.data as WeekData

  const daySteps: Vstep[] = weekPlan.taskData[data.workDay].map((task, index) => {
    return {
      name: task.title,
      description: task.description,
      to: (index + 1).toString(),
      status: "upcoming",
    }
  })

  const currentTask = daySteps.find((task) => task.to === data.task) ?? { name: 'Task 1', description: 'This is the first task' }

  const currentTaskIndex = daySteps.findIndex((task) => task.to === data.task)
  const truckText = "On Mondays you will need to pickup our weekly order of food from Second Harvest Food Bank. The address is 1234 Main St. and you will need to be there by 2:30pm. The Executive Director will have the keys for the truck in their office. When you have received the keys enter the Odometer reading in the form to complete the task."

  return (
    <div className="py-4">
      <TaskCard
        task={currentTask}
      >
        <p className="prose text-slate-600">
          {truckText}
        </p>
        <div className="mt-4">
          <Button variant={"secondary"} onClick={() => setOpen(true)}>
            Enter Odometer
          </Button>
        </div>
      </TaskCard>
      <TaskDrawer
        open={open}
        setOpen={setOpen}
        title="Odometer Reading"
        description="Enter the odometer reading for the truck here."
      >
        <Form method="post">
          <FormNumberField label="Odometer Reading" id="odometer" />
          <div className="py-3 flex justify-end">
            <Button type="submit">Submit</Button>
          </div>
        </Form>
      </TaskDrawer>
    </div>
  )
}

