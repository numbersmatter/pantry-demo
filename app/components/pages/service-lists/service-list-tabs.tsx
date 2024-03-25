import { CheckIcon } from "lucide-react"
import { Step } from "~/components/common/progress-panels"
import { Button } from "~/components/shadcn/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/shadcn/ui/card"
import { Input } from "~/components/shadcn/ui/input"
import { Label } from "~/components/shadcn/ui/label"

import {
  ProgressTabs,
  ProgressTabsList,
  ProgressTabsContent,
  TabsTrigger
} from "~/components/shadcn/ui/tabs-progress"

export function ServiceListProgress({
  steps, children, defaultValue, onValueChange
}: {
  steps: Step[], children?: React.ReactNode, defaultValue: string, onValueChange: (value: string) => void
}) {
  return (
    <ProgressTabs onValueChange={onValueChange} defaultValue={defaultValue} className="">
      <ProgressTabsList className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0">
        {steps.map((step, stepIdx) => {
          const stepNumber = (stepIdx + 1).toString()
          return (
            <li key={step.name} className="relative md:flex md:flex-1">
              {step.status === 'complete' ? (
                <TabsTrigger value={step.id} className="group flex w-full items-center">
                  <span className="flex items-center px-6 py-4 text-sm font-medium">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 group-hover:bg-indigo-800">
                      <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </span>
                    <span className="ml-4 text-sm font-medium text-gray-900">{step.name}</span>
                  </span>
                </TabsTrigger>
              ) : step.status === 'current' ? (
                <TabsTrigger value={step.id} className="flex items-center px-6 py-4 text-sm font-medium" aria-current="step">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-indigo-600">
                    <span className="text-indigo-600">{stepNumber}</span>
                  </span>
                  <span className="ml-4 text-sm font-medium text-indigo-600">{step.name}</span>
                </TabsTrigger>
              ) : (
                <TabsTrigger value={step.id} className="group flex items-center">
                  <span className="flex items-center px-6 py-4 text-sm font-medium">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400">
                      <span className="text-gray-500 group-hover:text-gray-900">
                        {stepNumber}
                      </span>
                    </span>
                    <span className="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900">{step.name}</span>
                  </span>
                </TabsTrigger>
              )}

              {stepIdx !== steps.length - 1 ? (
                <>
                  {/* Arrow separator for lg screens and up */}
                  <div className="absolute right-0 top-0 hidden h-full w-5 md:block" aria-hidden="true">
                    <svg
                      className="h-full w-full text-gray-300"
                      viewBox="0 0 22 80"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 -2L20 40L0 82"
                        vectorEffect="non-scaling-stroke"
                        stroke="currentcolor"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </>
              ) : null}
            </li>
          )
        })}

        {/* <TabsTrigger asChild value="account">
          <div className="relative md:flex md:flex-1">

            <button className="group flex w-full items-center">
              <span className="flex items-center px-6 py-4 text-sm font-medium">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 group-hover:bg-indigo-800">
                  <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </span>
                <span className="ml-4 text-sm font-medium text-gray-900">
                  Menu Items
                </span>
              </span>
            </button>
          </div>
        </TabsTrigger> */}
        {/* <TabsTrigger value="password">
          <span className="flex items-center px-6 py-4 text-sm font-medium">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 group-hover:bg-indigo-800">
              <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </span>
            <span className="ml-4 text-sm font-medium text-gray-900">
              Seat Selection
            </span>
          </span>
        </TabsTrigger> */}
      </ProgressTabsList>
      {children}
      {/* <ProgressTabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you're done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="@peduarte" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </ProgressTabsContent>
      <ProgressTabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </ProgressTabsContent> */}
    </ProgressTabs>
  )
}


{/* 
<ProgressTabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you're done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="@peduarte" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </ProgressTabsContent>
      <ProgressTabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </ProgressTabsContent> */}