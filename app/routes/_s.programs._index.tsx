import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useFetcher, useLoaderData } from "@remix-run/react";
import { makeDomainFunction } from "domain-functions";
import { performMutation } from "remix-forms";
import { z } from "zod";
import { FormDialog } from "~/components/common/form-dialog";
import { SectionHeader } from "~/components/common/header-tabs";
import { DataTable } from "~/components/display/data-table";
import { SelectField } from "~/components/forms/select-field";
import { FormTextArea } from "~/components/forms/text-area";
import { FormTextField } from "~/components/forms/textfield";
import { Button } from "~/components/shadcn/ui/button";
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "~/components/shadcn/ui/dialog";
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


interface AreaActionData {
  success: boolean;
  errors?: {
    [key: string]: string[]
  }
}


export default function Route() {
  const { programs, programAreaOptions } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const fetcher = useFetcher<AreaActionData>();

  const fetchData = fetcher.data
  const fetchErrorObj = fetchData ? fetchData?.errors ?? {} : {};

  const fetchErrors = {
    name: fetchErrorObj?.name ? fetchErrorObj.name[0] : "",
    description: fetchErrorObj?.description ? fetchErrorObj.description[0] : "",
    status: fetchErrorObj?.status ? fetchErrorObj.status[0] : "",
  }


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
      <div className="flex justify-end gap-3 py-2">
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
              <DialogClose asChild>
                <Button type={"button"} variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type={"submit"}>
                Add Program
              </Button>
            </DialogFooter>
          </Form>
        </FormDialog>
        <FormDialog addButton={<Button className="">Add Program Area</Button>}>
          <DialogHeader>
            <DialogTitle>Add Program Area</DialogTitle>
          </DialogHeader>
          <fetcher.Form method="post" action="/program-areas">
            <input readOnly type="hidden" name="type" value="create" />
            <div className="grid gap-4 py-4 ">
              <FormTextField label="Name" id="name" error={fetchErrors.name} />
              <SelectField
                label={"Area Status"}
                id={"status"}
                selectOptions={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]}
                placeholder={"Choose Program Area Status"}
                defaultValue={"active"}
              />
              <FormTextArea label="Description" id="description" error={fetchErrors.description} />
            </div>
            <DialogFooter className="justify-between">
              <DialogClose asChild>
                <Button type={"button"} variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type={"submit"}>
                Create Program Area
              </Button>
            </DialogFooter>
          </fetcher.Form>
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