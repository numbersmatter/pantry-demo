import type { ActionFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node";
import { protectedRoute } from "~/lib/auth/auth.server";
import { db } from "~/lib/database/firestore.server";
import { z } from "zod";
import { makeDomainFunction } from "domain-functions";
import { performMutation } from "remix-forms";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/shadcn/ui/dialog"
import { useFetcher } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { FormTextField } from "~/components/forms/textfield";
import { Button } from "~/components/shadcn/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/shadcn/ui/card";
import { FamilyAppModel } from "~/lib/database/families/types";
import { FormNumberField } from "~/components/forms/number-field";


const fieldIds = ["family_name", "street", "unit", "zip", "city", "state"] as const;

const familyNameSchema = z.object({
  fieldId: z.enum(fieldIds),
  value: z.string().min(3).max(50),
})
const familyAddressSchema = z.object({
  street: z.string().min(3).max(50),
  unit: z.string(),
  city: z.string().min(3).max(50),
  state: z.string().length(2),
  zip: z.string().length(5),
})

const studentSchema = z.object({
  tps: z.coerce.number().nonnegative().int(),
  lds: z.coerce.number().nonnegative().int(),
  tms: z.coerce.number().nonnegative().int(),
  ths: z.coerce.number().nonnegative().int(),
})

const familyNamemutation = (familyId: string) => makeDomainFunction(familyNameSchema)(async (values) => {
  const fieldId = values.fieldId;
  const value = values.value;
  if (fieldId === "family_name") {
    await db.families.update(familyId, { family_name: value });
  }

  return { values }
})

const updateAddressMutation = (familyId: string) => makeDomainFunction(familyAddressSchema)(async (values) => {
  const address = values;
  await db.families.update(familyId, { address });
  return { values }
})

const updateStudentsMutation = (familyId: string) => makeDomainFunction(studentSchema)(async (values) => {
  const students = values;
  await db.families.update(familyId, { students });
  return { values }
})



export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);
  let familyId = params["familyID"] ?? "familyID";

  const familyDoc = await db.families.read(familyId);
  if (!familyDoc) {
    throw new Error("Family not found")
  }

  const family = familyDoc;
  return json({ family });
};




export const action = async ({ request, params }: ActionFunctionArgs) => {
  let { user } = await protectedRoute(request);
  const familyId = params["familyID"] ?? "familyID";
  const requestClone = request.clone();
  const formData = await requestClone.formData();
  const family = await db.families.read(familyId);
  if (!family) {
    throw new Error("Family not found")
  }

  const type = formData.get("type") as string;

  if (type === "family_name") {
    const result = await performMutation({
      request,
      schema: familyNameSchema,
      mutation: familyNamemutation(familyId)
    })
    return json({ result });
  }

  if (type === "address") {
    const result = await performMutation({
      request,
      schema: familyAddressSchema,
      mutation: updateAddressMutation(familyId)
    })
    return json({ result });
  }
  if (type === "students") {
    const result = await performMutation({
      request,
      schema: studentSchema,
      mutation: updateStudentsMutation(familyId)
    })
    const errors = result.success ? {} : result.errors;
    return json({ result });
  }

  return json({
    result: { success: false, message: "Invalid Type", errors: {} }
  });
};





export default function Route() {
  const { family } = useLoaderData<typeof loader>();

  const familyData = {
    ...family,
    created_date: new Date(family.created_date)
  }

  return (
    <div>
      <>
        <div className="py-3 px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7 text-gray-900">
            Family Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            Family Details.
          </p>
        </div>
        <div>

        </div>
        <div className="mt-6 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <SingleTextUpdate
              fieldId={"family_name"}
              fieldLabel={"Family Name"}
              fieldValue={familyData.family_name}
            />
            <AddressCard family={familyData} />
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Total Students
              </dt>
              <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <span className="flex-grow">
                  {family.students.tps + family.students.lds + family.students.tms + family.students.ths}
                </span>
              </dd>
            </div>
            <div>
              <StudentCard family={familyData} />
            </div>
          </dl>
        </div>
      </>
    </div>
  )
}

function SingleTextUpdate({
  fieldId, fieldLabel, fieldValue
}: {
  fieldId: string,
  fieldLabel: string,
  fieldValue: string
}) {
  return <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
    <dt className="text-sm font-medium leading-6 text-gray-900">
      {fieldLabel}
    </dt>
    <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
      <span className="flex-grow">
        {fieldValue}
      </span>
      <span className="ml-4 flex-shrink-0">
        <UpdateTextDialog
          fieldId={fieldId}
          fieldLabel={fieldLabel}
          fieldValue={fieldValue}
        />
      </span>
    </dd>
  </div>
}


function UpdateTextDialog({
  fieldId, fieldLabel, fieldValue
}: {
  fieldId: string,
  fieldLabel: string,
  fieldValue: string
}) {
  const fetcher = useFetcher<typeof action>();
  const [isOpen, setIsOpen] = useState(false);


  const isFetching = fetcher.state !== 'idle';
  const actionData = fetcher.data;


  useEffect(() => {
    if (actionData?.result?.success) {
      setIsOpen(false);
    }
  }
    , [actionData, isFetching])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Update</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <fetcher.Form method="POST">
          <DialogHeader className="py-2">
            <DialogTitle>{fieldLabel}</DialogTitle>
            <DialogDescription>
              Update the {fieldLabel} for this family.
            </DialogDescription>
          </DialogHeader>
          <input readOnly type="hidden" name="fieldId" value={fieldId} />
          <input readOnly type="hidden" name="type" value={"family_name"} />
          <FormTextField
            label={fieldLabel}
            id={"value"}
            defaultValue={fieldValue}
          />
          <DialogFooter >
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>


  )

}

function AddressCard({ family }: { family: FamilyAppModel }) {
  return (
    <Card className="my-4">
      <CardHeader>
        <CardTitle> Current Address</CardTitle>
        <CardDescription>
          Address for Service Delivery
        </CardDescription>
        <CardContent>
          <p>
            Street: {family.address.street}
          </p>
          <p>
            Unit: {family.address.unit}
          </p>
          <p>
            City: {family.address.city}
          </p>
          <p>
            State: {family.address.state}
          </p>
          <p>
            Zip: {family.address.zip}
          </p>
        </CardContent>
        <CardFooter>
          <UpdateAddressDialog family={family} />
        </CardFooter>
      </CardHeader>
    </Card>
  )
}


function StudentCard({ family }: { family: FamilyAppModel }) {
  return (
    <Card className="my-4">
      <CardHeader>
        <CardTitle>Students</CardTitle>
        <CardDescription>
          Students in this family.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          Thomasville Primary School: {family.students.tps}
        </p>
        <p>
          Liberty Drive School: {family.students.lds}
        </p>
        <p>
          Thomasville Middle School: {family.students.tms}
        </p>
        <p>
          Thomasville High School: {family.students.ths}
        </p>
      </CardContent>
      <CardFooter>
        <UpdateStudentsDialog family={family} />
      </CardFooter>
    </Card>
  )
}

function UpdateStudentsDialog({ family }: { family: FamilyAppModel }) {
  const fetcher = useFetcher<typeof action>();
  const [isOpen, setIsOpen] = useState(false);


  const isFetching = fetcher.state !== 'idle';
  const actionData = fetcher.data;

  const formResult = actionData?.result ?? { success: false, errors: {} };
  const formErrors = formResult.success ? {} : formResult.errors as Partial<Record<"tps" | "lds" | "tms" | "ths" | "_global", string[]>>;

  useEffect(() => {
    if (actionData?.result?.success) {
      setIsOpen(false);
    }
  }, [actionData, isFetching])

  const errors = {
    tps: formErrors.tps ? formErrors.tps[0] : "",
    lds: formErrors.lds ? formErrors.lds[0] : "",
    tms: formErrors.tms ? formErrors.tms[0] : "",
    ths: formErrors.ths ? formErrors.ths[0] : "",
  }


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Update</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <fetcher.Form method="POST">
          <DialogHeader className="py-2">
            <DialogTitle>Update Address</DialogTitle>
            <DialogDescription>
              Update the address for this family.
            </DialogDescription>
          </DialogHeader>
          <input readOnly type="hidden" name="type" value={"students"} />
          <FormNumberField
            label="Primary School"
            id="tps"
            defaultValue={family.students.tps.toString()}
            error={errors.tps}
          />
          <FormNumberField
            label="Liberty Drive School"
            id="lds"
            defaultValue={family.students.lds.toString()}
            error={errors.lds}
          />
          <FormNumberField
            label="Middle School"
            id="tms"
            defaultValue={family.students.tms.toString()}
            error={errors.tms}
          />
          <FormNumberField
            label="High School"
            id="ths"
            defaultValue={family.students.ths.toString()}
            error={errors.ths}
          />
          <DialogFooter >
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  )
}
function UpdateAddressDialog({ family }: { family: FamilyAppModel }) {
  const fetcher = useFetcher<typeof action>();
  const [isOpen, setIsOpen] = useState(false);


  const isFetching = fetcher.state !== 'idle';
  const actionData = fetcher.data;


  useEffect(() => {
    if (actionData?.result?.success) {
      setIsOpen(false);
    }
  }
    , [actionData, isFetching])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Update</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <fetcher.Form method="POST">
          <DialogHeader className="py-2">
            <DialogTitle>Update Address</DialogTitle>
            <DialogDescription>
              Update the address for this family.
            </DialogDescription>
          </DialogHeader>
          <input readOnly type="hidden" name="type" value={"address"} />
          <FormTextField
            label="Street"
            id="street"
            defaultValue={family.address.street}
          />
          <FormTextField
            label="Unit"
            id="unit"
            defaultValue={family.address.unit}
          />
          <FormTextField
            label="City"
            id="city"
            defaultValue={family.address.city}
          />
          <FormTextField
            label="State"
            id="state"
            defaultValue={family.address.state}
          />
          <FormTextField
            label="Zip"
            id="zip"
            defaultValue={family.address.zip}
          />

          <DialogFooter >
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  )
}

