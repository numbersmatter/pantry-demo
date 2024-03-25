import { DataTable } from "~/components/display/data-table";
import { programAreaColumns } from "./columns";



export function ProgramAreasTable() {

  return (
    <div>
      <DataTable columns={programAreaColumns} data={[]} />
    </div>
  )
}