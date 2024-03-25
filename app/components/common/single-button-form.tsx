import { Form } from "@remix-run/react";
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