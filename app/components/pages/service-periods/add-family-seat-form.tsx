import { Label } from "@radix-ui/react-label";
import { Form } from "@remix-run/react";



export default function AddFamilySeatForm({
  children
}: { children?: React.ReactNode }) {


  return (
    <Form method="POST" className="grid gap-4 py-4">
      {children}
      <FormInputText label="First Name" id="fname" />
      <FormInputText label="Last Name" id="lname" />
      <FormInputText label="Phone" id="phone" defaultValue="" />
      <FormInputText label="Street" id="street" />
      <FormInputText label="Unit" id="unit" />
      <FormInputText label="City" id="city" defaultValue="Thomasville" />
      <FormInputText label="State" id="state" defaultValue="NC" />
      <FormInputText label="Zip" id="zip" defaultValue="27360" />
      <FormInputText label="Drop Off Notes" id="dropOffNotes" defaultValue="" />
      <div className="grid grid-cols-4 items-center gap-4">
        <button type="submit">Save changes</button>
      </div>
    </Form>

  )
}


function FormInputText({
  label, id, defaultValue
}: {
  label: string, id: string, defaultValue?: string
}) {
  return <div className="grid grid-cols-1 gap-2 pb-1 md:grid-cols-4 md:items-center md:gap-4">
    <Label className="text-left md:text-right">{label}</Label>
    <input id={id} name={id} defaultValue={defaultValue} className="col-span-3" />
  </div>;
}
