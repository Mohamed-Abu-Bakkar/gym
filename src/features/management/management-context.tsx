import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  TRAINER_CLIENT_DETAILS_MOCK,
  TRAINER_DASHBOARD_MOCK,
  TRAINER_PROGRAMS_MOCK,
  TRAINER_PROGRAM_DETAILS_MOCK,
  type TrainerClientActionItem,
  type TrainerClientCard,
  type TrainerClientDetail,
  type TrainerClientNutritionEntry,
  type TrainerClientRecentWorkout,
  type TrainerDashboardData,
  type TrainerProgramDetail,
  type TrainerProgramSummary,
} from '@/lib/mock-data'

const privilegedClients = TRAINER_DASHBOARD_MOCK.clients

type ClientsState = TrainerDashboardData['clients']

type CreateClientInput = Omit<TrainerClientCard, 'id'> & {
  list?: 'active' | 'flagged'
}

type UpdateClientInput = Partial<Omit<TrainerClientCard, 'id'>> & {
  list?: 'active' | 'flagged'
}

type CreateProgramInput = Omit<TrainerProgramSummary, 'id'> & {
  detail?: Partial<
    Omit<
      TrainerProgramDetail,
      'id' | 'blocks' | 'resources' | 'dailyWorkouts' | 'dietPlan'
    >
  >
  blocks?: TrainerProgramDetail['blocks']
  resources?: TrainerProgramDetail['resources']
  dailyWorkouts?: TrainerProgramDetail['dailyWorkouts']
  dietPlan?: TrainerProgramDetail['dietPlan']
}

type UpdateProgramInput = {
  summary?: Partial<Omit<TrainerProgramSummary, 'id'>>
  detail?: Partial<Omit<TrainerProgramDetail, 'id'>>
  dailyWorkouts?: TrainerProgramDetail['dailyWorkouts']
  dietPlan?: TrainerProgramDetail['dietPlan']
}

type WorkoutScheduleEntry = {
  day: string
  focus: string
  detail: string
  diet: string
}

type AssignedWorkoutPattern = {
  id: string
  name: string
  focus: string
  sourceProgramId?: string
  schedule: WorkoutScheduleEntry[]
}

type DietAssignment = {
  id: string
  title: string
  summary: string
  photoRefs: string[]
  dailyPlan: Array<{
    day: string
    guidance: string
  }>
}

type WorkoutTask = {
  id: string
  label: string
  detail: string
  completed: boolean
  day: string
}

type WeightLogEntry = {
  id: string
  date: string
  weight: number
}

export type WeightTrend = {
  thisWeekAvg: number | null
  lastWeekAvg: number | null
  delta: number | null
}

interface ClientPatternState {
  workout?: AssignedWorkoutPattern
  diet?: DietAssignment
  finalizedAt?: string | null
  tasks: WorkoutTask[]
  weightLog: WeightLogEntry[]
}

type AssignWorkoutPatternInput = {
  name: string
  focus: string
  programId?: string
  schedule: WorkoutScheduleEntry[]
}

type AssignDietPlanInput = {
  title: string
  summary: string
  photoRefs: string[]
  dailyPlan: Array<{
    day: string
    guidance: string
  }>
}

interface TrainerManagementContextValue {
  summary: TrainerDashboardData['summary']
  metrics: TrainerDashboardData['metrics']
  quickActions: TrainerDashboardData['quickActions']
  sessions: TrainerDashboardData['sessions']
  opsBoard: TrainerDashboardData['opsBoard']
  clients: ClientsState
  clientDetails: Record<string, TrainerClientDetail>
  programs: TrainerProgramSummary[]
  programDetails: Record<string, TrainerProgramDetail>
  createClient: (payload: CreateClientInput) => TrainerClientCard
  updateClient: (id: string, updates: UpdateClientInput) => void
  deleteClient: (id: string) => void
  moveClient: (id: string, list: 'active' | 'flagged') => void
  updateClientDetail: (
    id: string,
    updates: Partial<Omit<TrainerClientDetail, 'id'>>,
  ) => void
  logClientWorkout: (
    clientId: string,
    payload: Omit<TrainerClientRecentWorkout, 'id' | 'date'> & {
      date?: string
    },
  ) => void
  logClientNutrition: (
    clientId: string,
    payload: Omit<TrainerClientNutritionEntry, 'id'>,
  ) => void
  appendActionItem: (clientId: string, item: TrainerClientActionItem) => void
  createProgram: (payload: CreateProgramInput) => TrainerProgramSummary
  updateProgram: (id: string, payload: UpdateProgramInput) => void
  deleteProgram: (id: string) => void
  duplicateProgram: (id: string) => TrainerProgramSummary | null
  clientPatterns: Record<string, ClientPatternState>
  assignWorkoutPattern: (
    clientId: string,
    payload: AssignWorkoutPatternInput,
  ) => void
  assignDietPlan: (clientId: string, payload: AssignDietPlanInput) => void
  finalizePattern: (clientId: string) => void
  toggleWorkoutTask: (clientId: string, taskId: string) => void
  addCustomWorkoutTask: (
    clientId: string,
    payload: { label: string; detail: string; day?: string },
  ) => void
  logWeight: (clientId: string, weight: number, date?: string) => void
  getWeightTrend: (clientId: string) => WeightTrend
}

const TrainerManagementContext =
  createContext<TrainerManagementContextValue | null>(null)

const createId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 10)}`

const buildDefaultClientDetail = (
  client: TrainerClientCard,
): TrainerClientDetail => ({
  id: client.id,
  name: client.name,
  focus: client.focus,
  readiness: client.readiness,
  compliance: client.progress,
  trend: 'Waiting on new data',
  plan: client.status,
  metrics: [
    { label: 'Weekly volume', value: '—', helper: 'Log workouts to track' },
    { label: 'Sleep avg', value: '—', helper: 'Need wearable data' },
  ],
  readinessBreakdown: [
    { label: 'Sleep', current: 0, target: 100 },
    { label: 'Recovery', current: 0, target: 100 },
    { label: 'Training load', current: 0, target: 100 },
  ],
  recentWorkouts: [],
  nutritionLog: [],
  actionItems: [],
})

const emptyPatternState: ClientPatternState = {
  tasks: [],
  weightLog: [],
}

const buildInitialPatternState = (snapshot: ClientsState) => {
  const base: Record<string, ClientPatternState> = {}
  ;[...snapshot.active, ...snapshot.flagged].forEach((client) => {
    base[client.id] = { ...emptyPatternState }
  })
  return base
}

export function TrainerManagementProvider({
  children,
}: {
  children: ReactNode
}) {
  const [clients, setClients] = useState<ClientsState>(privilegedClients)
  const [clientDetails, setClientDetails] = useState<
    Record<string, TrainerClientDetail>
  >(TRAINER_CLIENT_DETAILS_MOCK)
  const [programs, setPrograms] = useState<TrainerProgramSummary[]>(
    TRAINER_PROGRAMS_MOCK,
  )
  const [programDetails, setProgramDetails] = useState<
    Record<string, TrainerProgramDetail>
  >(TRAINER_PROGRAM_DETAILS_MOCK)
  const [clientPatterns, setClientPatterns] = useState<
    Record<string, ClientPatternState>
  >(() => buildInitialPatternState(privilegedClients))

  const summary = useMemo(() => {
    const totalClients = clients.active.length + clients.flagged.length
    return {
      ...TRAINER_DASHBOARD_MOCK.summary,
      clientsTotal: totalClients,
      checkInsDue: clients.flagged.length,
    }
  }, [clients])

  const updateClientProgressMetrics = (
    clientId: string,
    completion: number,
  ) => {
    setClients((prev) => ({
      active: prev.active.map((client) =>
        client.id === clientId ? { ...client, progress: completion } : client,
      ),
      flagged: prev.flagged.map((client) =>
        client.id === clientId ? { ...client, progress: completion } : client,
      ),
    }))

    setClientDetails((prev) => {
      const detail = prev[clientId]
      if (!detail) return prev
      const newTrend =
        completion > detail.compliance
          ? 'Trending up'
          : completion < detail.compliance
            ? 'Needs attention'
            : detail.trend
      return {
        ...prev,
        [clientId]: {
          ...detail,
          compliance: completion,
          trend: newTrend,
        },
      }
    })
  }

  const updatePatternState = (
    clientId: string,
    updater: (state: ClientPatternState) => ClientPatternState,
  ) => {
    setClientPatterns((prev) => {
      const current = prev[clientId] ?? { ...emptyPatternState }
      return {
        ...prev,
        [clientId]: updater({ ...current }),
      }
    })
  }

  const assignWorkoutPattern = (
    clientId: string,
    payload: AssignWorkoutPatternInput,
  ) => {
    const baseTasks: WorkoutTask[] = payload.schedule.map((entry) => ({
      id: createId('task'),
      label: `${entry.day} · ${entry.focus}`,
      detail: entry.detail,
      completed: false,
      day: entry.day,
    }))
    updatePatternState(clientId, (state) => ({
      ...state,
      workout: {
        id: createId('pattern'),
        name: payload.name,
        focus: payload.focus,
        sourceProgramId: payload.programId,
        schedule: payload.schedule,
      },
      tasks: baseTasks,
      finalizedAt: null,
    }))
    updateClientProgressMetrics(clientId, 0)
  }

  const assignDietPlan = (clientId: string, payload: AssignDietPlanInput) => {
    updatePatternState(clientId, (state) => ({
      ...state,
      diet: {
        id: createId('diet'),
        title: payload.title,
        summary: payload.summary,
        photoRefs: payload.photoRefs,
        dailyPlan: payload.dailyPlan,
      },
    }))
  }

  const finalizePattern = (clientId: string) => {
    updatePatternState(clientId, (state) => ({
      ...state,
      finalizedAt: new Date().toISOString(),
      tasks: state.tasks.map((task) => ({ ...task, completed: true })),
    }))
    updateClientProgressMetrics(clientId, 100)
  }

  const toggleWorkoutTask = (clientId: string, taskId: string) => {
    updatePatternState(clientId, (state) => ({
      ...state,
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    }))
  }

  const addCustomWorkoutTask = (
    clientId: string,
    payload: { label: string; detail: string; day?: string },
  ) => {
    if (!payload.label.trim()) return
    updatePatternState(clientId, (state) => ({
      ...state,
      tasks: [
        {
          id: createId('task'),
          label: payload.label,
          detail: payload.detail,
          completed: false,
          day: payload.day ?? 'Any day',
        },
        ...state.tasks,
      ],
    }))
  }

  const logWeight = (clientId: string, weight: number, date?: string) => {
    if (!Number.isFinite(weight) || weight <= 0) return
    const entry: WeightLogEntry = {
      id: createId('weight'),
      weight,
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
    }
    updatePatternState(clientId, (state) => {
      const nextLog = [entry, ...state.weightLog]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 30)
      return {
        ...state,
        weightLog: nextLog,
      }
    })
  }

  const getWeightTrend = (clientId: string): WeightTrend => {
    const log = clientPatterns[clientId]?.weightLog ?? []
    if (!log.length) {
      return { thisWeekAvg: null, lastWeekAvg: null, delta: null }
    }
    const sorted = [...log].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
    const thisWeek = sorted.slice(0, 7)
    const lastWeek = sorted.slice(7, 14)
    const avg = (entries: WeightLogEntry[]) =>
      entries.length
        ? Number(
            (
              entries.reduce((sum, entry) => sum + entry.weight, 0) /
              entries.length
            ).toFixed(1),
          )
        : null
    const thisWeekAvg = avg(thisWeek)
    const lastWeekAvg = avg(lastWeek)
    const delta =
      thisWeekAvg !== null && lastWeekAvg !== null
        ? Number((thisWeekAvg - lastWeekAvg).toFixed(1))
        : null
    return { thisWeekAvg, lastWeekAvg, delta }
  }

  const createClient = (payload: CreateClientInput) => {
    const { list = 'active', ...rest } = payload
    const newClient: TrainerClientCard = {
      ...rest,
      id: createId('client'),
    }
    setClients((prev) => ({
      ...prev,
      [list]: [newClient, ...prev[list]],
    }))
    setClientDetails((prev) => ({
      ...prev,
      [newClient.id]: buildDefaultClientDetail(newClient),
    }))
    setClientPatterns((prev) => ({
      ...prev,
      [newClient.id]: { ...emptyPatternState },
    }))
    return newClient
  }

  const updateClient = (id: string, updates: UpdateClientInput) => {
    setClients((prev) => {
      const mapList = (list: TrainerClientCard[]) =>
        list.map((client) =>
          client.id === id ? { ...client, ...updates } : client,
        )
      let next = {
        active: mapList(prev.active),
        flagged: mapList(prev.flagged),
      }
      if (
        updates.list &&
        updates.list !== 'active' &&
        updates.list !== 'flagged'
      ) {
        return next
      }
      if (updates.list && updates.list !== undefined) {
        next = moveClientInternal(next, id, updates.list)
      }
      return next
    })
    setClientDetails((prev) => {
      const detail = prev[id]
      if (!detail) return prev
      return {
        ...prev,
        [id]: {
          ...detail,
          ...('name' in updates ? { name: updates.name ?? detail.name } : {}),
          ...('focus' in updates
            ? { focus: updates.focus ?? detail.focus }
            : {}),
          ...('readiness' in updates
            ? { readiness: updates.readiness ?? detail.readiness }
            : {}),
          ...('status' in updates
            ? { plan: updates.status ?? detail.plan }
            : {}),
        },
      }
    })
  }

  const moveClientInternal = (
    snapshot: ClientsState,
    id: string,
    target: 'active' | 'flagged',
  ): ClientsState => {
    const opposite = target === 'active' ? 'flagged' : 'active'
    let movingClient: TrainerClientCard | undefined
    const filteredOpposite = snapshot[opposite].filter((client) => {
      if (client.id === id) {
        movingClient = client
        return false
      }
      return true
    })
    if (!movingClient) {
      return snapshot
    }
    return {
      ...snapshot,
      [opposite]: filteredOpposite,
      [target]: [movingClient, ...snapshot[target]],
    }
  }

  const moveClient = (id: string, target: 'active' | 'flagged') => {
    setClients((prev) => moveClientInternal(prev, id, target))
  }

  const deleteClient = (id: string) => {
    setClients((prev) => ({
      active: prev.active.filter((client) => client.id !== id),
      flagged: prev.flagged.filter((client) => client.id !== id),
    }))
    setClientDetails((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setClientPatterns((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const updateClientDetail = (
    id: string,
    updates: Partial<Omit<TrainerClientDetail, 'id'>>,
  ) => {
    setClientDetails((prev) => {
      const detail = prev[id]
      if (!detail) return prev
      return {
        ...prev,
        [id]: { ...detail, ...updates },
      }
    })
  }

  const logClientWorkout = (
    clientId: string,
    payload: Omit<TrainerClientRecentWorkout, 'id' | 'date'> & {
      date?: string
    },
  ) => {
    setClientDetails((prev) => {
      const detail = prev[clientId]
      if (!detail) return prev
      const newWorkout: TrainerClientRecentWorkout = {
        id: createId('session'),
        date:
          payload.date ??
          new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
        ...payload,
      }
      return {
        ...prev,
        [clientId]: {
          ...detail,
          recentWorkouts: [newWorkout, ...detail.recentWorkouts].slice(0, 6),
        },
      }
    })
  }

  const logClientNutrition = (
    clientId: string,
    payload: Omit<TrainerClientNutritionEntry, 'id'>,
  ) => {
    setClientDetails((prev) => {
      const detail = prev[clientId]
      if (!detail) return prev
      const newEntry: TrainerClientNutritionEntry = {
        ...payload,
        id: createId('meal'),
      }
      return {
        ...prev,
        [clientId]: {
          ...detail,
          nutritionLog: [newEntry, ...detail.nutritionLog].slice(0, 8),
        },
      }
    })
  }

  const appendActionItem = (
    clientId: string,
    item: TrainerClientActionItem,
  ) => {
    setClientDetails((prev) => {
      const detail = prev[clientId]
      if (!detail) return prev
      return {
        ...prev,
        [clientId]: {
          ...detail,
          actionItems: [item, ...detail.actionItems],
        },
      }
    })
  }

  const createProgram = (payload: CreateProgramInput) => {
    const id = createId('program')
    const summaryEntry: TrainerProgramSummary = {
      id,
      name: payload.name,
      focus: payload.focus,
      level: payload.level,
      durationWeeks: payload.durationWeeks,
      status: payload.status,
      athletesAssigned: payload.athletesAssigned,
    }
    const detailEntry: TrainerProgramDetail = {
      id,
      headline: payload.detail?.headline ?? `${payload.name} overview`,
      overview: payload.detail?.overview ?? payload.focus,
      goal: payload.detail?.goal ?? 'Add a clear goal.',
      progressionNotes: payload.detail?.progressionNotes ?? 'Add weekly notes.',
      blocks: payload.blocks ?? [
        {
          week: 1,
          title: 'Foundation',
          focus: payload.focus,
          keySessions: ['Session A', 'Session B'],
          readinessCue: 'Keep the effort easy',
        },
      ],
      resources: payload.resources ?? [],
      dailyWorkouts: payload.dailyWorkouts ?? [],
      dietPlan: payload.dietPlan ?? [],
    }
    setPrograms((prev) => [summaryEntry, ...prev])
    setProgramDetails((prev) => ({ ...prev, [id]: detailEntry }))
    return summaryEntry
  }

  const updateProgram = (id: string, payload: UpdateProgramInput) => {
    if (payload.summary) {
      setPrograms((prev) =>
        prev.map((program) =>
          program.id === id ? { ...program, ...payload.summary } : program,
        ),
      )
    }
    if (payload.detail || payload.dailyWorkouts || payload.dietPlan) {
      setProgramDetails((prev) => {
        const detail = prev[id]
        if (!detail) return prev
        return {
          ...prev,
          [id]: {
            ...detail,
            ...(payload.detail ?? {}),
            ...(payload.dailyWorkouts
              ? { dailyWorkouts: payload.dailyWorkouts }
              : {}),
            ...(payload.dietPlan ? { dietPlan: payload.dietPlan } : {}),
          },
        }
      })
    }
  }

  const deleteProgram = (id: string) => {
    setPrograms((prev) => prev.filter((program) => program.id !== id))
    setProgramDetails((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const duplicateProgram = (id: string) => {
    const base = programs.find((program) => program.id === id)
    const detail = programDetails[id]
    if (!base || !detail) return null
    return createProgram({
      ...base,
      name: `${base.name} Copy`,
      status: 'Draft',
      detail: {
        headline: detail.headline,
        overview: detail.overview,
        goal: detail.goal,
        progressionNotes: detail.progressionNotes,
      },
      blocks: detail.blocks,
      resources: detail.resources,
      dailyWorkouts: detail.dailyWorkouts,
      dietPlan: detail.dietPlan,
    })
  }

  const value: TrainerManagementContextValue = {
    summary,
    metrics: TRAINER_DASHBOARD_MOCK.metrics,
    quickActions: TRAINER_DASHBOARD_MOCK.quickActions,
    sessions: TRAINER_DASHBOARD_MOCK.sessions,
    opsBoard: TRAINER_DASHBOARD_MOCK.opsBoard,
    clients,
    clientDetails,
    programs,
    programDetails,
    clientPatterns,
    createClient,
    updateClient,
    deleteClient,
    moveClient,
    updateClientDetail,
    logClientWorkout,
    logClientNutrition,
    appendActionItem,
    createProgram,
    updateProgram,
    deleteProgram,
    duplicateProgram,
    assignWorkoutPattern,
    assignDietPlan,
    finalizePattern,
    toggleWorkoutTask,
    addCustomWorkoutTask,
    logWeight,
    getWeightTrend,
  }

  return (
    <TrainerManagementContext.Provider value={value}>
      {children}
    </TrainerManagementContext.Provider>
  )
}

export function useTrainerManagement() {
  const ctx = useContext(TrainerManagementContext)
  if (!ctx) {
    throw new Error(
      'useTrainerManagement must be used inside TrainerManagementProvider',
    )
  }
  return ctx
}
