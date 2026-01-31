import { Outlet, createFileRoute } from '@tanstack/react-router'

import { BottomBarAdmin } from '@/components/bottom-bar-admin'

export const Route = createFileRoute('/app/management')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto max-w-screen-sm">
        <Outlet />
      </div>
      <BottomBarAdmin />
    </div>
  )
}
