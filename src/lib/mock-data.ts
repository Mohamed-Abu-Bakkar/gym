// Mock data for the fitness app

export interface Exercise {
  name: string
  sets: number
  reps: number
  weight: number
  notes?: string
}

export interface WorkoutDay {
  day: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
  name: string
  exercises: Exercise[]
  duration: number // in minutes
  caloriesBurned: number
}

export interface TrainingPlan {
  id: string
  name: string
  description: string
  weeks: WorkoutDay[]
}

export const TRAINING_PLAN: TrainingPlan = {
  id: '1',
  name: '6-Week Strength Training',
  description: 'Beginner to intermediate strength training program',
  weeks: [
    {
      day: 'mon',
      name: 'Leg Day 1',
      duration: 60,
      caloriesBurned: 350,
      exercises: [
        {
          name: 'Squats',
          sets: 4,
          reps: 10,
          weight: 135,
          notes: 'Warm up properly',
        },
        { name: 'Leg Press', sets: 3, reps: 12, weight: 200 },
        { name: 'Lunges', sets: 3, reps: 10, weight: 30 },
        { name: 'Leg Curls', sets: 3, reps: 12, weight: 70 },
        { name: 'Calf Raises', sets: 4, reps: 15, weight: 100 },
      ],
    },
    {
      day: 'tue',
      name: 'Rest Day',
      duration: 0,
      caloriesBurned: 0,
      exercises: [],
    },
    {
      day: 'wed',
      name: 'Chest & Triceps',
      duration: 55,
      caloriesBurned: 320,
      exercises: [
        {
          name: 'Bench Press',
          sets: 4,
          reps: 10,
          weight: 155,
          notes: 'Focus on form',
        },
        { name: 'Incline Dumbbell Press', sets: 3, reps: 12, weight: 50 },
        { name: 'Chest Flyes', sets: 3, reps: 12, weight: 30 },
        {
          name: 'Tricep Dips',
          sets: 3,
          reps: 10,
          weight: 0,
          notes: 'Bodyweight',
        },
        { name: 'Tricep Pushdowns', sets: 3, reps: 12, weight: 50 },
      ],
    },
    {
      day: 'thu',
      name: 'Back & Biceps',
      duration: 60,
      caloriesBurned: 340,
      exercises: [
        {
          name: 'Deadlifts',
          sets: 4,
          reps: 8,
          weight: 185,
          notes: 'Keep back straight',
        },
        {
          name: 'Pull-ups',
          sets: 3,
          reps: 8,
          weight: 0,
          notes: 'Assisted if needed',
        },
        { name: 'Barbell Rows', sets: 3, reps: 10, weight: 115 },
        { name: 'Lat Pulldowns', sets: 3, reps: 12, weight: 120 },
        { name: 'Bicep Curls', sets: 3, reps: 12, weight: 35 },
        { name: 'Hammer Curls', sets: 3, reps: 12, weight: 30 },
      ],
    },
    {
      day: 'fri',
      name: 'Shoulder Day 1',
      duration: 50,
      caloriesBurned: 300,
      exercises: [
        { name: 'Overhead Press', sets: 4, reps: 10, weight: 95 },
        { name: 'Lateral Raises', sets: 3, reps: 15, weight: 20 },
        { name: 'Front Raises', sets: 3, reps: 15, weight: 20 },
        { name: 'Rear Delt Flyes', sets: 3, reps: 15, weight: 15 },
        { name: 'Shrugs', sets: 3, reps: 15, weight: 60 },
      ],
    },
    {
      day: 'sat',
      name: 'Leg Day 2',
      duration: 55,
      caloriesBurned: 360,
      exercises: [
        { name: 'Romanian Deadlifts', sets: 4, reps: 10, weight: 135 },
        { name: 'Bulgarian Split Squats', sets: 3, reps: 10, weight: 40 },
        { name: 'Leg Extensions', sets: 3, reps: 12, weight: 90 },
        { name: 'Seated Leg Curls', sets: 3, reps: 12, weight: 80 },
        { name: 'Hip Thrusts', sets: 3, reps: 12, weight: 155 },
      ],
    },
    {
      day: 'sun',
      name: 'Active Recovery',
      duration: 30,
      caloriesBurned: 150,
      exercises: [
        {
          name: 'Light Cardio',
          sets: 1,
          reps: 30,
          weight: 0,
          notes: '30 min walk or bike',
        },
        {
          name: 'Stretching',
          sets: 1,
          reps: 15,
          weight: 0,
          notes: 'Full body stretch',
        },
      ],
    },
  ],
}

export interface WorkoutLog {
  id: string
  startTime: Date
  endTime: Date | null
  status: 'ongoing' | 'completed' | 'cancelled'
  workoutType: 'cardio' | 'strength' | 'flexibility' | 'balance'
  duration: number
  caloriesBurned: number
}

export interface DietLog {
  id: string
  createdAt: Date
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  description: string
  calories: number
}

export interface WeightLog {
  id: string
  createdAt: Date
  weight: number
}

// Mock workout logs
export const MOCK_WORKOUT_LOGS: WorkoutLog[] = [
  {
    id: '1',
    startTime: new Date(2026, 0, 27, 9, 0),
    endTime: new Date(2026, 0, 27, 10, 0),
    status: 'completed',
    workoutType: 'strength',
    duration: 60,
    caloriesBurned: 350,
  },
  {
    id: '2',
    startTime: new Date(2026, 0, 25, 10, 0),
    endTime: new Date(2026, 0, 25, 11, 0),
    status: 'completed',
    workoutType: 'strength',
    duration: 60,
    caloriesBurned: 340,
  },
  {
    id: '3',
    startTime: new Date(2026, 0, 24, 8, 0),
    endTime: new Date(2026, 0, 24, 9, 0),
    status: 'completed',
    workoutType: 'strength',
    duration: 55,
    caloriesBurned: 320,
  },
  {
    id: '4',
    startTime: new Date(2026, 0, 22, 9, 0),
    endTime: new Date(2026, 0, 22, 10, 0),
    status: 'completed',
    workoutType: 'strength',
    duration: 60,
    caloriesBurned: 350,
  },
  {
    id: '5',
    startTime: new Date(2026, 0, 21, 7, 0),
    endTime: new Date(2026, 0, 21, 7, 30),
    status: 'completed',
    workoutType: 'cardio',
    duration: 30,
    caloriesBurned: 200,
  },
]

// Mock diet logs
export const MOCK_DIET_LOGS: DietLog[] = [
  {
    id: '1',
    createdAt: new Date(2026, 0, 28, 8, 0),
    mealType: 'breakfast',
    description: 'Oatmeal with berries and protein shake',
    calories: 450,
  },
  {
    id: '2',
    createdAt: new Date(2026, 0, 28, 12, 30),
    mealType: 'lunch',
    description: 'Grilled chicken salad with quinoa',
    calories: 550,
  },
  {
    id: '3',
    createdAt: new Date(2026, 0, 28, 15, 0),
    mealType: 'snack',
    description: 'Apple and almond butter',
    calories: 200,
  },
  {
    id: '4',
    createdAt: new Date(2026, 0, 27, 8, 30),
    mealType: 'breakfast',
    description: 'Eggs, toast, and avocado',
    calories: 500,
  },
  {
    id: '5',
    createdAt: new Date(2026, 0, 27, 13, 0),
    mealType: 'lunch',
    description: 'Turkey wrap with vegetables',
    calories: 480,
  },
  {
    id: '6',
    createdAt: new Date(2026, 0, 27, 19, 0),
    mealType: 'dinner',
    description: 'Salmon with roasted vegetables',
    calories: 650,
  },
]

// Mock weight logs
export const MOCK_WEIGHT_LOGS: WeightLog[] = [
  { id: '1', createdAt: new Date(2026, 0, 28), weight: 180.5 },
  { id: '2', createdAt: new Date(2026, 0, 21), weight: 181.2 },
  { id: '3', createdAt: new Date(2026, 0, 14), weight: 182.0 },
  { id: '4', createdAt: new Date(2026, 0, 7), weight: 182.8 },
  { id: '5', createdAt: new Date(2025, 11, 31), weight: 183.5 },
  { id: '6', createdAt: new Date(2025, 11, 24), weight: 184.0 },
]

// Today's stats (for dashboard)
export const TODAY_STATS = {
  caloriesBurned: 350,
  workoutTime: 60,
  goals: {
    calories: { current: 350, target: 500 },
    workoutTime: { current: 60, target: 90 },
    steps: { current: 8500, target: 10000 },
  },
}

export type TrainerQuickActionKey =
  | 'programBuilder'
  | 'sessionCheckins'
  | 'callClient'
  | 'readinessReview'

export interface TrainerQuickAction {
  id: string
  label: string
  description: string
  iconKey: TrainerQuickActionKey
}

export interface TrainerClientCard {
  id: string
  name: string
  focus: string
  status: string
  progress: number
  readiness: string
  accentColor: string
}

export interface TrainerSessionSlot {
  id: string
  time: string
  name: string
  status: string
}

export interface TrainerOperationsNote {
  id: string
  title: string
  description: string
  status: 'Queued' | 'In progress' | 'Blocked'
}

export interface TrainerClientPerformanceMetric {
  label: string
  value: string
  helper: string
}

export interface TrainerReadinessBreakdown {
  label: string
  current: number
  target: number
}

export interface TrainerClientRecentWorkout {
  id: string
  title: string
  date: string
  focus: string
  load: string
  readiness: string
}

export interface TrainerClientNutritionEntry {
  id: string
  time: string
  mealType: string
  description: string
  calories: number
}

export interface TrainerClientActionItem {
  id: string
  label: string
  status: 'Queued' | 'In progress' | 'Blocked'
  description: string
}

export interface TrainerClientDetail {
  id: string
  name: string
  focus: string
  readiness: string
  compliance: number
  trend: string
  plan: string
  metrics: TrainerClientPerformanceMetric[]
  readinessBreakdown: TrainerReadinessBreakdown[]
  recentWorkouts: TrainerClientRecentWorkout[]
  nutritionLog: TrainerClientNutritionEntry[]
  actionItems: TrainerClientActionItem[]
}

export interface TrainerProgramSummary {
  id: string
  name: string
  focus: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  durationWeeks: number
  status: 'In review' | 'Live' | 'Draft'
  athletesAssigned: number
}

export interface TrainerProgramBlock {
  week: number
  title: string
  focus: string
  keySessions: string[]
  readinessCue: string
}

export interface TrainerProgramResource {
  id: string
  label: string
  type: 'Video' | 'PDF' | 'Note'
  url: string
}

export interface TrainerProgramDailyWorkout {
  dayLabel: string
  theme: string
  focus: string
  durationMinutes: number
  intensity: 'Low' | 'Medium' | 'High'
  keyWork: string[]
  readinessCue: string
  nutritionCue: string
}

export interface TrainerProgramDietMeal {
  title: string
  description: string
  calories: number
}

export interface TrainerProgramDietDay {
  dayLabel: string
  emphasis: string
  meals: TrainerProgramDietMeal[]
  hydration: string
  notes?: string
}

export interface TrainerProgramDetail {
  id: string
  headline: string
  overview: string
  goal: string
  progressionNotes: string
  blocks: TrainerProgramBlock[]
  resources: TrainerProgramResource[]
  dailyWorkouts: TrainerProgramDailyWorkout[]
  dietPlan: TrainerProgramDietDay[]
}

export interface TrainerDashboardData {
  summary: {
    readinessScore: number
    loadDelta: string
    focusArea: string
    clientsTotal: number
    checkInsDue: number
  }
  metrics: Array<{ label: string; value: string; helper: string }>
  clients: Record<'active' | 'flagged', TrainerClientCard[]>
  quickActions: TrainerQuickAction[]
  sessions: TrainerSessionSlot[]
  opsBoard: TrainerOperationsNote[]
}

export const TRAINER_DASHBOARD_MOCK: TrainerDashboardData = {
  summary: {
    readinessScore: 82,
    loadDelta: '+8% weekly load',
    focusArea: 'Strength and midline control',
    clientsTotal: 18,
    checkInsDue: 6,
  },
  metrics: [
    { label: 'Check-ins cleared', value: '12 / 18', helper: '6 due today' },
    { label: 'Programs updated', value: '4', helper: 'Last 24 hours' },
    { label: 'Hybrid sessions', value: '5', helper: 'Next 12 hours' },
    { label: 'Readiness alerts', value: '3', helper: 'Needs review' },
  ],
  clients: {
    active: [
      {
        id: 'client-1',
        name: 'Noah Patel',
        focus: 'Power + sprint work',
        status: 'Block 3 • Week 2',
        progress: 72,
        readiness: 'Green',
        accentColor: '#bef264',
      },
      {
        id: 'client-2',
        name: 'Amelia Trent',
        focus: 'Hybrid marathon prep',
        status: 'Deload scheduled',
        progress: 64,
        readiness: 'Amber',
        accentColor: '#fde047',
      },
      {
        id: 'client-3',
        name: 'Leo Morales',
        focus: 'Strength / hypertrophy',
        status: 'Needs nutrition touchpoint',
        progress: 58,
        readiness: 'Green',
        accentColor: '#c4b5fd',
      },
    ],
    flagged: [
      {
        id: 'client-4',
        name: 'Riley Park',
        focus: 'Return to play',
        status: 'Acute load spike',
        progress: 41,
        readiness: 'Red',
        accentColor: '#fca5a5',
      },
      {
        id: 'client-5',
        name: 'Isla Bennett',
        focus: 'Hybrid endurance',
        status: 'HRV trending down',
        progress: 47,
        readiness: 'Amber',
        accentColor: '#fde047',
      },
    ],
  },
  quickActions: [
    {
      id: 'qa-1',
      label: 'Program builder',
      description: 'Refresh micro cycle templates',
      iconKey: 'programBuilder',
    },
    {
      id: 'qa-2',
      label: 'Session check-ins',
      description: 'Clear today first',
      iconKey: 'sessionCheckins',
    },
    {
      id: 'qa-3',
      label: 'Call a client',
      description: 'High priority outreach',
      iconKey: 'callClient',
    },
    {
      id: 'qa-4',
      label: 'Readiness review',
      description: 'Review alerts and notes',
      iconKey: 'readinessReview',
    },
  ],
  sessions: [
    { id: 'session-1', time: '05:45', name: 'Mia | Hybrid', status: 'In gym' },
    {
      id: 'session-2',
      time: '07:30',
      name: 'Jackson | Remote',
      status: 'Awaiting video',
    },
    { id: 'session-3', time: '12:15', name: 'Sofia | Strength', status: 'Confirmed' },
    { id: 'session-4', time: '17:00', name: 'Ezra | Conditioning', status: 'Tentative' },
  ],
  opsBoard: [
    {
      id: 'op-1',
      title: 'Readiness alerts',
      description: '3 clients trending down for recovery markers.',
      status: 'In progress',
    },
    {
      id: 'op-2',
      title: 'Program refresh',
      description: 'Block updates needed before Thu.',
      status: 'Queued',
    },
    {
      id: 'op-3',
      title: 'Coach notes',
      description: 'Two feedback loops waiting on video review.',
      status: 'Blocked',
    },
  ],
}

export const TRAINER_CLIENT_DETAILS_MOCK: Record<string, TrainerClientDetail> = {
  'client-1': {
    id: 'client-1',
    name: 'Noah Patel',
    focus: 'Power + sprint work',
    readiness: 'Green',
    compliance: 92,
    trend: '+4% week-over-week',
    plan: 'Block 3 • Week 2',
    metrics: [
      { label: 'Average load', value: '8,450 lb', helper: 'Last 7 sessions' },
      { label: 'Session RPE', value: '7.2', helper: 'Moderate intensity' },
      { label: 'Sleep avg', value: '7h 45m', helper: 'Trending up' },
      { label: 'Nutrition compliance', value: '94%', helper: 'Macros on target' },
    ],
    readinessBreakdown: [
      { label: 'Load', current: 78, target: 80 },
      { label: 'Recovery', current: 84, target: 88 },
      { label: 'Mindset', current: 76, target: 80 },
    ],
    recentWorkouts: [
      {
        id: 'nw1',
        title: 'Acceleration clusters',
        date: 'Tue · 06:30',
        focus: 'Track sprint work',
        load: 'High CNS',
        readiness: 'Green',
      },
      {
        id: 'nw2',
        title: 'Strength density',
        date: 'Sun · 09:00',
        focus: 'Lower-body',
        load: 'Moderate',
        readiness: 'Green',
      },
      {
        id: 'nw3',
        title: 'Assault bike intervals',
        date: 'Fri · 07:15',
        focus: 'Conditioning',
        load: 'Low',
        readiness: 'Amber',
      },
    ],
    nutritionLog: [
      {
        id: 'nn1',
        time: '08:00',
        mealType: 'Breakfast',
        description: 'Protein oats + berries',
        calories: 480,
      },
      {
        id: 'nn2',
        time: '13:00',
        mealType: 'Lunch',
        description: 'Turkey quinoa bowl',
        calories: 620,
      },
      {
        id: 'nn3',
        time: '19:30',
        mealType: 'Dinner',
        description: 'Salmon, rice, greens',
        calories: 710,
      },
    ],
    actionItems: [
      {
        id: 'na1',
        label: 'Upload sprint footage',
        status: 'In progress',
        description: 'Share slow-mo clips for technical review.',
      },
      {
        id: 'na2',
        label: 'Nutrition check-in',
        status: 'Queued',
        description: 'Review new macro targets on Thu.',
      },
    ],
  },
  'client-2': {
    id: 'client-2',
    name: 'Amelia Trent',
    focus: 'Hybrid marathon prep',
    readiness: 'Amber',
    compliance: 86,
    trend: '-2% week-over-week',
    plan: 'Deload scheduled',
    metrics: [
      { label: 'Long-run pace', value: '5:05 /km', helper: 'Goal 4:55 /km' },
      { label: 'VO₂ max', value: '51 ml/kg/min', helper: 'Hold through deload' },
      { label: 'HRV avg', value: '68 ms', helper: 'Down 5% this week' },
      { label: 'Strength touchpoints', value: '2', helper: 'Need 3 minimum' },
    ],
    readinessBreakdown: [
      { label: 'Load', current: 64, target: 75 },
      { label: 'Recovery', current: 70, target: 80 },
      { label: 'Mindset', current: 82, target: 85 },
    ],
    recentWorkouts: [
      {
        id: 'aw1',
        title: 'Tempo + hills',
        date: 'Mon · 05:45',
        focus: 'Run economy',
        load: 'High',
        readiness: 'Amber',
      },
      {
        id: 'aw2',
        title: 'Joint prep circuit',
        date: 'Sat · 08:15',
        focus: 'Strength support',
        load: 'Low',
        readiness: 'Green',
      },
    ],
    nutritionLog: [
      {
        id: 'an1',
        time: '07:30',
        mealType: 'Breakfast',
        description: 'Bagel + egg whites',
        calories: 520,
      },
      {
        id: 'an2',
        time: '12:15',
        mealType: 'Lunch',
        description: 'Chicken wrap, greens',
        calories: 610,
      },
      {
        id: 'an3',
        time: '21:00',
        mealType: 'Snack',
        description: 'Casein shake',
        calories: 230,
      },
    ],
    actionItems: [
      {
        id: 'aa1',
        label: 'Schedule deload call',
        status: 'Queued',
        description: 'Align on next block adjustments.',
      },
      {
        id: 'aa2',
        label: 'Upload HRV screenshots',
        status: 'Blocked',
        description: 'Waiting for morning readings.',
      },
    ],
  },
  'client-3': {
    id: 'client-3',
    name: 'Leo Morales',
    focus: 'Strength / hypertrophy',
    readiness: 'Green',
    compliance: 89,
    trend: '+1% week-over-week',
    plan: 'Push/pull split',
    metrics: [
      { label: 'Volume PRs', value: '3', helper: 'Hit this week' },
      { label: 'Avg. tonnage', value: '32k lb', helper: 'Up 6%' },
      { label: 'Sleep avg', value: '7h 10m', helper: 'Stable' },
      { label: 'Energy check-ins', value: 'Green', helper: 'No red flags' },
    ],
    readinessBreakdown: [
      { label: 'Load', current: 81, target: 82 },
      { label: 'Recovery', current: 79, target: 83 },
      { label: 'Mindset', current: 74, target: 78 },
    ],
    recentWorkouts: [
      {
        id: 'lw1',
        title: 'Upper push volume',
        date: 'Tue · 18:00',
        focus: 'Chest + triceps',
        load: 'Moderate',
        readiness: 'Green',
      },
      {
        id: 'lw2',
        title: 'Lower strength wave',
        date: 'Sun · 10:00',
        focus: 'Squat + hinge',
        load: 'High',
        readiness: 'Green',
      },
      {
        id: 'lw3',
        title: 'Conditioning finisher',
        date: 'Fri · 17:30',
        focus: 'Bike sprints',
        load: 'Low',
        readiness: 'Green',
      },
    ],
    nutritionLog: [
      {
        id: 'ln1',
        time: '09:00',
        mealType: 'Breakfast',
        description: 'Egg scramble + rice',
        calories: 650,
      },
      {
        id: 'ln2',
        time: '14:00',
        mealType: 'Lunch',
        description: 'Steak bowl',
        calories: 780,
      },
      {
        id: 'ln3',
        time: '22:00',
        mealType: 'Snack',
        description: 'Greek yogurt + honey',
        calories: 320,
      },
    ],
    actionItems: [
      {
        id: 'la1',
        label: 'Film squat top set',
        status: 'Queued',
        description: 'Need angle check before adding load.',
      },
      {
        id: 'la2',
        label: 'Update macro targets',
        status: 'In progress',
        description: 'Adjust carbs on heavy days.',
      },
    ],
  },
}

export const TRAINER_PROGRAMS_MOCK: TrainerProgramSummary[] = [
  {
    id: 'program-accel',
    name: 'Acceleration Builder',
    focus: 'Speed + sprint mechanics',
    level: 'Intermediate',
    durationWeeks: 6,
    status: 'Live',
    athletesAssigned: 8,
  },
  {
    id: 'program-hybrid',
    name: 'Hybrid Marathon Prep',
    focus: 'Endurance + strength support',
    level: 'Advanced',
    durationWeeks: 10,
    status: 'In review',
    athletesAssigned: 4,
  },
  {
    id: 'program-foundation',
    name: 'Foundations Reloaded',
    focus: 'General strength + mobility',
    level: 'Beginner',
    durationWeeks: 4,
    status: 'Draft',
    athletesAssigned: 0,
  },
]

export const TRAINER_PROGRAM_DETAILS_MOCK: Record<string, TrainerProgramDetail> = {
  'program-accel': {
    id: 'program-accel',
    headline: 'Power development with staged deloads',
    overview:
      'Six-week block alternating max-velocity exposures with extensive plyometric support. Built for field sport athletes needing better first step power.',
    goal: 'Improve 10m split by 4% while holding CSA volume.',
    progressionNotes:
      'Weeks 1-2 emphasize bracing and upright mechanics, weeks 3-4 add resisted sprints, weeks 5-6 progress to fly 20s.',
    blocks: [
      {
        week: 1,
        title: 'Posture reset',
        focus: 'Ankling + wall drills',
        keySessions: ['A-series drills', 'Tempo accelerations', 'Contrast lifts'],
        readinessCue: 'Monitor shin angle consistency.',
      },
      {
        week: 3,
        title: 'Resisted speed',
        focus: 'Load + spring return',
        keySessions: ['Sled marches', 'Band-resisted sprints', 'Olympic lift triples'],
        readinessCue: 'Cap RPE at 7 to avoid CNS fatigue.',
      },
      {
        week: 5,
        title: 'Fly exposure',
        focus: 'Transition to max-velocity',
        keySessions: ['Fly 20s', 'Acceleration clusters', 'Contrast plyos'],
        readinessCue: 'Pull back volume if HRV dips >10%.',
      },
    ],
    resources: [
      {
        id: 'res-vid-1',
        label: 'Acceleration cueing video',
        type: 'Video',
        url: '#',
      },
      {
        id: 'res-pdf-1',
        label: 'Session template (PDF)',
        type: 'PDF',
        url: '#',
      },
      {
        id: 'res-note-1',
        label: 'Coaching notes',
        type: 'Note',
        url: '#',
      },
    ],
    dailyWorkouts: [
      {
        dayLabel: 'Mon',
        theme: 'Acceleration launch',
        focus: 'Ankling + wall drills',
        durationMinutes: 55,
        intensity: 'High',
        keyWork: [
          'A-series priming - 3x20m',
          'Wall drill ISO holds - 3x20s',
          'Sled push accelerations - 6x15m',
        ],
        readinessCue: 'Shin angles stacked; cap RPE at 7.',
        nutritionCue:
          '60 g carbs pre-session plus whey shake within 30 minutes.',
      },
      {
        dayLabel: 'Tue',
        theme: 'Elastic plyos',
        focus: 'Landing stiffness',
        durationMinutes: 45,
        intensity: 'Medium',
        keyWork: [
          'Pogo ladder - 4x15 contacts',
          'Lateral bound to stick - 4x6 each side',
          'Rotary core anti-rotation - 3x10',
        ],
        readinessCue: 'Stop if landing quality drops.',
        nutritionCue: 'Add citrus and collagen to the recovery shake.',
      },
      {
        dayLabel: 'Wed',
        theme: 'Contrast lifts',
        focus: 'Strength density',
        durationMinutes: 60,
        intensity: 'High',
        keyWork: [
          'Trap bar deadlift - 5x3 @ 75%',
          'Split squat contrast - 4x4 per leg',
          'Bike sprint finisher - 6x15s',
        ],
        readinessCue: 'Track bar speed and avoid grinders.',
        nutritionCue: 'Carb up the night before and sip electrolytes.',
      },
      {
        dayLabel: 'Thu',
        theme: 'Tempo strides',
        focus: 'Aerobic support',
        durationMinutes: 35,
        intensity: 'Low',
        keyWork: [
          'Tempo stride repeats - 8x80m',
          'Mobility blend - 10 minutes',
          'Breath ladders - 3 rounds',
        ],
        readinessCue: 'Keep HR in Zone 2 and nasal breathe.',
        nutritionCue: 'Emphasize greens and hydration throughout the day.',
      },
      {
        dayLabel: 'Fri',
        theme: 'Fly runs',
        focus: 'Max velocity',
        durationMinutes: 50,
        intensity: 'High',
        keyWork: [
          'Fly 20 build ups - 6 reps',
          'Assisted wicket runs - 4 passes',
          'Contrast plyos - 3 combos',
        ],
        readinessCue: 'Pull volume if HRV dips or RPE exceeds 8.',
        nutritionCue: 'Fast carbs 30 minutes prior and double hydration.',
      },
      {
        dayLabel: 'Sat',
        theme: 'Strength support',
        focus: 'Hinge + core',
        durationMinutes: 55,
        intensity: 'Medium',
        keyWork: [
          'Romanian deadlift - 4x6',
          'Chin up clusters - 5x3',
          'Anti-extension core ladder - 4 sets',
        ],
        readinessCue: 'Keep tempo controlled and avoid lumbar crank.',
        nutritionCue: 'Balanced macros with extra protein at dinner.',
      },
      {
        dayLabel: 'Sun',
        theme: 'Active recovery',
        focus: 'Mobility + flush',
        durationMinutes: 30,
        intensity: 'Low',
        keyWork: [
          'Easy bike spin - 20 minutes',
          'Full body mobility map - 15 drills',
          'Guided breath work - 10 minutes',
        ],
        readinessCue: 'Use RPE 3 or less; finish feeling better.',
        nutritionCue: 'Increase micronutrients and keep sodium steady.',
      },
    ],
    dietPlan: [
      {
        dayLabel: 'Mon',
        emphasis: 'High output sprint fueling',
        meals: [
          {
            title: 'Breakfast',
            description: 'Protein oats, berries, honey, whey scoop',
            calories: 560,
          },
          {
            title: 'Lunch',
            description: 'Rice bowl with steak, greens, avocado',
            calories: 720,
          },
          {
            title: 'Dinner',
            description: 'Salmon, sweet potato, roasted veg',
            calories: 680,
          },
        ],
        hydration: '3.5 L water plus electrolyte packet during session',
        notes: 'Add 40 g fast carbs 45 minutes before speed work.',
      },
      {
        dayLabel: 'Tues',
        emphasis: 'Tissue repair focus',
        meals: [
          {
            title: 'Breakfast',
            description: 'Egg scramble, sourdough, citrus',
            calories: 520,
          },
          {
            title: 'Lunch',
            description: 'Quinoa salad with chicken and olive oil',
            calories: 640,
          },
          {
            title: 'Dinner',
            description: 'Turkey meatballs, pasta, tomato sauce',
            calories: 690,
          },
        ],
        hydration: '3 L water, add collagen to evening tea',
      },
      {
        dayLabel: 'wed',
        emphasis: 'Heavy lift support',
        meals: [
          {
            title: 'Breakfast',
            description: 'Greek yogurt, granola, banana',
            calories: 600,
          },
          {
            title: 'Lunch',
            description: 'Bison burger, baked fries, greens',
            calories: 780,
          },
          {
            title: 'Dinner',
            description: 'Rice, chicken thighs, broccoli',
            calories: 700,
          },
        ],
        hydration: '3.2 L water plus creatine in shake',
        notes: 'Sodium load the night prior for better neural output.',
      },
      {
        dayLabel: 'Thu',
        emphasis: 'Recovery micro day',
        meals: [
          {
            title: 'Breakfast',
            description: 'Overnight oats with chia and kiwi',
            calories: 480,
          },
          {
            title: 'Lunch',
            description: 'Lentil soup, sourdough, salad',
            calories: 540,
          },
          {
            title: 'Dinner',
            description: 'Seared cod, jasmine rice, veggies',
            calories: 620,
          },
        ],
        hydration: '3 L water plus herbal tea in evening',
        notes: 'Aim for extra micronutrients and collagen.',
      },
      {
        dayLabel: 'Fri',
        emphasis: 'Max velocity readiness',
        meals: [
          {
            title: 'Breakfast',
            description: 'Bagel, peanut butter, banana, whey',
            calories: 650,
          },
          {
            title: 'Lunch',
            description: 'Pasta with lean beef and pesto',
            calories: 760,
          },
          {
            title: 'Dinner',
            description: 'Stir fry with rice noodles and shrimp',
            calories: 700,
          },
        ],
        hydration: '4 L water, electrolytes before and after session',
        notes: 'Caffeine 90 minutes out; cut fiber pre-session.',
      },
      {
        dayLabel: 'Saturday',
        emphasis: 'Strength support day',
        meals: [
          {
            title: 'Breakfast',
            description: 'Omelet, potatoes, fruit',
            calories: 610,
          },
          {
            title: 'Lunch',
            description: 'Chicken burrito bowl',
            calories: 680,
          },
          {
            title: 'Dinner',
            description: 'Beef stir fry with rice',
            calories: 720,
          },
        ],
        hydration: '3.2 L water plus electrolytes post-lift',
      },
      {
        dayLabel: 'Sunday',
        emphasis: 'Recovery and gut rest',
        meals: [
          {
            title: 'Breakfast',
            description: 'Smoothie bowl with mixed berries',
            calories: 480,
          },
          {
            title: 'Lunch',
            description: 'Mediterranean plate, hummus, veggies',
            calories: 560,
          },
          {
            title: 'Dinner',
            description: 'Bone broth ramen with soft eggs',
            calories: 640,
          },
        ],
        hydration: '3 L water, include magnesium in evening',
        notes: 'Add probiotic rich foods and slow chewing today.',
      },
    ],
  },
  'program-hybrid': {
    id: 'program-hybrid',
    headline: 'Hybrid prep with tempo deloads',
    overview:
      'Ten-week plan that layers marathon-specific long runs with two dedicated strength micro-cycles per week.',
    goal: 'PR marathon pace while maintaining strength baselines.',
    progressionNotes:
      'Long runs wave from 26 km to 32 km; deload every third week and introduce hill reps in block two.',
    blocks: [
      {
        week: 1,
        title: 'Aerobic base',
        focus: 'Zone 2 volume',
        keySessions: ['Long run 26 km', 'Tempo + hills', 'Full-body strength'],
        readinessCue: 'Track morning HRV before key runs.',
      },
      {
        week: 4,
        title: 'Deload + skill',
        focus: 'Soft tissue recovery',
        keySessions: ['Short long run', 'Mobility circuit', 'Joint prep'],
        readinessCue: 'Athletes should bounce back to green readiness.',
      },
      {
        week: 7,
        title: 'Peak specific',
        focus: 'Race pace efforts',
        keySessions: ['32 km progression', 'Strength maintenance', 'Strides + drills'],
        readinessCue: 'Cap RPE at 8/10; monitor sleep debt.',
      },
    ],
    resources: [
      {
        id: 'res-vid-2',
        label: 'Strength support demo',
        type: 'Video',
        url: '#',
      },
      {
        id: 'res-pdf-2',
        label: 'Hybrid prep playbook',
        type: 'PDF',
        url: '#',
      },
    ],
    dailyWorkouts: [
      {
        dayLabel: 'Mon',
        theme: 'Tempo + hills',
        focus: 'Run economy',
        durationMinutes: 70,
        intensity: 'High',
        keyWork: [
          '3 km tempo at goal pace',
          '6x45s hill surges',
          'Glute med strength circuit',
        ],
        readinessCue: 'Cap RPE at 8 and confirm HRV is steady.',
        nutritionCue: '80 g carbs pre-run and one gel mid-session.',
      },
      {
        dayLabel: 'Tues',
        theme: 'Strength support',
        focus: 'Full-body strength',
        durationMinutes: 50,
        intensity: 'Medium',
        keyWork: [
          'Hex bar pull - 4x5',
          'Single leg press - 3x8 each',
          'Core anti-rotation - 3x12',
        ],
        readinessCue: 'Leave two reps in reserve per set.',
        nutritionCue: 'Prioritize 30 g protein within 20 minutes post lift.',
      },
      {
        dayLabel: 'wed',
        theme: 'Aerobic support',
        focus: 'Zone 2 mileage',
        durationMinutes: 45,
        intensity: 'Low',
        keyWork: [
          'Easy run - 8 km',
          'Run drills - 10 minutes',
          'Breath cooldown - 5 minutes',
        ],
        readinessCue: 'Keep HR under 75% max.',
        nutritionCue: 'Mix electrolytes in handheld bottle.',
      },
      {
        dayLabel: 'Thu',
        theme: 'Mobility + drills',
        focus: 'Skill refinement',
        durationMinutes: 40,
        intensity: 'Low',
        keyWork: [
          'Mobility flow - 15 minutes',
          'Barefoot strides - 6x60m',
          'Jump rope rhythm - 5 minutes',
        ],
        readinessCue: 'Use session as systems check; no fatigue allowed.',
        nutritionCue: 'Add collagen and vitamin C to smoothies.',
      },
      {
        dayLabel: 'Fri',
        theme: 'Marathon pace repeats',
        focus: 'Specific endurance',
        durationMinutes: 65,
        intensity: 'High',
        keyWork: [
          '4x3 km at goal pace',
          'Float jog recoveries - 2 minutes',
          'Mini strength finisher - 2 rounds',
        ],
        readinessCue: 'Stop if stride length shortens or HR drifts.',
        nutritionCue: 'Two gels plus 500 ml electrolyte drink.',
      },
      {
        dayLabel: 'Saturday',
        theme: 'Long progression run',
        focus: 'Long run',
        durationMinutes: 110,
        intensity: 'High',
        keyWork: [
          '32 km progression',
          'Last 20 minutes at marathon pace',
          'Mobility decompression - 10 minutes',
        ],
        readinessCue: 'Track fueling and GI feedback in notes.',
        nutritionCue: 'Alternate gels every 30 minutes with 750 ml fluids.',
      },
      {
        dayLabel: 'Sunday',
        theme: 'Recovery cross-train',
        focus: 'Cardiac drift control',
        durationMinutes: 35,
        intensity: 'Low',
        keyWork: [
          'Bike or swim easy - 25 minutes',
          'Foam roll sequence - 10 minutes',
          'Box breathing - 2 sets of 4 minutes',
        ],
        readinessCue: 'Finish fresher than you started.',
        nutritionCue: 'Emphasize micronutrients and probiotic foods.',
      },
    ],
    dietPlan: [
      {
        dayLabel: 'Mon',
        emphasis: 'High tempo fueling',
        meals: [
          {
            title: 'Breakfast',
            description: 'Bagel, almond butter, banana, whey shake',
            calories: 650,
          },
          {
            title: 'Lunch',
            description: 'Rice, grilled chicken, beet salad',
            calories: 720,
          },
          {
            title: 'Dinner',
            description: 'Pasta with salmon and veggies',
            calories: 780,
          },
        ],
        hydration: '4 L water plus electrolytes during run',
        notes: 'Add one gel 15 minutes before tempo set.',
      },
      {
        dayLabel: 'Tues',
        emphasis: 'Strength day balance',
        meals: [
          {
            title: 'Breakfast',
            description: 'Eggs, sweet potato hash, greens',
            calories: 580,
          },
          {
            title: 'Lunch',
            description: 'Quinoa bowl with turkey meatballs',
            calories: 690,
          },
          {
            title: 'Dinner',
            description: 'Shrimp tacos, cabbage slaw',
            calories: 650,
          },
        ],
        hydration: '3.2 L water plus creatine in smoothie',
      },
      {
        dayLabel: 'wed',
        emphasis: 'Zone 2 glycogen top off',
        meals: [
          {
            title: 'Breakfast',
            description: 'Overnight oats, chia, mango',
            calories: 520,
          },
          {
            title: 'Lunch',
            description: 'Whole grain wrap, hummus, veggies',
            calories: 560,
          },
          {
            title: 'Dinner',
            description: 'Chicken stir fry, jasmine rice',
            calories: 640,
          },
        ],
        hydration: '3 L water and herbal tea',
        notes: 'Add fermented foods for gut support.',
      },
      {
        dayLabel: 'Thu',
        emphasis: 'Mobility + gut rest',
        meals: [
          {
            title: 'Breakfast',
            description: 'Smoothie with spinach, pineapple, collagen',
            calories: 480,
          },
          {
            title: 'Lunch',
            description: 'Bone broth soup, rice crackers',
            calories: 500,
          },
          {
            title: 'Dinner',
            description: 'Baked cod, potatoes, asparagus',
            calories: 620,
          },
        ],
        hydration: '3 L water plus magnesium before bed',
      },
      {
        dayLabel: 'Fri',
        emphasis: 'Marathon pace rehearsal',
        meals: [
          {
            title: 'Breakfast',
            description: 'Cream of rice, berries, honey',
            calories: 600,
          },
          {
            title: 'Lunch',
            description: 'Pasta with turkey bolognese',
            calories: 780,
          },
          {
            title: 'Dinner',
            description: 'Rice, tofu, stir fried greens',
            calories: 640,
          },
        ],
        hydration: '4 L water; sip electrolyte mix overnight',
        notes: 'Trial race day breakfast timing.',
      },
      {
        dayLabel: 'Saturday',
        emphasis: 'Long run fueling',
        meals: [
          {
            title: 'Breakfast',
            description: 'Toast with jam, banana, sports drink',
            calories: 620,
          },
          {
            title: 'Lunch',
            description: 'Recovery smoothie and rice bowl',
            calories: 700,
          },
          {
            title: 'Dinner',
            description: 'Lean beef, potatoes, veggies',
            calories: 760,
          },
        ],
        hydration: '4.5 L water; include sodium tablets',
        notes: 'Practice gel timing every 30 minutes.',
      },
      {
        dayLabel: 'Sunday',
        emphasis: 'Restorative focus',
        meals: [
          {
            title: 'Breakfast',
            description: 'Yogurt parfait with seeds',
            calories: 480,
          },
          {
            title: 'Lunch',
            description: 'Miso soup, rice, steamed greens',
            calories: 520,
          },
          {
            title: 'Dinner',
            description: 'Chicken pho with herbs',
            calories: 630,
          },
        ],
        hydration: '3.2 L water, include kombucha',
        notes: 'Focus on digestion and low fiber in evening.',
      },
    ],
  },
  'program-foundation': {
    id: 'program-foundation',
    headline: 'Rebuild movement quality first',
    overview:
      'Four-week on-ramp prioritizing joint prep, core stability, and simple conditioning.',
    goal: 'Increase session compliance to 90% before progressing.',
    progressionNotes:
      'Keep RPE 6 or less; every session ends with breathwork and positional drills.',
    blocks: [
      {
        week: 1,
        title: 'Movement screen',
        focus: 'Assess + prep',
        keySessions: ['Joint cars', 'Tempo goblet squat', 'Bike intervals'],
        readinessCue: 'Flag pain scores above 2/10.',
      },
      {
        week: 3,
        title: 'Capacity builder',
        focus: 'Add simple load',
        keySessions: ['Split squats', 'Carries', 'Short EMOM cardio'],
        readinessCue: 'Encourage nasal breathing compliance.',
      },
    ],
    resources: [
      {
        id: 'res-note-3',
        label: 'Movement screen checklist',
        type: 'Note',
        url: '#',
      },
    ],
    dailyWorkouts: [
      {
        dayLabel: 'Mon',
        theme: 'Movement screen reset',
        focus: 'Assess + prep',
        durationMinutes: 40,
        intensity: 'Low',
        keyWork: [
          'Joint CARs - 2 rounds',
          'Tempo goblet squat - 3x8',
          'Breath ladder finisher - 3 minutes',
        ],
        readinessCue: 'Pain above 2/10 pauses the session.',
        nutritionCue: 'Hydrate early and include omega rich breakfast.',
      },
      {
        dayLabel: 'Tues',
        theme: 'Core and pillar',
        focus: 'Trunk stability',
        durationMinutes: 35,
        intensity: 'Low',
        keyWork: [
          'Dead bug series - 3x10',
          'Side plank reach - 3x30s',
          'Carry ladder - 4 efforts',
        ],
        readinessCue: 'Keep breathing cadence slow and nasal.',
        nutritionCue: 'Add leafy greens and fermented foods.',
      },
      {
        dayLabel: 'wed',
        theme: 'Conditioning touch',
        focus: 'Bike intervals',
        durationMinutes: 30,
        intensity: 'Medium',
        keyWork: [
          'Bike EMOM - 10 rounds',
          'Step down practice - 3x8 each',
          'Light stretch flow - 5 minutes',
        ],
        readinessCue: 'Hold RPE 6 or below.',
        nutritionCue: 'Include 20 g protein within 30 minutes.',
      },
      {
        dayLabel: 'Thu',
        theme: 'Mobility flow',
        focus: 'Hips + thoracic spine',
        durationMinutes: 35,
        intensity: 'Low',
        keyWork: [
          'Hip cars - 2 rounds',
          'Thoracic reach backs - 3x8',
          'Breathwork cooldown - 5 minutes',
        ],
        readinessCue: 'Move with no joint guarding.',
        nutritionCue: 'Prioritize hydration with citrus water.',
      },
      {
        dayLabel: 'Fri',
        theme: 'Strength primer',
        focus: 'Split squats + hinge',
        durationMinutes: 45,
        intensity: 'Medium',
        keyWork: [
          'Split squat - 3x8 each',
          'KB deadlift - 4x6',
          'Row + press combo - 3x10',
        ],
        readinessCue: 'Stop two reps before fatigue.',
        nutritionCue: 'Balanced plate with slow carbs and protein.',
      },
      {
        dayLabel: 'Saturday',
        theme: 'Circuit builder',
        focus: 'Short EMOM cardio',
        durationMinutes: 35,
        intensity: 'Medium',
        keyWork: [
          'EMOM - squat, push, bike',
          'Crawl pattern - 3x20s',
          'Reset stretching - 6 minutes',
        ],
        readinessCue: 'Quality of movement over speed.',
        nutritionCue: 'Add fruit based carbs pre session.',
      },
      {
        dayLabel: 'Sunday',
        theme: 'Breath and walk',
        focus: 'Active recovery',
        durationMinutes: 30,
        intensity: 'Low',
        keyWork: [
          'Walk 20 minutes nasal breathing',
          'Guided box breathing - 2 rounds',
          'Foam roll scan - 5 minutes',
        ],
        readinessCue: 'Use RPE 3; finish refreshed.',
        nutritionCue: 'Fiber rich meals and herbal tea.',
      },
    ],
    dietPlan: [
      {
        dayLabel: 'Mon',
        emphasis: 'Light reset',
        meals: [
          {
            title: 'Breakfast',
            description: 'Greek yogurt, berries, chia',
            calories: 420,
          },
          {
            title: 'Lunch',
            description: 'Turkey wrap, greens, hummus',
            calories: 520,
          },
          {
            title: 'Dinner',
            description: 'Baked chicken, quinoa, veggies',
            calories: 600,
          },
        ],
        hydration: '2.8 L water, herbal tea before bed',
      },
      {
        dayLabel: 'Tues',
        emphasis: 'Gut friendly focus',
        meals: [
          {
            title: 'Breakfast',
            description: 'Oatmeal, flax, apple',
            calories: 430,
          },
          {
            title: 'Lunch',
            description: 'Lentil soup, sourdough',
            calories: 500,
          },
          {
            title: 'Dinner',
            description: 'Fish tacos, cabbage slaw',
            calories: 580,
          },
        ],
        hydration: '3 L water with citrus slices',
      },
      {
        dayLabel: 'wed',
        emphasis: 'Support conditioning',
        meals: [
          {
            title: 'Breakfast',
            description: 'Smoothie with banana and spinach',
            calories: 450,
          },
          {
            title: 'Lunch',
            description: 'Rice bowl, tofu, veggies',
            calories: 560,
          },
          {
            title: 'Dinner',
            description: 'Pasta with turkey and marinara',
            calories: 620,
          },
        ],
        hydration: '3 L water plus pinch of sea salt',
        notes: 'Add small carb snack 30 minutes pre-bike.',
      },
      {
        dayLabel: 'Thu',
        emphasis: 'Micronutrient push',
        meals: [
          {
            title: 'Breakfast',
            description: 'Avocado toast, poached eggs',
            calories: 480,
          },
          {
            title: 'Lunch',
            description: 'Mediterranean salad, chickpeas',
            calories: 520,
          },
          {
            title: 'Dinner',
            description: 'Stir fried veggies, brown rice',
            calories: 590,
          },
        ],
        hydration: '2.7 L water plus bone broth mug',
      },
      {
        dayLabel: 'Fri',
        emphasis: 'Strength primer meals',
        meals: [
          {
            title: 'Breakfast',
            description: 'Egg scramble, potatoes, fruit',
            calories: 550,
          },
          {
            title: 'Lunch',
            description: 'Chicken burrito bowl',
            calories: 620,
          },
          {
            title: 'Dinner',
            description: 'Sirloin, mashed potatoes, greens',
            calories: 640,
          },
        ],
        hydration: '3 L water, include electrolytes post lift',
      },
      {
        dayLabel: 'Saturday',
        emphasis: 'Circuit energy',
        meals: [
          {
            title: 'Breakfast',
            description: 'Bagel, nut butter, banana',
            calories: 560,
          },
          {
            title: 'Lunch',
            description: 'Grain bowl with salmon',
            calories: 610,
          },
          {
            title: 'Dinner',
            description: 'Turkey chili, cornbread',
            calories: 630,
          },
        ],
        hydration: '3 L water plus coconut water serving',
      },
      {
        dayLabel: 'Sunday',
        emphasis: 'Recovery comfort',
        meals: [
          {
            title: 'Breakfast',
            description: 'Yogurt bowl, granola, honey',
            calories: 430,
          },
          {
            title: 'Lunch',
            description: 'Chicken soup, crackers',
            calories: 520,
          },
          {
            title: 'Dinner',
            description: 'Veggie pasta bake',
            calories: 610,
          },
        ],
        hydration: '2.6 L water, chamomile tea at night',
        notes: 'Slow eating and mindful breath between bites.',
      },
    ],
  },
}
