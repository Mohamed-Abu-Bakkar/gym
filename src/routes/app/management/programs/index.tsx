import { useEffect, useMemo } from 'react'
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { TrainerProgramSummary } from '@/lib/mock-data'

import { useTrainerManagement } from '@/features/management/management-context'

const privilegedRoles = new Set(['trainer', 'admin'])

export const Route = createFileRoute('/app/management/programs/')({
  component: ProgramsRoute,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      editProgramId: (search.editProgramId as string) ?? '',
    }
  },
})

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
              onClick={() => navigate({ to: '/app/management/programs/new' })}
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
    </div>
  )
}
