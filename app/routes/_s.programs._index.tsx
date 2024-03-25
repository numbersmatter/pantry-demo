import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { makeDomainFunction } from "domain-functions";
import { performMutation } from "remix-forms";
import { z } from "zod";
import { FormDialog } from "~/components/common/form-dialog";
import { SectionHeader } from "~/components/common/header-tabs";
import { DataTable } from "~/components/display/data-table";
import { SelectField } from "~/components/forms/select-field";
import { FormTextField } from "~/components/forms/textfield";
import { Button } from "~/components/shadcn/ui/button";
import { DialogFooter, DialogHeader, DialogTitle } from "~/components/shadcn/ui/dialog";
import { protectedRoute } from "~/lib/auth/auth.server";
import { db } from "~/lib/database/firestore.server";
import { programsOfAreaColumns } from "~/lib/database/programs/tables";


const addProgramSchema = z.object({
  name: z.string().min(3).max(100),
  program_area_id: z.string().length(20),
  criteria: z.string().min(0).max(100)
})


const addProgramMutation = makeDomainFunction(addProgramSchema)(
  async (values) => {
    // do something

    const data = {
      ...values,
      id: "",
      createdAt: new Date(),
      updatedAt: new Date(),

    }

    const newProgramID = await db.programs.create(data);


    return { ...data, id: newProgramID };
  }
)


export const loader = async ({ request }: LoaderFunctionArgs) => {
  await protectedRoute(request);
  const programs = await db.programs.getAll();

  const programAreas = await db.program_areas.getAll();

  const programAreaOptions = programAreas.map(area => ({ value: area.id, label: area.name }));

  return json({ programs, programAreaOptions });
};
export const action = async ({ request }: ActionFunctionArgs) => {
  await protectedRoute(request);


  const result = await performMutation({
    request,
    schema: addProgramSchema,
    mutation: addProgramMutation,
  });

  if (!result.success) {
    return json(result);
  }

  return redirect(`/programs/${result.data.id}`)

};





export default function Route() {
  const { programs, programAreaOptions } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();


  const errors = {
    name: actionData?.errors?.name ? actionData.errors.name[0] : undefined,
    criteria: actionData?.errors?.criteria ? actionData.errors.criteria[0] : undefined,
    program_area_id: actionData?.errors?.program_area_id ? actionData.errors.program_area_id[0] : undefined,
  }
  const programNameError = actionData?.errors?.name ? actionData.errors.name[0] : undefined;

  return (
    <div>
      <SectionHeader title="Programs" text2="text2" text3="text3" />
      <div className="mt-6" />
      <div className="flex justify-end">
        <FormDialog addButton={<Button className="">Add Program</Button>}>
          <DialogHeader>
            <DialogTitle>Add Program</DialogTitle>
          </DialogHeader>
          <Form method="post">
            <div className="grid gap-4 py-4 ">
              <FormTextField label="Name" id="name" error={errors.name} />
              <SelectField
                label={"Program Area"}
                id={"program_area_id"}
                selectOptions={programAreaOptions}
                placeholder={"Choose Program Area"}
              />
              <FormTextField label="Criteria" id="criteria" />
            </div>
            <DialogFooter className="justify-between">
              <Button type={"button"} variant="outline">
                Cancel
              </Button>
              <Button type={"submit"}>
                Add Program
              </Button>
            </DialogFooter>
          </Form>
        </FormDialog>
      </div>
      <DataTable columns={programsOfAreaColumns} data={programs} />
      <pre>
        {JSON.stringify(actionData, null, 2)}
      </pre>

    </div>
  );
}


function AddProgramDialog() {
  return (
    <div>
      <h1>Add Program</h1>
    </div>
  );
}