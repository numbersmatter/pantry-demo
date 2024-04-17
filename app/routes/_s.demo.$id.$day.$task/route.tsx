import { json, useLoaderData } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node";
import { ProgressSteps, Step } from "./progress";
import { TaskCard } from "./task-card";




export const loader = async ({ request, params }: LoaderFunctionArgs) => {

  const steps: Step[] = [
    { step_id: "1", name: 'Step 1', to: '#', status: 'complete' },
    { step_id: "2", name: 'Step 2', to: '#', status: 'current' },
    { step_id: "3", name: 'Step 3', to: '#', status: 'upcoming' },
    { step_id: "4", name: 'Step 4', to: '#', status: 'upcoming' },
  ];
  return json({ steps });
};


export default function TaskRoute() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <ProgressSteps steps={data.steps} />
      <TaskCard task={{ title: 'Task 1', description: 'This is the first task' }}>
      </TaskCard>
    </div>
  )
}

