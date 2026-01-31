import { FormEvent, useEffect, useMemo, useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Flame,
  Scale,
  TrendingDown,
  TrendingUp,
  Utensils,
} from 'lucide-react'

import { useAuth } from '@/components/auth/useAuth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { useTrainerManagement } from '@/features/management/management-context'

const privilegedRoles = new Set(['trainer', 'admin'])

export const Route = createFileRoute('/app/management/clients/$clientId')({
  component: ClientDetailRoute,
})

function ClientDetailRoute() {
  const { clientId } = Route.useParams()
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const {
    clients,
    clientDetails,
    updateClient,
    deleteClient,
    logClientWorkout,
    logClientNutrition,
    clientPatterns,
    toggleWorkoutTask,
    addCustomWorkoutTask,
    logWeight,
    getWeightTrend,
  } = useTrainerManagement()
  const [statusForm, setStatusForm] = useState({
    status: '',
    readiness: 'Green',
    list: 'active' as 'active' | 'flagged',
  })
  
  const [workoutForm, setWorkoutForm] = useState({
    title: '',
    focus: '',
    load: '',
    readiness: 'Green',
  })
  const [nutritionForm, setNutritionForm] = useState({
    mealType: '',
    description: '',
    time: '',
    calories: '',
  })
  const [customTaskForm, setCustomTaskForm] = useState({
    label: '',
    detail: '',
    day: '',
  })
  const [weightForm, setWeightForm] = useState({
    weight: '',
    date: '',
  })

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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Loading client…
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
              Only trainers and admins can view clients.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const rosterEntry = useMemo(
    () =>
      [...clients.active, ...clients.flagged].find(
        (client) => client.id === clientId,
      ),
    [clients, clientId],
  )
  const detail = clientDetails[clientId]
  const currentList: 'active' | 'flagged' = clients.active.some(
    (client) => client.id === clientId,
  )
    ? 'active'
    : 'flagged'
  const patternState = clientPatterns[clientId]
  const weightTrend = getWeightTrend(clientId)

  useEffect(() => {
    if (!rosterEntry || !detail) return
    setStatusForm({
      status: rosterEntry.status,
      readiness: detail.readiness,
      list: currentList,
    })
  }, [rosterEntry, detail, currentList])

  if (!rosterEntry || !detail) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
        <Card>
          <CardHeader>
            <CardTitle>Client not found</CardTitle>
            <CardDescription>
              Double-check the link or pick another athlete.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const handleStatusSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    updateClient(clientId, {
      status: statusForm.status,
      readiness: statusForm.readiness,
      list: statusForm.list,
    })
  }

  const handleDelete = () => {
    deleteClient(clientId)
    navigate({ to: '/app/management/clients/' })
  }

  const handleWorkoutSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!workoutForm.title) return
    logClientWorkout(clientId, {
      title: workoutForm.title,
      focus: workoutForm.focus || rosterEntry.focus,
      load: workoutForm.load || 'Manual entry',
      readiness: workoutForm.readiness,
    })
    setWorkoutForm({ title: '', focus: '', load: '', readiness: 'Green' })
  }

  const handleNutritionSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!nutritionForm.mealType || !nutritionForm.description) return
    logClientNutrition(clientId, {
      mealType: nutritionForm.mealType,
      description: nutritionForm.description,
      time: nutritionForm.time || '—',
      calories: Number(nutritionForm.calories) || 0,
    })
    setNutritionForm({ mealType: '', description: '', time: '', calories: '' })
  }

  const handleTaskSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!customTaskForm.label.trim()) return
    addCustomWorkoutTask(clientId, {
      label: customTaskForm.label,
      detail: customTaskForm.detail,
      day: customTaskForm.day,
    })
    setCustomTaskForm({ label: '', detail: '', day: '' })
  }

  const handleWeightSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!weightForm.weight) return
    logWeight(clientId, Number(weightForm.weight), weightForm.date || undefined)
    setWeightForm({ weight: '', date: '' })
  }
const isMicroLayout = detail.metrics.length <= 4

  return (
    <div className="p-4 space-y-6 pb-16">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Link
          to="/app/management/clients/"
          className="inline-flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to clients
        </Link>
      </div>

      <Card>
        <CardHeader className="space-y-4">
          {/* Top: Identity */}
          <div className="flex flex-col gap-1">
            <CardDescription className="text-xs uppercase tracking-wide text-muted-foreground">
              {detail.plan}
            </CardDescription>
            <CardTitle className="text-2xl md:text-3xl">
              {detail.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{detail.focus}</p>
          </div>

          {/* Middle: Metrics */}
          <div className="grid grid-cols-2 gap-6 pt-2">
            {/* Compliance */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Compliance
                </p>
                <span className="text-xs font-medium text-muted-foreground">
                  {detail.compliance}%
                </span>
              </div>

              <div className="relative h-2 rounded-full bg-muted">
                <span
                  className="absolute left-0 top-0 h-full rounded-full bg-primary"
                  style={{ width: `${detail.compliance}%` }}
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Check-ins complete
              </p>
            </div>

            {/* Readiness */}
            <div className="text-right space-y-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Status
              </p>
              <p className="text-xl font-semibold">{detail.readiness}</p>
              <p className="text-xs text-muted-foreground">{detail.trend}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Client status</CardTitle>
          <CardDescription>
            Update the status or move between lists.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={handleStatusSubmit}
          >
            <div>
              <label className="text-sm font-medium">Plan status</label>
              <input
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                value={statusForm.status}
                onChange={(event) =>
                  setStatusForm((prev) => ({
                    ...prev,
                    status: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Status label</label>
              <select
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                value={statusForm.readiness}
                onChange={(event) =>
                  setStatusForm((prev) => ({
                    ...prev,
                    readiness: event.target.value,
                  }))
                }
              >
                <option value="Green">Green</option>
                <option value="Amber">Amber</option>
                <option value="Red">Red</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">List</label>
              <select
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                value={statusForm.list}
                onChange={(event) =>
                  setStatusForm((prev) => ({
                    ...prev,
                    list: event.target.value as 'active' | 'flagged',
                  }))
                }
              >
                <option value="active">Active</option>
                <option value="flagged">Needs attention</option>
              </select>
            </div>
            <div className="flex items-end justify-left gap-2">
              <Button type="submit" className="sm:w-auto">
                Save status
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="sm:w-auto"
                onClick={handleDelete}
              >
                Remove client
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <section
        className={`grid gap-3 ${
          isMicroLayout
            ? 'grid-cols-2 sm:grid-cols-4'
            : 'grid-cols-1 sm:grid-cols-2'
        }`}
      >
        {detail.metrics.map((metric) => (
          <Card
            key={metric.label}
            className={isMicroLayout ? 'p-3' : undefined}
          >
            <CardHeader className={`${isMicroLayout ? 'p-3 pb-1' : undefined}`}>
              <CardDescription className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {metric.label}
              </CardDescription>

              <CardTitle
                className={`${isMicroLayout ? 'text-lg' : 'text-2xl'}`}
              >
                {metric.value}
              </CardTitle>
            </CardHeader>

            {!isMicroLayout && (
              <CardContent>
                <p className="text-sm text-muted-foreground">{metric.helper}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </section>

      {/* <section className="grid gap-4 md:grid-cols-2">
        {detail.metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader>
              <CardDescription className="text-xs uppercase tracking-wide">
                {metric.label}
              </CardDescription>
              <CardTitle className="text-2xl">{metric.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{metric.helper}</p>
            </CardContent>
          </Card>
        ))}
      </section> */}

      <Card>
        <CardHeader>
          <CardTitle>Status factors</CardTitle>
          <CardDescription>See how each part is tracking.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {detail.readinessBreakdown.map((pill) => (
            <div key={pill.label}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{pill.label}</span>
                <span className="text-muted-foreground">
                  {pill.current}% / {pill.target}% goal
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-muted">
                <span
                  className="block h-full rounded-full bg-primary"
                  style={{ width: `${pill.current}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Block tasks</CardTitle>
              <CardDescription>Track the assigned workouts.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {patternState?.tasks?.length ? (
            patternState.tasks.map((task) => (
              <label
                key={task.id}
                className="flex items-start gap-3 rounded-xl border border-border bg-background p-3 text-sm"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleWorkoutTask(clientId, task.id)}
                  className="mt-1 h-4 w-4"
                />
                <div>
                  <p className="font-semibold">{task.label}</p>
                  <p className="text-xs text-muted-foreground">{task.detail}</p>
                </div>
              </label>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No pattern tasks yet. Assign a block from the dashboard.
            </p>
          )}
          <form
            className="grid gap-3 md:grid-cols-3"
            onSubmit={handleTaskSubmit}
          >
            <input
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              placeholder="Quick task label"
              value={customTaskForm.label}
              onChange={(event) =>
                setCustomTaskForm((prev) => ({
                  ...prev,
                  label: event.target.value,
                }))
              }
            />
            <input
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              placeholder="Details"
              value={customTaskForm.detail}
              onChange={(event) =>
                setCustomTaskForm((prev) => ({
                  ...prev,
                  detail: event.target.value,
                }))
              }
            />
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                placeholder="Day"
                value={customTaskForm.day}
                onChange={(event) =>
                  setCustomTaskForm((prev) => ({
                    ...prev,
                    day: event.target.value,
                  }))
                }
              />
              <Button type="submit" size="sm">
                Add
              </Button>
            </div>
          </form>
        </CardContent>
      </Card> */}

      <section className="grid gap-6 md:grid-cols-1">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Log workout</CardTitle>
                <CardDescription>
                  Add a manual entry for {detail.name}.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleWorkoutSubmit}>
              <div className="space-y-1">
                <label className="text-sm font-medium">Session title</label>
                <input
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  placeholder="e.g. Speed endurance + skill"
                  value={workoutForm.title}
                  onChange={(event) =>
                    setWorkoutForm((prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Focus</label>
                <input
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  placeholder="Acceleration, max strength, etc."
                  value={workoutForm.focus}
                  onChange={(event) =>
                    setWorkoutForm((prev) => ({
                      ...prev,
                      focus: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Notes</label>
                <textarea
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  rows={4}
                  placeholder="Key cues, adjustments, reminders"
                  value={workoutForm.load}
                  onChange={(event) =>
                    setWorkoutForm((prev) => ({
                      ...prev,
                      load: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Status tag</label>
                <select
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  value={workoutForm.readiness}
                  onChange={(event) =>
                    setWorkoutForm((prev) => ({
                      ...prev,
                      readiness: event.target.value,
                    }))
                  }
                >
                  <option value="Green">Green</option>
                  <option value="Amber">Amber</option>
                  <option value="Red">Red</option>
                </select>
              </div>
              <Button type="submit" className="w-full">
                Save workout log
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Utensils className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Log nutrition</CardTitle>
                <CardDescription>
                  Log diet updates for this client.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleNutritionSubmit}>
              <div className="space-y-1">
                <label className="text-sm font-medium">Meal / timing</label>
                <input
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  placeholder="e.g. Lunch · 13:00"
                  value={nutritionForm.mealType}
                  onChange={(event) =>
                    setNutritionForm((prev) => ({
                      ...prev,
                      mealType: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  rows={4}
                  placeholder="Meal details, adherence notes"
                  value={nutritionForm.description}
                  onChange={(event) =>
                    setNutritionForm((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Calories</label>
                <input
                  type="number"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  placeholder="650"
                  value={nutritionForm.calories}
                  onChange={(event) =>
                    setNutritionForm((prev) => ({
                      ...prev,
                      calories: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Time stamp</label>
                <input
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  placeholder="13:00"
                  value={nutritionForm.time}
                  onChange={(event) =>
                    setNutritionForm((prev) => ({
                      ...prev,
                      time: event.target.value,
                    }))
                  }
                />
              </div>
              <Button type="submit" className="w-full" variant="secondary">
                Save nutrition log
              </Button>
            </form>
          </CardContent>
        </Card> */}
      </section>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Weight tracking</CardTitle>
              <CardDescription>
                Weekly averages and trend deltas.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3 text-center">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                This week
              </p>
              <p className="text-2xl font-semibold">
                {weightTrend.thisWeekAvg ?? '—'}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Last week
              </p>
              <p className="text-2xl font-semibold">
                {weightTrend.lastWeekAvg ?? '—'}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2">
              {weightTrend.delta !== null ? (
                <>
                  {weightTrend.delta < 0 ? (
                    <TrendingDown className="h-5 w-5 text-chart-2" />
                  ) : (
                    <TrendingUp className="h-5 w-5 text-chart-5" />
                  )}
                  <span className="text-xl font-semibold">
                    {weightTrend.delta} lbs
                  </span>
                </>
              ) : (
                <span className="text-muted-foreground text-sm">No data</span>
              )}
            </div>
          </div>
          <form
            className="grid gap-4 md:grid-cols-3"
            onSubmit={handleWeightSubmit}
          >
            <input
              type="number"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              placeholder="Weight"
              value={weightForm.weight}
              onChange={(event) =>
                setWeightForm((prev) => ({
                  ...prev,
                  weight: event.target.value,
                }))
              }
            />
            <input
              type="date"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              value={weightForm.date}
              onChange={(event) =>
                setWeightForm((prev) => ({
                  ...prev,
                  date: event.target.value,
                }))
              }
            />
            <Button type="submit">Save weight</Button>
          </form>
          <div className="space-y-2">
            {(patternState?.weightLog ?? []).slice(0, 5).map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm"
              >
                <span>{new Date(entry.date).toLocaleDateString()}</span>
                <span className="font-semibold">{entry.weight} lbs</span>
              </div>
            ))}
            {!patternState?.weightLog?.length && (
              <p className="text-sm text-muted-foreground">
                No weigh-ins on file yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Utensils className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Meal history</CardTitle>
              <CardDescription>Recent meals on record.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {detail.nutritionLog.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No meals logged yet. Add one above to start the list.
            </p>
          )}
          {detail.nutritionLog.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold">{entry.mealType}</p>
                <p className="text-muted-foreground">{entry.description}</p>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <p>{entry.time}</p>
                <p>{entry.calories} cal</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <section className="grid gap-6 md:grid-cols-5">
        <Card className="md:col-span-3">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Recent sessions</CardTitle>
                <CardDescription>Latest updates.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {detail.recentWorkouts.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No workouts logged yet. Use the form below to add one.
              </p>
            )}
            {detail.recentWorkouts.map((session) => (
              <div
                key={session.id}
                className="rounded-xl border border-border bg-muted/30 p-4"
              >
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-semibold">{session.title}</p>
                    <p className="text-muted-foreground">{session.focus}</p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>{session.date}</p>
                    <p>{session.load}</p>
                  </div>
                </div>
                <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
                  Status: {session.readiness}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Task list</CardTitle>
                <CardDescription>Next steps for this client.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {detail.actionItems.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No tasks yet. Add one later.
              </p>
            )}
            {detail.actionItems.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-border bg-background p-3"
              >
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {item.status}
                </p>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
