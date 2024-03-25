import type { ActionFunctionArgs } from "@remix-run/node";
import { json, useFetcher, useLoaderData } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node";
import { protectedRoute } from "~/lib/auth/auth.server";
import { db } from "~/lib/database/firestore.server";
import { DriveThruForm } from "~/lib/database/drive-thru/types";
import { Dialog, DialogClose, DialogFooter, DialogHeader, DialogTitle, DialogContent, DialogTrigger } from "~/components/shadcn/ui/dialog";
import { Button } from "~/components/shadcn/ui/button";
import { FormNumberField } from "~/components/forms/number-field";
import { useEffect, useState } from "react";
import { performMutation } from "remix-forms";
import { z } from "zod";
import { makeDomainFunction } from "domain-functions";
import { FormTextArea } from "~/components/forms/text-area";



const schemaUpdateNumber = z.object({
  fieldID: z.enum(["household_adults", "household_children", "primary_children", "elementary_children", "middle_children", "high_children", "notes"]),
  value: z.coerce.number().nonnegative().int(),
  type: z.enum(["updateValue", "updateNotes"])
})

const schemaUpdateNotes = z.object({
  fieldID: z.enum(["notes"]),
  value: z.string(),
  type: z.enum(["updateValue", "updateNotes"])
})

const mutation = (formID: string) => makeDomainFunction(schemaUpdateNumber)(
  async (values) => {
    const data = {
      formID,
      fieldID: values.fieldID,
      value: values.value
    }

    const writeResult = await db.drive_thru.updateFormNumber(data)

    return { data, writeResult }
  }
)
const mutationNotes = (formID: string) => makeDomainFunction(schemaUpdateNotes)(
  async (values) => {
    const data = {
      formID,
      fieldID: values.fieldID,
      value: values.value
    }

    const writeResult = await db.drive_thru.updateFormNotes(
      formID,
      values.value
    )

    return { data, writeResult }
  }
)

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);
  const formID = params.formID ?? "formID"
  const driveThruForm = await db.drive_thru.read(formID);


  if (!driveThruForm) {
    throw new Response("Not Found", { status: 404 });
  }



  const driveThruFormData = {
    ...driveThruForm,
    created_date: driveThruForm.created_date.toDate(),
    updated_date: driveThruForm.updated_date.toDate(),
    id: formID
  } as DriveThruForm;


  return json({ driveThruForm, driveThruFormData });
};


export const action = async ({ request, params }: ActionFunctionArgs) => {
  let { user, staffData } = await protectedRoute(request);
  const formID = params.formID ?? "formID"
  const clonedRequest = request.clone();
  const clonedFormData = await clonedRequest.formData();
  const fieldID = clonedFormData.get("fieldID");

  const formInfo = await db.drive_thru.read(formID);

  if (!formInfo) {
    throw new Response("Not Found", { status: 404 });
  }

  if (fieldID === "notes") {
    console.log(" is notes")
    const result = await performMutation({
      request,
      schema: schemaUpdateNotes,
      mutation: mutationNotes(formID)
    })

    return json(result);
  }

  console.log(" is number")

  const result = await performMutation({
    request,
    schema: schemaUpdateNumber,
    mutation: mutation(formID)
  })



  return json(result);
};


export default function Route() {
  const data = useLoaderData<typeof loader>();

  const createdDate = new Date(data.driveThruFormData.created_date);
  const formattedDate = `${createdDate.toLocaleDateString()} ${createdDate.toLocaleTimeString()}`;

  const formInfo = data.driveThruFormData

  return (
    <>
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">Drive Thru Form</h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          {formattedDate}
        </p>
        <p>
          Form ID: {formInfo.id}
        </p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <InfoDisplay
            label="Staff Name"
            value={formInfo.staff_name}
            id="staff_name"
            type="string"
          />
          <InfoDisplay
            label="Staff ID"
            value={formInfo.staff_id}
            id="staff_id"
            type="string"
          />
          <InfoDisplay
            label="Language"
            value={formInfo.form_responses.language}
            id="language"
            type="string"
          />
          <InfoDisplayEditNumber
            label="Number of Adults"
            value={formInfo.form_responses.household_adults} id="household_adults"
            type="number"
          />
          <InfoDisplayEditNumber
            label="Number of Children"
            value={formInfo.form_responses.household_children} id="household_children"
            type="number"
          />
          <InfoDisplayEditNumber
            label="Number of Primary Children"
            value={formInfo.form_responses.primary_children} id="primary_children"
            type="number"
          />
          <InfoDisplayEditNumber
            label="Number of Elementary Children"
            value={formInfo.form_responses.elementary_children} id="elementary_children"
            type="number"
          />
          <InfoDisplayEditNumber
            label="Number of Middle Children"
            value={formInfo.form_responses.middle_children} id="middle_children"
            type="number"
          />
          <InfoDisplayEditNumber label="Number of High Children" value={formInfo.form_responses.high_children} id="high_children" type="number" />
          <InfoDisplayNotes label="Notes" value={formInfo.form_responses.notes} id="notes" type="textArea" />


        </dl>
      </div>
      <pre>
        {JSON.stringify(formInfo, null, 2)}
      </pre>
    </>
  )
}


function InfoDisplay({
  label, value, id, type
}: {
  label: string, value: string | number, id: string, type: "string" | "number" | "textArea"
}) {
  return (
    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <dt className="text-sm font-medium leading-6 text-gray-900">
        {label}
      </dt>
      <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
        <span className="flex-grow">{value}</span>
        <span className="ml-4 flex-shrink-0">

        </span>
      </dd>
    </div>
  )
}
function InfoDisplayNotes({
  label, value, id, type
}: {
  label: string, value: string | number, id: string, type: "string" | "number" | "textArea"
}) {
  return (
    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <dt className="text-sm font-medium leading-6 text-gray-900">
        {label}
      </dt>
      <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
        <span className="flex-grow">{value}</span>
        <span className="ml-4 flex-shrink-0">
          <UpdateNotes id={id} value={value.toString()} label={label} />
        </span>
      </dd>
    </div>
  )
}
function InfoDisplayEditNumber({
  label, value, id, type
}: {
  label: string, value: string | number, id: string, type: "string" | "number" | "textArea"
}) {
  return (
    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <dt className="text-sm font-medium leading-6 text-gray-900">
        {label}
      </dt>
      <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
        <span className="flex-grow">{value}</span>
        <span className="ml-4 flex-shrink-0">
          <UpdateData id={id} value={value.toString()} label={label} />
        </span>
      </dd>
    </div>
  )
}

function UpdateData({ id, value, label }: { id: string, value: string | number, label: string }) {
  const [open, setOpen] = useState(false);

  const fetcher = useFetcher<typeof action>();
  const actionData = fetcher.data
  const isFetching = fetcher.state !== "idle"


  useEffect(() => {
    if (!isFetching && actionData?.success) {
      setOpen(false)
    }
  }, [isFetching, actionData])


  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <Button variant="secondary">Update</Button>
      </DialogTrigger>
      <DialogContent>
        <fetcher.Form method="post">
          <DialogHeader>
            <DialogTitle> Edit Value</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <input readOnly type="hidden" name="fieldID" value={id} />
            <input readOnly type="hidden" name="type" value={"updateValue"} />
            <FormNumberField id={"value"} label={label} defaultValue={value.toString()} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant={"secondary"} className="">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="">Submit</Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  )
}
function UpdateNotes({ id, value, label }: { id: string, value: string, label: string }) {
  const [open, setOpen] = useState(false);

  const fetcher = useFetcher<typeof action>();
  const actionData = fetcher.data
  const isFetching = fetcher.state !== "idle"


  useEffect(() => {
    if (!isFetching && actionData?.success) {
      setOpen(false)
    }
  }, [isFetching, actionData])


  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <Button variant="secondary">Update</Button>
      </DialogTrigger>
      <DialogContent>
        <fetcher.Form method="post">
          <DialogHeader>
            <DialogTitle> Edit Value</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <input readOnly type="hidden" name="fieldID" value={id} />
            <input readOnly type="hidden" name="type" value={"updateValue"} />
            <FormTextArea id={"value"} label={label} defaultValue={value.toString()} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant={"secondary"} className="">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="">Submit</Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  )
}
