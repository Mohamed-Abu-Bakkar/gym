import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Dumbbell } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/app/_user/workout-session')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect back to workouts since we don't have sessions implemented yet
    const timer = setTimeout(() => {
      navigate({ to: '/app/workouts' })
    }, 2000)
    return () => clearTimeout(timer)
  }, [navigate])

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
              <h3 className="font-semibold">Session tracking coming soon</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Redirecting you back to workouts...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
