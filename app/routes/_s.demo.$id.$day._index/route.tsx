import type { ActionFunctionArgs } from "@remix-run/node";
import { json, useLoaderData, useMatches } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node";
import VerticalSteps, { Vstep } from "./steps";
import type { loader as parentData } from "~/routes/_s.demo.$id/route"
import { DayTask, WeekData, demoData } from "~/lib/demo/demo-data";
import { protectedRoute } from "~/lib/auth/auth.server";
import { db } from "~/lib/database/firestore.server";
import { makeDomainFunction } from "domain-functions";
import { z } from "zod";
import { performMutation } from "remix-forms";
import { SingleButtonForm } from "~/components/common/single-button-form";



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


export const action = async ({ request, params }: ActionFunctionArgs) => {
  await protectedRoute(request);
  const day = params.day as string;
  const weekPlanId = params.id as string;
  const weekPlanDoc = await db.weekplan.read(weekPlanId);

  if (!weekPlanDoc) {
    throw new Error("Weekplan not found");
  }








  return json({ success: false });
};




export default function Route() {
  const { steps, workDay } = useLoaderData<typeof loader>();
  const matches = useMatches();
  const dataRoute = "routes/_s.demo.$id"
  const dayTaskRoute = "routes/_s.demo.$id.$day"

  const weekPlan = matches.find(m => m.id === dataRoute)?.data as WeekData

  // @ts-ignore
  const dayTasks = matches.find(m => m.id === dayTaskRoute)?.data.dayTasks as DayTask[]
  const daySteps: Vstep[] = dayTasks.map((task, index) => {
    return {
      name: task.title,
      description: task.description,
      to: task.id,
      status: task.status ? 'complete' : 'upcoming',
    }
  })

  return (
    <div className="mx-auto py-5 px-1 w-80 md:w-96">
      <VerticalSteps steps={daySteps} />

      <pre>{JSON.stringify(dayTasks, null, 2)}</pre>
    </div>
  )

}