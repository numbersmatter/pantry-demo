import { FamilyAppModel } from '~/lib/database/families/types'
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
import { Button } from '~/components/shadcn/ui/button';
import { FormTextField } from '~/components/forms/textfield';


interface family {
}


export default function FamilyDisplay({ family }: { family: FamilyAppModel }) {




  return (
    <>
      <div className="py-3 px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          Family Information
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Family Details.
        </p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">

        </dl>
      </div>
    </>
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



interface ActionData {
  success: boolean,
  message: string,
  errors: any,


}

function UpdateTextDialog({
  fieldId, fieldLabel, fieldValue
}: {
  fieldId: string,
  fieldLabel: string,
  fieldValue: string
}) {
  const fetcher = useFetcher();
  const [isOpen, setIsOpen] = useState(false);


  const isFetching = fetcher.state !== 'idle';


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Update</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <fetcher.Form method="POST">
          <DialogHeader>
            <DialogTitle>{fieldLabel}</DialogTitle>
            <DialogDescription>
              Update the {fieldLabel} for this family.
            </DialogDescription>
          </DialogHeader>
          <input type="hidden" name="fieldId" value={fieldId} />
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



