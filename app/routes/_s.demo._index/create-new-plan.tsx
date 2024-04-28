import { Form, useActionData } from "@remix-run/react";
import { FormTextField } from "~/components/forms/textfield";
import { Button } from "~/components/shadcn/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/shadcn/ui/dialog";


export function CreateNewPlan() {
  const actionData = useActionData<undefined | Partial<Record<"title" | "_action" | "_global", string[]>>>();

  const errors = actionData ?? {};

  const titleError = errors.title?.[0];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          Create New Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form method="post">
          <DialogHeader>
            <DialogTitle>Create New Plan</DialogTitle>
            <DialogDescription>
              Create a new plan for the week.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <FormTextField label="Title" id="title" error={titleError} />

          </div>
          <DialogFooter className="">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type={"submit"} name="_action" value="create">
              Create Plan
            </Button>
          </DialogFooter>
        </Form>

      </DialogContent>

    </Dialog>
  );
}