import { Label } from "../shadcn/ui/label";
import { Textarea } from "../shadcn/ui/textarea";


export function FormTextArea({
  label, id, defaultValue, error
}: {
  label: string, id: string, defaultValue?: string, error?: string
}) {
  return <div className="grid grid-cols-1 gap-2 pb-1 md:grid-cols-4 md:items-center md:gap-4">
    <Label className="text-left md:text-right">{label}</Label>
    <Textarea id={id} name={id} defaultValue={defaultValue} className="col-span-3" />
    {error && <div className="col-span-4 text-red-500">{error}</div>}
  </div>;
}