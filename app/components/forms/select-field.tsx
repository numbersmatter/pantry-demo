import { Label } from "../shadcn/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../shadcn/ui/select";
import { useState } from "react";


export function SelectField({
  selectOptions,
  placeholder,
  id,
  label
}: {
  selectOptions: { value: string, label: string }[],
  placeholder: string,
  id: string,
  label: string
}) {

  return <div className="grid grid-cols-1 gap-2 pb-1 md:grid-cols-4 md:items-center md:gap-4">
    <Label className="text-left md:text-right">{label}</Label>
    <Select name={id} >
      <SelectTrigger className="col-span-3">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {
          selectOptions.map(({ value, label }) => {
            return <SelectItem key={value} value={value}>{label}</SelectItem>
          })
        }
      </SelectContent>
    </Select>
  </div>;
}
