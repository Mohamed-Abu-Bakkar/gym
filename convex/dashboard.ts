import { mutation, query, MutationCtx } from './_generated/server'
import type { Id } from './_generated/dataModel'
import { v } from 'convex/values'

const privilegeRoles = new Set(['trainer', 'admin'])

type Ctx = MutationCtx

type SeedUser = {
  name: string
  phoneNumber: string
  pin: string
  role: 'trainer' | 'trainerManagedCustomer' | 'selfManagedCustomer' | 'admin'
  goal: 'generalFitness'
  trainerId?: Id<'users'>
}

type MetaSeed = {
  focusArea: string
  readinessNote: string
  progressPercent: number
  accentColor: string
}

type ClientMetricsSeed = {
  planName: string
  goalProgress: number
  goalQuote: string
  caloriesRemaining: number
  macros: Array<{
    label: string
    amount: string
    remaining: string
    accentFrom: string
    accentTo: string
  }>
  activitySeries: Array<{ day: string; minutes: number }>
  durationMinutes: number
  caloriesBurned: number
  habits: Array<{
    label: string
    value: string
    helper: string
    iconKey: string
    accentColor: string
  }>
  sunlightMinutes: number
}

type TrainerMetricsSeed = {
  overallProgress: number
  trendDelta: number
  clientsTotal: number
  microStats: Array<{ label: string; value: string; helper: string }>
  quickActions: Array<{ label: string; description: string; iconKey: string }>
  upcomingSessions: Array<{ name: string; time: string; status: string }>
}

type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
type WorkoutType = 'cardio' | 'strength' | 'flexibility' | 'balance'
type WorkoutStatus = 'ongoing' | 'completed' | 'cancelled'
type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

type TrainingPlanSeed = {
  name: string
  description: string
  durationWeeks: number
  days: Array<{
    day: DayOfWeek
    exercises: Array<{
      exerciseName: string
      sets?: number
      reps?: number
      weight?: number
      notes?: string
    }>
  }>
}

type WorkoutExerciseSeed = {
  createdAt: number
  exerciseName: string
  sets?: number
  reps?: number
  weight?: number
  notes?: string
}

type WorkoutLogSeed = {
  startTime: number
  endTime?: number
  status: WorkoutStatus
  workoutType: WorkoutType
  duration?: number
  caloriesBurned?: number
  exercises: WorkoutExerciseSeed[]
}

type DietLogSeed = {
  createdAt: number
  mealType: MealType
  description: string
  calories: number
}

type WeightLogSeed = {
  createdAt: number
  weight: number
}

type ClientSeed = {
  name: string
  phoneNumber: string
  pin: string
  role: 'trainerManagedCustomer' | 'selfManagedCustomer'
  goal: 'generalFitness'
  focusArea: string
  readinessNote: string
  progressPercent: number
  accentColor: string
  planName: string
  goalProgress: number
  goalQuote: string
  caloriesRemaining: number
  macros: ClientMetricsSeed['macros']
  activitySeries: ClientMetricsSeed['activitySeries']
  durationMinutes: number
  caloriesBurned: number
  habits: ClientMetricsSeed['habits']
  sunlightMinutes: number
  trainingPlan: TrainingPlanSeed
  workoutLogs: WorkoutLogSeed[]
  dietLogs: DietLogSeed[]
  weightLogs: WeightLogSeed[]
}

export const trainerDashboard = query({
  args: { trainerId: v.id('users') },
  handler: async (ctx, args) => {
    const metrics = await ctx.db
      .query('trainerMetrics')
      .withIndex('by_trainer', q => q.eq('trainerId', args.trainerId))
      .unique()

    if (!metrics) {
      return null
    }

    const clients = await ctx.db
      .query('users')
      .withIndex('by_trainer', q => q.eq('trainerId', args.trainerId))
      .collect()

    const activeClients = [] as Array<{
      _id: typeof clients[number]['_id']
      name: string
      focus: string
      progress: number
      status: string
      accentColor: string
    }>

    for (const client of clients) {
      if (!privilegeRoles.has(client.role)) {
        const meta = await ctx.db
          .query('userMeta')
          .withIndex('by_user', q => q.eq('userId', client._id))
          .unique()

        activeClients.push({
          _id: client._id,
          name: client.name,
          focus: meta?.focusArea ?? client.goal,
          progress: meta?.progressPercent ?? 0,
          status: meta?.readinessNote ?? 'On program',
          accentColor: meta?.accentColor ?? '#bef264',
        })
      }
    }

    return {
      summary: {
        progress: metrics.overallProgress,
        trend: metrics.trendDelta,
        clientsTotal: metrics.clientsTotal,
      },
      microStats: metrics.microStats,
      quickActions: metrics.quickActions,
      upcomingSessions: metrics.upcomingSessions,
      activeClients,
    }
  },
})

export const clientDashboard = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const metrics = await ctx.db
      .query('clientMetrics')
      .withIndex('by_user', q => q.eq('userId', args.userId))
      .unique()

    if (!metrics) {
      return null
    }

    return metrics
  },
})

export const seedDemoData = mutation({
  args: {},
  handler: async ctx => {
    const now = Date.now()
    const trainerSeed = {
      name: 'Coach Alex Varma',
      phoneNumber: '+15551230000',
      pin: '123123',
      role: 'trainer' as const,
      goal: 'generalFitness' as const,
    }

    const adminSeed = {
      name: 'Admin Priya',
      phoneNumber: '+15551239999',
      pin: '999999',
      role: 'admin' as const,
      goal: 'generalFitness' as const,
    }

    const iso = (value: string) => Date.parse(value)

    const clientsSeed: ClientSeed[] = [
      {
        name: 'Karthik Raja',
        phoneNumber: '+15550000001',
        pin: '111111',
        role: 'trainerManagedCustomer',
        goal: 'generalFitness',
        focusArea: 'Hypertrophy',
        readinessNote: 'In session • Push day',
        progressPercent: 85,
        accentColor: '#bef264',
        planName: 'Push / Pull Split',
        goalProgress: 73,
        goalQuote:
          'Discipline is doing what needs to be done, even if you do not want to do it.',
        caloriesRemaining: 850,
        macros: [
          {
            label: 'Carb',
            amount: '160g',
            remaining: '120g left',
            accentFrom: '#38bdf8',
            accentTo: '#2563eb',
          },
          {
            label: 'Protein',
            amount: '140g',
            remaining: '80g left',
            accentFrom: '#818cf8',
            accentTo: '#a855f7',
          },
          {
            label: 'Fat',
            amount: '55g',
            remaining: '110g left',
            accentFrom: '#fb7185',
            accentTo: '#f97316',
          },
        ],
        activitySeries: [
          { day: 'Mon', minutes: 45 },
          { day: 'Tue', minutes: 35 },
          { day: 'Wed', minutes: 62 },
          { day: 'Thu', minutes: 28 },
          { day: 'Fri', minutes: 70 },
          { day: 'Sat', minutes: 40 },
          { day: 'Sun', minutes: 55 },
        ],
        durationMinutes: 312,
        caloriesBurned: 2430,
        habits: [
          {
            label: 'Hydration',
            value: '2.1 L',
            helper: 'Goal 3.0 L',
            iconKey: 'hydration',
            accentColor: '#38bdf8',
          },
          {
            label: 'Sleep',
            value: '7h 45m',
            helper: 'Last night',
            iconKey: 'sleep',
            accentColor: '#a78bfa',
          },
        ],
        sunlightMinutes: 45,
        trainingPlan: {
          name: 'Push / Pull Split',
          description: 'Six-week rotation alternating neural and metabolic focus.',
          durationWeeks: 6,
          days: [
            {
              day: 'mon',
              exercises: [
                { exerciseName: 'Back Squat', sets: 4, reps: 8, weight: 225, notes: 'Tempo 3-1-1' },
                { exerciseName: 'Incline Dumbbell Press', sets: 4, reps: 10, weight: 60 },
                { exerciseName: 'Bent Over Row', sets: 4, reps: 8, weight: 155 },
              ],
            },
            {
              day: 'wed',
              exercises: [
                { exerciseName: 'Deadlift', sets: 3, reps: 5, weight: 275 },
                { exerciseName: 'Tempo Push-up', sets: 3, reps: 12 },
                { exerciseName: 'Sled Push', sets: 5, reps: 1, notes: '20 meters' },
              ],
            },
            {
              day: 'fri',
              exercises: [
                { exerciseName: 'Front Squat', sets: 4, reps: 6, weight: 185 },
                { exerciseName: 'Single-Arm Row', sets: 3, reps: 10, weight: 70 },
                { exerciseName: 'Intervals Bike', sets: 6, reps: 1, notes: '45s on / 15s off' },
              ],
            },
          ],
        },
        workoutLogs: [
          {
            startTime: iso('2024-10-01T10:00:00Z'),
            endTime: iso('2024-10-01T11:05:00Z'),
            status: 'completed',
            workoutType: 'strength',
            duration: 65,
            caloriesBurned: 640,
            exercises: [
              {
                createdAt: iso('2024-10-01T10:05:00Z'),
                exerciseName: 'Back Squat',
                sets: 4,
                reps: 8,
                weight: 225,
              },
              {
                createdAt: iso('2024-10-01T10:25:00Z'),
                exerciseName: 'Incline Dumbbell Press',
                sets: 4,
                reps: 10,
                weight: 60,
              },
              {
                createdAt: iso('2024-10-01T10:45:00Z'),
                exerciseName: 'Bent Over Row',
                sets: 4,
                reps: 8,
                weight: 155,
              },
            ],
          },
          {
            startTime: iso('2024-10-03T10:00:00Z'),
            endTime: iso('2024-10-03T10:55:00Z'),
            status: 'completed',
            workoutType: 'cardio',
            duration: 55,
            caloriesBurned: 520,
            exercises: [
              {
                createdAt: iso('2024-10-03T10:10:00Z'),
                exerciseName: 'Intervals Bike',
                notes: '45s on / 15s off',
              },
              {
                createdAt: iso('2024-10-03T10:35:00Z'),
                exerciseName: 'Sled Push',
                notes: '4 rounds, 25m',
              },
            ],
          },
        ],
        dietLogs: [
          {
            createdAt: iso('2024-10-01T08:00:00Z'),
            mealType: 'breakfast',
            description: 'Overnight oats, berries, whey',
            calories: 420,
          },
          {
            createdAt: iso('2024-10-01T13:00:00Z'),
            mealType: 'lunch',
            description: 'Grilled chicken, jasmine rice, greens',
            calories: 620,
          },
        ],
        weightLogs: [
          { createdAt: iso('2024-09-28T07:00:00Z'), weight: 79.4 },
          { createdAt: iso('2024-10-05T07:00:00Z'), weight: 78.8 },
        ],
      },
      {
        name: 'Priya Darshini',
        phoneNumber: '+15550000002',
        pin: '222222',
        role: 'trainerManagedCustomer',
        goal: 'generalFitness',
        focusArea: 'Fat Loss',
        readinessNote: 'Check-in due today',
        progressPercent: 62,
        accentColor: '#facc15',
        planName: 'Metabolic Reset',
        goalProgress: 65,
        goalQuote: 'Momentum arrives after consistency.',
        caloriesRemaining: 640,
        macros: [
          {
            label: 'Carb',
            amount: '130g',
            remaining: '90g left',
            accentFrom: '#7dd3fc',
            accentTo: '#38bdf8',
          },
          {
            label: 'Protein',
            amount: '110g',
            remaining: '40g left',
            accentFrom: '#c084fc',
            accentTo: '#a855f7',
          },
          {
            label: 'Fat',
            amount: '45g',
            remaining: '60g left',
            accentFrom: '#fb7185',
            accentTo: '#ec4899',
          },
        ],
        activitySeries: [
          { day: 'Mon', minutes: 30 },
          { day: 'Tue', minutes: 40 },
          { day: 'Wed', minutes: 35 },
          { day: 'Thu', minutes: 50 },
          { day: 'Fri', minutes: 42 },
          { day: 'Sat', minutes: 25 },
          { day: 'Sun', minutes: 38 },
        ],
        durationMinutes: 260,
        caloriesBurned: 1980,
        habits: [
          {
            label: 'Hydration',
            value: '1.8 L',
            helper: 'Goal 2.5 L',
            iconKey: 'hydration',
            accentColor: '#38bdf8',
          },
          {
            label: 'Sleep',
            value: '7h 10m',
            helper: 'Stable trend',
            iconKey: 'sleep',
            accentColor: '#a78bfa',
          },
        ],
        sunlightMinutes: 32,
        trainingPlan: {
          name: 'Metabolic Reset',
          description: 'Higher-frequency conditioning blocks with dedicated recovery cues.',
          durationWeeks: 5,
          days: [
            {
              day: 'tue',
              exercises: [
                { exerciseName: 'Tempo Lunges', sets: 3, reps: 12, weight: 35 },
                { exerciseName: 'Row Machine', sets: 4, reps: 1, notes: '500m repeats' },
                { exerciseName: 'Plank Hold', sets: 3, reps: 1, notes: '60s each' },
              ],
            },
            {
              day: 'thu',
              exercises: [
                { exerciseName: 'Kettlebell Swing', sets: 4, reps: 15, weight: 24 },
                { exerciseName: 'Assault Bike Sprint', sets: 8, reps: 1, notes: '20s on / 40s off' },
                { exerciseName: 'Box Jump', sets: 4, reps: 8 },
              ],
            },
            {
              day: 'sat',
              exercises: [
                { exerciseName: 'Long Zone 2 Ride', sets: 1, reps: 1, notes: '45 min' },
                { exerciseName: 'Mobility Flow', sets: 1, reps: 1, notes: '20 min' },
              ],
            },
          ],
        },
        workoutLogs: [
          {
            startTime: iso('2024-10-02T07:00:00Z'),
            endTime: iso('2024-10-02T07:48:00Z'),
            status: 'completed',
            workoutType: 'cardio',
            duration: 48,
            caloriesBurned: 410,
            exercises: [
              {
                createdAt: iso('2024-10-02T07:05:00Z'),
                exerciseName: 'Row Machine',
                notes: '4 x 500m',
              },
              {
                createdAt: iso('2024-10-02T07:30:00Z'),
                exerciseName: 'Plank Hold',
                notes: '3 x 60s',
              },
            ],
          },
          {
            startTime: iso('2024-10-04T07:00:00Z'),
            endTime: iso('2024-10-04T07:42:00Z'),
            status: 'completed',
            workoutType: 'strength',
            duration: 42,
            caloriesBurned: 360,
            exercises: [
              {
                createdAt: iso('2024-10-04T07:05:00Z'),
                exerciseName: 'Kettlebell Swing',
                sets: 4,
                reps: 15,
                weight: 20,
              },
              {
                createdAt: iso('2024-10-04T07:25:00Z'),
                exerciseName: 'Box Jump',
                sets: 4,
                reps: 8,
              },
            ],
          },
        ],
        dietLogs: [
          {
            createdAt: iso('2024-10-02T06:30:00Z'),
            mealType: 'breakfast',
            description: 'Greek yogurt, chia, kiwi',
            calories: 310,
          },
          {
            createdAt: iso('2024-10-02T19:00:00Z'),
            mealType: 'dinner',
            description: 'Salmon bowl with quinoa and greens',
            calories: 580,
          },
        ],
        weightLogs: [
          { createdAt: iso('2024-09-29T06:30:00Z'), weight: 68.1 },
          { createdAt: iso('2024-10-05T06:30:00Z'), weight: 67.6 },
        ],
      },
      {
        name: 'Vijay Kumar',
        phoneNumber: '+15550000003',
        pin: '333333',
        role: 'selfManagedCustomer',
        goal: 'generalFitness',
        focusArea: 'Strength',
        readinessNote: 'On program • increase load',
        progressPercent: 45,
        accentColor: '#38bdf8',
        planName: 'Strength Foundations',
        goalProgress: 58,
        goalQuote: 'Strength is built on patience.',
        caloriesRemaining: 910,
        macros: [
          {
            label: 'Carb',
            amount: '180g',
            remaining: '150g left',
            accentFrom: '#38bdf8',
            accentTo: '#2563eb',
          },
          {
            label: 'Protein',
            amount: '150g',
            remaining: '100g left',
            accentFrom: '#818cf8',
            accentTo: '#a855f7',
          },
          {
            label: 'Fat',
            amount: '60g',
            remaining: '120g left',
            accentFrom: '#fb7185',
            accentTo: '#f97316',
          },
        ],
        activitySeries: [
          { day: 'Mon', minutes: 50 },
          { day: 'Tue', minutes: 20 },
          { day: 'Wed', minutes: 55 },
          { day: 'Thu', minutes: 25 },
          { day: 'Fri', minutes: 65 },
          { day: 'Sat', minutes: 35 },
          { day: 'Sun', minutes: 30 },
        ],
        durationMinutes: 280,
        caloriesBurned: 2100,
        habits: [
          {
            label: 'Hydration',
            value: '2.4 L',
            helper: 'Goal 3.0 L',
            iconKey: 'hydration',
            accentColor: '#38bdf8',
          },
          {
            label: 'Sleep',
            value: '6h 50m',
            helper: 'Needs wind-down',
            iconKey: 'sleep',
            accentColor: '#a78bfa',
          },
        ],
        sunlightMinutes: 25,
        trainingPlan: {
          name: 'Strength Foundations',
          description: 'Linear progression with accessory posterior-chain work.',
          durationWeeks: 8,
          days: [
            {
              day: 'mon',
              exercises: [
                { exerciseName: 'Trap Bar Deadlift', sets: 4, reps: 6, weight: 245 },
                { exerciseName: 'Barbell Row', sets: 4, reps: 8, weight: 145 },
                { exerciseName: 'Core Rollout', sets: 3, reps: 12 },
              ],
            },
            {
              day: 'thu',
              exercises: [
                { exerciseName: 'Overhead Press', sets: 4, reps: 6, weight: 105 },
                { exerciseName: 'Bulgarian Split Squat', sets: 3, reps: 10, weight: 40 },
                { exerciseName: 'Farmer Carry', sets: 4, reps: 1, notes: '30 meters' },
              ],
            },
          ],
        },
        workoutLogs: [
          {
            startTime: iso('2024-10-01T12:00:00Z'),
            endTime: iso('2024-10-01T12:58:00Z'),
            status: 'completed',
            workoutType: 'strength',
            duration: 58,
            caloriesBurned: 520,
            exercises: [
              {
                createdAt: iso('2024-10-01T12:05:00Z'),
                exerciseName: 'Trap Bar Deadlift',
                sets: 4,
                reps: 6,
                weight: 245,
              },
              {
                createdAt: iso('2024-10-01T12:30:00Z'),
                exerciseName: 'Barbell Row',
                sets: 4,
                reps: 8,
                weight: 145,
              },
            ],
          },
          {
            startTime: iso('2024-10-04T12:00:00Z'),
            endTime: iso('2024-10-04T12:46:00Z'),
            status: 'completed',
            workoutType: 'strength',
            duration: 46,
            caloriesBurned: 430,
            exercises: [
              {
                createdAt: iso('2024-10-04T12:05:00Z'),
                exerciseName: 'Overhead Press',
                sets: 4,
                reps: 6,
                weight: 105,
              },
              {
                createdAt: iso('2024-10-04T12:30:00Z'),
                exerciseName: 'Farmer Carry',
                notes: '4 x 30m',
              },
            ],
          },
        ],
        dietLogs: [
          {
            createdAt: iso('2024-10-01T07:30:00Z'),
            mealType: 'breakfast',
            description: 'Paneer bhurji with millet toast',
            calories: 480,
          },
          {
            createdAt: iso('2024-10-01T18:30:00Z'),
            mealType: 'dinner',
            description: 'Lentil stew with roti and salad',
            calories: 620,
          },
        ],
        weightLogs: [
          { createdAt: iso('2024-09-27T07:30:00Z'), weight: 84.2 },
          { createdAt: iso('2024-10-05T07:30:00Z'), weight: 83.7 },
        ],
      },
    ]

    const exerciseNameSet = new Set<string>()
    for (const client of clientsSeed) {
      client.trainingPlan?.days.forEach(day => {
        day.exercises.forEach(exercise => exerciseNameSet.add(exercise.exerciseName))
      })
      client.workoutLogs?.forEach(log => {
        log.exercises.forEach(exercise => exerciseNameSet.add(exercise.exerciseName))
      })
    }

    const [trainer, admin] = await Promise.all([
      ensureUser(ctx, trainerSeed, now),
      ensureUser(ctx, adminSeed, now),
    ])

    const clientIds: Array<Id<'users'>> = []

    for (const clientSeed of clientsSeed) {
      const clientUser = await ensureUser(
        ctx,
        {
          name: clientSeed.name,
          phoneNumber: clientSeed.phoneNumber,
          pin: clientSeed.pin,
          role: clientSeed.role,
          goal: clientSeed.goal,
          trainerId: trainer._id,
        },
        now,
      )
      clientIds.push(clientUser._id)
      let trainingPlanId: Id<'trainingPlans'> | undefined
      if (clientSeed.trainingPlan) {
        trainingPlanId = await ensureTrainingPlan(
          ctx,
          trainer._id,
          clientSeed.trainingPlan,
        )
        await ctx.db.patch(clientUser._id, {
          trainingPlanId,
          updatedAt: Date.now(),
        })
      }
      await ensureUserMeta(ctx, clientUser._id, {
        focusArea: clientSeed.focusArea,
        readinessNote: clientSeed.readinessNote,
        progressPercent: clientSeed.progressPercent,
        accentColor: clientSeed.accentColor,
      })
      await ensureClientMetrics(ctx, clientUser._id, {
        planName: clientSeed.planName,
        goalProgress: clientSeed.goalProgress,
        goalQuote: clientSeed.goalQuote,
        caloriesRemaining: clientSeed.caloriesRemaining,
        macros: clientSeed.macros,
        activitySeries: clientSeed.activitySeries,
        durationMinutes: clientSeed.durationMinutes,
        caloriesBurned: clientSeed.caloriesBurned,
        habits: clientSeed.habits,
        sunlightMinutes: clientSeed.sunlightMinutes,
      })
      for (const workoutLog of clientSeed.workoutLogs) {
        const workoutLogId = await ensureWorkoutLog(
          ctx,
          clientUser._id,
          workoutLog,
        )
        await ensureWorkout(ctx, workoutLogId, workoutLog.exercises)
      }
      for (const dietLog of clientSeed.dietLogs) {
        await ensureDietLog(ctx, clientUser._id, dietLog)
      }
      for (const weightLog of clientSeed.weightLogs) {
        await ensureWeightLog(ctx, clientUser._id, weightLog)
      }
    }

    await ensureExerciseNames(ctx, Array.from(exerciseNameSet))

    await ensureTrainerMetrics(ctx, trainer._id, {
      overallProgress: 76,
      trendDelta: 12,
      clientsTotal: clientIds.length,
      microStats: [
        { label: 'Weekly Sessions', value: '18', helper: '+3 vs last week' },
        { label: 'Meal Compliance', value: '92%', helper: '↑ tighter tracking' },
        { label: 'Recovery Flags', value: '2', helper: 'Focus on sleep' },
      ],
      quickActions: [
        {
          label: 'Program Builder',
          description: 'Spin up a new mesocycle',
          iconKey: 'programBuilder',
        },
        {
          label: 'Session Check-ins',
          description: 'Record RPE + notes',
          iconKey: 'sessionCheckins',
        },
        {
          label: 'Call Client',
          description: 'Start concierge outreach',
          iconKey: 'callClient',
        },
      ],
      upcomingSessions: [
        {
          name: 'Maya Iyer',
          time: '18:00 — Strength',
          status: 'Needs warm-up tweak',
        },
        {
          name: 'Zaid Khan',
          time: '19:15 — Conditioning',
          status: 'Red day • Poor sleep',
        },
        {
          name: 'Saanvi Rao',
          time: '20:30 — Mobility',
          status: 'Green • Ready to progress',
        },
      ],
    })

    return {
      trainer: { id: trainer._id, phoneNumber: trainer.phoneNumber, pin: trainer.pin },
      admin: { id: admin._id, phoneNumber: admin.phoneNumber, pin: admin.pin },
      clients: clientIds,
    }
  },
})

async function ensureUser(ctx: Ctx, seed: SeedUser, now: number) {
  const existing = await ctx.db
    .query('users')
    .withIndex('by_phone', q => q.eq('phoneNumber', seed.phoneNumber))
    .unique()

  if (existing) {
    return existing
  }

  const _id = await ctx.db.insert('users', {
    name: seed.name,
    phoneNumber: seed.phoneNumber,
    email: undefined,
    pin: seed.pin,
    role: seed.role,
    goal: seed.goal,
    trainerId: seed.trainerId,
    trainingPlanId: undefined,
    createdAt: now,
    updatedAt: now,
  })

  const created = await ctx.db.get(_id)
  if (!created) {
    throw new Error('Failed to create user seed')
  }
  return created
}

async function ensureUserMeta(ctx: Ctx, userId: Id<'users'>, seed: MetaSeed) {
  const existing = await ctx.db
    .query('userMeta')
    .withIndex('by_user', q => q.eq('userId', userId))
    .unique()

  if (existing) {
    await ctx.db.patch(existing._id, {
      focusArea: seed.focusArea,
      readinessNote: seed.readinessNote,
      progressPercent: seed.progressPercent,
      accentColor: seed.accentColor,
      updatedAt: Date.now(),
    })
    return
  }

  await ctx.db.insert('userMeta', {
    userId,
    age: undefined,
    address: undefined,
    gender: undefined,
    height: undefined,
    focusArea: seed.focusArea,
    readinessNote: seed.readinessNote,
    progressPercent: seed.progressPercent,
    accentColor: seed.accentColor,
    emergencyContactName: undefined,
    emergencyContactPhone: undefined,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })
}

async function ensureClientMetrics(
  ctx: Ctx,
  userId: Id<'users'>,
  seed: ClientMetricsSeed,
) {
  const existing = await ctx.db
    .query('clientMetrics')
    .withIndex('by_user', q => q.eq('userId', userId))
    .unique()

  const payload = {
    userId,
    planName: seed.planName,
    goalProgress: seed.goalProgress,
    goalQuote: seed.goalQuote,
    caloriesRemaining: seed.caloriesRemaining,
    macros: seed.macros,
    activitySeries: seed.activitySeries,
    durationMinutes: seed.durationMinutes,
    caloriesBurned: seed.caloriesBurned,
    habits: seed.habits,
    sunlightMinutes: seed.sunlightMinutes,
    updatedAt: Date.now(),
  }

  if (existing) {
    await ctx.db.patch(existing._id, payload)
    return
  }

  await ctx.db.insert('clientMetrics', {
    ...payload,
    createdAt: Date.now(),
  })
}

async function ensureTrainerMetrics(
  ctx: Ctx,
  trainerId: Id<'users'>,
  seed: TrainerMetricsSeed,
) {
  const existing = await ctx.db
    .query('trainerMetrics')
    .withIndex('by_trainer', q => q.eq('trainerId', trainerId))
    .unique()

  const payload = {
    trainerId,
    overallProgress: seed.overallProgress,
    trendDelta: seed.trendDelta,
    clientsTotal: seed.clientsTotal,
    microStats: seed.microStats,
    quickActions: seed.quickActions,
    upcomingSessions: seed.upcomingSessions,
    updatedAt: Date.now(),
  }

  if (existing) {
    await ctx.db.patch(existing._id, payload)
    return
  }

  await ctx.db.insert('trainerMetrics', {
    ...payload,
    createdAt: Date.now(),
  })
}

async function ensureTrainingPlan(
  ctx: Ctx,
  trainerId: Id<'users'>,
  seed: TrainingPlanSeed,
): Promise<Id<'trainingPlans'>> {
  const plans = await ctx.db
    .query('trainingPlans')
    .withIndex('by_creator', q => q.eq('createdBy', trainerId))
    .collect()

  const existing = plans.find(plan => plan.name === seed.name)

  const payload = {
    name: seed.name,
    description: seed.description,
    durationWeeks: seed.durationWeeks,
    days: seed.days,
    createdBy: trainerId,
    updatedAt: Date.now(),
  }

  if (existing) {
    await ctx.db.patch(existing._id, payload)
    return existing._id
  }

  return ctx.db.insert('trainingPlans', {
    ...payload,
    createdAt: Date.now(),
  })
}

async function ensureWorkoutLog(
  ctx: Ctx,
  userId: Id<'users'>,
  seed: WorkoutLogSeed,
): Promise<Id<'workoutLogs'>> {
  const logs = await ctx.db
    .query('workoutLogs')
    .withIndex('by_user', q => q.eq('userId', userId))
    .collect()

  const existing = logs.find(log => log.startTime === seed.startTime)

  const payload = {
    userId,
    startTime: seed.startTime,
    endTime: seed.endTime,
    status: seed.status,
    workoutType: seed.workoutType,
    duration: seed.duration,
    caloriesBurned: seed.caloriesBurned,
    updatedAt: Date.now(),
  }

  if (existing) {
    await ctx.db.patch(existing._id, payload)
    return existing._id
  }

  const _id = await ctx.db.insert('workoutLogs', {
    ...payload,
    createdAt: seed.startTime,
  })
  return _id
}

async function ensureWorkout(
  ctx: Ctx,
  workoutLogId: Id<'workoutLogs'>,
  exercises: WorkoutExerciseSeed[],
) {
  if (!exercises.length) {
    return
  }

  const existing = await ctx.db
    .query('workouts')
    .withIndex('by_workout_log', q => q.eq('workoutLogId', workoutLogId))
    .unique()

  const payload = {
    workoutLogId,
    exercises,
    updatedAt: Date.now(),
  }

  if (existing) {
    await ctx.db.patch(existing._id, payload)
    return
  }

  await ctx.db.insert('workouts', {
    ...payload,
    createdAt: Date.now(),
  })
}

async function ensureDietLog(
  ctx: Ctx,
  userId: Id<'users'>,
  seed: DietLogSeed,
) {
  const logs = await ctx.db
    .query('dietLogs')
    .withIndex('by_user', q => q.eq('userId', userId))
    .collect()

  const existing = logs.find(log => log.createdAt === seed.createdAt)

  const payload = {
    userId,
    createdAt: seed.createdAt,
    mealType: seed.mealType,
    description: seed.description,
    calories: seed.calories,
  }

  if (existing) {
    await ctx.db.patch(existing._id, payload)
    return
  }

  await ctx.db.insert('dietLogs', payload)
}

async function ensureWeightLog(
  ctx: Ctx,
  userId: Id<'users'>,
  seed: WeightLogSeed,
) {
  const logs = await ctx.db
    .query('weightLogs')
    .withIndex('by_user', q => q.eq('userId', userId))
    .collect()

  const existing = logs.find(log => log.createdAt === seed.createdAt)

  const payload = {
    userId,
    createdAt: seed.createdAt,
    weight: seed.weight,
  }

  if (existing) {
    await ctx.db.patch(existing._id, payload)
    return
  }

  await ctx.db.insert('weightLogs', payload)
}

async function ensureExerciseNames(ctx: Ctx, exerciseNames: string[]) {
  for (const name of exerciseNames) {
    const existing = await ctx.db
      .query('exerciseNames')
      .withIndex('by_name', q => q.eq('name', name))
      .unique()

    if (!existing) {
      await ctx.db.insert('exerciseNames', { name })
    }
  }
}
