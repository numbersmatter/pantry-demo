import { Outlet, useLoaderData, } from "@remix-run/react"
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { HeaderText } from "./header";
import { protectedRoute } from "~/lib/auth/auth.server";
import { db } from "~/lib/database/firestore.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);
  const weekplanId = params["id"] as string;

  const weekplan = await db.weekplan.read(weekplanId);

  if (!weekplan) {
    throw new Error("Weekplan not found",);
  }

  const taskStatus = weekplan.taskStatus;


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
      // current: tab.day === day,
      to: `/demo/${weekplanId}/${tab.day}`,
    }
  });


  const taskData = weekplan.taskData;
  const title = weekplan.title;
  return json({ title, taskData, taskStatus });
};


export default function FoodPantryDemo() {
  const { title, taskStatus } = useLoaderData<typeof loader>();
  return (
    <div className="px-2 py-2">
      <HeaderText title={title} />
      <Outlet />
      <pre>{JSON.stringify(taskStatus, null, 2)}</pre>
    </div>
  )
};