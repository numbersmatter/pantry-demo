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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/shadcn/ui/tabs"
import AddFamilySeatForm from "./add-family-seat-form"

export function AddSeatsTabs() {
  return (
    <Tabs defaultValue="new" className="">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="new">New Family</TabsTrigger>
        <TabsTrigger value="existing">Existing Family</TabsTrigger>
      </TabsList>
      <TabsContent value="new">
        <Card>
          <CardHeader>
            <CardTitle>Add New Family</CardTitle>
            <CardDescription>
              This will create new person,family and seat records.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <AddFamilySeatForm>

            </AddFamilySeatForm>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="existing">
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
      </TabsContent>
    </Tabs>
  )
}
