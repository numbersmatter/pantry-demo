import type { ActionFunctionArgs } from "@remix-run/node";
import { json, useFetcher, useLoaderData } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node";
import { protectedRoute } from "~/lib/auth/auth.server";
import { db } from "~/lib/database/firestore.server";
import { serviceListIndexCols } from "~/lib/database/service-lists/tables";
import { DataTable } from "~/components/display/data-table";
import { useEffect, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/shadcn/ui/dialog";
import { Button } from "~/components/shadcn/ui/button";
import { DialogDescription } from "@radix-ui/react-dialog";
import { FormTextField } from "~/components/forms/textfield";
import { FormTextArea } from "~/components/forms/text-area";
import { z } from "zod";
import { makeDomainFunction } from "domain-functions";
import { servicePeriodToDbModel } from "~/lib/database/service-periods/service-periods-crud.server";
import { performMutation } from "remix-forms";
import { ServiceTransactionValue } from "~/lib/database/service-transactions/types/service-trans-model";
import { ServiceListAdd } from "~/lib/database/service-lists/types";


const addListSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string(),
});

const addListMutation = (service_period_id: string) => makeDomainFunction(addListSchema)(
  async (values) => {

    const service_period = await db.service_period.read(service_period_id);
    if (!service_period) {
      throw new Error("Service period not found");
    }

    const servicePeriodDb = servicePeriodToDbModel(service_period);

    const serviceListData: ServiceListAdd = {
      name: values.name,
      description: values.description,
      service_period_id: service_period_id,
      service_period: servicePeriodDb,
      seats_array: [],
      service_items: [],
      service_type: "FoodBoxOrder",
    }

    const serviceListId = await db.service_lists.create(serviceListData);

    return { service_list_id: serviceListId, status: "success" }
  }
)

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);
  const service_period_id = params.periodID ?? "periodID";
  const service_period = await db.service_period.read(service_period_id);

  if (!service_period) {
    throw new Error("Service period not found");
  };

  const service_lists = await db.service_lists.inPeriod(service_period_id);

  return json({ service_lists });
};



export const action = async ({ request, params }: ActionFunctionArgs) => {
  let { user } = await protectedRoute(request);
  const service_period_id = params.periodID ?? "periodID";
  const clonedRequest = request.clone();
  const formData = await clonedRequest.formData();

  const action = formData.get("_action") as string;

  if (action === "addList") {
    const result = await performMutation({
      request,
      schema: addListSchema,
      mutation: addListMutation(service_period_id),
    });
    return json({ result });
  }


  return json({ result: { success: false, message: "Invalid action", errors: { _globel: ["Invalid Action"] } } });
};



export default function Route() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <div>
        <AddList />
      </div>
      <DataTable columns={serviceListIndexCols} data={data.service_lists} />
    </div>
  )
}

function AddList() {
  const fetcher = useFetcher<typeof action>();
  const [isOpen, setIsOpen] = useState(false);
  const isFetching = fetcher.state !== 'idle';
  const actionData = fetcher.data;

  const formResult = actionData?.result ?? { success: false, errors: {} };
  const formErrors = formResult.success ? {} : formResult.errors as Partial<Record<"name" | "description" | "_global", string[]>>;

  const displayError = {
    name: formErrors.name?.[0] ?? "",
    description: formErrors.description?.[0] ?? "",
    _global: formErrors._global?.[0] ?? "",
  }

  useEffect(() => {
    if (actionData?.result?.success) {
      setIsOpen(false);
    }
  }, [actionData, isFetching])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add List</Button>
      </DialogTrigger>
      <DialogContent>
        <fetcher.Form method="POST">
          <DialogHeader>
            <DialogTitle>Create Service List</DialogTitle>
            <DialogDescription>
              Create a Service List for this program.
            </DialogDescription>
          </DialogHeader>

          <input hidden readOnly name="_action" value={"addList"} />
          <FormTextField label="Name" id="name" error={displayError.name} />
          <FormTextArea label="Description" id="description" />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant={"secondary"}>Cancel</Button>
            </DialogClose>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  )

}

