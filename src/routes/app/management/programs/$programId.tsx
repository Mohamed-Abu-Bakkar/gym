import { useEffect } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, ClipboardList, Calendar, Dumbbell } from 'lucide-react'
import { useQuery } from 'convex/react'

import { useAuth } from '@/components/auth/useAuth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { api } from '../../../../../convex/_generated/api'
import type { Id } from '../../../../../convex/_generated/dataModel'

const privilegedRoles = new Set(['trainer', 'admin'])

export const Route = createFileRoute('/app/management/programs/$programId')({
  component: ProgramDetailRoute,
})

function ProgramDetailRoute() {
  const { programId } = Route.useParams()
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  // Fetch program details
  const program = useQuery(api.trainingPlans.getTrainingPlanById, {
    trainingPlanId: programId as Id<'trainingPlans'>,
  })

  /* -------------------------------------------------------------------------- */
  /*                                    Auth                                    */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (isLoading) return
    if (!user) {
      navigate({ to: '/' })
      return
    }
    if (!privilegedRoles.has(user.role)) {
      navigate({ to: '/app' })
    }
  }, [user, isLoading, navigate])

  if (isLoading) {
    return <div className="p-4">Loading...</div>
  }

  if (!user || !privilegedRoles.has(user.role)) {
    return null
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="space-y-6 p-4">
      {/* --------------------------- Header --------------------------- */}
      <header className="space-y-3">
        <Link
          to="/app/management/programs"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to programs
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">Program Details</h1>
          <p className="text-muted-foreground">ID: {programId}</p>
        </div>
      </header>

      {/* ----------------------------- Content ----------------------------- */}
      {!program && (
        <div className="text-center py-12">Loading program details...</div>
      )}

      {program && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{program.name}</CardTitle>
              <CardDescription>{program.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Duration</div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">
                      {program.durationWeeks} weeks
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    Workout Days
                  </div>
                  <div className="flex items-center gap-2">
                    <Dumbbell className="h-4 w-4" />
                    <span className="font-medium">
                      {program.days.length} days/week
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {program.days.map((day, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg capitalize">{day.day}</CardTitle>
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
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      {exercise.sets.map((set, setIndex) => (
                        <div key={setIndex} className="bg-muted p-2 rounded">
                          Set {setIndex + 1}: {set.reps} reps
                          {set.weight && ` @ ${set.weight}kg`}
                        </div>
                      ))}
                    </div>
                    {exercise.sets[0]?.notes && (
                      <div className="text-xs text-muted-foreground italic">
                        {exercise.sets[0].notes}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </div>
  )
}
