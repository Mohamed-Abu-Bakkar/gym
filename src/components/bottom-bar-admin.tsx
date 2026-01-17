import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/_components/bottom-bar-admin')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/components/bottom-bar-admin"!</div>
}
