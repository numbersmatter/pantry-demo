import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, redirect, useActionData, useLoaderData } from "@remix-run/react";
import { makeDomainFunction } from "domain-functions";
import { performMutation } from "remix-forms";
import { z } from "zod";
import { FormTextField } from "~/components/forms/textfield";
import { AddSeatsTabs } from "~/components/pages/service-periods/add-seat-tabs";
import { ServicePeriodTabs } from "~/components/pages/service-periods/headers";
import { Button } from "~/components/shadcn/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/shadcn/ui/card";
import { Label } from "~/components/shadcn/ui/label";
import { protectedRoute } from "~/lib/auth/auth.server";
import { familyDb } from "~/lib/database/families/family-crud.server";
import { personDb } from "~/lib/database/person/person-crud.server";
import { seatsDb } from "~/lib/database/seats/seats-crud.server";
import { servicePeriodExists } from "~/lib/database/service-periods/domain-logic/checks.server";
import { ServicePeriodId } from "~/lib/database/service-periods/types/service-periods-model";

const schema = z.object({
  fname: z.string().min(2).max(50),
  lname: z.string().min(2).max(50),
  phone: z.string().length(10),
  street: z.string().min(2).max(50),
  unit: z.string().max(50),
  city: z.string().min(2).max(50),
  state: z.string().length(2),
  zip: z.string().length(5),
})


const mutation = makeDomainFunction(schema)(async (values) => {
  const personId = await personDb.create({
    first_name: values.fname,
    last_name: values.lname,
    phone: values.phone,
    email: "",
    type: "caregiver"
  })

  const familyId = await familyDb.create({
    primary_user_id: "",
    family_name: `${values.fname} ${values.lname} family`,
    members: [personId]
  });

  return { status: "success", personId, familyId, }
})

export const action = async ({ request, params }: ActionFunctionArgs) => {
  let { user } = await protectedRoute(request);



  const result = await performMutation({ request, schema, mutation });

  if (!result.success) {
    return json(result, 400)
  }

  return redirect(`/families/${result.data.familyId}`)
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


export default function Route() {
  const { periodID } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const errors = actionData?.errors ?? {};

  const displayErrors = {
    fname: errors?.fname ? errors.fname[0] : "",
    lname: errors?.lname ? errors.lname[0] : "",
    phone: errors?.phone ? errors.phone[0] : "",
    street: errors?.street ? errors.street[0] : "",
    unit: errors?.unit ? errors.unit[0] : "",
    city: errors?.city ? errors.city[0] : "",
    state: errors?.state ? errors.state[0] : "",
    zip: errors?.zip ? errors.zip[0] : "",
  }

  return (
    <>
      <Card className="my-4">
        <Form method="POST">
          <CardHeader>
            <CardTitle>Create Family</CardTitle>
            <CardDescription>
              Enter the information on the primary caregiver for this family.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 py-4">
            <FormTextField
              label="First Name" id="fname" error={displayErrors.fname}
            />
            <FormTextField
              label="Last Name" id="lname" error={displayErrors.lname}
            />
            <FormTextField
              label="Phone" id="phone" defaultValue=""
              error={displayErrors.phone}
            />
            <FormTextField
              label="Street" id="street"
              error={displayErrors.street}
            />
            <FormTextField
              label="Unit" id="unit"
              error={displayErrors.unit}
            />
            <FormTextField
              label="City" id="city" defaultValue="Thomasville"
              error={displayErrors.city}
            />
            <FormTextField
              label="State" id="state" defaultValue="NC"
              error={displayErrors.state}
            />
            <FormTextField
              label="Zip" id="zip" defaultValue="27360"
              error={displayErrors.zip}
            />
          </CardContent>
          <CardFooter className="pt-2 flex flex-row justify-between">
            <Button variant={"secondary"} type="button">Cancel</Button>
            <Button type="submit">Save changes</Button>
          </CardFooter>
        </Form>
      </Card>
      {
        actionData && <div>
          <pre>{JSON.stringify(actionData, null, 2)}</pre>
        </div>
      }
    </>
  )
}

