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
import { Button } from "../ui/button"

export function AddItemTabs() {
  return (
    <Tabs defaultValue="other" className="">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="box">Packed Box</TabsTrigger>
        <TabsTrigger value="prepacked">Pre-Packed</TabsTrigger>
        <TabsTrigger value="other">Other</TabsTrigger>
      </TabsList>
      <TabsContent value="box">
        <Card>
          <CardHeader>
            <CardTitle> Packed Box</CardTitle>
            <CardDescription>
              Add a packed box to the service transaction.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="value">Value</Label>
              <Input id="value" defaultValue={0} />
            </div>
            <div className="grid grid-cols-1 space-y-1">
              <Label htmlFor="username">Image</Label>
              <input id="image" type="file" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="prepacked">
        <Card>
          <CardHeader>
            <CardTitle>Add Pre-packed Box</CardTitle>
            <CardDescription>
              Box packed by Second Harvest
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="value">Value</Label>
              <Input id="value" type="number" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Add Box</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="other">
        <Card>
          <CardHeader>
            <CardTitle>Other Item</CardTitle>
            <CardDescription>
              Add other item
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="item_name">Name</Label>
              <Input id="item_name" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="value">Unit Value</Label>
              <Input id="value" type="number" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Add Item</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
