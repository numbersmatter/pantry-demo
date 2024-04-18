import { json, useLoaderData, useMatches } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node";
import { ProgressSteps, Step } from "./progress";
import { TaskCard } from "./task-card";
import { WeekData } from "~/lib/demo/demo-data";
import { Vstep } from "../_s.demo.$id.$day._index/steps";
import { TaskDrawer } from "./taskdrawer";
import { useState } from "react";
import { Button } from "~/components/shadcn/ui/button";




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

  return (
    <div className="py-4">
      <TaskCard
        task={currentTask}
      >
        <Button onClick={() => setOpen(true)}>Edit</Button>
      </TaskCard>
      <TaskDrawer open={open} setOpen={setOpen}>
        <div className="p-4">
          <h2 className="text-lg font-bold">Edit Task</h2>
          <p className="text-sm">Make changes to your task here. Click save when you're done.</p>
          <input type="text" placeholder="Task Name" className="input" />
          <textarea placeholder="Task Description" className="input"></textarea>
        </div>
      </TaskDrawer>
    </div>
  )
}

