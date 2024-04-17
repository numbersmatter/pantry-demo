import { Button } from "~/components/shadcn/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/shadcn/ui/card";


export type Task = {
  title: string,
  description: string,
}

export function TaskCard({ task, children }: { task: Task, children?: React.ReactNode }) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {task.title}
        </CardTitle>
        <CardDescription>
          {task.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      <CardFooter className="">
        <Button>Next</Button>
      </CardFooter>
    </Card>
  )
}