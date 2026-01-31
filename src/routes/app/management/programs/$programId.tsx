import { FormEvent, useEffect, useMemo, useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, Copy, Trash2, Edit3, Plus } from 'lucide-react'

import { useAuth } from '@/components/auth/useAuth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { useTrainerManagement } from '@/features/management/management-context'
import type { TrainerProgramResource } from '@/lib/mock-data'

const privilegedRoles = new Set(['trainer', 'admin'])

export const Route = createFileRoute('/app/management/programs/$programId')({
  component: ProgramDetailRoute,
})

function ProgramDetailRoute() {
  const { programId } = Route.useParams()
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const {
    clients,
    programs,
    programDetails,
    deleteProgram,
    duplicateProgram,
    updateProgram,
    assignWorkoutPattern,
    assignDietPlan,
  } = useTrainerManagement()
  const [isManagingResources, setIsManagingResources] = useState(false)
  const [resourceForm, setResourceForm] = useState<{
    label: string
    url: string
    type: TrainerProgramResource['type']
  }>({
    label: '',
    url: '',
    type: 'PDF',
  })
  const [resourceError, setResourceError] = useState<string | null>(null)
  const [isAssigning, setIsAssigning] = useState(false)
  const [assignClientId, setAssignClientId] = useState('')
  const [assignFeedback, setAssignFeedback] = useState<{
    clientId: string
    name: string
  } | null>(null)
  const [assignError, setAssignError] = useState<string | null>(null)

  const rosterOptions = useMemo(
    () => [...clients.active, ...clients.flagged],
    [clients],
  )

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

  useEffect(() => {
    setIsManagingResources(false)
    setResourceForm({ label: '', url: '', type: 'PDF' })
    setResourceError(null)
    setIsAssigning(false)
    setAssignClientId('')
    setAssignError(null)
    setAssignFeedback(null)
  }, [programId])

  useEffect(() => {
    if (isAssigning && !assignClientId && rosterOptions.length) {
      setAssignClientId(rosterOptions[0].id)
    }
  }, [isAssigning, assignClientId, rosterOptions])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Loading program…
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
              Only trainers and admins can view this program.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const summaryEntry = programs.find((program) => program.id === programId)
  const detailEntry = programDetails[programId]

  if (!summaryEntry || !detailEntry) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Program not found</CardTitle>
            <CardDescription>
              Double-check the link or return to the management list.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() =>
                navigate({
                  to: '/app/management/programs/',
                  search: { editProgramId: undefined },
                })
              }
            >
              Back to programs
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleDuplicate = () => {
    const duplicated = duplicateProgram(programId)
    if (duplicated) {
      navigate({
        to: '/app/management/programs/$programId',
        params: { programId: duplicated.id },
      })
    }
  }

  const handleDelete = () => {
    deleteProgram(programId)
    navigate({
      to: '/app/management/programs/',
      search: { editProgramId: undefined },
    })
  }

  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const handleResourceSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const label = resourceForm.label.trim()
    const url = resourceForm.url.trim()
    if (!label || !url) {
      setResourceError('Provide both a label and a link before saving.')
      return
    }

    const newResource: TrainerProgramResource = {
      id: `resource-${Math.random().toString(36).slice(2, 10)}`,
      label,
      url,
      type: resourceForm.type,
    }

    updateProgram(programId, {
      detail: {
        resources: [...detailEntry.resources, newResource],
      },
    })

    setResourceForm({ label: '', url: '', type: 'PDF' })
    setResourceError(null)
    setIsManagingResources(false)
  }

  const handleRemoveResource = (resourceId: string) => {
    const nextResources = detailEntry.resources.filter(
      (resource) => resource.id !== resourceId,
    )
    updateProgram(programId, {
      detail: {
        resources: nextResources,
      },
    })
  }

  const handleAssignSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!assignClientId) {
      setAssignError('Select a client before assigning this program.')
      return
    }
    if (!detailEntry.dailyWorkouts.length && !detailEntry.dietPlan.length) {
      setAssignError('Add workouts or diet entries before assigning.')
      return
    }

    const schedule = detailEntry.dailyWorkouts.map((day) => ({
      day: day.dayLabel,
      focus: day.focus,
      detail: `${day.theme} · ${day.keyWork.join(', ')}`,
      diet: day.nutritionCue,
    }))

    if (schedule.length) {
      assignWorkoutPattern(assignClientId, {
        name: summaryEntry.name,
        focus: summaryEntry.focus,
        programId,
        schedule,
      })
    }

    if (detailEntry.dietPlan.length) {
      assignDietPlan(assignClientId, {
        title: `${summaryEntry.name} nutrition`,
        summary: detailEntry.overview,
        photoRefs: [],
        dailyPlan: detailEntry.dietPlan.map((day) => ({
          day: day.dayLabel,
          guidance:
            day.notes?.trim() ||
            `${day.emphasis} · ${day.meals
              .map((meal) => meal.title)
              .join(', ')}`,
        })),
      })
    }

    const assignedClient = rosterOptions.find(
      (client) => client.id === assignClientId,
    )
    setAssignFeedback(
      assignedClient
        ? { clientId: assignedClient.id, name: assignedClient.name }
        : null,
    )
    setAssignError(null)
    setIsAssigning(false)
  }

  return (
    <div className="p-4 space-y-6 pb-16">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1 ">
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
          <p className="text-sm text-muted-foreground">
            Program detail · {todayLabel}
          </p>
          <h1 className="text-2xl font-semibold">{summaryEntry.name}</h1>
          <p className="text-muted-foreground">{summaryEntry.focus}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => navigate({ to: '/app/management/programs/' })}
          >
            <ArrowLeft className="h-4 w-4" /> Back to programs
          </Button> */}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate({
                to: '/app/management/programs/',
                search: { editProgramId: summaryEntry.id },
              })
            }
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          {/* <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={handleDuplicate}
          >
            <Copy className="h-4 w-4" /> Duplicate
          </Button> */}
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <Card className="rounded-lg">
        <CardHeader className="pb-1">
          <CardTitle className="text-sm font-medium">
            Program overview
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Duration
            </p>
            <p className="text-sm font-semibold">
              {summaryEntry.durationWeeks}w
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Level
            </p>
            <p className="text-sm font-semibold">{summaryEntry.level}</p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Status
            </p>
            <p className="text-sm font-semibold">{summaryEntry.status}</p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Athletes
            </p>
            <p className="text-sm font-semibold">
              {summaryEntry.athletesAssigned}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-2">
          <div className="pb-4 flex items-center justify-between">
            <CardDescription className="uppercase text-[11px] tracking-wide">
              Program
            </CardDescription>
            <Button
              variant={isAssigning ? 'default' : 'outline'}
              size="sm"
              className="gap-2"
              onClick={() => {
                setIsAssigning((prev) => !prev)
                setAssignError(null)
              }}
            >
              <ArrowRight className="h-4 w-4" /> Assign
            </Button>
          </div>
          <CardTitle className="text-2xl">{detailEntry.headline}</CardTitle>
          {/* <p className="text-sm text-muted-foreground">
            {detailEntry.overview}
          </p> */}
          {/* <div className="flex flex-wrap gap-2 pt-2">
           
            <Button variant="ghost" size="sm">
              Copy week
            </Button>
          </div> */}
          {isAssigning && (
            <form
              onSubmit={handleAssignSubmit}
              className="mt-3 space-y-3 rounded-2xl border border-dashed border-border bg-muted/20 p-4"
            >
              {rosterOptions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Add a client in management before assigning this program.
                </p>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Choose client
                    </label>
                    <select
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                      value={assignClientId}
                      onChange={(event) =>
                        setAssignClientId(event.target.value)
                      }
                    >
                      <option value="" disabled>
                        Select client
                      </option>
                      {rosterOptions.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name} · {client.focus}
                        </option>
                      ))}
                    </select>
                  </div>
                  {assignError && (
                    <p className="text-sm text-destructive">{assignError}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <Button type="submit" size="sm">
                      Assign program
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsAssigning(false)
                        setAssignError(null)
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </form>
          )}
          {assignFeedback && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Assigned to {assignFeedback.name}.
              <Link
                to="/app/management/clients/$clientId"
                params={{ clientId: assignFeedback.clientId }}
                className="ml-2 font-semibold text-emerald-900 underline"
              >
                View client
              </Link>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-2xl border border-border bg-muted/20 p-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Goal
            </p>
            <p className="text-lg font-semibold">{detailEntry.goal}</p>
            <p className="text-sm text-muted-foreground">
              {detailEntry.progressionNotes}
            </p>
          </div>
          <Tabs defaultValue="workouts" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="workouts">Daily workouts</TabsTrigger>
              <TabsTrigger value="diet">Nutrition playbook</TabsTrigger>
            </TabsList>

            <TabsContent value="workouts" className="space-y-3 pt-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Daily workouts</h2>
                <span className="text-sm text-muted-foreground">
                  {detailEntry.dailyWorkouts.length}-day template
                </span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {detailEntry.dailyWorkouts.map((day) => (
                  <div
                    key={`${detailEntry.headline}-${day.dayLabel}-${day.theme}`}
                    className="rounded-2xl border border-border bg-background p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          {day.dayLabel}
                        </p>
                        <p className="text-base font-semibold">{day.theme}</p>
                        <p className="text-xs text-muted-foreground">
                          {day.focus}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs text-muted-foreground">
                          {day.durationMinutes} min
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            day.intensity === 'High'
                              ? 'bg-destructive/10 text-destructive'
                              : day.intensity === 'Medium'
                                ? 'bg-amber-500/10 text-amber-500'
                                : 'bg-emerald-500/10 text-emerald-500'
                          }`}
                        >
                          {day.intensity}
                        </span>
                      </div>
                    </div>
                    <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                      {day.keyWork.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span>-</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Readiness: {day.readinessCue}
                    </p>
                    <p className="text-xs text-primary">
                      Nutrition: {day.nutritionCue}
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="diet" className="space-y-3 pt-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Nutrition playbook</h2>
                <span className="text-sm text-muted-foreground">
                  {detailEntry.dietPlan.length}-day cadence
                </span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {detailEntry.dietPlan.map((day) => (
                  <div
                    key={`${detailEntry.headline}-${day.dayLabel}-diet`}
                    className="rounded-2xl border border-border bg-background p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          {day.dayLabel}
                        </p>
                        <p className="text-base font-semibold">
                          {day.emphasis}
                        </p>
                      </div>
                      <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                        Hydration focus
                      </span>
                    </div>
                    <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                      {day.meals.map((meal) => (
                        <li key={meal.title} className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {meal.title}
                          </span>
                          <span>
                            {meal.description} · {meal.calories} cal
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Hydration: {day.hydration}
                    </p>
                    {day.notes && (
                      <p className="text-xs text-primary/80">
                        Note: {day.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Resources</h2>
              <Button
                variant={isManagingResources ? 'outline' : 'ghost'}
                size="sm"
                className="gap-1"
                onClick={() => {
                  setIsManagingResources((prev) => !prev)
                  setResourceError(null)
                }}
              >
                <Edit3 className="h-4 w-4" /> Manage files
              </Button>
            </div>
            {isManagingResources && (
              <form
                onSubmit={handleResourceSubmit}
                className="space-y-3 rounded-2xl border border-dashed border-border bg-muted/20 p-4"
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Label
                    </label>
                    <input
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                      value={resourceForm.label}
                      onChange={(event) =>
                        setResourceForm((prev) => ({
                          ...prev,
                          label: event.target.value,
                        }))
                      }
                      placeholder="Phase overview PDF"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Type
                    </label>
                    <select
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                      value={resourceForm.type}
                      onChange={(event) =>
                        setResourceForm((prev) => ({
                          ...prev,
                          type: event.target
                            .value as TrainerProgramResource['type'],
                        }))
                      }
                    >
                      <option value="PDF">PDF</option>
                      <option value="Video">Video</option>
                      <option value="Note">Note</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Link
                  </label>
                  <input
                    type="url"
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    value={resourceForm.url}
                    onChange={(event) =>
                      setResourceForm((prev) => ({
                        ...prev,
                        url: event.target.value,
                      }))
                    }
                    placeholder="https://..."
                  />
                </div>
                {resourceError && (
                  <p className="text-sm text-destructive">{resourceError}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  <Button type="submit" size="sm" className="gap-1">
                    <Plus className="h-4 w-4" /> Save resource
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsManagingResources(false)
                      setResourceForm({ label: '', url: '', type: 'PDF' })
                      setResourceError(null)
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
            <div className="space-y-2">
              {detailEntry.resources.map((resource) => (
                <Link
                  key={resource.id}
                  to={resource.url}
                  className="group flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm transition hover:border-primary"
                >
                  <div>
                    <p className="font-medium">{resource.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {resource.type}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isManagingResources && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-destructive"
                        onClick={(event) => {
                          event.preventDefault()
                          handleRemoveResource(resource.id)
                        }}
                        aria-label={`Delete ${resource.label}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
              {detailEntry.resources.length === 0 && (
                <p className="rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
                  No resources yet. Use Manage files to attach guides or media.
                </p>
              )}
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
