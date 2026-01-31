import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/management/superadmin')({
  component: SuperAdminLayout,
})

function SuperAdminLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  )
}
