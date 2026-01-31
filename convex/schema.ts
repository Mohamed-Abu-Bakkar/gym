import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'


/* ======================================================
   CONSTANTS (Single Source of Truth)
====================================================== */

const ROLES = [
  'trainer',
  'trainerManagedCustomer',
  'selfManagedCustomer',
  'admin',
] as const

const WORKOUT_STATUSES = ['ongoing', 'completed', 'cancelled'] as const

const WORKOUT_TYPES = ['cardio', 'strength', 'flexibility', 'balance'] as const

export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack', "postWorkout"] as const

const DAYS_OF_WEEK = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const

const GOALS = [
  'weightLoss',
  'muscleGain',
  'endurance',
  'flexibility',
  'generalFitness',
] as const

const EXERCISE_NAMES = [
  // CHEST (8)
  'Barbell Bench Press',
  'Incline Dumbbell Press',
  'Decline Bench Press',
  'Dumbbell Fly',
  'Cable Chest Fly',
  'Push-Ups',
  'Dumbbell Pullover',
  'Smith Machine Bench Press',
  // BACK (8)
  'Lat Pulldown',
  'Pull-Ups / Assisted Pull-Ups',
  'Seated Cable Row',
  'Bent-Over Barbell Row',
  'One-Arm Dumbbell Row',
  'T-Bar Row',
  'Deadlift',
  'Straight-Arm Pulldown',
  // SHOULDERS (7)
  'Barbell Overhead Press',
  'Dumbbell Lateral Raise',
  'Front Raise',
  'Rear Delt Fly',
  'Arnold Press',
  'Upright Row',
  'Face Pull',
  // BICEPS (6)
  'Barbell Curl',
  'Dumbbell Curl',
  'Hammer Curl',
  'Preacher Curl',
  'Concentration Curl',
  'Cable Biceps Curl',
  // TRICEPS (6)
  'Cable Triceps Pushdown',
  'Skull Crushers',
  'Overhead Dumbbell Triceps Extension',
  'Bench Dips',
  'Close-Grip Bench Press',
  'Triceps Kickbacks',
  // LEGS (10)
  'Barbell Squat',
  'Leg Press',
  'Walking Lunges',
  'Leg Extension',
  'Leg Curl',
  'Romanian Deadlift',
  'Standing Calf Raises',
  'Seated Calf Raises',
  'Bulgarian Split Squat',
  'Hack Squat',
  // CORE / ABS (5)
  'Hanging Leg Raises',
  'Cable Crunch',
  'Ab Wheel Rollout',
  'Plank',
  'Russian Twist',
] as const

/* ======================================================
   ENUM → VALIDATOR HELPER
====================================================== */

function enumToValidator<T extends ReadonlyArray<string>>(values: T) {
  return v.union(...values.map(v.literal))
}

/* ======================================================
   VALIDATORS
====================================================== */

const RoleValidator = enumToValidator(ROLES)
const WorkoutStatusValidator = enumToValidator(WORKOUT_STATUSES)
const WorkoutTypeValidator = enumToValidator(WORKOUT_TYPES)
const MealTypeValidator = enumToValidator(MEAL_TYPES)
const DayOfWeekValidator = enumToValidator(DAYS_OF_WEEK)
const GoalValidator = enumToValidator(GOALS)
const ExerciseNameValidator = enumToValidator(EXERCISE_NAMES)

/* ======================================================
   TABLES
====================================================== */

/* -------------------- USERS -------------------- */

const users = defineTable({
  name: v.string(),
  phoneNumber: v.string(), // unique via index
  email: v.optional(v.string()),
  pin: v.string(), // 6-digit, stored as-is (explicitly insecure)

  role: RoleValidator,

  goal: GoalValidator,

  trainerId: v.optional(v.id('users')),
  trainingPlanId: v.optional(v.id('trainingPlans')),

  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index('by_phone', ['phoneNumber'])
  .index('by_phone_pin', ['phoneNumber', 'pin'])
  .index('by_trainer', ['trainerId'])
  .index('by_training_plan', ['trainingPlanId'])

/* -------------------- USER META -------------------- */

const userMeta = defineTable({
  userId: v.id('users'),

  age: v.optional(v.number()),
  address: v.optional(v.string()),
  gender: v.optional(v.string()),
  height: v.optional(v.number()),
  focusArea: v.optional(v.string()),
  progressPercent: v.optional(v.number()),
  readinessNote: v.optional(v.string()),
  accentColor: v.optional(v.string()),

  emergencyContactName: v.optional(v.string()),
  emergencyContactPhone: v.optional(v.string()),

  createdAt: v.number(),
  updatedAt: v.number(),
}).index('by_user', ['userId'])

/* -------------------- WORKOUT LOGS -------------------- */

const workoutLogs = defineTable({
  userId: v.id('users'),

  startTime: v.number(),
  endTime: v.optional(v.number()),

  status: WorkoutStatusValidator,
  workoutType: WorkoutTypeValidator,

  duration: v.optional(v.number()),
  caloriesBurned: v.optional(v.number()),

  createdAt: v.number(),
  updatedAt: v.number(),
}).index('by_user', ['userId'])

/* -------------------- WORKOUT (EXERCISES) -------------------- */

const workouts = defineTable({
  workoutLogId: v.id('workoutLogs'),

  exercises: v.array(
    v.object({
      createdAt: v.number(),
      exerciseName: v.string(),
      sets: v.optional(v.number()),
      reps: v.optional(v.number()),
      weight: v.optional(v.number()),
      notes: v.optional(v.string()),
    }),
  ),

  createdAt: v.number(),
  updatedAt: v.number(),
}).index('by_workout_log', ['workoutLogId'])

/* -------------------- DIET LOGS -------------------- */

const dietLogs = defineTable({
  userId: v.id('users'),

  createdAt: v.number(),
  mealType: MealTypeValidator,
  title: v.string(),
  description: v.string(),
  calories: v.number(),
}).index('by_user', ['userId'])

/* -------------------- WEIGHT LOGS -------------------- */

const weightLogs = defineTable({
  userId: v.id('users'),

  createdAt: v.number(),
  weight: v.number(),
}).index('by_user', ['userId'])

/* -------------------- TRAINING PLANS -------------------- */

const trainingPlans = defineTable({
  name: v.string(),
  description: v.string(),

  days: v.array(
    v.object({
      day: DayOfWeekValidator,
      exercises: v.array(
        v.object({
          exerciseName: v.string(),
          noOfSets: v.number(),
          sets: v.array(
            v.object({
              reps: v.optional(v.number()),
              weight: v.optional(v.number()),
              notes: v.optional(v.string()),
            }),
          ),
        }),
      ),
    }),
  ),

  durationWeeks: v.number(),
  createdBy: v.id('users'),
  createdAt: v.number(),
  updatedAt: v.number(),
}).index('by_creator', ['createdBy'])

export const dietPlans = defineTable({
  name: v.string(),
  description: v.string(),
  goal: v.optional(v.string()),
  durationWeeks: v.optional(v.number()),

  // Days that are active in this plan
  activeDays: v.array(DayOfWeekValidator),

  // Daily targets
  dailyCalorieTarget: v.optional(v.number()),
  hydrationTarget: v.optional(v.string()),

  // Coach guidance
  coachNote: v.optional(v.string()),

  // Meal template for each day (repeatable structure)
  mealTemplate: v.array(
    v.object({
      mealType: MealTypeValidator,
      title: v.string(),
      description: v.string(),
      calories: v.number(),
    })
  ),

  createdBy: v.id('users'),
  createdAt: v.number(),
  updatedAt: v.number(),
}).index('by_creator', ['createdBy'])

/* ======================================================
   SCHEMA EXPORT
====================================================== */

export default defineSchema({
  users,
  userMeta,
  workoutLogs,
  workouts,
  dietLogs,
  weightLogs,
  trainingPlans,
  dietPlans,
})
