import { createFileRoute, useNavigate } from '@tanstack/react-router'
import * as React from 'react'
import { Calendar, Clock, Flame, ChevronRight, Play, List } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TRAINING_PLAN, type WorkoutDay } from '@/lib/mock-data'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer'

export const Route = createFileRoute('/app/_user/workouts')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [selectedWorkout, setSelectedWorkout] =
    React.useState<WorkoutDay | null>(null)
  const [showExercises, setShowExercises] = React.useState(false)

  // Get today's day of week
  const today = new Date()
  const dayOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][
    today.getDay()
  ] as WorkoutDay['day']
  const todaysWorkout = TRAINING_PLAN.weeks.find((w) => w.day === dayOfWeek)

  // Get day name mapping
  const dayNames: Record<WorkoutDay['day'], string> = {
    mon: 'Monday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
    sun: 'Sunday',
  }

  const handleSwipeRight = (workout: WorkoutDay) => {
    // Mark as complete (would update state/database in real app)
    console.log('Workout completed:', workout.name)
  }

  const handleSwipeLeft = (workout: WorkoutDay) => {
    // Mark as skipped
    console.log('Workout skipped:', workout.name)
  }

  const startWorkout = () => {
    navigate({ to: '/app/workout-session' })
  }

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
          {todaysWorkout && todaysWorkout.exercises.length > 0 && (
            <div className="text-right">
              <div className="text-sm font-medium">{todaysWorkout.name}</div>
              <div className="text-xs text-muted-foreground">Today</div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Today's Workout Card */}
        {todaysWorkout && todaysWorkout.exercises.length > 0 ? (
          <Card className="border-primary shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{todaysWorkout.name}</CardTitle>
                <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  Today
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{todaysWorkout.duration} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="w-4 h-4 text-muted-foreground" />
                  <span>{todaysWorkout.caloriesBurned} cal</span>
                </div>
                <div className="flex items-center gap-1">
                  <List className="w-4 h-4 text-muted-foreground" />
                  <span>{todaysWorkout.exercises.length} exercises</span>
                </div>
              </div>

              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => {
                  setSelectedWorkout(todaysWorkout)
                  setShowExercises(true)
                }}
              >
                <List className="w-5 h-5 mr-2" />
                View Exercises
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-muted">
            <CardContent className="py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Rest Day</h3>
              <p className="text-sm text-muted-foreground">
                Take it easy and recover for tomorrow's workout
              </p>
            </CardContent>
          </Card>
        )}

        {/* Weekly Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>This Week's Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {TRAINING_PLAN.weeks.map((workout) => {
              const isToday = workout.day === dayOfWeek
              const isEmpty = workout.exercises.length === 0

              return (
                <div
                  key={workout.day}
                  className={`p-4 rounded-lg border transition-all ${
                    isToday
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 cursor-pointer'
                  }`}
                  onClick={() => {
                    if (!isEmpty) {
                      setSelectedWorkout(workout)
                      setShowExercises(true)
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground uppercase">
                          {dayNames[workout.day]}
                        </span>
                        {isToday && (
                          <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs">
                            Today
                          </span>
                        )}
                      </div>
                      <div className="font-semibold mt-1">{workout.name}</div>
                      {!isEmpty && (
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {workout.duration} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Flame className="w-3 h-3" />
                            {workout.caloriesBurned} cal
                          </span>
                        </div>
                      )}
                    </div>
                    {!isEmpty && (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Floating Start Workout Button - Music Player Style */}
      {todaysWorkout && todaysWorkout.exercises.length > 0 && (
        <button
          onClick={startWorkout}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 z-40 px-8 py-4"
        >
          <div className="flex items-center gap-3">
            <div className="bg-primary-foreground/20 rounded-full p-2">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-bold">{todaysWorkout.name}</span>
              <span className="text-xs opacity-80">
                {todaysWorkout.exercises.length} exercises • {todaysWorkout.duration} min
              </span>
            </div>
          </div>
        </button>
      )}

      {/* Exercise List Drawer */}
      <Drawer open={showExercises} onOpenChange={setShowExercises}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{selectedWorkout?.name}</DrawerTitle>
            <DrawerDescription>
              {selectedWorkout?.exercises.length} exercises •{' '}
              {selectedWorkout?.duration} min
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-6 pb-6 space-y-3 max-h-[60vh] overflow-y-auto">
            {selectedWorkout?.exercises.map((exercise, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-primary">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{exercise.name}</h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span>{exercise.sets} sets</span>
                          <span>•</span>
                          <span>{exercise.reps} reps</span>
                          {exercise.weight > 0 && (
                            <>
                              <span>•</span>
                              <span>{exercise.weight} lbs</span>
                            </>
                          )}
                        </div>
                        {exercise.notes && (
                          <p className="text-xs text-muted-foreground mt-2">
                            {exercise.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
