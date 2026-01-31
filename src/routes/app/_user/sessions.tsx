import { createFileRoute } from '@tanstack/react-router'
import { Clock } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/app/_user/sessions')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="p-4 space-y-4">
      <div className="pt-4">
        <h1 className="text-2xl font-bold">Sessions</h1>
        <p className="text-muted-foreground">View your workout history</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workout Sessions</CardTitle>
          <CardDescription>Track your completed workouts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Workout Sessions Coming Soon</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Your training programs will be integrated with the backend.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
