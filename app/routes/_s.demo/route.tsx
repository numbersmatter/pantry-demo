import { json, useLoaderData } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node";
import WeeklyPanel from "./panels";
import WeeklyTabs from "./tabs";
import DailySteps from "./steps";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {

  return json({});
};


export default function FoodPantryDemo() {

  return (
    <div className="px-2 py-2">
      <WeeklyTabs />
      <div className="w-96 mx-auto py-4">
        <DailySteps />
      </div>
    </div>
  )
};