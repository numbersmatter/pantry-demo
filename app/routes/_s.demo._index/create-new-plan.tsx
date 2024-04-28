import { FormTextField } from "~/components/forms/textfield";
import { Button } from "~/components/shadcn/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/shadcn/ui/dialog";


export function CreateNewPlan() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          Create New Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Plan</DialogTitle>
          <DialogDescription>
            Create a new plan for the week.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <FormTextField label="Title" id="title" />

        </div>
        <DialogFooter className="">
          <DialogClose asChild>
            <Button variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type={"submit"}>
            Create Plan
          </Button>
        </DialogFooter>

      </DialogContent>

    </Dialog>
  );
}