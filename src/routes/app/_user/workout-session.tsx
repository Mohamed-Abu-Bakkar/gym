import { createFileRoute, useNavigate } from '@tanstack/react-router'
import * as React from 'react'
import { Play, Pause, CheckCircle2, X, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TRAINING_PLAN, type WorkoutDay } from '@/lib/mock-data'
import { SlidingNumber } from '@/components/animate-ui/primitives/texts/sliding-number'

export const Route = createFileRoute('/app/_user/workout-session')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  
  // Workout session state
  const [isPaused, setIsPaused] = React.useState(false)
  const [currentExerciseIndex, setCurrentExerciseIndex] = React.useState(0)
  const [completedExercises, setCompletedExercises] = React.useState<Set<number>>(new Set())
  const [workoutTime, setWorkoutTime] = React.useState(0) // Total workout time in seconds
  const [exerciseTime, setExerciseTime] = React.useState(0) // Current exercise time in seconds

  // Ref for current exercise card
  const currentExerciseRef = React.useRef<HTMLDivElement>(null)

  // Get today's workout
  const today = new Date()
  const dayOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][
    today.getDay()
  ] as WorkoutDay['day']
  const todaysWorkout = TRAINING_PLAN.weeks.find((w) => w.day === dayOfWeek)

  // Timer effect for total workout time
  React.useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setWorkoutTime((prev) => prev + 1)
        setExerciseTime((prev) => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isPaused])

  // Redirect if no workout
  React.useEffect(() => {
    if (!todaysWorkout || todaysWorkout.exercises.length === 0) {
      navigate({ to: '/app/workouts' })
    }
  }, [todaysWorkout, navigate])

  // Auto-scroll to current exercise when it changes
  React.useEffect(() => {
    if (currentExerciseRef.current) {
      // Calculate position to show exercise above the timer bar
      // Timer bar is ~140px (fixed bottom-16 = 64px from bottom, plus bar height ~110px)
      const timerBarHeight = 180 // Approximate height including bottom nav
      const element = currentExerciseRef.current
      const elementRect = element.getBoundingClientRect()
      const absoluteElementTop = elementRect.top + window.scrollY
      const middle = absoluteElementTop - (window.innerHeight - timerBarHeight - elementRect.height - 20)
      
      window.scrollTo({
        top: middle,
        behavior: 'smooth'
      })
    }
  }, [currentExerciseIndex])

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  const completeExercise = (index: number) => {
    const newCompleted = new Set(completedExercises)
    newCompleted.add(index)
    setCompletedExercises(newCompleted)
    
    // Move to next exercise if available
    if (todaysWorkout && index < todaysWorkout.exercises.length - 1) {
      setCurrentExerciseIndex(index + 1)
      setExerciseTime(0)
    }
  }

  const goToNextExercise = () => {
    if (todaysWorkout && currentExerciseIndex < todaysWorkout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1)
      setExerciseTime(0)
    }
  }

  const endWorkout = () => {
    navigate({ to: '/app/workouts' })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!todaysWorkout) {
    return null
  }

  return (
    <div className="min-h-screen bg-background pb-48">
      {/* Simple Header */}
      <div className="sticky top-0 z-10 bg-background border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{todaysWorkout.name}</h2>
            <div className="text-sm text-muted-foreground">
              {completedExercises.size} / {todaysWorkout.exercises.length} completed
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={endWorkout}
          >
            <X className="w-4 h-4 mr-2" />
            End
          </Button>
        </div>
      </div>

      {/* Exercise List - Reversed Order with empty space at top */}
      <div className="p-4 space-y-3">
        {/* Empty space to allow first exercises to scroll above timer */}
        <div className="h-[50vh]" />
        
        {[...todaysWorkout.exercises].reverse().map((exercise, reversedIndex) => {
          // Calculate original index
          const index = todaysWorkout.exercises.length - 1 - reversedIndex
          const isCompleted = completedExercises.has(index)
          const isCurrent = index === currentExerciseIndex && !isCompleted
          
          return (
            <Card
              key={index}
              ref={isCurrent ? currentExerciseRef : null}
              className={`transition-all ${
                isCurrent
                  ? 'border-primary shadow-lg scale-[1.02]'
                  : isCompleted
                    ? 'border-green-500 bg-green-500/5'
                    : 'border-border'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isCurrent
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-bold">{index + 1}</span>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{exercise.name}</h3>
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
                    
                    {isCurrent && (
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-primary" />
                          <div className="text-2xl font-bold tabular-nums text-primary">
                            <SlidingNumber number={exerciseTime} />s
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {index === todaysWorkout.exercises.length - 1 ? (
                            <Button
                              size="sm"
                              onClick={() => {
                                completeExercise(index)
                                endWorkout()
                              }}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              End
                            </Button>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                onClick={() => completeExercise(index)}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                Complete
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={goToNextExercise}
                              >
                                Skip
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Fixed Bottom Timer Bar */}
      <div className="fixed bottom-16 left-0 right-0 bg-background border-t shadow-lg z-20">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-primary" />
              <div>
                <div className="text-3xl font-bold tabular-nums">
                  {formatTime(workoutTime)}
                </div>
                <div className="text-xs text-muted-foreground">Total Time</div>
              </div>
            </div>
            <Button
              variant={isPaused ? "default" : "secondary"}
              size="lg"
              onClick={togglePause}
            >
              {isPaused ? (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
