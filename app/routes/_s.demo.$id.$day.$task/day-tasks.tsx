import { Button } from "~/components/shadcn/ui/button";
import { TaskCard } from "./task-card";
import { TaskDrawer } from "./taskdrawer";
import { Form } from "@remix-run/react";
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
          <Button>Mark Complete</Button>
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
          <Button>Mark Complete</Button>
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
        <Button>Mark Complete</Button>
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
        <Button>Mark Complete</Button>
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
    default:
      return <div>Task not found</div>
  }

}