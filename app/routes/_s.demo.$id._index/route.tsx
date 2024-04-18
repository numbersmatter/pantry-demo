import type { ActionFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node";
import { protectedRoute } from "~/lib/auth/auth.server";
import { db } from "~/lib/database/firestore.server";
import { createWeekStatus } from "~/lib/database/weekplan/domain-funcs";
import { SingleButtonForm } from "~/components/common/single-button-form";


export const action = async ({ request, params }: ActionFunctionArgs) => {
  await protectedRoute(request);
  const weekplanId = params.id as string;
  const weekplan = await db.weekplan.read(weekplanId);

  if (!weekplan) {
    throw new Error("Weekplan not found");
  };

  const taskData = weekplan.taskData;

  const statusMap = new Map<string, boolean>();

  const statusObject = createWeekStatus(taskData);

  const updateData = {
    taskStatus: statusObject
  }

  await db.weekplan.update({
    weekplanId: weekplan.id,
    data: updateData
  });


  return json({});
};



export const loader = async ({ request, params }: LoaderFunctionArgs) => {

  return json({});
};




export default function Route() {
  const { } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Route</h1>
      <SingleButtonForm text="Submit" >
        <input readOnly hidden name="_action" value="update" />
      </SingleButtonForm>
    </div>
  )

}



