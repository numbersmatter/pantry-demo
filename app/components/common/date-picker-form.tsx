import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@remix-run/react"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/shadcn/ui/popover"
import { Button } from "../shadcn/ui/button"
import { cn } from "~/lib"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "../shadcn/ui/calendar"
import { useState } from "react"

const FormSchema = z.object({
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
})

export function DatePickerForm() {
  const [date, setDate] = useState<Date>()


  return (
    <div className="space-y-8">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] pl-3 text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            {date ? (
              format(date, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Button type="submit">Submit</Button>
    </div>
  )
}
