import { createFileRoute } from '@tanstack/react-router'
import { Calendar, Dumbbell, ClipboardList } from 'lucide-react'
import { useQuery } from 'convex/react'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { useAuth } from '@/components/auth/useAuth'
import { api } from '../../../../convex/_generated/api'

export const Route = createFileRoute('/app/_user/workouts')({
  component: RouteComponent,
})

function RouteComponent() {
  const today = new Date()
  const { user } = useAuth()

  // Fetch user's assigned training plan
  const userWithMeta = useQuery(
    api.users.getUserWithMeta,
    user ? { userId: user._id } : 'skip',
  )

  const trainingPlan = useQuery(
    api.trainingPlans.getTrainingPlanById,
    userWithMeta?.trainingPlanId
      ? { trainingPlanId: userWithMeta.trainingPlanId }
      : 'skip',
  )

  return (
    <div className="space-y-4">
      {/* Header with date and day */}
      <div className="sticky top-0 z-10 bg-background p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Workouts</h1>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
              <Calendar className="w-4 h-4" />
              <span>
                {today.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {!user && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Please sign in to view workouts
            </p>
          </div>
        )}

        {user && !trainingPlan && (
          <Card>
            <CardHeader>
              <CardTitle>No Training Program Assigned</CardTitle>
              <CardDescription>
                Contact your trainer to get a workout program
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <ClipboardList className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">No Program Yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Your trainer will assign you a personalized training
                    program.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {trainingPlan && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>{trainingPlan.name}</CardTitle>
                <CardDescription>{trainingPlan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{trainingPlan.durationWeeks} weeks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dumbbell className="h-4 w-4" />
                    <span>{trainingPlan.days.length} workout days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {trainingPlan.days.map((day, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg capitalize">
                    {day.day}
                  </CardTitle>
                  <CardDescription>
                    {day.exercises.length} exercises
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {day.exercises.map((exercise, exIndex) => (
                    <div
                      key={exIndex}
                      className="border rounded-lg p-4 space-y-2"
                    >
                      <h4 className="font-medium">{exercise.exerciseName}</h4>
                      <div className="text-sm text-muted-foreground">
                        {exercise.noOfSets} sets
                      </div>
                      <div className="space-y-1">
                        {exercise.sets.map((set, setIndex) => (
                          <div
                            key={setIndex}
                            className="text-sm flex items-center gap-2"
                          >
                            <span className="text-muted-foreground">
                              Set {setIndex + 1}:
                            </span>
                            <span>{set.reps} reps</span>
                            {set.weight && <span>@ {set.weight}kg</span>}
                            {set.notes && (
                              <span className="text-muted-foreground italic">
                                ({set.notes})
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
