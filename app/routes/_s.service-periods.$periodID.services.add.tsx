import { json, type ActionFunctionArgs, redirect, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { performMutation } from "remix-forms";
import { z } from "zod"
import { Label } from "~/components/shadcn/ui/label";
import { protectedRoute } from "~/lib/auth/auth.server";
import { RemixForm } from "~/lib/remix-forms/form"
import { servicePeriodExists } from "~/lib/database/service-periods/domain-logic/checks.server";
import { ServicePeriodId } from "~/lib/database/service-periods/types/service-periods-model";
import { addFromPeriod, recordServiceMutation } from "~/lib/database/service-transactions/domain-logic/mutations.server";






export const action = async ({ request }: ActionFunctionArgs) => {
  let { user } = await protectedRoute(request);
  const result = await performMutation({
    request,
    schema: addFromPeriod,
    mutation: recordServiceMutation,
  })
  if (!result.success) {
    return json(result, 400)
  }
  return redirect(`/service-transactions/${result.data}`)
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);
  const periodID: ServicePeriodId = params["periodID"] ?? "periodID";

  const exists = await servicePeriodExists(periodID);
  if (!exists) {
    return json({ periodID }, 404);
  }




  return json({ periodID });
};



export default function AddServiceRoute() {
  const { periodID } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <main>
      {
        actionData && <div>
          <pre>{JSON.stringify(actionData, null, 2)}</pre>
        </div>
      }
      <Form method="POST" className="grid gap-4 py-4">
        <input type="hidden" name="servicePeriodId" value={periodID} readOnly />
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Seat Id</Label>
          <input readOnly id="seatId" name="seatId" value="newSeatID" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Service Type</Label>
          <select id="servicetype" name="serviceType" className="col-span-3">
            <option value="FoodBoxOrder">Food Box Order</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Value</Label>
          <input id='value' name='value' defaultValue={0} type="number" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">
            Status
          </Label>
          <select id='status' name='status' className="col-span-3">
            <option value="pending">Pending</option>
            <option value="received">Received</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <button type="submit">Save changes</button>
        </div>
      </Form>

    </main>
  )

}