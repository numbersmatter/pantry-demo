import { Outlet, json, useLoaderData } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node";
import WeeklyPanel from "./panels";
import WeeklyTabs from "./tabs";
import DailySteps from "./steps";
import { HeaderText } from "./header";
import { demoData } from "~/lib/demo/demo-data";
import { protectedRoute } from "~/lib/auth/auth.server";
import { db } from "~/lib/database/firestore.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);
  const weekplanId = params["id"] as string;

  const weekplan = await db.weekplan.read(weekplanId);

  if (!weekplan) {
    throw new Error("Weekplan not found",);
  }

  const taskData = weekplan.taskData;
  const title = weekplan.title;
  return json({ title, taskData });
};


export default function FoodPantryDemo() {
  const { title } = useLoaderData<typeof loader>();
  return (
    <div className="px-2 py-2">
      <HeaderText title={title} />
      <Outlet />
    </div>
  )
};