import { useFetcher } from "@remix-run/react";
import { Button } from "~/components/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/shadcn/ui/card"


export interface SeatBox {
  family_name: string;
  enrolled_date: Date;
  number_of_members: number;
  id: string;
  status: "added" | "notAdded"

}


export function AddSeatBox({ seat, actionUrl }: { seat: SeatBox, actionUrl: string }) {

  const fetcher = useFetcher();

  const fetching = fetcher.state !== "idle" ? true : false;
  const isFetching = fetcher.state !== "idle";

  const seatStatus = fetching ? "pending" : seat.status;

  const seatClasses: {
    "pending": string,
    "added": string,
    "notAdded": string
  } = {
    "pending": "bg-yellow-400",
    "added": "bg-green-400",
    "notAdded": ""
  }
  const addedValues = {
    value: "removeSeat",
    text: "Remove Seat",
    variant: "destructive"
  }
  const notAddedValues = {
    value: "addSeat",
    text: "Add Seat",
    variant: "secondary"
  }

  const variant: "destructive" | "secondary" = seatStatus === "added" ? "destructive" : "secondary";

  const fetcherProps = seatStatus === "added" ? addedValues : notAddedValues;


  return (
    <Card className={seatClasses[seatStatus]}>
      <CardHeader>
        <CardTitle>{seat.family_name}</CardTitle>
        <CardDescription>
          {seat.enrolled_date.toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* {
          seatStatus === "added" && (
            <fetcher.Form method="post" className="flex flex-row gap-2">
              <input hidden readOnly name="actionType" value="removeSeat" />
              <input hidden readOnly name="seatID" value={seat.id} />
              <Button variant="destructive" type="submit">
                Remove Seat
              </Button>
            </fetcher.Form>
          )
        } */}

        <fetcher.Form action={actionUrl} method="post" className="flex flex-row gap-2">
          <input hidden readOnly name="actionType" value={fetcherProps.value} />
          <input hidden readOnly name="seatID" value={seat.id} />
          <Button disabled={isFetching} variant={variant} type="submit">
            {fetcherProps.text}
          </Button>
        </fetcher.Form>


      </CardContent>
    </Card>
  )

}