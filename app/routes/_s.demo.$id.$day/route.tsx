import { Outlet, json, redirect, useLoaderData, useMatches, useNavigate } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node";
import { WeeklyTabs, Tab, SelectTab } from "./tabs";
import { useState } from "react";
import { demoData } from "~/lib/demo/demo-data";
import { protectedRoute } from "~/lib/auth/auth.server";
import { db } from "~/lib/database/firestore.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await protectedRoute(request);
  const id = params.id ?? 'default';

  const day = params.day as string;
  const weekPlanId = params.id as string;
  const weekPlanDoc = await db.weekplan.read(weekPlanId);

  if (!weekPlanDoc) {
    throw new Error("Weekplan not found");
  }

  const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

  if (!validDays.includes(day)) {
    throw redirect(`/demo/${id}/${validDays[0]}`)
  };

  const taskStatus = weekPlanDoc.taskStatus;

  const dayTasks = weekPlanDoc.taskData[day as keyof typeof weekPlanDoc.taskData].map((task) => {
    return {
      ...task,
      status: taskStatus[task.id] ?? false,
    }
  });

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