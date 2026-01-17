import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/_user/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/management/(user)/"!</div>
}
