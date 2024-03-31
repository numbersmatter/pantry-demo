import { useFetcher } from "@remix-run/react";
import { FormDialogVer1 } from "~/components/common/form-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/shadcn/ui/card"
import { Button } from "~/components/shadcn/ui/button"
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
import { Label } from "~/components/shadcn/ui/label";
import { Input } from "~/components/shadcn/ui/input";
import { useEffect, useState } from "react";
import { action } from "~/routes/_s.service-lists.$listID.preparing._index"
import { FormTextField } from "~/components/forms/textfield";
import { FormNumberField } from "~/components/forms/number-field";





export default function AddMenuItemDialog({ actionUrl }: { actionUrl: string }) {
  const fetcher = useFetcher<typeof action>();
  const [isOpen, setIsOpen] = useState(false);
  const isFetching = fetcher.state !== "idle";

  const actionData = fetcher.data;

  const emptyErrors = {
    item_name: [""],
    quantity: [""],
    value: [""],
  }

  useEffect(() => {
    if (actionData?.success && !isFetching) {
      setIsOpen(false)
    }
  }, [actionData, isFetching])

  const errors = actionData?.success
    ? emptyErrors
    : {
      item_name: actionData?.errors?.item_name ?? [""],
      quantity: actionData?.errors?.quantity ?? [""],
      value: actionData?.errors?.value ?? [""],
    };

  const displayError = {
    item_name: errors?.item_name[0] ?? "",
    quantity: errors?.quantity[0],
    value: errors?.value[0],
  }


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Item</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <fetcher.Form method="post" action={actionUrl}>
          <DialogHeader>
            <DialogTitle>
              Add Item
            </DialogTitle>
            <CardDescription>
              Adds item to the service list menu.
            </CardDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <FormTextField
              id="item_name"
              label="Name"
              error={displayError.item_name}
            />
            <FormNumberField
              id="quantity"
              label="Quantity"
              error={displayError.quantity}
            />
            <FormNumberField
              id="value"
              label="Unit Value"
              error={displayError.value}
            />
            {/* <div className="space-y-1">
              <Label htmlFor="item_name">Name</Label>
              <Input name="item_name" id="item_name" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" name="quantity" type="number" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="value">Unit Value</Label>
              <Input id="value" name="value" type="number" />
            </div> */}
          </div>
          <DialogFooter>
            <Button name="actionType" value="addItem" type="submit">Add Item</Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  )
}