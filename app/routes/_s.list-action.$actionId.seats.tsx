import type { ActionFunctionArgs } from "@remix-run/node";
import { json, useFetcher, useLoaderData } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node";
import ProgressPanels, { Step } from "~/components/common/progress-panels"
import { protectedRoute } from "~/lib/auth/auth.server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/shadcn/ui/card";
import { Button } from "~/components/shadcn/ui/button";
import { db } from "~/lib/database/firestore.server";
import { z } from "zod";
import { makeDomainFunction } from "domain-functions";

interface SeatBox {
  family_name: string;
  enrolled_date: Date;
  number_of_members: number;
  id: string;
  status: "added" | "notAdded"

}

const seatMutSchema = z.object({
  seatID: z.string().length(20),
  actionType: z.enum(["addSeat", "removeSeat"])
})

const addMutation = (actionId: string) => makeDomainFunction(seatMutSchema)(
  async ({ seatID }) => {
    const seat = await db.seats.read(seatID);
    if (!seat) {
      return {
        status: 404,
        message: "Seat not found"
      }
    }

    await db.pending.addSeat(actionId, seatID);

    return {
      status: 200,
      message: "Seat added"
    }
  }
);

const removeMutation = (actionId: string) => makeDomainFunction(seatMutSchema)(
  async ({ seatID }) => {
    const seat = await db.seats.read(seatID);
    if (!seat) {
      return {
        status: 404,
        message: "Seat not found"
      }
    }

    await db.pending.removeSeat(actionId, seatID);
    return {
      status: 200,
      message: "Seat removed"
    }
  }
);



export const action = async ({ request }: ActionFunctionArgs) => {
  let { user } = await protectedRoute(request);
  return null;
};


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let { user } = await protectedRoute(request);
  const actionId = params.actionId ?? "actionId";


  const baseUrl = `/list-action/${actionId}`

  const steps: Step[] = [
    { id: 'items', name: 'Menu Items', to: `${baseUrl}`, status: 'current' },
    { id: 'seat', name: 'Seat Selection', to: `${baseUrl}/seats`, status: 'upcoming' },
    { id: 'preview', name: 'Preview', to: `${baseUrl}/preview`, status: 'upcoming' },
  ];

  const action_list = {
    service_period_id: "MCurta6GO8PELJs4LGdO",
    seats_array: ["seat1", "seat2", "seat3"]
  }

  const allSeats = await db.seats.queryByString("service_period_id", action_list.service_period_id);

  const seatsStatus = allSeats.map((seat) => {
    return {
      id: seat.id,
      family_name: seat.family_name,
      enrolled_date: seat.enrolled_date,
      number_of_members: 1,
      status: action_list.seats_array.includes(seat.id) ? "added" : "notAdded"
    } as SeatBox
  })



  return json({ steps, seatsStatus });
};




export default function Route() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <ProgressPanels steps={data.steps} />
      <Card>
        <CardHeader>
          <CardTitle>Seat Selection</CardTitle>
          <div className="flex flex-row justify-between">
            <CardDescription>
              Select the seats for this service list.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p>Seat Selection</p>
          <div className="flex flex-col gap-2">
            {
              data.seatsStatus.map((seat) => {
                const data = {
                  family_name: seat.family_name,
                  enrolled_date: new Date(seat.enrolled_date),
                  number_of_members: 1,
                  id: seat.id,
                  status: seat.status
                }
                return (
                  <AddSeatBox key={seat.id} seat={data} />
                )
              })
            }
          </div>
        </CardContent>
      </Card>
      <pre>{JSON.stringify({}, null, 2)} </pre>
    </>
  )
};


function AddSeatBox({ seat }: { seat: SeatBox }) {
  const fetcher = useFetcher();
  const fetching = fetcher.state !== "idle" ? true : false;
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


  return (
    <Card className={seatClasses[seatStatus]}>
      <CardHeader>
        <CardTitle>{seat.family_name}</CardTitle>
        <CardDescription>
          {seat.enrolled_date.toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {
          seatStatus === "added" && (
            <fetcher.Form method="post" className="flex flex-row gap-2">
              <input hidden readOnly name="actionType" value="removeSeat" />
              <input hidden readOnly name="seatID" value={seat.id} />
              <Button variant="destructive" type="submit">
                Remove Seat
              </Button>
            </fetcher.Form>
          )
        }
        {
          seatStatus === "notAdded" &&
          <fetcher.Form method="post" className="flex flex-row gap-2">
            <input hidden readOnly name="actionType" value="addSeat" />
            <input hidden readOnly name="seatID" value={seat.id} />
            <Button variant="secondary" type="submit">
              Add Seat
            </Button>
          </fetcher.Form>
        }

      </CardContent>
    </Card>
  )

}