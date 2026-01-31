import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Droplets,
  UtensilsCrossed,
} from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@/components/auth/useAuth'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { api } from '../../../../convex/_generated/api'
import { useMutation as useConvexMutation } from 'convex/react'

export const Route = createFileRoute('/app/_user/diet-plans/new')({
  component: RouteComponent,
})

type MealEntry = {
  title: string
  description: string
  calories: string
}

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'post-workout'

const mealTypeLabels: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
  'post-workout': 'Post-workout',
}

const weekDays = [
  { key: 'mon', label: 'Mon' },
  { key: 'tue', label: 'Tue' },
  { key: 'wed', label: 'Wed' },
  { key: 'thu', label: 'Thu' },
  { key: 'fri', label: 'Fri' },
  { key: 'sat', label: 'Sat' },
  { key: 'sun', label: 'Sun' },
] as const

const steps = [
  { key: 'details', label: 'Plan details' },
  { key: 'schedule', label: 'Schedule' },
  { key: 'meals', label: 'Meals' },
  { key: 'review', label: 'Review' },
]

function RouteComponent() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const createDietPlan = useConvexMutation(api.dietPlans.createDietPlan)

  const [stepIndex, setStepIndex] = useState(0)
  const [planName, setPlanName] = useState('')
  const [planDescription, setPlanDescription] = useState('')
  const [goal, setGoal] = useState('')
  const [durationWeeks, setDurationWeeks] = useState('4')
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [calorieTarget, setCalorieTarget] = useState('')
  const [hydrationTarget, setHydrationTarget] = useState('')
  const [coachNote, setCoachNote] = useState('')
  const [meals, setMeals] = useState<Record<MealType, MealEntry>>({
    breakfast: { title: '', description: '', calories: '' },
    lunch: { title: '', description: '', calories: '' },
    dinner: { title: '', description: '', calories: '' },
    snack: { title: '', description: '', calories: '' },
    'post-workout': { title: '', description: '', calories: '' },
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const progressValue = useMemo(
    () => ((stepIndex + 1) / steps.length) * 100,
    [stepIndex],
  )

  const toggleDay = (dayKey: string) => {
    setSelectedDays((prev) =>
      prev.includes(dayKey)
        ? prev.filter((day) => day !== dayKey)
        : [...prev, dayKey],
    )
  }

  const handleSubmit = async () => {
    if (!user) {
      toast.error('You must be logged in to create a diet plan')
      return
    }

    if (!planName.trim()) {
      toast.error('Plan name is required')
      return
    }

    if (selectedDays.length === 0) {
      toast.error('Please select at least one active day')
      return
    }

    // Convert meals to array format for backend
    const mealTemplate = Object.entries(meals)
      .filter(([_, meal]) => meal.title.trim() !== '')
      .map(([mealType, meal]) => ({
        mealType: mealType === 'post-workout' ? 'postWorkout' : mealType,
        title: meal.title,
        description: meal.description,
        calories: parseFloat(meal.calories) || 0,
      }))

    if (mealTemplate.length === 0) {
      toast.error('Please add at least one meal')
      return
    }

    setIsSubmitting(true)

    try {
      const dietPlanId = await createDietPlan({
        name: planName,
        description: planDescription,
        goal: goal || undefined,
        durationWeeks: parseInt(durationWeeks) || undefined,
        activeDays: selectedDays as any,
        dailyCalorieTarget: calorieTarget
          ? parseFloat(calorieTarget)
          : undefined,
        hydrationTarget: hydrationTarget || undefined,
        coachNote: coachNote || undefined,
        mealTemplate: mealTemplate as any,
        createdBy: user._id,
      })

      toast.success('Diet plan created successfully!')
      navigate({ to: '/app' })
    } catch (error) {
      console.error('Failed to create diet plan:', error)
      toast.error('Failed to create diet plan. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFirstStep = stepIndex === 0
  const isLastStep = stepIndex === steps.length - 1

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-4 pt-6 pb-4 space-y-4">
        <header className="flex items-center justify-between">
          <Link
            to="/app"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            Step {stepIndex + 1} of {steps.length}
          </span>
        </header>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Create diet plan</h1>
          <p className="text-sm text-muted-foreground">
            Build a multi-day meal template in a few focused steps.
          </p>
          <Progress value={progressValue} />
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {steps.map((step, index) => (
            <span
              key={step.key}
              className={cn(
                'rounded-full border border-border px-3 py-1',
                index === stepIndex
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted/40',
              )}
            >
              {step.label}
            </span>
          ))}
        </div>
      </div>

      <div className="px-4 pb-10 space-y-4">
        {stepIndex === 0 && (
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                Plan details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Plan name</label>
                <Input
                  placeholder="e.g. Lean strength cut"
                  value={planName}
                  onChange={(event) => setPlanName(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="w-full min-h-[110px] rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  placeholder="Outline the intent, rules, or special notes."
                  value={planDescription}
                  onChange={(event) => setPlanDescription(event.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Primary goal</label>
                  <Input
                    placeholder="e.g. Fat loss with energy"
                    value={goal}
                    onChange={(event) => setGoal(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Duration (weeks)
                  </label>
                  <Input
                    type="number"
                    min={1}
                    value={durationWeeks}
                    onChange={(event) => setDurationWeeks(event.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {stepIndex === 1 && (
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                Schedule cadence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Active days</label>
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day) => {
                    const isSelected = selectedDays.includes(day.key)
                    return (
                      <button
                        key={day.key}
                        type="button"
                        onClick={() => toggleDay(day.key)}
                        className={cn(
                          'rounded-lg border px-2 py-3 text-xs font-semibold uppercase transition',
                          isSelected
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-background text-muted-foreground',
                        )}
                      >
                        {day.label}
                      </button>
                    )
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Pick the days this template should cover.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Daily calorie target
                  </label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="e.g. 2100"
                    value={calorieTarget}
                    onChange={(event) => setCalorieTarget(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Hydration target
                  </label>
                  <Input
                    placeholder="e.g. 3.5 L"
                    value={hydrationTarget}
                    onChange={(event) => setHydrationTarget(event.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Coach guidance</label>
                <textarea
                  className="w-full min-h-[100px] rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  placeholder="Macro notes, timing rules, or fueling reminders."
                  value={coachNote}
                  onChange={(event) => setCoachNote(event.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {stepIndex === 2 && (
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <UtensilsCrossed className="h-5 w-5 text-primary" />
                Meals template
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Design a repeatable meal structure. You can refine per day
                later.
              </p>

              <div className="space-y-4">
                {(Object.keys(meals) as MealType[]).map((mealType) => (
                  <div
                    key={mealType}
                    className="rounded-2xl border border-border bg-muted/30 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        {mealTypeLabels[mealType]}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Template entry
                      </span>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium uppercase text-muted-foreground">
                        Meal title
                      </label>
                      <Input
                        placeholder="e.g. Protein oats"
                        value={meals[mealType].title}
                        onChange={(event) =>
                          setMeals((prev) => ({
                            ...prev,
                            [mealType]: {
                              ...prev[mealType],
                              title: event.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium uppercase text-muted-foreground">
                        Description
                      </label>
                      <textarea
                        className="w-full min-h-[80px] rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        placeholder="Ingredients, timing, or portion notes."
                        value={meals[mealType].description}
                        onChange={(event) =>
                          setMeals((prev) => ({
                            ...prev,
                            [mealType]: {
                              ...prev[mealType],
                              description: event.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium uppercase text-muted-foreground">
                        Calories
                      </label>
                      <Input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={meals[mealType].calories}
                        onChange={(event) =>
                          setMeals((prev) => ({
                            ...prev,
                            [mealType]: {
                              ...prev[mealType],
                              calories: event.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {stepIndex === 3 && (
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-primary" />
                Review
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-2">
                <p className="text-sm font-semibold">Plan summary</p>
                <p className="text-sm text-muted-foreground">
                  {planName || 'Untitled plan'} · {durationWeeks || '--'} weeks
                </p>
                <p className="text-sm text-muted-foreground">
                  {goal || 'No primary goal yet'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {planDescription || 'Add a description to guide the athlete.'}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-2">
                <p className="text-sm font-semibold">Schedule</p>
                <p className="text-sm text-muted-foreground">
                  {selectedDays.length
                    ? selectedDays
                        .map(
                          (day) =>
                            weekDays.find((entry) => entry.key === day)?.label,
                        )
                        .join(', ')
                    : 'No days selected yet'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Calories: {calorieTarget || '--'} · Hydration:{' '}
                  {hydrationTarget || '--'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {coachNote || 'Add optional coaching notes.'}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-3">
                <p className="text-sm font-semibold">Meals snapshot</p>
                <div className="grid gap-3">
                  {(Object.keys(meals) as MealType[]).map((mealType) => (
                    <div key={mealType} className="space-y-1">
                      <p className="text-xs font-semibold uppercase text-muted-foreground">
                        {mealTypeLabels[mealType]}
                      </p>
                      <p className="text-sm">
                        {meals[mealType].title || 'No title yet'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {meals[mealType].description || 'Add meal notes.'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setStepIndex((prev) => Math.max(prev - 1, 0))}
            disabled={isFirstStep || isSubmitting}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              if (isLastStep) {
                handleSubmit()
              } else {
                setStepIndex((prev) => Math.min(prev + 1, steps.length - 1))
              }
            }}
            disabled={isSubmitting}
          >
            {isLastStep
              ? isSubmitting
                ? 'Saving...'
                : 'Save Plan'
              : 'Continue'}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
