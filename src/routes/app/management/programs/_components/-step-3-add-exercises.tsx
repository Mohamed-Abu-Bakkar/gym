import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ProgramFormData, DayOfWeek } from '../new'

type StepAddExercisesProps = {
  programForm: ProgramFormData
  setProgramForm: React.Dispatch<React.SetStateAction<ProgramFormData>>
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

const EXERCISE_NAMES = [
  'Barbell Bench Press',
  'Incline Dumbbell Press',
  'Decline Bench Press',
  'Dumbbell Fly',
  'Cable Chest Fly',
  'Push-Ups',
  'Lat Pulldown',
  'Pull-Ups / Assisted Pull-Ups',
  'Seated Cable Row',
  'Bent-Over Barbell Row',
  'Deadlift',
  'Barbell Squat',
  'Leg Press',
  'Walking Lunges',
  'Romanian Deadlift',
  'Barbell Curl',
  'Dumbbell Curl',
  'Cable Triceps Pushdown',
  'Overhead Dumbbell Triceps Extension',
  'Plank',
  'Russian Twist',
]

export function StepAddExercises({
  programForm,
  setProgramForm,
}: StepAddExercisesProps) {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | null>(
    programForm.days[0]?.day || null,
  )

  const addExerciseToDay = (day: DayOfWeek) => {
    setProgramForm((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.day === day
          ? {
              ...d,
              exercises: [
                ...d.exercises,
                {
                  exerciseName: EXERCISE_NAMES[0],
                  noOfSets: 3,
                  sets: [
                    { reps: 10, weight: 0 },
                    { reps: 10, weight: 0 },
                    { reps: 10, weight: 0 },
                  ],
                },
              ],
            }
          : d,
      ),
    }))
  }

  const removeExerciseFromDay = (day: DayOfWeek, exerciseIndex: number) => {
    setProgramForm((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.day === day
          ? {
              ...d,
              exercises: d.exercises.filter((_, i) => i !== exerciseIndex),
            }
          : d,
      ),
    }))
  }

  const updateExercise = (
    day: DayOfWeek,
    exerciseIndex: number,
    field: string,
    value: any,
  ) => {
    setProgramForm((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.day === day
          ? {
              ...d,
              exercises: d.exercises.map((ex, i) => {
                if (i !== exerciseIndex) return ex

                // When updating noOfSets, adjust the sets array
                if (field === 'noOfSets') {
                  const newNoOfSets = value
                  const currentSets = ex.sets
                  const newSets = Array.from(
                    { length: newNoOfSets },
                    (_, idx) => currentSets[idx] || { reps: 10, weight: 0 },
                  )
                  return { ...ex, noOfSets: newNoOfSets, sets: newSets }
                }

                return { ...ex, [field]: value }
              }),
            }
          : d,
      ),
    }))
  }

  const updateSet = (
    day: DayOfWeek,
    exerciseIndex: number,
    setIndex: number,
    field: 'reps' | 'weight',
    value: number,
  ) => {
    setProgramForm((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.day === day
          ? {
              ...d,
              exercises: d.exercises.map((ex, i) =>
                i === exerciseIndex
                  ? {
                      ...ex,
                      sets: ex.sets.map((set, idx) =>
                        idx === setIndex ? { ...set, [field]: value } : set,
                      ),
                    }
                  : ex,
              ),
            }
          : d,
      ),
    }))
  }

  const addSet = (day: DayOfWeek, exerciseIndex: number) => {
    setProgramForm((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.day === day
          ? {
              ...d,
              exercises: d.exercises.map((ex, i) =>
                i === exerciseIndex
                  ? {
                      ...ex,
                      noOfSets: ex.noOfSets + 1,
                      sets: [...ex.sets, { reps: 10, weight: 0 }],
                    }
                  : ex,
              ),
            }
          : d,
      ),
    }))
  }

  const removeSet = (
    day: DayOfWeek,
    exerciseIndex: number,
    setIndex: number,
  ) => {
    setProgramForm((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.day === day
          ? {
              ...d,
              exercises: d.exercises.map((ex, i) =>
                i === exerciseIndex && ex.sets.length > 1
                  ? {
                      ...ex,
                      noOfSets: ex.noOfSets - 1,
                      sets: ex.sets.filter((_, idx) => idx !== setIndex),
                    }
                  : ex,
              ),
            }
          : d,
      ),
    }))
  }

  if (programForm.days.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
        <p>No training days selected.</p>
        <p className="text-sm mt-2">Go back to add training days first.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Day Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {programForm.days.map((day) => {
          const dayInfo = DAYS_OF_WEEK.find((d) => d.value === day.day)
          return (
            <button
              key={day.day}
              type="button"
              onClick={() => setSelectedDay(day.day)}
              className={`px-6 py-3 rounded-lg whitespace-nowrap transition font-medium ${
                selectedDay === day.day
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {dayInfo?.label}
              <span className="ml-2 text-xs opacity-75">
                ({day.exercises.length})
              </span>
            </button>
          )
        })}
      </div>

      {/* Exercise List for Selected Day */}
      {selectedDay && (
        <div className="space-y-4">
          {programForm.days
            .find((d) => d.day === selectedDay)
            ?.exercises.map((exercise, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border-2 bg-muted/30 space-y-4"
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <label className="text-sm font-medium">Exercise</label>
                      <select
                        className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2"
                        value={exercise.exerciseName}
                        onChange={(e) =>
                          updateExercise(
                            selectedDay,
                            index,
                            'exerciseName',
                            e.target.value,
                          )
                        }
                      >
                        {EXERCISE_NAMES.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-8"
                      onClick={() => removeExerciseFromDay(selectedDay, index)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Individual Set Details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Sets</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addSet(selectedDay, index)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Set
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {exercise.sets.map((set, setIndex) => (
                        <div
                          key={setIndex}
                          className="flex items-center gap-3 p-3 rounded-lg border bg-background"
                        >
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                            {setIndex + 1}
                          </div>
                          <div className="flex-1">
                            <label className="text-xs text-muted-foreground">
                              Reps
                            </label>
                            <input
                              type="number"
                              min="1"
                              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                              value={set.reps || 0}
                              placeholder="10"
                              onChange={(e) =>
                                updateSet(
                                  selectedDay,
                                  index,
                                  setIndex,
                                  'reps',
                                  parseInt(e.target.value) || 0,
                                )
                              }
                            />
                          </div>
                          <div className="flex-1">
                            <label className="text-xs text-muted-foreground">
                              Weight (kg)
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.5"
                              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                              value={set.weight || 0}
                              placeholder="0"
                              onChange={(e) =>
                                updateSet(
                                  selectedDay,
                                  index,
                                  setIndex,
                                  'weight',
                                  parseFloat(e.target.value) || 0,
                                )
                              }
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                            onClick={() =>
                              removeSet(selectedDay, index, setIndex)
                            }
                            disabled={exercise.sets.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => addExerciseToDay(selectedDay)}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Exercise
          </Button>
        </div>
      )}
    </div>
  )
}
