import { FormEvent, useEffect, useMemo, useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  AlertTriangle,
  ArrowLeft,
  Edit3,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Users,
  ChevronRight,
  Flag,
} from 'lucide-react'

import { useAuth } from '@/components/auth/useAuth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import type { TrainerClientCard } from '@/lib/mock-data'

import { useTrainerManagement } from '@/features/management/management-context'

const privilegedRoles = new Set(['trainer', 'admin'])

export const Route = createFileRoute('/app/management/clients/')({
  component: ClientsRoute,
})

function ClientsRoute() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [clientDrawerOpen, setClientDrawerOpen] = useState(false)
  const [editingClientId, setEditingClientId] = useState<string | null>(null)
  const [clientForm, setClientForm] = useState({
    name: '',
    focus: '',
    status: '',
    readiness: 'Green',
    progress: 50,
    accentColor: '#22c55e',
    list: 'active' as const,
  })
  const { clients, createClient, updateClient, deleteClient, moveClient } =
    useTrainerManagement()

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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Loading clients…
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
              Only trainers and admins can view the roster.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const activeClients = clients.active
  const flaggedClients = clients.flagged

  const filtered = useMemo(() => {
    if (!query.trim()) {
      return { active: activeClients, flagged: flaggedClients }
    }
    const term = query.toLowerCase()
    const filterList = (list: typeof activeClients) =>
      list.filter((client) =>
        [client.name, client.focus, client.status].some((field) =>
          field.toLowerCase().includes(term),
        ),
      )
    return {
      active: filterList(activeClients),
      flagged: filterList(flaggedClients),
    }
  }, [query, activeClients, flaggedClients])

  const openCreateDrawer = (list: 'active' | 'flagged' = 'active') => {
    setClientForm({
      name: '',
      focus: '',
      status: '',
      readiness: 'Green',
      progress: 50,
      accentColor: '#22c55e',
      list,
    })
    setEditingClientId(null)
    setClientDrawerOpen(true)
  }

  const openEditDrawer = (
    client: TrainerClientCard,
    list: 'active' | 'flagged',
  ) => {
    setClientForm({
      name: client.name,
      focus: client.focus,
      status: client.status,
      readiness: client.readiness,
      progress: client.progress,
      accentColor: client.accentColor,
      list,
    })
    setEditingClientId(client.id)
    setClientDrawerOpen(true)
  }

  const handleClientSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const payload = {
      ...clientForm,
      progress: Number(clientForm.progress),
    }
    if (editingClientId) {
      updateClient(editingClientId, payload)
    } else {
      createClient(payload)
    }
    setClientDrawerOpen(false)
  }

  const handleDeleteClient = (id: string) => {
    deleteClient(id)
  }

  const handleMoveClient = (id: string, list: 'active' | 'flagged') => {
    moveClient(id, list)
  }

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
      <header className="space-y-2">
        <p className="text-sm text-muted-foreground">Client overview</p>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">Active clients</h1>
          <Button
            variant={'outline'}
            size="sm"
            className="gap-2"
            onClick={() => openCreateDrawer('active')}
          >
            <Plus className="h-4 w-4" />
            Add client
          </Button>
        </div>
      </header>

      <div className="rounded-2xl border border-border bg-card/50 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-1 items-center rounded-xl border border-border bg-background px-3 py-2">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, focus, or status"
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>
          <div className="rounded-xl bg-muted/60 px-3 py-2 text-sm text-muted-foreground">
            {activeClients.length + flaggedClients.length} total
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Users className="h-4 w-4" />
          </span>
          Active list
          <span className="text-xs font-normal text-muted-foreground">
            {filtered.active.length} clients
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-1">
          {filtered.active.map((client) => (
            <Link
              key={client.id}
              to="/app/management/clients/$clientId"
              params={{ clientId: client.id }}
              className="rounded-2xl border border-border bg-card/80 p-4 transition hover:border-primary"
            >
              <div className="flex flex- items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold">{client.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {client.focus}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {client.status}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1"
                  onClick={(event) => {
                    event.preventDefault()
                    handleMoveClient(client.id, 'flagged')
                  }}
                >
                  <Flag className="h-3.5 w-3.5" /> 
                </Button>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
                {/* <div className="text-right">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Status
                  </p>
                  <p className="text-base font-semibold">{client.readiness}</p>
                  <div className="mt-1 h-1.5 w-32 rounded-full bg-muted">
                    <span
                      className="block h-full rounded-full bg-primary"
                      style={{ width: `${client.progress}%` }}
                    />
                  </div>
                </div> */}
              </div>
              {/* <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1"
                  onClick={(event) => {
                    event.preventDefault()
                    openEditDrawer(client, 'active')
                  }}
                >
                  <Edit3 className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1"
                  onClick={(event) => {
                    event.preventDefault()
                    handleMoveClient(client.id, 'flagged')
                  }}
                >
                  <Flag className="h-3.5 w-3.5" /> Mark issue
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-1 text-destructive"
                  onClick={(event) => {
                    event.preventDefault()
                    handleDeleteClient(client.id)
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </Button>
              </div> */}
            </Link>
          ))}

          {filtered.active.length === 0 && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>No clients found</CardTitle>
                <CardDescription>
                  Adjust your search to see more athletes.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <AlertTriangle className="h-4 w-4" />
          </span>
          Needs help
          <span className="text-xs font-normal text-muted-foreground">
            {filtered.flagged.length} clients
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-1">
          {filtered.flagged.map((client) => (
            <Link
              key={client.id}
              to="/app/management/clients/$clientId"
              params={{ clientId: client.id }}
              className="rounded-2xl border border-destructive/40 bg-destructive/5 p-4 transition hover:border-destructive/60"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold">{client.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {client.focus}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {client.status}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1"
                    onClick={(event) => {
                      event.preventDefault()
                      handleMoveClient(client.id, 'active')
                    }}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </Button>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
                {/* <div className="text-right">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Status
                  </p>
                  <p className="text-base font-semibold text-destructive">
                    {client.readiness}
                  </p>
                  <div className="mt-1 h-1.5 w-32 rounded-full bg-muted">
                    <span
                      className="block h-full rounded-full bg-destructive"
                      style={{ width: `${client.progress}%` }}
                    />
                  </div>
                </div> */}
              </div>
              {/* <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1"
                  onClick={(event) => {
                    event.preventDefault()
                    openEditDrawer(client, 'flagged')
                  }}
                >
                  <Edit3 className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1"
                  onClick={(event) => {
                    event.preventDefault()
                    handleMoveClient(client.id, 'active')
                  }}
                >
                  <ShieldCheck className="h-3.5 w-3.5" /> Mark ok
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-1 text-destructive"
                  onClick={(event) => {
                    event.preventDefault()
                    handleDeleteClient(client.id)
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </Button>
              </div> */}
            </Link>
          ))}

          {filtered.flagged.length === 0 && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>No issues</CardTitle>
                <CardDescription>Nothing to fix right now.</CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </section>
      <Drawer open={clientDrawerOpen} onOpenChange={setClientDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {editingClientId ? 'Update client' : 'Add client'}
            </DrawerTitle>
            <DrawerDescription>
              Add the basics so you can manage this client later.
            </DrawerDescription>
          </DrawerHeader>
          <form className="space-y-4 p-6" onSubmit={handleClientSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  required
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  value={clientForm.name}
                  onChange={(event) =>
                    setClientForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Focus</label>
                <input
                  required
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  value={clientForm.focus}
                  onChange={(event) =>
                    setClientForm((prev) => ({
                      ...prev,
                      focus: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Status / plan</label>
                <input
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  value={clientForm.status}
                  onChange={(event) =>
                    setClientForm((prev) => ({
                      ...prev,
                      status: event.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Status label</label>
                <select
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  value={clientForm.readiness}
                  onChange={(event) =>
                    setClientForm((prev) => ({
                      ...prev,
                      readiness: event.target.value,
                    }))
                  }
                >
                  <option value="Green">Green</option>
                  <option value="Amber">Amber</option>
                  <option value="Red">Red</option>
                </select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Progress (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  value={clientForm.progress}
                  onChange={(event) =>
                    setClientForm((prev) => ({
                      ...prev,
                      progress: Number(event.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Accent color</label>
                <input
                  type="color"
                  className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 py-1"
                  value={clientForm.accentColor}
                  onChange={(event) =>
                    setClientForm((prev) => ({
                      ...prev,
                      accentColor: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">List</label>
              <select
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                value={clientForm.list}
                onChange={(event) =>
                  setClientForm((prev) => ({
                    ...prev,
                    list: event.target.value as 'active' | 'flagged',
                  }))
                }
              >
                <option value="active">Active</option>
                <option value="flagged">Needs help</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setClientDrawerOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingClientId ? 'Save changes' : 'Create client'}
              </Button>
            </div>
          </form>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
