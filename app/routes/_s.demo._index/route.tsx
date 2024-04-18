import { redirect, type ActionFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import { SingleButtonForm } from "~/components/common/single-button-form";
import { db } from "~/lib/database/firestore.server";
import { createWeekStatus } from "~/lib/database/weekplan/domain-funcs";
import { demoData } from "~/lib/demo/demo-data";

const schema = z.object({
  _action: z.literal("create"),
});


export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const action = formData.get("_action");
  const data = demoData

  if (action === "create") {

    const weekplan = await db.weekplan.create({
      title: "April 15-19, 2024 Food Box Program",
      taskData: data,
      taskStatus: createWeekStatus(data),
    });

    return redirect(`/demo/${weekplan.id}`);
  }

  return json({}, { status: 200 });
};



export default function Route() {

  return (
    <div>
      <h1>Route</h1>
      <SingleButtonForm
        text="Submit"
      >
        <input readOnly hidden name="_action" value="create" />

      </SingleButtonForm>
    </div>
  )

}