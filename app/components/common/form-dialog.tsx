import { Button } from "~/components/shadcn/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/shadcn/ui/dialog"


export function FormDialogVer1({ children }: { children?: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Item</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        {children}
      </DialogContent>
    </Dialog>
  )
}


export function FormDialog({ children, addButton }: { children?: React.ReactNode, addButton: React.ReactNode }) {

  return (
    <Dialog>
      <DialogTrigger asChild>
        {addButton}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        {children}
      </DialogContent>
    </Dialog>
  )

}