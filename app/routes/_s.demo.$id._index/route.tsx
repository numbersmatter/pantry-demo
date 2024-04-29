import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, json, useLoaderData, useNavigate } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node";
import { protectedRoute } from "~/lib/auth/auth.server";
import { db } from "~/lib/database/firestore.server";
import { makeDomainFunction } from "domain-functions";
import { demoData } from "~/lib/demo/demo-data";
import { z } from "zod";
import { performMutation } from "remix-forms";
import { Button } from "~/components/shadcn/ui/button";

const setDemoSchema = z.object({
  _action: z.literal("setDemoData"),
})

const setDemoData = (weekplanId: string) => makeDomainFunction(setDemoSchema)(
  async (input) => {
    const taskData = demoData;

    const writeTaskData = await db.weekplan.update({
      weekplanId,
      data: {
        taskData,
        taskStatus: {},
      }
    });

    return writeTaskData;

  }
)


export const action = async ({ request, params }: ActionFunctionArgs) => {
  await protectedRoute(request);
  const weekplanId = params.id as string;
  const weekplan = await db.weekplan.read(weekplanId);

  if (!weekplan) {
    throw new Error("Weekplan not found");
  };

  const cloneRequest = request.clone();
  const formData = await cloneRequest.formData();
  const action = formData.get('_action') as string;

  if (action === 'setDemoData') {
    const result = await performMutation({
      request,
      schema: setDemoSchema,
      mutation: setDemoData(weekplanId),
    });

    return json(result);

  }

  return json({ success: false });
};



export const loader = async ({ request, params }: LoaderFunctionArgs) => {

  return json({});
};




export default function Route() {
  const { } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('monday');
  }

  return (
    <div className="flex-col flex gap-5">
      <Button variant={"default"} className="" onClick={handleNavigate}>
        Start Monday
      </Button>

      <div className="py-3 px-6">
        <Form method="post">
          <Button type="submit" variant={"destructive"}>
            Reset Data
          </Button>
          <input type="hidden" name="_action" value="setDemoData" />
        </Form>
      </div>
    </div>
  )

}



