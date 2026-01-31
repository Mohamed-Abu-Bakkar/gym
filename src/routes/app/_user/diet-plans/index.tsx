import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/_user/diet-plans/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/_user/diet-plans/"!</div>
}
