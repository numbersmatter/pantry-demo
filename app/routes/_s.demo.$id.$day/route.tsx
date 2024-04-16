import { json, useLoaderData } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node";
import { WeeklyTabs, Tab } from "./tabs";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const day = params.day ?? 'monday';
  const id = params.id ?? 'default';

  const dbTabs = [
    { name: 'Monday', day: 'monday', count: 10 },
    { name: 'Tuesday', day: 'tuesday', count: 6 },
    { name: 'Wednesday', day: 'wednesday', count: 4 },
    { name: 'Thursday', day: 'thursday', count: 0 },
    { name: 'Friday', day: 'friday', count: 0 },
  ];

  const tabs = dbTabs.map((tab) => {
    return {
      ...tab,
      current: tab.day === day,
      to: `/demo/${id}/${tab.day}`,
    }
  });

  return json({ tabs });
};



export default function Route() {
  const data = useLoaderData<typeof loader>();

  const defaultTab = data.tabs.find((tab) => tab.current) ?? data.tabs[0];


  return (
    <>
      <WeeklyTabs tabs={data.tabs} />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  )
}