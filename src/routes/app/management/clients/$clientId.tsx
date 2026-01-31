import { useEffect } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Users } from 'lucide-react'

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

export const Route = createFileRoute('/app/management/clients/$clientId')({
  component: ClientDetailRoute,
})

function ClientDetailRoute() {
  const { clientId } = Route.useParams()
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  /* -------------------------------------------------------------------------- */
  /*                                    Auth                                    */
  /* -------------------------------------------------------------------------- */

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

  if (isLoading) {
    return <div className="p-4">Loading...</div>
  }

  if (!user || !privilegedRoles.has(user.role)) {
    return null
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="space-y-6 p-4">
      {/* --------------------------- Header --------------------------- */}
      <header className="space-y-3">
        <Link
          to="/app/management/clients"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to clients
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">Client Details</h1>
          <p className="text-muted-foreground">ID: {clientId}</p>
        </div>
      </header>

      {/* ----------------------------- Content ----------------------------- */}
      <Card>
        <CardHeader>
          <CardTitle>Client Profile</CardTitle>
          <CardDescription>View and manage client information</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Client details coming soon</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Client profiles will be integrated with Convex backend.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
