import { useEffect, useMemo } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import {
  UtensilsCrossed,
  Plus,
  Target,
  Calendar,
  ChevronRight,
  ArrowLeft,
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
import { api } from '../../../../../convex/_generated/api'

const privilegedRoles = new Set(['trainer', 'admin'])

export const Route = createFileRoute('/app/management/diet-plans/')({
  component: DietPlansRoute,
})

function DietPlansRoute() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  // Fetch all diet plans (for now, just the user's own)
  const dietPlans = useQuery(
    api.dietPlans.getDietPlansByUser,
    user ? { userId: user._id } : 'skip',
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

  /* -------------------------------------------------------------------------- */
  /*                                Summary Stats                               */
  /* -------------------------------------------------------------------------- */

  const summaryStats = useMemo(() => {
    if (!dietPlans) return { total: 0, totalMeals: 0 }

    const totalMeals = dietPlans.reduce(
      (sum, plan) => sum + plan.mealTemplate.length,
      0,
    )

    return {
      total: dietPlans.length,
      totalMeals,
    }
  }, [dietPlans])

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
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4">
      {/* --------------------------- Header --------------------------- */}
      <header className="space-y-3">
        <Link
          to="/app/management"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to overview
        </Link>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Diet Plans · {todayLabel}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold">Diet Plans</h1>
            <p className="text-muted-foreground">
              Manage nutrition templates for athletes
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="gap-2"
              onClick={() => navigate({ to: '/app/management/diet-plans/new' })}
            >
              <Plus className="h-4 w-4" /> New
            </Button>
          </div>
        </div>
      </header>

      {/* --------------------------- Summary Cards --------------------------- */}
      <section className="flex gap-4">
        <Card>
          <CardHeader className="space-y-1">
            <CardDescription className="uppercase text-[11px] tracking-wide">
              Total plans
            </CardDescription>
            <CardTitle className="text-3xl">{summaryStats.total}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardDescription className="uppercase text-[11px] tracking-wide">
              Total meals
            </CardDescription>
            <CardTitle className="text-3xl">
              {summaryStats.totalMeals}
            </CardTitle>
          </CardHeader>
        </Card>
      </section>

      {/* --------------------------- Plans List --------------------------- */}
      <Card>
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Diet Plans</CardTitle>
            <CardDescription>
              Create, edit, and assign nutrition templates.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {!dietPlans && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading plans...</p>
            </div>
          )}

          {dietPlans && dietPlans.length === 0 && (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <UtensilsCrossed className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">No diet plans yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Create your first nutrition template to start organizing meal
                  plans for your athletes.
                </p>
              </div>
              <Button
                className="gap-2"
                onClick={() =>
                  navigate({ to: '/app/management/diet-plans/new' })
                }
              >
                <Plus className="h-4 w-4" />
                Create diet plan
              </Button>
            </div>
          )}

          {dietPlans &&
            dietPlans.map((plan) => (
              <Link
                key={plan._id}
                to="/app/management/diet-plans/$planId"
                params={{ planId: plan._id }}
                className="group flex w-full flex-col gap-4 rounded-2xl border border-border bg-muted/20 p-5 text-left transition-all hover:border-primary hover:bg-muted/40 focus-visible:outline-none"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-lg font-semibold leading-none">
                      {plan.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>

                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
                  {plan.durationWeeks && (
                    <span>{plan.durationWeeks}-week plan</span>
                  )}
                  {plan.goal && (
                    <span className="flex items-center gap-1.5">
                      <Target className="h-4 w-4" />
                      {plan.goal}
                    </span>
                  )}
                  {plan.dailyCalorieTarget && (
                    <span className="flex items-center gap-1.5">
                      <UtensilsCrossed className="h-4 w-4" />
                      {plan.dailyCalorieTarget} cal/day
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {plan.activeDays.length} active days
                  </span>
                </div>
              </Link>
            ))}
        </CardContent>
      </Card>
    </div>
  )
}
