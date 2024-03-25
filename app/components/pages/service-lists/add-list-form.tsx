import { Label } from "@radix-ui/react-label";
import { Form } from "@remix-run/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/shadcn/ui/select";



export default function AddServiceListForm({
  servicePeriodOptions,
  children
}: {
  children?: React.ReactNode
  servicePeriodOptions: { value: string, label: string }[]
}) {


  return (
    <Form method="POST" className="grid gap-4 py-4">
      {children}
      <FormInputText label="Name" id="name" />
      <FormInputText label="Description" id="description" defaultValue="" />
      <ServicePeriodSelect servicePeriodOptions={servicePeriodOptions} />
      <div className="grid grid-cols-4 items-center gap-4">
        <button type="submit">Save changes</button>
      </div>
    </Form>

  )
}

function ServicePeriodSelect({
  servicePeriodOptions
}: {
  servicePeriodOptions: { value: string, label: string }[]
}) {
  return <div className="grid grid-cols-1 gap-2 pb-1 md:grid-cols-4 md:items-center md:gap-4">
    <Label className="text-left md:text-right">Service Period</Label>
    <Select name={"service_period_id"} >
      <SelectTrigger className="col-span-3">
        <SelectValue placeholder="Choice Service Period" />
      </SelectTrigger>
      <SelectContent>
        {
          servicePeriodOptions.map(({ value, label }) => {
            return <SelectItem key={value} value={value}>{label}</SelectItem>
          })
        }
      </SelectContent>
    </Select>
  </div>;
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
