import { CalendarIcon } from "@heroicons/react/24/outline"
import { addDays, format } from "date-fns"
import { useState } from "react"
import { Button } from "~/components/shadcn/ui/button"
import { Calendar } from "~/components/shadcn/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/shadcn/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/shadcn/ui/select"
import { cn } from "~/lib"

export function DatePickerInput({ id }: { id: string }) {
  const [date, setDate] = useState<Date>()

  return (
    <>
      <input hidden name={id} value={date?.toISOString()} readOnly />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="flex w-auto flex-col space-y-2 p-2"
        >
          <Select
            onValueChange={(value) =>
              setDate(addDays(new Date(), parseInt(value)))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="0">Today</SelectItem>
              <SelectItem value="1">Tomorrow</SelectItem>
              <SelectItem value="3">In 3 days</SelectItem>
              <SelectItem value="7">In a week</SelectItem>
            </SelectContent>
          </Select>
          <div className="rounded-md border">
            <Calendar mode="single" selected={date} onSelect={setDate} />
          </div>
        </PopoverContent>
      </Popover>
    </>

  )
}
