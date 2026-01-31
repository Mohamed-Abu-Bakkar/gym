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
          {user.role === 'admin' && (
            <Link to="/app/management/superadmin">
              <button className="px-4 py-2 rounded-lg bg-amber-500/10 text-amber-600 text-sm font-medium hover:bg-amber-500/20 transition-colors">
                Super Admin
              </button>
            </Link>
          )}
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
              <CardTitle className="text-sm font-medium">Programs</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                Training templates
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
                {dietPlans?.length ?? '-'}
              </div>
              <p className="text-xs text-muted-foreground">
                Nutrition templates
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Jump to key management workflows</CardDescription>
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
            to="/app/management/diet-plans"
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
