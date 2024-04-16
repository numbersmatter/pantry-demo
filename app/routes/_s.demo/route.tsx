import { Outlet, json, useLoaderData } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node";
import WeeklyPanel from "./panels";
import WeeklyTabs from "./tabs";
import DailySteps from "./steps";
import { HeaderText } from "./header";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {

  const title = 'April 15-19, 2024 Food Box Program';
  return json({ title });
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