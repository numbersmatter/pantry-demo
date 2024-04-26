import { Button } from "~/components/shadcn/ui/button";
import { TaskCard } from "./task-card";
import { TaskDrawer } from "./taskdrawer";
import { Form, useFetcher } from "@remix-run/react";
import { FormNumberField } from "~/components/forms/number-field";
import { useRef, useState } from "react";
import { demoData } from "~/lib/demo/demo-data";
import { ValidDay } from "~/lib/database/weekplan/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/shadcn/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/shadcn/ui/drawer";


function CheckOutTruck() {
  const [open, setOpen] = useState(false)


  const task = {
    name: "Check Out Truck",
    description: "Enter the odometer reading for the truck."
  }

  const truckText = "On Mondays you will need to pickup our weekly order of food from Second Harvest Food Bank. The address is 1234 Main St. and you will need to be there by 2:30pm. The Executive Director will have the keys for the truck in their office. When you have received the keys enter the Odometer reading in the form to complete the task."



  return (
    <div className="py-4">
      <TaskCard
        task={task}
      >
        <p className="prose text-slate-600">
          {truckText}
        </p>
        <div className="mt-4">
          <Button variant={"secondary"} onClick={() => setOpen(true)}>
            Enter Odometer
          </Button>
        </div>
      </TaskCard>
      <TaskDrawer
        open={open}
        setOpen={setOpen}
        title="Odometer Reading"
        description="Enter the odometer reading for the truck here."
      >
        <Form method="post">
          <FormNumberField label="Odometer Reading" id="odometer" />
          <div className="py-3 flex justify-end">
            <Button type="submit">Submit</Button>
          </div>
        </Form>
      </TaskDrawer>
    </div>
  )
}

export type DriveStatus = "not-started" | "in-progress" | "completed" | "error" | "canceled"

function DriveSecondHarvest() {
  const [open, setOpen] = useState(false)
  const [driveStatus, setDriveStatus] = useState<DriveStatus>("not-started")

  const setStatusFetcher = useFetcher();

  const handleMarkComplete = async () => {
    await setStatusFetcher.submit(
      {
        newStatus: "complete",
        _action: "setTaskStatus"
      },
      {
        method: "post",
      })
    setDriveStatus("completed")
  }


  const task = {
    name: "Drive to Second Harvest Food Bank",
    description: "Leave at 1:45pm"
  }

  const explainText = " The address is 3330 Shorefair Dr NW, Winston-Salem, NC 27105, United States and you will need to be there by 2:30pm. The recommended leave time is 1:45pm."

  const statusText = (status: DriveStatus) => {
    switch (status) {
      case "not-started":
        return "Drive not started"
      case "in-progress":
        return "Drive in progress"
      case "completed":
        return "Drive completed"
      case "error":
        return "Error"
      case "canceled":
        return "Drive canceled"
    }
  }

  return (
    <div className="py-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {task.name}
          </CardTitle>
          <CardDescription>
            {task.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="prose text-slate-600">
            {explainText}
          </p>

          <iframe className="my-3 aspect-square min-w-full" src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d260609.8246677232!2d-80.33177336869866!3d36.01134875666099!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x88530a587631e067%3A0xd80fc5d0a6bcdbb1!2sCommunities%20In%20Schools%20of%20Thomasville%2C%20East%20Guilford%20Street%2C%20Thomasville%2C%20NC%2C%20USA!3m2!1d35.8848546!2d-80.0811739!4m5!1s0x8853af6a6ba8891f%3A0x20fce3b69c5e8c07!2sSecond%20Harvest%20Food%20Bank%20of%20Northwest%20North%20Carolina%2C%203330%20Shorefair%20Dr%20NW%2C%20Winston-Salem%2C%20NC%2027105%2C%20United%20States!3m2!1d36.13607!2d-80.25279019999999!5e1!3m2!1sen!2sco!4v1713976745359!5m2!1sen!2sco" allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
          <div className="mt-4">

          </div>
        </CardContent>
        <CardFooter className="grid grid-cols-1 gap-2">
          <Button type="button" onClick={handleMarkComplete}>
            Mark Complete
          </Button>
          <Button variant={"destructive"} onClick={() => setOpen(true)}>
            Report Problem
          </Button>
        </CardFooter>
      </Card>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>
                Something Go Wrong?
              </DrawerTitle>
              <DrawerDescription>
                Let us know if this task will be delayed or need to be cancelled.
              </DrawerDescription>
            </DrawerHeader>
            <div className="grid grid-cols-1 gap-2 p-4">
              <Button>
                Delayed
              </Button>
              <Button variant="destructive">
                Task Canceled
              </Button>
            </div>
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
function DriveCisT() {
  const [open, setOpen] = useState(false)
  const [driveStatus, setDriveStatus] = useState<DriveStatus>("not-started")
  const setStatusFetcher = useFetcher();

  const handleMarkComplete = async () => {
    await setStatusFetcher.submit(
      {
        newStatus: "complete",
        _action: "setTaskStatus"
      },
      {
        method: "post",
      })
    setDriveStatus("completed")
  }


  const task = {
    name: "Drive to Communities In Schools",
    description: "Drive back to CIS-T."
  }

  const explainText = " The address is  19 East Guilford Street, Thomasville, NC 27360."

  const statusText = (status: DriveStatus) => {
    switch (status) {
      case "not-started":
        return "Drive not started"
      case "in-progress":
        return "Drive in progress"
      case "completed":
        return "Drive completed"
      case "error":
        return "Error"
      case "canceled":
        return "Drive canceled"
    }
  }

  return (
    <div className="py-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {task.name}
          </CardTitle>
          <CardDescription>
            {task.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="prose text-slate-600">
            {explainText}
          </p>

          <iframe className="my-3 aspect-square min-w-full" src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d260609.8246677232!2d-80.33177336869866!3d36.01134875666099!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x88530a587631e067%3A0xd80fc5d0a6bcdbb1!2sCommunities%20In%20Schools%20of%20Thomasville%2C%20East%20Guilford%20Street%2C%20Thomasville%2C%20NC%2C%20USA!3m2!1d35.8848546!2d-80.0811739!4m5!1s0x8853af6a6ba8891f%3A0x20fce3b69c5e8c07!2sSecond%20Harvest%20Food%20Bank%20of%20Northwest%20North%20Carolina%2C%203330%20Shorefair%20Dr%20NW%2C%20Winston-Salem%2C%20NC%2027105%2C%20United%20States!3m2!1d36.13607!2d-80.25279019999999!5e1!3m2!1sen!2sco!4v1713976745359!5m2!1sen!2sco" allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
          <div className="mt-4">

          </div>
        </CardContent>
        <CardFooter className="grid grid-cols-1 gap-2">
          <Button type="button" onClick={handleMarkComplete}>
            Mark Complete
          </Button>
          <Button variant={"destructive"} onClick={() => setOpen(true)}>
            Report Problem
          </Button>
        </CardFooter>
      </Card>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>
                Something Go Wrong?
              </DrawerTitle>
              <DrawerDescription>
                Let us know if this task will be delayed or need to be cancelled.
              </DrawerDescription>
            </DrawerHeader>
            <div className="grid grid-cols-1 gap-2 p-4">
              <Button>
                Delayed
              </Button>
              <Button variant="destructive">
                Task Canceled
              </Button>
            </div>
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}


function AcceptOrder() {
  const [open, setOpen] = useState(false)
  const inputFile = useRef(null);
  const task = {
    name: "Accept Order",
    description: "Signing for pallets and inspecting order."
  }
  const setStatusFetcher = useFetcher();

  const handleMarkComplete = async () => {
    await setStatusFetcher.submit(
      {
        newStatus: "complete",
        _action: "setTaskStatus"
      },
      {
        method: "post",
      })
  }

  const explainText = "When you arrive at Second Harvest Food Bank you will need to sign for the pallets and inspect the order. After signing for the order use your phone to take a picture of the order and upload it here."

  const handleOpenFileInput = () => {
    if (inputFile.current === null) return;
    // @ts-ignore
    inputFile.current.click();
  }

  return <div className="py-4">
    <Card>
      <CardHeader>
        <CardTitle>
          {task.name}
        </CardTitle>
        <CardDescription>
          {task.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="prose text-slate-600">
          {explainText}
        </p>

        <div className="mt-4">
          <Button variant={"secondary"} onClick={handleOpenFileInput}>
            Upload Image
          </Button>
          <input
            type="file"
            ref={inputFile}
            hidden
          />
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-1 gap-2">
        <Button type="button" onClick={handleMarkComplete}>
          Mark Complete
        </Button>
        <Button variant={"destructive"} onClick={() => setOpen(true)}>
          Report Problem
        </Button>
      </CardFooter>
    </Card>
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>
              Something Go Wrong?
            </DrawerTitle>
            <DrawerDescription>
              Let us know what occurred.
            </DrawerDescription>
          </DrawerHeader>
          <div className="grid grid-cols-1 gap-2 p-4">
            <Button>
              Order is Wrong
            </Button>
            <Button variant="destructive">
              No Order Present
            </Button>
          </div>
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  </div>

}


function OffloadColdPallets() {
  const [open, setOpen] = useState(false)
  const setStatusFetcher = useFetcher();
  const handleMarkComplete = async () => {
    await setStatusFetcher.submit(
      {
        newStatus: "complete",
        _action: "setTaskStatus"
      },
      {
        method: "post",
      })
  }
  const task = {
    name: "Storge Cold Pallets",
    description: "Any frozen or refrigerated items moved to cold storage."
  }

  const explainText = " The address is  19 East Guilford Street, Thomasville, NC 27360."

  return <div className="py-4">
    <Card>
      <CardHeader>
        <CardTitle>
          {task.name}
        </CardTitle>
        <CardDescription>
          {task.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="prose text-slate-600">
          {explainText}
        </p>

        <div className="mt-4">

        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-1 gap-2">
        <Button type="button" onClick={handleMarkComplete}>
          Mark Complete
        </Button>
        <Button variant={"destructive"} onClick={() => setOpen(true)}>
          Report Problem
        </Button>
      </CardFooter>
    </Card>
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>
              Something Go Wrong?
            </DrawerTitle>
            <DrawerDescription>
              Let us know what occurred.
            </DrawerDescription>
          </DrawerHeader>
          <div className="grid grid-cols-1 gap-2 p-4">
            <Button>
              Order is Wrong
            </Button>
            <Button variant="destructive">
              No Order Present
            </Button>
          </div>
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  </div>
};
function OffloadToStagingArea() {
  const [open, setOpen] = useState(false)
  const setStatusFetcher = useFetcher();
  const handleMarkComplete = async () => {
    await setStatusFetcher.submit(
      {
        newStatus: "complete",
        _action: "setTaskStatus"
      },
      {
        method: "post",
      })
  }

  const task = {
    name: "Offload Dry Goods",
    description: "Move dry goods to the staging area."
  }

  const explainText = "We never know exactly what we will receive from Second Harvest Food Bank. The dry goods will need to be moved to the staging area for sorting and distribution later."

  return <div className="py-4">
    <Card>
      <CardHeader>
        <CardTitle>
          {task.name}
        </CardTitle>
        <CardDescription>
          {task.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="prose text-slate-600">
          {explainText}
        </p>

        <div className="mt-4">

        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-1 gap-2">
        <Button type="button" onClick={handleMarkComplete}>
          Mark Complete
        </Button>

      </CardFooter>
    </Card>
  </div>
};
function MoveToStorage() {
  const [open, setOpen] = useState(false)
  const setStatusFetcher = useFetcher();
  const handleMarkComplete = async () => {
    await setStatusFetcher.submit(
      {
        newStatus: "complete",
        _action: "setTaskStatus"
      },
      {
        method: "post",
      })
  }

  const task = {
    name: "Move to Storage",
    description: "Move dry goods into their storage area."
  }

  const explainText = "Space is always at a premier in our storage area. We have a couple of general categories for dry goods: canned goods, prepared boxes,  cereals and breakfast items."

  return <div className="py-4">
    <Card>
      <CardHeader>
        <CardTitle>
          {task.name}
        </CardTitle>
        <CardDescription>
          {task.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="prose text-slate-600">
          {explainText}
        </p>

        <div className="mt-4">

        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-1 gap-2">
        <Button type="button" onClick={handleMarkComplete}>
          Mark Complete
        </Button>

      </CardFooter>
    </Card>
  </div>
};
function MessageFamilies() {
  const [open, setOpen] = useState(false)
  const setStatusFetcher = useFetcher();
  const handleMarkComplete = async () => {
    await setStatusFetcher.submit(
      {
        newStatus: "complete",
        _action: "setTaskStatus"
      },
      {
        method: "post",
      })
  }

  const task = {
    name: "Send Message to Families",
    description: "Allows families to reserve a time for food pickup."
  }

  const explainText = "We do not have the resources to deliver all food boxes via DoorDash. For families not on DoorDash delivery we send them a message telling them how to reserve a time to pickup their box."

  return <div className="py-4">
    <Card>
      <CardHeader>
        <CardTitle>
          {task.name}
        </CardTitle>
        <CardDescription>
          {task.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="prose text-slate-600">
          {explainText}
        </p>

        <div className="mt-4">

        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-1 gap-2">
        <Button type="button" onClick={handleMarkComplete}>
          Mark Complete
        </Button>

      </CardFooter>
    </Card>
  </div>
};
function PrepareInventory() {
  const [open, setOpen] = useState(false)
  const setStatusFetcher = useFetcher();
  const handleMarkComplete = async () => {
    await setStatusFetcher.submit(
      {
        newStatus: "complete",
        _action: "setTaskStatus"
      },
      {
        method: "post",
      })
  }

  const task = {
    name: "Prepare Inventory",
    description: "Time permitting do inventory of possible items."
  }

  const explainText = "Inventory is done solely for the purposes of filling out this weeks order requests. We do not have the resources to do a full inventory of all items. On DoorDash only weeks we need to have about 70 boxes of food prepared. On Drive-thru weeks we need about 150 boxes of food prepared."

  return <div className="py-4">
    <Card>
      <CardHeader>
        <CardTitle>
          {task.name}
        </CardTitle>
        <CardDescription>
          {task.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="prose text-slate-600">
          {explainText}
        </p>

        <div className="mt-4">

        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-1 gap-2">
        <Button type="button" onClick={handleMarkComplete}>
          Mark Complete
        </Button>

      </CardFooter>
    </Card>
  </div>
};
function PlanServiceMenu() {
  const [open, setOpen] = useState(false)
  const setStatusFetcher = useFetcher();
  const handleMarkComplete = async () => {
    await setStatusFetcher.submit(
      {
        newStatus: "complete",
        _action: "setTaskStatus"
      },
      {
        method: "post",
      })
  }

  const task = {
    name: "Plan Service Menu",
    description: "The menu of items that will be sent in each box."
  }

  const explainText = "We try to have roughly similar items in each box. Our main limitation is this goal is what we receive from Second Harvest Food Bank. We don't always have 60 of one exact item in each box. So we try to substitute with similar items when necessary."

  return <div className="py-4">
    <Card>
      <CardHeader>
        <CardTitle>
          {task.name}
        </CardTitle>
        <CardDescription>
          {task.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="prose text-slate-600">
          {explainText}
        </p>

        <div className="mt-4">

        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-1 gap-2">
        <Button type="button" onClick={handleMarkComplete}>
          Mark Complete
        </Button>
      </CardFooter>
    </Card>
  </div>
};
function PlaceOrder() {
  const [open, setOpen] = useState(false);
  const setStatusFetcher = useFetcher();
  const handleMarkComplete = async () => {
    await setStatusFetcher.submit(
      {
        newStatus: "complete",
        _action: "setTaskStatus"
      },
      {
        method: "post",
      })
  }

  const task = {
    name: "Order from Second Harvest",
    description: "Place next week's order."
  }

  const explainText = "We place a weekly order from Second Harvest Food Bank. This order is placed on Tuesday for pickup the following Monday."

  return <div className="py-4">
    <Card>
      <CardHeader>
        <CardTitle>
          {task.name}
        </CardTitle>
        <CardDescription>
          {task.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="prose text-slate-600">
          {explainText}
        </p>

        <div className="mt-4">

        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-1 gap-2">
        <Button type="button" onClick={handleMarkComplete}>
          Mark Complete
        </Button>
      </CardFooter>
    </Card>
  </div>
};
function ReserveTruck() {
  const [open, setOpen] = useState(false);
  const setStatusFetcher = useFetcher();
  const handleMarkComplete = async () => {
    await setStatusFetcher.submit(
      {
        newStatus: "complete",
        _action: "setTaskStatus"
      },
      {
        method: "post",
      })
  }

  const task = {
    name: "Reserve Truck",
    description: "Reserve truck for following week."
  }

  const explainText = "After we place the order and reserve the truck we are set for the following week. The truck is reserved for Monday from noon to 4:30pm."

  return <div className="py-4">
    <Card>
      <CardHeader>
        <CardTitle>
          {task.name}
        </CardTitle>
        <CardDescription>
          {task.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="prose text-slate-600">
          {explainText}
        </p>

        <div className="mt-4">

        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-1 gap-2">
        <Button type="button" onClick={handleMarkComplete}>
          Mark Complete
        </Button>
      </CardFooter>
    </Card>
  </div>
};
function PrepareColdItems() {
  const [open, setOpen] = useState(false);
  const setStatusFetcher = useFetcher();
  const handleMarkComplete = async () => {
    await setStatusFetcher.submit(
      {
        newStatus: "complete",
        _action: "setTaskStatus"
      },
      {
        method: "post",
      })
  }

  const task = {
    name: "Prep Cold Items",
    description: "Prepare Cold Food Items."
  }

  const explainText = "Cold food items need to be prepared for DoorDash and Drive-thru weeks. We prepare all the cold items on Wednesday and store them in the DoorDash Freezers until they are ready to be added as the final item in the box."

  return <div className="py-4">
    <Card>
      <CardHeader>
        <CardTitle>
          {task.name}
        </CardTitle>
        <CardDescription>
          {task.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="prose text-slate-600">
          {explainText}
        </p>

        <div className="mt-4">

        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-1 gap-2">
        <Button type="button" onClick={handleMarkComplete}>
          Mark Complete
        </Button>
      </CardFooter>
    </Card>
  </div>
};
function StageDryGoods() {
  const [open, setOpen] = useState(false);
  const setStatusFetcher = useFetcher();
  const handleMarkComplete = async () => {
    await setStatusFetcher.submit(
      {
        newStatus: "complete",
        _action: "setTaskStatus"
      },
      {
        method: "post",
      })
  }

  const task = {
    name: "Stage Dry Goods",
    description: "Move non-perishable items to staging area."
  }

  const explainText = "After cold food items are prepared, we move the nonperishable items which will go into the box to the staging area. This is done on Wednesday and Thursday."

  return <div className="py-4">
    <Card>
      <CardHeader>
        <CardTitle>
          {task.name}
        </CardTitle>
        <CardDescription>
          {task.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="prose text-slate-600">
          {explainText}
        </p>

        <div className="mt-4">

        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-1 gap-2">
        <Button type="button" onClick={handleMarkComplete}>
          Mark Complete
        </Button>
      </CardFooter>
    </Card>
  </div>
};
function PrepareInPersonPickup() {
  const [open, setOpen] = useState(false);
  const setStatusFetcher = useFetcher();
  const handleMarkComplete = async () => {
    await setStatusFetcher.submit(
      {
        newStatus: "complete",
        _action: "setTaskStatus"
      },
      {
        method: "post",
      })
  }

  const task = {
    name: "Prepare In-Person Pickup",
    description: "Build boxes for in-person pickup."
  }

  const explainText = "All of the families that requested an in-person pickup time from the message sent out on Tuesday will be arriving today. Prepare those boxes of the pickup time."

  return <div className="py-4">
    <Card>
      <CardHeader>
        <CardTitle>
          {task.name}
        </CardTitle>
        <CardDescription>
          {task.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="prose text-slate-600">
          {explainText}
        </p>

        <div className="mt-4">

        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-1 gap-2">
        <Button type="button" onClick={handleMarkComplete}>
          Mark Complete
        </Button>
      </CardFooter>
    </Card>
  </div>
};
function BuildDeliveryBoxes() {
  const [open, setOpen] = useState(false);
  const setStatusFetcher = useFetcher();
  const handleMarkComplete = async () => {
    await setStatusFetcher.submit(
      {
        newStatus: "complete",
        _action: "setTaskStatus"
      },
      {
        method: "post",
      })
  }

  const task = {
    name: "Build Delivery Boxes",
    description: "Boxes for the DoorDash orders."
  }

  const explainText = "We have a set number of boxes that need to be built for DoorDash orders. These boxes are built on Thursday. The boxes are built with the non-perishable items for that box."

  return <div className="py-4">
    <Card>
      <CardHeader>
        <CardTitle>
          {task.name}
        </CardTitle>
        <CardDescription>
          {task.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="prose text-slate-600">
          {explainText}
        </p>

        <div className="mt-4">

        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-1 gap-2">
        <Button type="button" onClick={handleMarkComplete}>
          Mark Complete
        </Button>

      </CardFooter>
    </Card>
  </div>
};
function TakeSamplePicture() {
  const [open, setOpen] = useState(false);
  const setStatusFetcher = useFetcher();
  const handleMarkComplete = async () => {
    await setStatusFetcher.submit(
      {
        newStatus: "complete",
        _action: "setTaskStatus"
      },
      {
        method: "post",
      })
  }

  const task = {
    name: "Take Sample Picture",
    description: "Take a picture of the box items."
  }

  const explainText = "We send a picture of the box items to the families that are receiving the boxes. This is done on Friday morning and lets the family know what to expect in their box aswell as serves as a reminder to the family to expect a delivery."

  return <div className="py-4">
    <Card>
      <CardHeader>
        <CardTitle>
          {task.name}
        </CardTitle>
        <CardDescription>
          {task.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="prose text-slate-600">
          {explainText}
        </p>

        <div className="mt-4">

        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-1 gap-2">
        <Button type="button" onClick={handleMarkComplete}>
          Mark Complete
        </Button>

      </CardFooter>
    </Card>
  </div>
};
function SealDeliveryBoxes() {
  const [open, setOpen] = useState(false);
  const setStatusFetcher = useFetcher();
  const handleMarkComplete = async () => {
    await setStatusFetcher.submit(
      {
        newStatus: "complete",
        _action: "setTaskStatus"
      },
      {
        method: "post",
      })
  }

  const task = {
    name: "Seal Boxes",
    description: "Add frozen items and seal boxes."
  }

  const explainText = "The final step in preparing the boxes is to add the frozen items and seal the boxes. This is done on Friday morning. The boxes are then ready for delivery."

  return <div className="py-4">
    <Card>
      <CardHeader>
        <CardTitle>
          {task.name}
        </CardTitle>
        <CardDescription>
          {task.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="prose text-slate-600">
          {explainText}
        </p>

        <div className="mt-4">

        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-1 gap-2">
        <Button type="button" onClick={handleMarkComplete}>
          Mark Complete
        </Button>

      </CardFooter>
    </Card>
  </div>
};
function RequestDoorDash() {
  const [open, setOpen] = useState(false);
  const setStatusFetcher = useFetcher();
  const handleMarkComplete = async () => {
    await setStatusFetcher.submit(
      {
        newStatus: "complete",
        _action: "setTaskStatus"
      },
      {
        method: "post",
      })
  }

  const task = {
    name: "Request DoorDash",
    description: "Send your request to DoorDash."
  }

  const explainText = "Bulk DoorDash Delivery needs to be scheduled 1 hour prior to the first pickups. This is done on Friday morning. The DoorDash driver will arrive at noon if the request is made by 11 am."

  return <div className="py-4">
    <Card>
      <CardHeader>
        <CardTitle>
          {task.name}
        </CardTitle>
        <CardDescription>
          {task.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="prose text-slate-600">
          {explainText}
        </p>

        <div className="mt-4">

        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-1 gap-2">
        <Button type="button" onClick={handleMarkComplete}>
          Mark Complete
        </Button>

      </CardFooter>
    </Card>
  </div>
};
function LoadDasherTrolley() {
  const [open, setOpen] = useState(false);
  const setStatusFetcher = useFetcher();
  const handleMarkComplete = async () => {
    await setStatusFetcher.submit(
      {
        newStatus: "complete",
        _action: "setTaskStatus"
      },
      {
        method: "post",
      })
  }

  const task = {
    name: "Load Box Trollies",
    description: "Prepare boxes for each dasher."
  }

  const explainText = "Dasher's will be assigned up to 10 boxes each. The boxes are loaded onto the trollies and the dashers are given their delivery routes by DoorDash."

  return <div className="py-4">
    <Card>
      <CardHeader>
        <CardTitle>
          {task.name}
        </CardTitle>
        <CardDescription>
          {task.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="prose text-slate-600">
          {explainText}
        </p>

        <div className="mt-4">

        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-1 gap-2">
        <Button type="button" onClick={handleMarkComplete}>
          Mark Complete
        </Button>

      </CardFooter>
    </Card>
  </div>
};
function MeetDasher() {
  const [open, setOpen] = useState(false);
  const setStatusFetcher = useFetcher();
  const handleMarkComplete = async () => {
    await setStatusFetcher.submit(
      {
        newStatus: "complete",
        _action: "setTaskStatus"
      },
      {
        method: "post",
      })
  }

  const task = {
    name: "Meet Dashers",
    description: "Meet with the DoorDash drivers."
  }

  const explainText = "Verifer Dasher's name and total number of deliveries. Hand out the trolley and delivery route. Answer any questions the Dasher may have."

  return <div className="py-4">
    <Card>
      <CardHeader>
        <CardTitle>
          {task.name}
        </CardTitle>
        <CardDescription>
          {task.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="prose text-slate-600">
          {explainText}
        </p>

        <div className="mt-4">

        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-1 gap-2">
        <Button type="button" onClick={handleMarkComplete}>
          Mark Complete
        </Button>

      </CardFooter>
    </Card>
  </div>
};



export function DayTasks({ task_id }: { task_id: string }) {

  switch (task_id) {
    case 'check-out-truck':
      return <CheckOutTruck />
    case 'drive-second-harvest':
      return <DriveSecondHarvest />
    case 'accept-order':
      return <AcceptOrder />
    case 'drive-cis-t':
      return <DriveCisT />
    case 'unload-cold-pallets':
      return <OffloadColdPallets />
    case 'unload-to-staging':
      return <OffloadToStagingArea />
    case 'store-dry-goods':
      return <MoveToStorage />
    case 'send-message':
      return <MessageFamilies />
    case 'prepare-inventory':
      return <PrepareInventory />
    case 'plan-menu':
      return <PlanServiceMenu />
    case 'place-order':
      return <PlaceOrder />
    case 'reserve-truck':
      return <ReserveTruck />
    case 'prepare-cold-items':
      return <PrepareColdItems />
    case 'stage-dry-goods':
      return <StageDryGoods />
    case 'prepare-pickup-orders':
      return <PrepareInPersonPickup />
    case 'build-boxes':
      return <BuildDeliveryBoxes />
    case 'take-box-photo':
      return <TakeSamplePicture />
    case 'seal-boxes':
      return <SealDeliveryBoxes />
    case 'request-doordash':
      return <RequestDoorDash />
    case 'load-trollies':
      return <LoadDasherTrolley />
    case 'meet-dashers':
      return <MeetDasher />
    default:
      return <div>Task not found</div>
  }

}