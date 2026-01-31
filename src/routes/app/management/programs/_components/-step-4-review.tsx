import { CheckCircle2 } from 'lucide-react'
import type { ProgramFormData, DayOfWeek } from '../new'

type StepReviewProps = {
  programForm: ProgramFormData
}

const DAYS_OF_WEEK: { value: DayOfWeek; label: string }[] = [
  { value: 'mon', label: 'Monday' },
  { value: 'tue', label: 'Tuesday' },
  { value: 'wed', label: 'Wednesday' },
  { value: 'thu', label: 'Thursday' },
  { value: 'fri', label: 'Friday' },
  { value: 'sat', label: 'Saturday' },
  { value: 'sun', label: 'Sunday' },
]

export function StepReview({ programForm }: StepReviewProps) {
  const totalExercises = programForm.days.reduce(
    (sum, day) => sum + day.exercises.length,
    0,
  )

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="p-6 rounded-xl bg-primary/5 border-2 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold">{programForm.name}</h3>
            <p className="text-muted-foreground mt-2">
              {programForm.description}
            </p>
            <div className="flex gap-6 mt-4 text-sm">
              <div>
                <span className="text-muted-foreground">Duration:</span>
                <span className="ml-2 font-semibold">
                  {programForm.durationWeeks} weeks
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Training Days:</span>
                <span className="ml-2 font-semibold">
                  {programForm.days.length} days
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Total Exercises:</span>
                <span className="ml-2 font-semibold">{totalExercises}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Breakdown */}
      <div className="space-y-4">
        <h4 className="font-semibold text-lg">Weekly Schedule</h4>
        {programForm.days.map((day) => {
          const dayInfo = DAYS_OF_WEEK.find((d) => d.value === day.day)
          return (
            <div key={day.day} className="p-6 rounded-xl border-2 bg-card">
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-semibold text-lg">{dayInfo?.label}</h5>
                <span className="text-sm text-muted-foreground">
                  {day.exercises.length} exercises
                </span>
              </div>
              <div className="space-y-3">
                {day.exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{exercise.exerciseName}</p>
                        <p className="text-sm text-muted-foreground">
                          {exercise.noOfSets} sets ×{' '}
                          {exercise.sets[0]?.reps || 10} reps
                          {exercise.sets[0]?.weight
                            ? ` @ ${exercise.sets[0].weight}kg`
                            : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Info Message */}
      <div className="p-4 rounded-lg bg-muted/50 border text-sm text-muted-foreground">
        <p>
          📋 Review your program carefully. Once created, you can assign it to
          clients and start tracking their progress.
        </p>
      </div>
    </div>
  )
}
