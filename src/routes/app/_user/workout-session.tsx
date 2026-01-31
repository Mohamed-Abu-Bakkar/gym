import { createFileRoute } from '@tanstack/react-router'
import { Dumbbell } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/app/_user/workout-session')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="p-4 min-h-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Workout Session</CardTitle>
          <CardDescription>
            Live workout tracking will be available soon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Dumbbell className="h-8 w-8 text-primary" />
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
