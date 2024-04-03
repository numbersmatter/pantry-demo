import { Form, useFetcher } from "@remix-run/react";
import { ReactNode } from "react";
import { Button } from "../shadcn/ui/button";


export function SingleButtonForm({ children, text }: { text: string, children: ReactNode }) {

  return (
    <Form method="POST" className="">
      {children}
      <Button type="submit" variant={"ghost"} >
        {text}
      </Button>
    </Form>
  )
}

export function SingleButtonFetcher({ children, text, actionUrl }: { text: string, children: ReactNode, actionUrl?: string }) {
  const fetcher = useFetcher()

  return (
    <fetcher.Form method="POST" className="" action={actionUrl}>
      {children}
      <Button type="submit" variant={"ghost"} >
        {text}
      </Button>
    </fetcher.Form>
  )
}