import { useEffect } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ClipboardList, Plus, ArrowLeft } from 'lucide-react'

import { useAuth } from '@/components/auth/useAuth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const privilegedRoles = new Set(['trainer', 'admin'])

export const Route = createFileRoute('/app/management/programs/')({
  component: ProgramsRoute,
})

function ProgramsRoute() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

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

      {/* ----------------------------- Program List ----------------------------- */}
      <Card>
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Program list</CardTitle>
            <CardDescription>Create, edit, and assign plans.</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <ClipboardList className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Training programs coming soon</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Workout program management will be integrated with Convex
                backend.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
