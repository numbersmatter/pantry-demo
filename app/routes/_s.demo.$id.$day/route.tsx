import { json, useLoaderData } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node";
import { WeeklyTabs, Tab } from "./tabs";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {

  const tabs: Tab[] = [
    { name: 'Monday', to: '#', current: false, count: 10 },
    { name: 'Tuesday', to: '#', current: false, count: 6 },
    { name: 'Wednesday', to: '#', current: true, count: 4 },
    { name: 'Thursday', to: '#', current: false, count: 0 },
    { name: 'Friday', to: '#', current: false, count: 0 },
  ]

  return json({ tabs });
};



export default function Route() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <WeeklyTabs tabs={data.tabs} defaultTab={data.tabs[0]} />
    </>
  )
}