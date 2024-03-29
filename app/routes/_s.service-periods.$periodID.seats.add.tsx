import { DialogTrigger } from "@radix-ui/react-dialog";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, redirect, useActionData, useFetcher, useLoaderData } from "@remix-run/react";
import { makeDomainFunction } from "domain-functions";
import { useEffect, useState } from "react";
import { performMutation } from "remix-forms";
import { z } from "zod";
import { FormTextArea } from "~/components/forms/text-area";
import { AddSeatsTabs } from "~/components/pages/service-periods/add-seat-tabs";
import { ServicePeriodTabs } from "~/components/pages/service-periods/headers";
import { Button } from "~/components/shadcn/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/shadcn/ui/dialog";
import { Label } from "~/components/shadcn/ui/label";
import { protectedRoute } from "~/lib/auth/auth.server";
import { familyDb } from "~/lib/database/families/family-crud.server";
import { db } from "~/lib/database/firestore.server";
import { personDb } from "~/lib/database/person/person-crud.server";
import { seatsDb } from "~/lib/database/seats/seats-crud.server";
import { servicePeriodExists } from "~/lib/database/service-periods/domain-logic/checks.server";
import { ServicePeriodId } from "~/lib/database/service-periods/types/service-periods-model";

const addSeatSchema = z.object({
  fname: z.string().min(2).max(50),
  lname: z.string().min(2).max(50),
  phone: z.string().length(10),
  street: z.string().min(2).max(50),
  unit: z.string().max(50),
  city: z.string().min(2).max(50),
  state: z.string().length(2),
  zip: z.string().length(5),
  dropOffNotes: z.string(),
})
const addFamilySchema = z.object({
  dropOffNotes: z.string(),
  family_id: z.string().length(20),
})

const addFamilySeat = (service_period_Id: string) => makeDomainFunction(addFamilySchema)(async (values) => {
  const family = await db.families.read(values.family_id);
  if (!family) {
    throw new Error("Family not found")
  };

  const seatId = await db.seats.create({
    delivery_notes: values.dropOffNotes,
    family_name: family.family_name,
    service_period_id: service_period_Id,
    family_id: family.id,
    application_id: "",
    is_active: true,
    status: "active",
    address: family.address
  })

  return { seatId }
})

const manualAddSeat = (service_period_Id: string) => makeDomainFunction(addSeatSchema)(async (values) => {
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
    members: [personId],
    address: {
      street: values.street,
      unit: values.unit,
      city: values.city,
      state: values.state,
      zip: values.zip
    },
    students: {
      tps: 0,
      lds: 0,
      tms: 0,
      ths: 0
    }
  });

  const seatId = await seatsDb.create({
    delivery_notes: values.dropOffNotes,
    family_name: `${values.fname} ${values.lname} family`,
    service_period_id: service_period_Id,
    family_id: familyId,
    application_id: familyId,
    is_active: true,
    status: "pending",
    address: {
      street: values.street,
      unit: values.unit,
      city: values.city,
      state: values.state,
      zip: values.zip
    }
  })

  console.log(values);
  return { status: "success", personId, familyId, seatId }
})

export const action = async ({ request, params }: ActionFunctionArgs) => {
  let { user } = await protectedRoute(request);
  const periodID: ServicePeriodId = params["periodID"] ?? "periodID";
  const exists = await servicePeriodExists(periodID);
  if (!exists) {
    throw new Error("Service period not found");
  }
  const clonedRequest = request.clone();
  const formData = await clonedRequest.formData();
  const type = formData.get("type");


  if (type === "newFamily") {
    const mutatFunc = manualAddSeat(periodID);
    const result = await performMutation({ request, schema: addSeatSchema, mutation: mutatFunc });

    return json({ result });
  }

  if (type === "addFamily") {
    const mutatFunc = addFamilySeat(periodID);
    const result = await performMutation({ request, schema: addFamilySchema, mutation: mutatFunc });

    return json({ result });
  }

  return json({ result: { success: false, errors: { _global: ["Invalid form submission"] } } });
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);
  const periodID: ServicePeriodId = params["periodID"] ?? "periodID";

  const service_period = await db.service_period.read(periodID);
  if (!service_period) {
    throw new Error("Service period not found");
  }

  const service_period_seats = await db
    .seats.queryByString("service_period_id", periodID);

  const added_family_ids = service_period_seats.map((seat) =>
    seat.family_id
  );

  const families = await db.families.getAll();

  const families_not_added = families.filter((family) =>
    !added_family_ids.includes(family.id)
  );



  return json({ families_not_added });
};


export default function Route() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <div className="mx-auto prose">
        <h3>Add Seat to Service Period</h3>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {
          data.families_not_added.map((family) => {
            return (
              <div className="flex flex-row justify-between">
                <p>{family.family_name}</p>
                <AddFamilySeatForm family_id={family.id} />
              </div>
            )
          })
        }
      </div>
      {
        actionData && <div>
          <pre>{JSON.stringify(actionData, null, 2)}</pre>
        </div>
      }


    </div>
  )
}


function AddFamilySeatForm({ family_id }: { family_id: string }) {
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

  }



  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Family</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <fetcher.Form method="POST">
          <DialogHeader className="py-2">
            <DialogTitle>Update Address</DialogTitle>
            <DialogDescription>
              Update the address for this family.
            </DialogDescription>
          </DialogHeader>
          <input readOnly type="hidden" name="type" value={"addFamily"} />
          <input readOnly type="hidden" name="family_id" value={family_id} />
          <FormTextArea label="Delivery Notes" id="dropOffNotes" />

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

