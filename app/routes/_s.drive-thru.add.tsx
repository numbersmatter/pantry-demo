import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, json, redirect, useLoaderData } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/shadcn/ui/card";
import { FormNumberField } from "~/components/forms/number-field";
import { SelectField } from "~/components/forms/select-field";
import { FormTextArea } from "~/components/forms/text-area";
import { Button } from "~/components/shadcn/ui/button";
import { z } from "zod";
import { protectedRoute } from "~/lib/auth/auth.server";
import { makeDomainFunction } from "domain-functions";
import { DriveThruDbAddModel, DriveThruFormDbModel } from "~/lib/database/drive-thru/types";
import { performMutation } from "remix-forms";
import { db } from "~/lib/database/firestore.server";



const schema = z.object({
  language: z.enum(["en", "es"]),
  household_adults: z.coerce.number().positive().int(),
  household_children: z.coerce.number().positive().int(),
  primary_children: z.coerce.number().nonnegative().int(),
  elementary_children: z.coerce.number().nonnegative().int(),
  middle_children: z.coerce.number().nonnegative().int(),
  high_children: z.coerce.number().nonnegative().int(),
  notes: z.string(),
})

const mutation = (staffData: { fname: string, lname: string, staff_id: string }) => makeDomainFunction(schema)(
  async (values) => {

    const data: DriveThruDbAddModel = {
      staff_id: staffData.staff_id,
      staff_name: `${staffData.fname} ${staffData.lname}`,
      form_responses: values
    }

    const writeResult = await db.drive_thru.create(data)

    return { data }
  }
)

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);
  return json({});
};


export const action = async ({ request }: ActionFunctionArgs) => {
  let { user, staffData } = await protectedRoute(request);

  const staffInfo = {
    fname: staffData.fname,
    lname: staffData.lname,
    staff_id: user.uid
  }

  const result = await performMutation({
    request,
    schema,
    mutation: mutation(staffInfo),
  })

  if (!result.success) {
    return json(result);
  }


  return redirect("/drive-thru");
};





export default function Route() {
  let data = useLoaderData();
  return (
    <>
      <FormCard />
    </>
  )
}


function FormCard() {
  const langaugeOptions = [
    { label: "English", value: "en" },
    { label: "Spanish", value: "es" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Drive Thru Form</CardTitle>
      </CardHeader>
      <Form method="post">
        <CardContent>
          <div className="grid gap-4 py-4">
            <SelectField
              label={"Language"}
              id={"language"}
              selectOptions={langaugeOptions}
              placeholder={"Choose Language"}
            />
            <FormNumberField id="household_adults" label="Household Adults" />
            <FormNumberField id="household_children" label="Household Children" />
            <FormNumberField id="primary_children" label="Primary School Children" />
            <FormNumberField id="elementary_children" label="Elementary School Children" />
            <FormNumberField id="middle_children" label="Middle School Children" />
            <FormNumberField id="high_children" label="High School Children" />
            <FormTextArea id="notes" label="Notes" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between" >
          <Button type="button" variant={"secondary"} className="">Cancel</Button>
          <Button type="submit" className="">Submit</Button>
        </CardFooter>
      </Form>
    </Card>
  )
}