import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "~/lib"

const ProgressTabs = TabsPrimitive.Root

const ProgressTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0",
      className
    )}
    {...props}
  />
))
ProgressTabsList.displayName = TabsPrimitive.List.displayName

const ProgressTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "",
      className
    )}
    {...props}
  />
))
ProgressTabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const ProgressTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300",
      className
    )}
    {...props}
  />
))
ProgressTabsContent.displayName = TabsPrimitive.Content.displayName

export { ProgressTabs, ProgressTabsList, ProgressTabsTrigger as TabsTrigger, ProgressTabsContent }
