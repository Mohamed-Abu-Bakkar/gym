import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import {
  Activity,
  ChevronRight,
  Dumbbell,
  Lock,
  Phone,
  Pin,
  Plus,
  Target,
  TrendingUp,
  User,
  Users,
} from 'lucide-react'

import { api } from '../../../../../convex/_generated/api'
import { useAuth } from '@/components/auth/useAuth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

type Tab = 'clients' | 'trainers'

const superAdminRoles = new Set(['admin'])

export const Route = createFileRoute('/app/management/superadmin/')({
  component: SuperAdminDashboard,
})

function SuperAdminDashboard() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<Tab>('clients')
  const [onboardDrawerOpen, setOnboardDrawerOpen] = useState(false)

  // Form state for onboarding
  const [newClientName, setNewClientName] = useState('')
  const [newClientPhone, setNewClientPhone] = useState('')
  const [newClientPin, setNewClientPin] = useState('')
  const [newClientRole, setNewClientRole] = useState<string>(
    'trainerManagedCustomer',
  )
  const [newClientGoal, setNewClientGoal] = useState<string>('generalFitness')
  const [selectedTrainerId, setSelectedTrainerId] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch all users
  const allUsers = useQuery(api.users.getAllUsers)

  // Create user mutation
  const createUser = useMutation(api.users.createUser)

  // Filter clients and trainers
  const clients =
    allUsers?.filter(
      (u) =>
        u.role === 'trainerManagedCustomer' || u.role === 'selfManagedCustomer',
    ) ?? []

  const trainers =
    allUsers?.filter((u) => u.role === 'trainer' || u.role === 'admin') ?? []

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      navigate({ to: '/' })
      return
    }

    if (!superAdminRoles.has(user.role)) {
      navigate({ to: '/app/management' })
    }
  }, [user, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        <p className="text-sm tracking-[0.3em] uppercase">
          Loading super admin...
        </p>
      </div>
    )
  }

  if (!user || !superAdminRoles.has(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
        <Card className="max-w-md border-dashed">
          <CardHeader>
            <CardTitle>Super Admin Only</CardTitle>
            <CardDescription>
              Only administrators can access this console.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const handleOnboardClient = async () => {
    if (!newClientName || !newClientPhone || !newClientPin) return

    setIsSubmitting(true)
    try {
      await createUser({
        name: newClientName,
        phoneNumber: newClientPhone,
        pin: newClientPin,
        role: newClientRole as
          | 'trainerManagedCustomer'
          | 'selfManagedCustomer'
          | 'trainer'
          | 'admin',
        goal: newClientGoal as
          | 'weightLoss'
          | 'muscleGain'
          | 'endurance'
          | 'flexibility'
          | 'generalFitness',
        trainerId: selectedTrainerId ? (selectedTrainerId as any) : undefined,
      })

      // Reset form
      setNewClientName('')
      setNewClientPhone('')
      setNewClientPin('')
      setNewClientRole('trainerManagedCustomer')
      setNewClientGoal('generalFitness')
      setSelectedTrainerId('')
      setOnboardDrawerOpen(false)
    } catch (error) {
      console.error('Failed to create user:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="p-4 space-y-2 border-b border-border">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          Super Admin Console · {todayLabel}
        </p>
        <h1 className="text-xl font-semibold">Administration</h1>
      </header>

      {/* Tab Navigation Bar */}
      <nav className="flex items-center justify-between border-b border-border bg-muted/30">
        <div className="flex flex-1">
          {/* Clients Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('clients')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-4 px-4 text-sm font-medium transition-colors border-b-2',
              activeTab === 'clients'
                ? 'border-primary text-primary bg-background'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50',
            )}
          >
            <Users className="w-4 h-4" />
            <span>Clients</span>
            <Pin className="w-3 h-3 text-amber-500" />
          </button>

          {/* Add Button */}
          <button
            type="button"
            aria-label="Add new user"
            title="Add new user"
            onClick={() => setOnboardDrawerOpen(true)}
            className="flex items-center justify-center px-6 py-4 border-x border-border bg-background hover:bg-muted/50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
              <Plus className="w-5 h-5" />
            </div>
          </button>

          {/* Trainers Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('trainers')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-4 px-4 text-sm font-medium transition-colors border-b-2',
              activeTab === 'trainers'
                ? 'border-primary text-primary bg-background'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50',
            )}
          >
            <Dumbbell className="w-4 h-4" />
            <span>Trainers</span>
            <Pin className="w-3 h-3 text-amber-500" />
          </button>
        </div>
      </nav>

      {/* Content Area */}
      <main className="flex-1 p-4 space-y-6 pb-24">
        {activeTab === 'clients' && (
          <ClientsView clients={clients} trainers={trainers} />
        )}
        {activeTab === 'trainers' && (
          <TrainersView trainers={trainers} clientCount={clients.length} />
        )}
      </main>

      {/* Onboard Client Drawer */}
      <Drawer open={onboardDrawerOpen} onOpenChange={setOnboardDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Onboard New User</DrawerTitle>
            <DrawerDescription>
              Add a new client or trainer to the system
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-4 p-4">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                Full Name
              </label>
              <Input
                placeholder="John Doe"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                Phone Number
              </label>
              <Input
                placeholder="+1234567890"
                value={newClientPhone}
                onChange={(e) => setNewClientPhone(e.target.value)}
              />
            </div>

            {/* PIN */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                PIN Code
              </label>
              <Input
                placeholder="1234"
                type="password"
                maxLength={6}
                value={newClientPin}
                onChange={(e) => setNewClientPin(e.target.value)}
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select value={newClientRole} onValueChange={setNewClientRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trainerManagedCustomer">
                    Client (Trainer Managed)
                  </SelectItem>
                  <SelectItem value="selfManagedCustomer">
                    Client (Self Managed)
                  </SelectItem>
                  <SelectItem value="trainer">Trainer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Goal */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                Fitness Goal
              </label>
              <Select value={newClientGoal} onValueChange={setNewClientGoal}>
                <SelectTrigger>
                  <SelectValue placeholder="Select goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weightLoss">Weight Loss</SelectItem>
                  <SelectItem value="muscleGain">Muscle Gain</SelectItem>
                  <SelectItem value="endurance">Endurance</SelectItem>
                  <SelectItem value="flexibility">Flexibility</SelectItem>
                  <SelectItem value="generalFitness">
                    General Fitness
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Assign Trainer (for clients) */}
            {newClientRole === 'trainerManagedCustomer' && (
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-muted-foreground" />
                  Assign Trainer
                </label>
                <Select
                  value={selectedTrainerId}
                  onValueChange={setSelectedTrainerId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select trainer" />
                  </SelectTrigger>
                  <SelectContent>
                    {trainers.map((trainer) => (
                      <SelectItem key={trainer._id} value={trainer._id}>
                        {trainer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DrawerFooter>
            <Button
              onClick={handleOnboardClient}
              disabled={
                !newClientName ||
                !newClientPhone ||
                !newClientPin ||
                isSubmitting
              }
            >
              {isSubmitting ? 'Creating...' : 'Create User'}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                              Clients View                                  */
/* -------------------------------------------------------------------------- */

interface ClientsViewProps {
  clients: Array<{
    _id: string
    name: string
    phoneNumber: string
    role: string
    goal: string
    trainerId?: string
    createdAt: number
  }>
  trainers: Array<{
    _id: string
    name: string
  }>
}

function ClientsView({ clients, trainers }: ClientsViewProps) {
  const trainerMap = new Map(trainers.map((t) => [t._id, t.name]))

  return (
    <div className="space-y-4">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{clients.length}</p>
                <p className="text-xs text-muted-foreground">Total Clients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {
                    clients.filter((c) => c.role === 'trainerManagedCustomer')
                      .length
                  }
                </p>
                <p className="text-xs text-muted-foreground">Trainer Managed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Client Roster</CardTitle>
          <CardDescription>All registered clients</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {clients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No clients registered yet</p>
            </div>
          ) : (
            clients.map((client) => (
              <div
                key={client._id}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {client.trainerId
                        ? `Trainer: ${trainerMap.get(client.trainerId) ?? 'Unknown'}`
                        : 'Self-managed'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground capitalize">
                    {client.goal.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                              Trainers View                                 */
/* -------------------------------------------------------------------------- */

interface TrainersViewProps {
  trainers: Array<{
    _id: string
    name: string
    phoneNumber: string
    role: string
    createdAt: number
  }>
  clientCount: number
}

function TrainersView({ trainers, clientCount }: TrainersViewProps) {
  return (
    <div className="space-y-4">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{trainers.length}</p>
                <p className="text-xs text-muted-foreground">Total Trainers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {clientCount > 0 && trainers.length > 0
                    ? (clientCount / trainers.length).toFixed(1)
                    : '0'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Avg Clients/Trainer
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trainer List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Trainer Roster</CardTitle>
          <CardDescription>All registered trainers and admins</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {trainers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Dumbbell className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No trainers registered yet</p>
            </div>
          ) : (
            trainers.map((trainer) => (
              <div
                key={trainer._id}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">{trainer.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {trainer.phoneNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'text-xs px-2 py-1 rounded-full capitalize',
                      trainer.role === 'admin'
                        ? 'bg-amber-500/10 text-amber-600'
                        : 'bg-purple-500/10 text-purple-600',
                    )}
                  >
                    {trainer.role}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
