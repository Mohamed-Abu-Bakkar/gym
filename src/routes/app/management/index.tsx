import { useEffect, useState, type FormEvent } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  // Activity,
  // BarChart3,
  // CalendarClock,
  CheckCircle2,
  ChevronRight,
  // Phone,
  // ShieldCheck,
  TrendingUp,
} from 'lucide-react'
// import type { LucideIcon } from 'lucide-react'

import { useAuth } from '@/components/auth/useAuth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import type {
  TrainerDashboardData,
  // TrainerQuickActionKey,
} from '@/lib/mock-data'

import { useTrainerManagement } from '@/features/management/management-context'

import './management.css'

const privilegedRoles = new Set(['trainer', 'admin'])

// const quickActionIconMap: Record<TrainerQuickActionKey, LucideIcon> = {
//   programBuilder: Activity,
//   sessionCheckins: CalendarClock,
//   callClient: Phone,
//   readinessReview: ShieldCheck,
// } as const

export const Route = createFileRoute('/app/management/')({
  component: RouteComponent,
})

type ClientRosterKey = keyof TrainerDashboardData['clients']

function RouteComponent() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const [clientView, setClientView] = useState<ClientRosterKey>('active')
  const {
    summary,
    metrics,
    // quickActions,
    sessions,
    // opsBoard,
    clients,
    moveClient,
    programs,
    programDetails,
    assignWorkoutPattern,
    assignDietPlan,
    clientPatterns,
    getWeightTrend,
  } = useTrainerManagement()
  const [blockDrawerOpen, setBlockDrawerOpen] = useState(false)
  const [blockForm, setBlockForm] = useState({
    clientId: '',
    programId: '',
    dietTitle: '',
    dietSummary: '',
  })
  const availableClients = [...clients.active, ...clients.flagged]

  useEffect(() => {
    setBlockForm((prev) => ({
      ...prev,
      clientId: prev.clientId || availableClients[0]?.id || '',
      programId: prev.programId || programs[0]?.id || '',
    }))
  }, [availableClients, programs])

  const openBlockDrawer = () => {
    setBlockForm((prev) => ({
      clientId: availableClients[0]?.id || '',
      programId: programs[0]?.id || '',
      dietTitle: prev.dietTitle,
      dietSummary: prev.dietSummary,
    }))
    setBlockDrawerOpen(true)
  }

  const handleBlockSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!blockForm.clientId || !blockForm.programId) return
    const program = programs.find((entry) => entry.id === blockForm.programId)
    const detail = programDetails[blockForm.programId]
    if (!program || !detail) return
    if (!detail.dailyWorkouts?.length || !detail.dietPlan?.length) {
      window.alert(
        'The selected program is missing daily workouts or diet guidance. Edit the program to add them before assigning.',
      )
      return
    }
    const totalWeeks = Math.max(1, program.durationWeeks)
    const template = detail.dailyWorkouts
    const totalTemplateDays = totalWeeks * template.length
    const schedule = Array.from({ length: totalTemplateDays }, (_, index) => {
      const baseDay = template[index % template.length]
      const weekNumber = Math.floor(index / template.length) + 1
      const detailNote =
        baseDay.readinessCue || detail.progressionNotes || baseDay.theme
      return {
        day: `Week ${weekNumber} · ${baseDay.dayLabel}`,
        focus: `${baseDay.focus} · ${baseDay.theme}`,
        detail: detailNote,
        diet: baseDay.nutritionCue,
      }
    })
    const planTemplate = detail.dietPlan
    const totalDietDays = totalWeeks * planTemplate.length
    const dailyDietPlan = Array.from({ length: totalDietDays }, (_, index) => {
      const baseDay = planTemplate[index % planTemplate.length]
      const weekNumber = Math.floor(index / planTemplate.length) + 1
      const mealSummary = baseDay.meals
        .map((meal) => `${meal.title}: ${meal.description}`)
        .join(' | ')
      const note = baseDay.notes ? ` Note: ${baseDay.notes}` : ''
      return {
        day: `Week ${weekNumber} · ${baseDay.dayLabel}`,
        guidance: `${baseDay.emphasis} • ${mealSummary} • Hydration: ${baseDay.hydration}${note}`,
      }
    })
    assignWorkoutPattern(blockForm.clientId, {
      name: program.name,
      focus: program.focus,
      programId: program.id,
      schedule,
    })
    assignDietPlan(blockForm.clientId, {
      title: blockForm.dietTitle || `${program.name} Fueling`,
      summary:
        blockForm.dietSummary || 'Pair carbs + protein before every session.',
      photoRefs: [],
      dailyPlan: dailyDietPlan,
    })
    setBlockDrawerOpen(false)
  }

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

  const isPrivileged = !!user && privilegedRoles.has(user.role)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        <p className="text-sm tracking-[0.3em] uppercase">Loading coach view</p>
      </div>
    )
  }

  if (!user || !isPrivileged) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
        <Card className="max-w-md border-dashed">
          <CardHeader>
            <CardTitle>Restricted area</CardTitle>
            <CardDescription>
              Only trainers and admins can open the management console. We will
              reroute you shortly.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const roster = clients[clientView]
  const greetingName = user.name?.split(' ')[0] ?? 'Coach'
  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const handleClearCheckIns = () => {
    clients.flagged.forEach((client) => moveClient(client.id, 'active'))
  }

  return (
    <div className="p-4 space-y-6 pb-16">
      <header className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Coach console · {todayLabel}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">
              Welcome back, {greetingName}
            </h1>
            <p className="text-muted-foreground">Focus: {summary.focusArea}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleClearCheckIns}>
              <CheckCircle2 className="h-4 w-4" />
              Clear check-ins
            </Button>
            <Button size="sm" onClick={openBlockDrawer}>
              <TrendingUp className="h-4 w-4" />
              New block
            </Button>
          </div>
        </div>
      </header>

      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Overall status</CardTitle>
            <CardDescription>
              {summary.clientsTotal} active clients • {summary.checkInsDue}{' '}
              check-ins due
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Weekly load</p>
            <p className="text-2xl font-semibold">{summary.loadDelta}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-semibold">
                {summary.readinessScore}
              </span>
              <span className="text-muted-foreground">Status score</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Tracking sleep, recovery, and workload
            </div>
          </div>
          <progress
            className="progress-bar"
            value={summary.readinessScore}
            max={100}
            aria-label="Readiness score"
          />
        </CardContent>
      </Card>

      <section className="grid grid-cols-4 gap-2 md:gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="flex flex-col h-full">
            <CardHeader className="space-y-1 p-2 md:p-6">
              <CardDescription className="uppercase text-[9px] md:text-[11px] leading-tight font-medium break-words">
                {metric.label}
              </CardDescription>
              <CardTitle className="text-base md:text-2xl font-bold break-all md:break-normal">
                {metric.value}
              </CardTitle>
            </CardHeader>

            {/* Helper text now wraps and pushes the card height instead of hiding */}
            <CardContent className="p-2 pt-0 md:p-6 md:pt-0">
              <p className="text-[10px] md:text-xs text-muted-foreground leading-snug">
                {metric.helper}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Client list</CardTitle>
            <CardDescription>Live view for everyone you coach.</CardDescription>
          </div>
          <Tabs
            defaultValue="active"
            value={clientView}
            onValueChange={(value) => setClientView(value as ClientRosterKey)}
          >
            <TabsList>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="flagged">Needs help</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="space-y-3">
          {roster.map((client) => (
            <div
              key={client.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-muted/30 p-4"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 rounded-xl bg-background">
                  <span
                    className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border border-background"
                    style={{ backgroundColor: client.accentColor }}
                  />
                </div>
                <div>
                  <p className="font-medium">{client.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {client.focus}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {client.status}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  {client.readiness} status
                </span>
                <div className="w-40">
                  <progress
                    className="progress-bar"
                    value={client.progress}
                    max={100}
                    aria-label={`${client.name}'s progress`}
                  />
                </div>
              </div>
              <ChevronRight className="text-muted-foreground" size={16} />
            </div>
          ))}
          <Button
            variant="ghost"
            className="w-full justify-center"
            onClick={() => navigate({ to: '/app/management/clients' })}
          >
            View full roster
          </Button>
        </CardContent>
      </Card>

      {availableClients.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pattern snapshot</CardTitle>
            <CardDescription>
              Track assignments, diet plans, and weight trends at a glance.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {availableClients.map((client) => {
              const pattern = clientPatterns[client.id]
              const outstanding = pattern?.tasks.filter(
                (t) => !t.completed,
              ).length
              const trend = getWeightTrend(client.id)
              return (
                <div
                  key={client.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/60 bg-muted/20 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold">{client.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {pattern?.workout?.name ?? 'No workout pattern yet'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Diet: {pattern?.diet?.title ?? 'Unassigned'}
                    </p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>
                      Tasks: {outstanding ?? 0}
                      {pattern?.tasks?.length
                        ? ` / ${pattern.tasks.length}`
                        : ''}
                    </p>
                    <p>
                      Weight Δ:{' '}
                      {trend.delta !== null ? `${trend.delta} lbs` : '—'}
                    </p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      <section className="grid gap-6 lg:grid-cols-1">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming sessions</CardTitle>
            <CardDescription>Auto-sync on</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {sessions.map((slot) => (
                <li
                  key={slot.id}
                  className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{slot.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {slot.status}
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {slot.time}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* <Card className="lg:col-span-3">
          <CardHeader className="flex justify-between">
            <div>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription>
                Tackle the things that matter now.
              </CardDescription>
            </div>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = quickActionIconMap[action.iconKey]
              return (
                <button
                  key={action.id}
                  type="button"
                  className="rounded-xl border border-border bg-background p-4 text-left transition hover:border-primary"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-3 font-medium">{action.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </button>
              )
            })}
          </CardContent>
        </Card> */}
      </section>

      {/* <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Task board</CardTitle>
                <CardDescription>
                  Keep work moving.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {opsBoard.map((note) => (
              <div
                key={note.id}
                className="rounded-xl border border-border bg-muted/30 p-4"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {note.status}
                </p>
                <p className="mt-2 text-lg font-semibold">{note.title}</p>
                <p className="text-sm text-muted-foreground">
                  {note.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card> */}

      <Drawer open={blockDrawerOpen} onOpenChange={setBlockDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Assign new block</DrawerTitle>
            <DrawerDescription>
              Pair a program and diet brief for a specific client.
            </DrawerDescription>
          </DrawerHeader>
          <form className="space-y-4 p-6" onSubmit={handleBlockSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  className="text-sm font-medium"
                  htmlFor="block-client-select"
                >
                  Client
                </label>
                <select
                  id="block-client-select"
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  value={blockForm.clientId}
                  onChange={(event) =>
                    setBlockForm((prev) => ({
                      ...prev,
                      clientId: event.target.value,
                    }))
                  }
                >
                  {availableClients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className="text-sm font-medium"
                  htmlFor="block-program-select"
                >
                  Program
                </label>
                <select
                  id="block-program-select"
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  value={blockForm.programId}
                  onChange={(event) =>
                    setBlockForm((prev) => ({
                      ...prev,
                      programId: event.target.value,
                    }))
                  }
                >
                  {programs.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Diet title</label>
              <input
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                value={blockForm.dietTitle}
                onChange={(event) =>
                  setBlockForm((prev) => ({
                    ...prev,
                    dietTitle: event.target.value,
                  }))
                }
                placeholder="In-season fueling"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Diet summary</label>
              <textarea
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                rows={4}
                value={blockForm.dietSummary}
                onChange={(event) =>
                  setBlockForm((prev) => ({
                    ...prev,
                    dietSummary: event.target.value,
                  }))
                }
                placeholder="Outline macro targets, hydration, and supplement cues."
              />
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setBlockDrawerOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!availableClients.length || !programs.length}
              >
                Assign block
              </Button>
            </div>
          </form>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
