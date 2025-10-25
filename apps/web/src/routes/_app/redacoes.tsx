import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/redacoes')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/redacoes"!</div>
}
