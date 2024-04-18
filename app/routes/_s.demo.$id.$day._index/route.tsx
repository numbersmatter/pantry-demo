import { json, useLoaderData, useMatches } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node";
import VerticalSteps, { Vstep } from "./steps";
import type { loader as parentData } from "~/routes/_s.demo.$id/route"
import { WeekData } from "~/lib/demo/demo-data";


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const day = params.day as string;

  const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  if (!validDays.includes(day)) {
    throw new Error(`Invalid day ${day}`);
  }

  const workDay = day as keyof WeekData['taskData']

  const steps: Vstep[] = [
    { name: 'Create account', description: 'Vitae sed mi luctus laoreet.', to: '1', status: 'complete' },
    {
      name: 'Profile information',
      description: 'Cursus semper viverra facilisis et et some more.',
      to: '2',
      status: 'current',
    },
    { name: 'Business information', description: 'Penatibus eu quis ante.', to: '3', status: 'upcoming' },
    { name: 'Theme', description: 'Faucibus nec enim leo et.', to: '#', status: 'upcoming' },
    { name: 'Preview', description: 'Iusto et officia maiores porro ad non quas.', to: '4', status: 'upcoming' },
  ]

  return json({ steps, workDay });
};




export default function Route() {
  const { steps, workDay } = useLoaderData<typeof loader>();
  const matches = useMatches();
  const dataRoute = "routes/_s.demo.$id"
  const weekPlan = matches.find(m => m.id === dataRoute)?.data as WeekData

  const daySteps: Vstep[] = weekPlan.taskData[workDay].map((task, index) => {
    return {
      name: task.title,
      description: task.description,
      to: (index + 1).toString(),
      status: "upcoming",
    }
  })

  return (
    <div className="mx-auto py-5 px-1 w-80 md:w-96">
      <VerticalSteps steps={daySteps} />
      <pre>{JSON.stringify(weekPlan, null, 2)}</pre>
    </div>
  )

}