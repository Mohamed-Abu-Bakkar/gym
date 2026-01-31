import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  ClipboardList,
  Plus,
  Target,
  Trash2,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react'

import { useAuth } from '@/components/auth/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import type {
  TrainerProgramDetail,
  TrainerProgramSummary,
  TrainerProgramDailyWorkout,
  TrainerProgramDietDay,
} from '@/lib/mock-data'

import { useTrainerManagement } from '@/features/management/management-context'

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

const privilegedRoles = new Set(['trainer', 'admin'])

type ProgramForm = {
  name: string
  focus: string
  level: TrainerProgramSummary['level']
  durationWeeks: number
  status: TrainerProgramSummary['status']
}

type WorkoutDayForm = {
  dayLabel: string
  theme: string
  focus: string
  durationMinutes: number
  intensity: 'Low' | 'Medium' | 'High'
  keyWork: string
  readinessCue: string
  nutritionCue: string
}

type MealForm = {
  title: string
  description: string
  calories: number
}

type DietDayForm = {
  dayLabel: string
  emphasis: string
  hydration: string
  notes?: string
  meals: MealForm[]
}

/* -------------------------------------------------------------------------- */
/*                                Form Helpers                                */
/* -------------------------------------------------------------------------- */

const createBlankWorkoutDay = (): WorkoutDayForm => ({
  dayLabel: '',
  theme: '',
  focus: '',
  durationMinutes: 60,
  intensity: 'Medium',
  keyWork: '',
  readinessCue: '',
  nutritionCue: '',
})

const createBlankDietDay = (): DietDayForm => ({
  dayLabel: '',
  emphasis: '',
  hydration: '',
  notes: '',
  meals: [{ title: '', description: '', calories: 0 }],
})

const defaultDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const parseWorkoutTemplate = (
  template: WorkoutDayForm[],
): TrainerProgramDailyWorkout[] =>
  template.map((day, index) => {
    const dayLabel = day.dayLabel.trim()
    const theme = day.theme.trim()
    const focus = day.focus.trim()
    const readinessCue = day.readinessCue.trim()
    const nutritionCue = day.nutritionCue.trim()
    const keyWork = day.keyWork
      .split(',')
      .map((session) => session.trim())
      .filter((session) => session.length > 0)

    if (!dayLabel || !theme || !focus) {
      throw new Error(
        `Workout day ${index + 1} requires day, theme, and focus details.`,
      )
    }
    if (!Number.isFinite(day.durationMinutes) || day.durationMinutes <= 0) {
      throw new Error(
        `Workout day ${index + 1} must include a positive duration.`,
      )
    }
    if (!keyWork.length) {
      throw new Error(
        `Workout day ${index + 1} must list at least one key session.`,
      )
    }
    if (!readinessCue || !nutritionCue) {
      throw new Error(
        `Workout day ${index + 1} requires readiness and nutrition cues.`,
      )
    }

    return {
      dayLabel,
      theme,
      focus,
      durationMinutes: Number(day.durationMinutes),
      intensity: day.intensity,
      keyWork,
      readinessCue,
      nutritionCue,
    }
  })

const parseDietTemplate = (template: DietDayForm[]): TrainerProgramDietDay[] =>
  template.map((day, index) => {
    const dayLabel = day.dayLabel.trim()
    const emphasis = day.emphasis.trim()
    const hydration = day.hydration.trim()
    const meals = day.meals
      .map((meal) => ({
        title: meal.title.trim(),
        description: meal.description.trim(),
        calories: Number(meal.calories ?? 0),
      }))
      .filter((meal) => meal.title || meal.description)

    if (!dayLabel || !emphasis || !hydration) {
      throw new Error(
        `Diet day ${index + 1} requires day, emphasis, and hydration details.`,
      )
    }
    if (!meals.length) {
      throw new Error(`Diet day ${index + 1} must include at least one meal.`)
    }

    meals.forEach((meal, mealIndex) => {
      if (!meal.title || !meal.description) {
        throw new Error(
          `Provide title and description for meal ${mealIndex + 1} on diet day ${index + 1}.`,
        )
      }
      if (!Number.isFinite(meal.calories) || meal.calories < 0) {
        throw new Error(
          `Calories must be non-negative for meal ${mealIndex + 1} on diet day ${index + 1}.`,
        )
      }
    })

    const notes = day.notes?.trim()

    return {
      dayLabel,
      emphasis,
      meals,
      hydration,
      notes: notes?.length ? notes : undefined,
    }
  })

/* -------------------------------------------------------------------------- */
/*                                   Routing                                  */
/* -------------------------------------------------------------------------- */

export const Route = createFileRoute('/app/management/programs/')({
  component: ProgramsRoute,
  validateSearch: (search) => ({
    editProgramId:
      typeof search.editProgramId === 'string'
        ? search.editProgramId
        : undefined,
  }),
})

/* -------------------------------------------------------------------------- */
/*                               Main Component                               */
/* -------------------------------------------------------------------------- */

function ProgramsRoute() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const { editProgramId } = Route.useSearch()

  const {
    programs,
    programDetails,
    createProgram,
    updateProgram,
    deleteProgram,
    duplicateProgram,
  } = useTrainerManagement()

  const [programDrawerOpen, setProgramDrawerOpen] = useState(false)
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null)

  const [wizardStep, setWizardStep] = useState(1)

  const [programForm, setProgramForm] = useState<ProgramForm>({
    name: '',
    focus: '',
    level: 'Intermediate',
    durationWeeks: 4,
    status: 'Draft',
  })

  const [workoutTemplate, setWorkoutTemplate] = useState<WorkoutDayForm[]>(
    defaultDays.map((day) => ({
      ...createBlankWorkoutDay(),
      dayLabel: day,
    })),
  )

  const [dietTemplate, setDietTemplate] = useState<DietDayForm[]>(
    defaultDays.map((day) => ({
      ...createBlankDietDay(),
      dayLabel: day,
    })),
  )

  /* -------------------------------------------------------------------------- */
  /*                             Drawer Open Logic                              */
  /* -------------------------------------------------------------------------- */

  const openProgramDrawer = useCallback(
    (programId?: string) => {
      if (programId) {
        const summaryEntry = programs.find((entry) => entry.id === programId)
        const detailEntry = programDetails[programId]

        if (summaryEntry && detailEntry) {
          setProgramForm({
            name: summaryEntry.name,
            focus: summaryEntry.focus,
            level: summaryEntry.level,
            durationWeeks: summaryEntry.durationWeeks,
            status: summaryEntry.status,
          })

          setWorkoutTemplate(
            detailEntry.dailyWorkouts.length
              ? detailEntry.dailyWorkouts.map((entry) => ({
                  dayLabel: entry.dayLabel,
                  theme: entry.theme,
                  focus: entry.focus,
                  durationMinutes: entry.durationMinutes,
                  intensity: entry.intensity,
                  keyWork: entry.keyWork.join(', '),
                  readinessCue: entry.readinessCue,
                  nutritionCue: entry.nutritionCue,
                }))
              : defaultDays.map((day) => ({
                  ...createBlankWorkoutDay(),
                  dayLabel: day,
                })),
          )

          setDietTemplate(
            detailEntry.dietPlan.length
              ? detailEntry.dietPlan.map((entry) => ({
                  dayLabel: entry.dayLabel,
                  emphasis: entry.emphasis,
                  hydration: entry.hydration,
                  notes: entry.notes ?? '',
                  meals: entry.meals.map((meal) => ({ ...meal })),
                }))
              : defaultDays.map((day) => ({
                  ...createBlankDietDay(),
                  dayLabel: day,
                })),
          )

          setEditingProgramId(programId)
          setWizardStep(1)
          setProgramDrawerOpen(true)
          return
        }
      }

      setProgramForm({
        name: '',
        focus: '',
        level: 'Intermediate',
        durationWeeks: 4,
        status: 'Draft',
      })
      setWorkoutTemplate(
        defaultDays.map((day) => ({
          ...createBlankWorkoutDay(),
          dayLabel: day,
        })),
      )
      setDietTemplate(
        defaultDays.map((day) => ({
          ...createBlankDietDay(),
          dayLabel: day,
        })),
      )
      setEditingProgramId(null)
      setWizardStep(1)
      setProgramDrawerOpen(true)
    },
    [programDetails, programs],
  )

  /* -------------------------------------------------------------------------- */
  /*                                 Auth Guard                                 */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (isLoading) return
    if (!user) {
      navigate({ to: '/' })
      return
    }
    if (!privilegedRoles.has(user.role)) {
      navigate({ to: '/app/_user' })
    }
  }, [user, isLoading, navigate])

  useEffect(() => {
    if (!editProgramId) return
    const exists = programs.some((program) => program.id === editProgramId)
    if (exists) {
      openProgramDrawer(editProgramId)
    }
    navigate({ to: '/app/management/programs/', search: {}, replace: true })
  }, [editProgramId, navigate, openProgramDrawer, programs])

  /* -------------------------------------------------------------------------- */
  /*                                Summary Stats                               */
  /* -------------------------------------------------------------------------- */

  const summaryStats = useMemo(() => {
    const statusCount = programs.reduce(
      (acc, program) => {
        acc[program.status] = (acc[program.status] ?? 0) + 1
        return acc
      },
      {} as Record<TrainerProgramSummary['status'], number>,
    )

    const totalAssignments = programs.reduce(
      (sum, program) => sum + program.athletesAssigned,
      0,
    )

    return {
      live: statusCount['Live'] ?? 0,
      review: statusCount['In review'] ?? 0,
      draft: statusCount['Draft'] ?? 0,
      assignments: totalAssignments,
    }
  }, [programs])

  /* -------------------------------------------------------------------------- */
  /*                             Program Submit Logic                            */
  /* -------------------------------------------------------------------------- */

  const buildBlocksFromForm = (): TrainerProgramDetail['blocks'] => {
    const totalWeeks = Math.max(1, programForm.durationWeeks)
    const segmentSize = Math.max(1, Math.round(totalWeeks / 3))
    return [0, 1, 2].map((segment, index) => {
      const week = Math.min(totalWeeks, segment * segmentSize + 1)
      const title = index === 0 ? 'Kickoff' : index === 1 ? 'Build' : 'Finish'
      return {
        week,
        title,
        focus: programForm.focus,
        keySessions: ['Primary session', 'Support session'],
        readinessCue: 'Check daily energy and soreness',
      }
    })
  }

  const handleProgramSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const existingAssignments = editingProgramId
      ? (programs.find((program) => program.id === editingProgramId)
          ?.athletesAssigned ?? 0)
      : 0

    const summaryPayload = {
      name: programForm.name,
      focus: programForm.focus,
      level: programForm.level,
      durationWeeks: Number(programForm.durationWeeks),
      status: programForm.status,
      athletesAssigned: existingAssignments,
    }

    const detailPayload = {
      headline: `${programForm.name || 'Program'} daily blueprint`,
      overview: `${programForm.focus || 'Training'} focus block`,
      goal: `Deliver ${programForm.focus || 'training'} gains over ${summaryPayload.durationWeeks} weeks.`,
      progressionNotes: `Trainer-authored ${summaryPayload.durationWeeks}-week cadence. Adjust daily workouts and diet as needed.`,
    }

    try {
      const parsedDaily = parseWorkoutTemplate(workoutTemplate)
      const parsedDiet = parseDietTemplate(dietTemplate)

      if (editingProgramId) {
        updateProgram(editingProgramId, {
          summary: summaryPayload,
          detail: detailPayload,
          dailyWorkouts: parsedDaily,
          dietPlan: parsedDiet,
        })
      } else {
        const created = createProgram({
          ...summaryPayload,
          detail: detailPayload,
          blocks: buildBlocksFromForm(),
          dailyWorkouts: parsedDaily,
          dietPlan: parsedDiet,
        })
        navigate({
          to: '/app/management/programs/$programId',
          params: { programId: created.id },
        })
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to save the program. Please review the form inputs and try again.'
      window.alert(message)
      return
    }

    setProgramDrawerOpen(false)
    setEditingProgramId(null)
  }

  /* -------------------------------------------------------------------------- */
  /*                                 UI Helpers                                 */
  /* -------------------------------------------------------------------------- */

  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Loading programs…
      </div>
    )
  }

  const isPrivileged = !!user && privilegedRoles.has(user.role)
  if (!user || !isPrivileged) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
        <Card>
          <CardHeader>
            <CardTitle>Restricted area</CardTitle>
            <CardDescription>
              Only trainers and admins can manage programs.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="p-4 space-y-6 pb-16">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 mb-3"
        onClick={() =>
          navigate({
            to: '/app/management/programs',
            search: { editProgramId: undefined },
          })
        }
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      {/* ------------------------------ Header ------------------------------ */}
      <header className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Program list · {todayLabel}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold">Programs</h1>
            <p className="text-muted-foreground">
              Keep plans tidy and ready to assign.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="gap-2"
              onClick={() => openProgramDrawer()}
            >
              <Plus className="h-4 w-4" /> New
            </Button>
          </div>
        </div>
      </header>

      {/* --------------------------- Summary Cards --------------------------- */}
      <section className="flex gap-4">
        <Card>
          <CardHeader className="space-y-1 ">
            <CardDescription className="uppercase text-[11px] tracking-wide">
              Active plans
            </CardDescription>
            <CardTitle className="text-3xl">
              {summaryStats.live + summaryStats.review}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {summaryStats.live} live · {summaryStats.review} in review
            </span>
            {/* <Sparkles className="h-4 w-4" /> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="space-y-1">
            <CardDescription className="uppercase text-[11px] tracking-wide">
              Athletes assigned
            </CardDescription>
            <CardTitle className="text-3xl">
              {summaryStats.assignments}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{summaryStats.draft} drafts ready</span>
            {/* <Layers className="h-4 w-4" /> */}
          </CardContent>
        </Card>
      </section>

      {/* ----------------------------- Program List ----------------------------- */}
      <Card>
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Program list</CardTitle>
            <CardDescription>Create, edit, and assign plans.</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {programs.map((program) => (
            <Link
              key={program.id}
              to="/app/management/programs/$programId"
              params={{ programId: program.id }}
              className="group flex w-full flex-col gap-4 rounded-2xl border border-border bg-muted/20 p-5 text-left transition-all hover:border-primary hover:bg-muted/40 focus-visible:outline-none"
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-lg font-semibold leading-none">
                    {program.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {program.focus}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-border bg-background px-3 py-1 text-xs uppercase tracking-wide text-muted-foreground">
                    {program.level}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
              </div>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
                <span>{program.durationWeeks}-week plan</span>
                <span className="flex items-center gap-1.5">
                  <ClipboardList className="h-4 w-4" />
                  {program.athletesAssigned} athletes
                </span>
                <span className="flex items-center gap-1.5">
                  <Target className="h-4 w-4" />
                  {program.status}
                </span>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* ----------------------------- Wizard Drawer ----------------------------- */}
      <Drawer open={programDrawerOpen} onOpenChange={setProgramDrawerOpen}>
        <DrawerContent className="max-h-[90vh] overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>
              {editingProgramId ? 'Edit program' : 'Create new program'}
            </DrawerTitle>
            <DrawerDescription>
              Step {wizardStep} of 4 · Define program structure, training, and
              nutrition.
            </DrawerDescription>
          </DrawerHeader>

          <form className="space-y-8 p-6" onSubmit={handleProgramSubmit}>
            {wizardStep === 1 && (
              <ProgramBasicsStep
                programForm={programForm}
                setProgramForm={setProgramForm}
              />
            )}

            {wizardStep === 2 && (
              <WorkoutTemplateStep
                workoutTemplate={workoutTemplate}
                setWorkoutTemplate={setWorkoutTemplate}
              />
            )}

            {wizardStep === 3 && (
              <DietTemplateStep
                dietTemplate={dietTemplate}
                setDietTemplate={setDietTemplate}
              />
            )}

            {wizardStep === 4 && (
              <ReviewStep
                programForm={programForm}
                workoutTemplate={workoutTemplate}
                dietTemplate={dietTemplate}
              />
            )}

            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setWizardStep((s) => Math.max(1, s - 1))}
                disabled={wizardStep === 1}
              >
                Back
              </Button>

              {wizardStep < 4 ? (
                <Button
                  type="button"
                  onClick={() => setWizardStep((s) => Math.min(4, s + 1))}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit">
                  {editingProgramId ? 'Save changes' : 'Create program'}
                </Button>
              )}
            </div>
          </form>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                               Wizard Steps                                 */
/* -------------------------------------------------------------------------- */

function ProgramBasicsStep({
  programForm,
  setProgramForm,
}: {
  programForm: ProgramForm
  setProgramForm: React.Dispatch<React.SetStateAction<ProgramForm>>
}) {
  return (
    <section className="space-y-6">
      <h3 className="text-lg font-semibold">Program basics</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          label="Program name"
          value={programForm.name}
          placeholder="8-Week Strength Builder"
          onChange={(v) => setProgramForm((prev) => ({ ...prev, name: v }))}
        />
        <InputField
          label="Primary focus"
          value={programForm.focus}
          placeholder="Lower body strength & power"
          onChange={(v) => setProgramForm((prev) => ({ ...prev, focus: v }))}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField
          label="Level"
          value={programForm.level}
          options={['Beginner', 'Intermediate', 'Advanced']}
          onChange={(v) =>
            setProgramForm((prev) => ({
              ...prev,
              level: v as TrainerProgramSummary['level'],
            }))
          }
        />
        <SelectField
          label="Status"
          value={programForm.status}
          options={['Draft', 'In review', 'Live']}
          onChange={(v) =>
            setProgramForm((prev) => ({
              ...prev,
              status: v as TrainerProgramSummary['status'],
            }))
          }
        />
        <InputField
          label="Duration (weeks)"
          type="number"
          value={programForm.durationWeeks}
          onChange={(v) =>
            setProgramForm((prev) => ({
              ...prev,
              durationWeeks: Number(v),
            }))
          }
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Workouts and diet repeat weekly across the selected duration.
      </p>
    </section>
  )
}

function WorkoutTemplateStep({
  workoutTemplate,
  setWorkoutTemplate,
}: {
  workoutTemplate: WorkoutDayForm[]
  setWorkoutTemplate: React.Dispatch<React.SetStateAction<WorkoutDayForm[]>>
}) {
  const [activeDayIndex, setActiveDayIndex] = useState(0)
  const activeDay = workoutTemplate[activeDayIndex]

  function updateDay(updatedDay: WorkoutDayForm) {
    setWorkoutTemplate((prev) =>
      prev.map((day, idx) => (idx === activeDayIndex ? updatedDay : day)),
    )
  }

  return (
    <section className="space-y-6">
      <h3 className="text-lg font-semibold">Weekly training structure</h3>

      <div className="grid grid-cols-7 gap-2">
        {workoutTemplate.map((day, index) => (
          <Button
            key={index}
            size="sm"
            variant={index === activeDayIndex ? 'default' : 'outline'}
            onClick={() => setActiveDayIndex(index)}
          >
            {day.dayLabel || `Day ${index + 1}`}
          </Button>
        ))}
      </div>

      <Card className="p-4 space-y-4">
        <h4 className="font-semibold">
          {activeDay.dayLabel || `Day ${activeDayIndex + 1}`} — Workout
        </h4>

        <InputField
          label="Session theme"
          value={activeDay.theme}
          onChange={(v) => updateDay({ ...activeDay, theme: v })}
        />

        <TextareaField
          label="Focus"
          value={activeDay.focus}
          onChange={(v) => updateDay({ ...activeDay, focus: v })}
        />

        <div className="grid gap-3 sm:grid-cols-3">
          <InputField
            label="Duration (min)"
            type="number"
            value={activeDay.durationMinutes}
            onChange={(v) =>
              updateDay({ ...activeDay, durationMinutes: Number(v) })
            }
          />
          <SelectField
            label="Intensity"
            value={activeDay.intensity}
            options={['Low', 'Medium', 'High']}
            onChange={(v) =>
              updateDay({
                ...activeDay,
                intensity: v as WorkoutDayForm['intensity'],
              })
            }
          />
          <InputField
            label="Key sessions (comma separated)"
            value={activeDay.keyWork}
            onChange={(v) => updateDay({ ...activeDay, keyWork: v })}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <TextareaField
            label="Readiness cue"
            value={activeDay.readinessCue}
            onChange={(v) => updateDay({ ...activeDay, readinessCue: v })}
          />
          <TextareaField
            label="Nutrition cue"
            value={activeDay.nutritionCue}
            onChange={(v) => updateDay({ ...activeDay, nutritionCue: v })}
          />
        </div>
      </Card>
    </section>
  )
}

function DietTemplateStep({
  dietTemplate,
  setDietTemplate,
}: {
  dietTemplate: DietDayForm[]
  setDietTemplate: React.Dispatch<React.SetStateAction<DietDayForm[]>>
}) {
  const [activeDayIndex, setActiveDayIndex] = useState(0)
  const activeDay = dietTemplate[activeDayIndex]

  function updateDay(updatedDay: DietDayForm) {
    setDietTemplate((prev) =>
      prev.map((day, idx) => (idx === activeDayIndex ? updatedDay : day)),
    )
  }

  function addMeal() {
    updateDay({
      ...activeDay,
      meals: [...activeDay.meals, { title: '', description: '', calories: 0 }],
    })
  }

  function updateMeal(mealIndex: number, updatedMeal: MealForm) {
    updateDay({
      ...activeDay,
      meals: activeDay.meals.map((meal, idx) =>
        idx === mealIndex ? updatedMeal : meal,
      ),
    })
  }

  function removeMeal(mealIndex: number) {
    if (activeDay.meals.length === 1) return
    updateDay({
      ...activeDay,
      meals: activeDay.meals.filter((_, idx) => idx !== mealIndex),
    })
  }

  return (
    <section className="space-y-6">
      <h3 className="text-lg font-semibold">Weekly nutrition structure</h3>

      <div className="grid grid-cols-7 gap-2">
        {dietTemplate.map((day, index) => (
          <Button
            key={index}
            size="sm"
            variant={index === activeDayIndex ? 'default' : 'outline'}
            onClick={() => setActiveDayIndex(index)}
          >
            {day.dayLabel || `Day ${index + 1}`}
          </Button>
        ))}
      </div>

      <Card className="p-4 space-y-4">
        <h4 className="font-semibold">
          {activeDay.dayLabel || `Day ${activeDayIndex + 1}`} — Nutrition
        </h4>

        <InputField
          label="Emphasis"
          value={activeDay.emphasis}
          onChange={(v) => updateDay({ ...activeDay, emphasis: v })}
        />

        <InputField
          label="Hydration target"
          value={activeDay.hydration}
          onChange={(v) => updateDay({ ...activeDay, hydration: v })}
        />

        <TextareaField
          label="Notes"
          value={activeDay.notes ?? ''}
          onChange={(v) => updateDay({ ...activeDay, notes: v })}
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Meals</p>
            <Button size="sm" variant="outline" onClick={addMeal}>
              <Plus className="h-4 w-4" /> Add meal
            </Button>
          </div>

          {activeDay.meals.map((meal, mealIndex) => (
            <div
              key={mealIndex}
              className="grid gap-3 md:grid-cols-[1fr_1fr_120px_auto]"
            >
              <Input
                placeholder="Meal title"
                value={meal.title}
                onChange={(e) =>
                  updateMeal(mealIndex, {
                    ...meal,
                    title: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Description"
                value={meal.description}
                onChange={(e) =>
                  updateMeal(mealIndex, {
                    ...meal,
                    description: e.target.value,
                  })
                }
              />
              <Input
                type="number"
                placeholder="Calories"
                value={meal.calories}
                onChange={(e) =>
                  updateMeal(mealIndex, {
                    ...meal,
                    calories: Number(e.target.value),
                  })
                }
              />
              <Button
                size="icon"
                variant="ghost"
                className="text-destructive"
                onClick={() => removeMeal(mealIndex)}
                disabled={activeDay.meals.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </section>
  )
}

function ReviewStep({
  programForm,
  workoutTemplate,
  dietTemplate,
}: {
  programForm: ProgramForm
  workoutTemplate: WorkoutDayForm[]
  dietTemplate: DietDayForm[]
}) {
  return (
    <section className="space-y-6">
      <h3 className="text-lg font-semibold">Review program</h3>

      <Card className="p-4 space-y-2">
        <p>
          <strong>Name:</strong> {programForm.name}
        </p>
        <p>
          <strong>Focus:</strong> {programForm.focus}
        </p>
        <p>
          <strong>Level:</strong> {programForm.level}
        </p>
        <p>
          <strong>Status:</strong> {programForm.status}
        </p>
        <p>
          <strong>Duration:</strong> {programForm.durationWeeks} weeks
        </p>
      </Card>

      <Card className="p-4 space-y-3">
        <h4 className="font-semibold">Weekly training preview</h4>
        {workoutTemplate.map((day, i) => (
          <p key={i}>
            {day.dayLabel}: {day.theme || '—'} ({day.intensity})
          </p>
        ))}
      </Card>

      <Card className="p-4 space-y-3">
        <h4 className="font-semibold">Weekly nutrition preview</h4>
        {dietTemplate.map((day, i) => (
          <p key={i}>
            {day.dayLabel}: {day.emphasis || '—'}
          </p>
        ))}
      </Card>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*                           Reusable Input Components                         */
/* -------------------------------------------------------------------------- */

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string
  value: string | number
  onChange: (value: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <div>
      <label className="text-sm font-semibold">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

function TextareaField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label className="text-sm font-semibold">{label}</label>
      <textarea
        rows={2}
        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label className="text-sm font-semibold">{label}</label>
      <select
        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  )
}
