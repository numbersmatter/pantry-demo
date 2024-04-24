import { Outlet, json, redirect, useLoaderData, useMatches, useNavigate } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node";
import { WeeklyTabs, Tab, SelectTab } from "./tabs";
import { useState } from "react";
import { demoData } from "~/lib/demo/demo-data";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const day = params.day as string;
  const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const id = params.id ?? 'default';


  if (!validDays.includes(day)) {
    throw redirect(`/demo/${id}/${validDays[0]}`)
  };

  const dayTasks = demoData[day as keyof typeof demoData];

  const dbTabs = [
    { name: 'Monday', day: 'monday', count: 0 },
    { name: 'Tuesday', day: 'tuesday', count: 0 },
    { name: 'Wednesday', day: 'wednesday', count: 0 },
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

  return json({ tabs, dayTasks });
};



export default function Route() {
  const data = useLoaderData<typeof loader>();

  const matches = useMatches();


  const defaultTab = data.tabs.find((tab) => tab.current) ?? data.tabs[0];
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Tab>(defaultTab)

  const handleTabChange = (tab: Tab) => {
    setSelected(tab)
    return navigate(tab.to)
  }



  return (
    <>
      <WeeklyTabs tabs={data.tabs} handleTabChange={handleTabChange}>
        <SelectTab
          tabs={data.tabs}
          selected={selected}
          handleTabChange={handleTabChange}
        />
      </WeeklyTabs>
      <Outlet />
    </>
  )
}