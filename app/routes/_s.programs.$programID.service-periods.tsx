import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { makeDomainFunction } from "domain-functions";
import { Button } from "~/components/shadcn/ui/button";
import { performMutation } from "remix-forms";
import { z } from "zod";
import { ContainerPadded } from "~/components/common/containers";
import { FormDialog, FormDialogVer1 } from "~/components/common/form-dialog";
import { HeaderTabs, SectionHeader, TabOption } from "~/components/common/header-tabs";
import { DataTable } from "~/components/display/data-table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/shadcn/ui/card";
import { Input } from "~/components/shadcn/ui/input";
import { Label } from "~/components/shadcn/ui/label";
import { protectedRoute } from "~/lib/auth/auth.server";
import { programsDb } from "~/lib/database/programs/programs-crud.server";
import { servicePeriodsDb } from "~/lib/database/service-periods/service-periods-crud.server";
import { servicePeriodsOfProgramColumns } from "~/lib/database/service-periods/tables";
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "~/components/shadcn/ui/dialog";
import { FormTextField } from "~/components/forms/textfield";
import { SelectField } from "~/components/forms/select-field";
import { db } from "~/lib/database/firestore.server";
import { DatePickerInput } from "~/components/shadcn/compound/data-picker";
import { FormNumberField } from "~/components/forms/number-field";



export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);

  const programID = params.programID ?? "programID";

  const program = await programsDb.read(programID);
  if (!program) {
    throw new Response("Program not found", { status: 404 });
  }

  const servicePeriods = await servicePeriodsDb.byProgramId(programID);

  const tabs: TabOption[] = [
    { name: 'Overview', to: '', end: true },
    { name: 'Service Periods', to: 'service-periods', end: false },
  ]

  const baseUrl = `/programs/${programID}`;

  return json({ tabs, baseUrl, program, servicePeriods });
};


const schema = z.object({
  name: z.string().min(3).max(100),
  description: z.string(),
  capacity: z.coerce.number(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
});

const mutation = (program_id: string) => makeDomainFunction(schema)(
  async (values) => {

    const data = {
      start_date: values.start_date,
      end_date: values.end_date,
      name: values.name,
      description: values.description,
      capacity: values.capacity,
      id: "",
      created_date: new Date(),
      updated_date: new Date(),
      program_id,
    }

    const servicePeriodID = await servicePeriodsDb.create(data);
    return { ...data, id: servicePeriodID };
  }
)

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { user } = await protectedRoute(request);
  const programID = params.programID ?? "programID";
  const clonedRequest = request.clone();

  const formData = Object.fromEntries(await clonedRequest.formData());
  console.log("formData", formData);

  const parse = schema.safeParse(formData);
  console.log("parse", JSON.stringify(parse, null, 2));
  if (!parse.success) {
    const errors: { [key: string]: string[] } = {};
    parse.error.errors.forEach((e) => {
      errors[e.path.join(".")] = [e.message];

    }
    );
    return json({
      success: false,
      errors,
      test: "test",
    });
  }



  const program = await db.programs.read(programID);
  if (!program) {
    throw new Response("Program not found", { status: 404 });
  }
  //  performmutation does not recognize dates
  // const result = await performMutation({
  //   request,
  //   schema,
  //   mutation: mutation(program.id),
  // });

  // if (!result.success) {
  //   return json(result);
  // }

  const servicePeriodID = await db.service_period.create({
    start_date: parse.data.start_date,
    end_date: parse.data.end_date,
    name: parse.data.name,
    description: parse.data.description,
    capacity: parse.data.capacity,
    id: "",
    created_date: new Date(),
    updated_date: new Date(),
    program_id: programID,
  })



  return redirect(`/programs/${programID}/service-periods/${servicePeriodID}`);
};


export default function ProgramIDRouteServicePeriods() {
  const { tabs, baseUrl, servicePeriods } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const servicePeriodTableData = servicePeriods.map((sp) => {
    return {
      name: sp.name,
      description: sp.description,
      id: sp.id,
    }
  })

  const errors = {
    name: ""
  }

  return (
    <>
      <HeaderTabs tabs={tabs} baseUrl={baseUrl} defaultTab="service-periods" />
      <div className="mt-6 flex flex-row justify-between">
        <FormDialog addButton={<Button className="">Add Service Period</Button>}>
          <DialogHeader>
            <DialogTitle>Service Period</DialogTitle>
          </DialogHeader>
          <Form method="post">
            <div className="grid gap-4 py-4 ">
              <FormTextField label="Name" id="name" error={errors.name} />
              <FormTextField label="Description" id="description" />
              <FormNumberField label="Capacity" id="capacity" />
              <FormTextField label="Criteria" id="criteria" />
              <div className="grid grid-cols-1 gap-2 pb-1 md:grid-cols-4 md:items-center md:gap-4">
                <Label htmlFor="start_date">Start Date</Label>
                <DatePickerInput id="start_date" />
              </div>
              <div className="grid grid-cols-1 gap-2 pb-1 md:grid-cols-4 md:items-center md:gap-4">
                <Label htmlFor="end_date">End Date</Label>
                <DatePickerInput id="end_date" />
              </div>
            </div>
            <DialogFooter className="justify-between">
              <DialogClose>
                <Button type={"button"} variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type={"submit"}>
                Create Service Period
              </Button>
            </DialogFooter>
          </Form>
        </FormDialog>
      </div>
      <div className="mt-6" />
      <DataTable columns={servicePeriodsOfProgramColumns} data={servicePeriodTableData} />
    </>
  )
}