import { createFileRoute } from '@tanstack/react-router'
import { Scale, Utensils } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from '@/components/animate-ui/components/radix/tabs'

export const Route = createFileRoute('/app/_user/logs')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="pt-4">
        <h1 className="text-2xl font-bold">Logs</h1>
        <p className="text-muted-foreground">Track your diet and weight</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="diet">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="diet">Diet</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
        </TabsList>

        <TabsContents className="mt-4">
          {/* Diet Tab */}
          <TabsContent value="diet" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Diet Logging</CardTitle>
                <CardDescription>Track your daily nutrition</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Utensils className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Diet tracking coming soon</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                      Nutrition logging will be integrated with the backend.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Weight Tab */}
          <TabsContent value="weight" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Weight Tracking</CardTitle>
                <CardDescription>Monitor your weight progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Scale className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">
                      Weight tracking coming soon
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                      Weight logging and progress charts will be integrated with
                      the backend.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </TabsContents>
      </Tabs>
    </div>
  )
}
