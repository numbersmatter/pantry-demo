
import { Form } from "@remix-run/react";
import { SelectField } from "~/components/forms/select-field";
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


export function AddSeatsFromServicePeriod({
  service_period_options,
}: {
  service_period_options: { label: string, value: string }[]
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          Add Seats from Service Period
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form method="post">
          <DialogHeader>
            <DialogTitle>Create New Weekplan</DialogTitle>
            <DialogDescription>
              This will create a new weekplan for the staff to follow.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <SelectField
              id="servicePeriod"
              label="Service Period"
              selectOptions={service_period_options}
              placeholder="Select Service Period to add from"
            />
          </div>
          <DialogFooter>
            <div className="w-full flex justify-between">
              <DialogClose>
                cancel
              </DialogClose>
              <Button name="type" value="addFromServicePeriod">
                Confirm
              </Button>
            </div>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}