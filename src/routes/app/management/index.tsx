import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/management/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/management/"!</div>
}
