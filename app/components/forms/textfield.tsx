import { Input } from "../shadcn/ui/input";
import { Label } from "../shadcn/ui/label";


export function FormTextField({
  label, id, defaultValue, error
}: {
  label: string, id: string, defaultValue?: string, error?: string
}) {
  const className = error ? "col-span-3 ring-1 ring-inset ring-red-300" : "col-span-3";
  return <div className="grid grid-cols-1 gap-2 pb-1 md:grid-cols-4 md:items-center md:gap-4">
    <Label className="text-left md:text-right">{label}</Label>
    <Input id={id} name={id} defaultValue={defaultValue} className={className} />
    {error && <div className="col-span-4 text-red-500 flex flex-row justify-end">
      <p>
        {error}
      </p>
    </div>
    }
  </div>;
}