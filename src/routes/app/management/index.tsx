import { useEffect } from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import {
  TrendingUp,
  UtensilsCrossed,
  Users,
  ClipboardList,
  ChevronRight,
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
import { api } from '../../../../convex/_generated/api'

import './management.css'

const privilegedRoles = new Set(['trainer', 'admin'])

export const Route = createFileRoute('/app/management/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  // Fetch diet plans
  const dietPlans = useQuery(
    api.dietPlans.getDietPlansByUser,
    user ? { userId: user._id } : 'skip',
  )

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

  const greetingName = user.name?.split(' ')[0] ?? 'Coach'
  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

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
            <p className="text-muted-foreground">Management Dashboard</p>
          </div>
        </div>
      </header>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/app/management/clients">
          <Card className="cursor-pointer hover:border-primary transition-colors h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                Manage your athletes
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/app/management/programs">
          <Card className="cursor-pointer hover:border-primary transition-colors h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Workout Programs
              </CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                Active training templates
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/app/management/diet-plans">
          <Card className="cursor-pointer hover:border-primary transition-colors h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Diet Plans</CardTitle>
              <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dietPlans?.length ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Nutrition templates ready
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Jump to key management workflows
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link
            to="/app/management/programs/new"
            className="group flex items-center justify-between rounded-xl border border-border bg-muted/30 p-4 transition-all hover:border-primary hover:bg-muted/40"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Create Workout Program</p>
                <p className="text-sm text-muted-foreground">
                  Build a new training template
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            to="/app/management/diet-plans/new"
            className="group flex items-center justify-between rounded-xl border border-border bg-muted/30 p-4 transition-all hover:border-primary hover:bg-muted/40"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <UtensilsCrossed className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold">Create Diet Plan</p>
                <p className="text-sm text-muted-foreground">
                  Design a nutrition template
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            to="/app/management/clients"
            className="group flex items-center justify-between rounded-xl border border-border bg-muted/30 p-4 transition-all hover:border-primary hover:bg-muted/40"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold">Manage Clients</p>
                <p className="text-sm text-muted-foreground">
                  View and update athlete roster
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
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
                      {trend.delta !== null
                        ? `${(trend.delta * 0.453592).toFixed(1)} kg`
                        : '—'}
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
    </div>
  )
}
