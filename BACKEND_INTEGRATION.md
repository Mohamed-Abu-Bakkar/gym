# Convex Backend Integration Guide

## Overview

The backend is now fully integrated with all features including:

- User Management (users, authentication, user metadata)
- Workout Logs (create, track, complete workouts)
- Workouts (exercises within workout sessions)
- Diet Logs (meal tracking, calorie counting)
- Diet Plans (meal templates and nutrition guides)
- Training Plans (workout programs with exercises)
- Weight Logs (weight tracking over time)

## Database Schema

### Users

- Roles: `trainer`, `trainerManagedCustomer`, `selfManagedCustomer`, `admin`
- Goals: `weightLoss`, `muscleGain`, `endurance`, `flexibility`, `generalFitness`
- Includes trainer assignment and training plan assignment

### User Meta

- Extended user information (age, height, gender, emergency contacts, etc.)

### Workout Logs

- Track workout sessions with start/end times
- Status: `ongoing`, `completed`, `cancelled`
- Types: `cardio`, `strength`, `flexibility`, `balance`

### Workouts (Exercises)

- Detailed exercise tracking per workout log
- Supports sets, reps, weight, and notes

### Diet Logs

- Track individual meals throughout the day
- Meal types: `breakfast`, `lunch`, `dinner`, `snack`, `postWorkout`

### Diet Plans

- Reusable meal templates for clients
- Includes daily calorie targets, hydration goals, and coach notes

### Training Plans

- Weekly workout programs with day-by-day exercises
- Assignable to users

### Weight Logs

- Simple weight tracking over time

## Available Backend Functions

### Users (`convex/users.ts`)

- `signInQuery` - Authenticate user by phone and PIN
- `createUser` - Register new user
- `getUserById` - Get user by ID
- `getAllUsers` - Get all users
- `getUsersByTrainer` - Get clients of a trainer
- `updateUser` - Update user information
- `deleteUser` - Delete user and associated data
- `getUserWithMeta` - Get user with metadata
- `updateUserMeta` - Update user metadata
- `searchUsers` - Search users by name or phone

### Workout Logs (`convex/workoutLogs.ts`)

- `createWorkoutLog` - Start a new workout session
- `getWorkoutLogsByUser` - Get user's workout history
- `getOngoingWorkout` - Get current active workout
- `completeWorkoutLog` - Mark workout as completed
- `cancelWorkoutLog` - Cancel a workout
- `deleteWorkoutLog` - Delete workout log
- `getWorkoutLogById` - Get specific workout log
- `getWorkoutStats` - Get user's workout statistics

### Workouts (`convex/workouts.ts`)

- `addExercises` - Add exercises to a workout log
- `getExercisesByWorkoutLog` - Get exercises for a workout
- `updateExercise` - Update exercise details
- `deleteExercise` - Remove exercise from workout

### Diet Logs (`convex/dietLogs.ts`)

- `addDietLog` - Log a meal
- `getDietLogsByUser` - Get user's meal history
- `getTodayDietLogs` - Get today's meals
- `getTodayCalories` - Get today's calorie total
- `deleteDietLog` - Delete meal log
- `updateDietLog` - Update meal log
- `getDietStats` - Get user's diet statistics

### Diet Plans (`convex/dietPlans.ts`)

- `createDietPlan` - Create new diet plan
- `getDietPlansByUser` - Get diet plans by creator
- `getDietPlanById` - Get specific diet plan
- `updateDietPlan` - Update diet plan
- `deleteDietPlan` - Delete diet plan

### Training Plans (`convex/trainingPlans.ts`)

- `createTrainingPlan` - Create new training plan
- `getTrainingPlansByCreator` - Get plans by creator
- `getAllTrainingPlans` - Get all training plans
- `getTrainingPlanById` - Get specific plan
- `updateTrainingPlan` - Update training plan
- `deleteTrainingPlan` - Delete training plan
- `assignTrainingPlanToUser` - Assign plan to user
- `unassignTrainingPlanFromUser` - Remove plan from user
- `getUsersByTrainingPlan` - Get users with a specific plan

### Weight Logs (`convex/weightLogs.ts`)

- `addWeightLog` - Log weight measurement
- `getWeightLogsByUser` - Get user's weight history

### Seed (`convex/seed.ts`)

- `seedDatabase` - Populate database with sample data
- `clearDatabase` - Clear all data (use with caution!)

## Seeding the Database

To populate your database with sample data:

### Method 1: Via Convex Dashboard

1. Go to your Convex dashboard
2. Navigate to "Functions"
3. Find and run `seed:seedDatabase`
4. The database will be populated with sample users, plans, logs, etc.

### Method 2: Via Code

```typescript
import { useMutation } from 'convex/react'
import { api } from '../convex/_generated/api'

function SeedButton() {
  const seedDatabase = useMutation(api.seed.seedDatabase)

  return (
    <button onClick={() => seedDatabase()}>
      Seed Database
    </button>
  )
}
```

## Sample Users Created by Seed Script

After running the seed script, you can log in with these accounts:

1. **Admin**
   - Phone: `1000000000`
   - PIN: `000000`
   - Role: Admin

2. **Trainer**
   - Phone: `1111111111`
   - PIN: `111111`
   - Role: Trainer

3. **Client 1 (Sarah Johnson)**
   - Phone: `2222222222`
   - PIN: `222222`
   - Role: Trainer Managed Customer
   - Goal: Weight Loss

4. **Client 2 (Mike Chen)**
   - Phone: `3333333333`
   - PIN: `333333`
   - Role: Trainer Managed Customer
   - Goal: Muscle Gain

5. **Client 3 (Emma Davis)**
   - Phone: `4444444444`
   - PIN: `444444`
   - Role: Self Managed Customer
   - Goal: Endurance

## Sample Data Included

- 4 users with complete profiles
- 2 training plans (Strength Training & Cardio/Endurance)
- 2 diet plans (Weight Loss & Muscle Building)
- 2 completed workout logs with exercises
- 4 diet logs (meals logged today)
- 10 weight logs (tracking progress over 30 days)

## Development Workflow

### 1. Start Convex Dev Server

```bash
npx convex dev
```

### 2. Seed the Database

Once Convex is running, seed the database through the dashboard or programmatically.

### 3. Start Your App

```bash
npm run dev
# or
pnpm dev
```

### 4. Test Authentication

Try logging in with any of the sample user credentials above.

## Clearing the Database

If you need to reset the database:

```typescript
const clearDatabase = useMutation(api.seed.clearDatabase)

// Call it
await clearDatabase()
```

**WARNING**: This will delete ALL data from ALL tables. Use only in development!

## Integration Examples

### Example: Get User's Workout Stats

```typescript
import { useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'

function WorkoutStatsComponent({ userId }) {
  const stats = useQuery(api.workoutLogs.getWorkoutStats, { userId })

  return (
    <div>
      <p>Total Workouts: {stats?.totalWorkouts}</p>
      <p>Completed: {stats?.completedWorkouts}</p>
      <p>Total Duration: {stats?.totalDuration} min</p>
      <p>Calories Burned: {stats?.totalCalories}</p>
    </div>
  )
}
```

### Example: Start a Workout

```typescript
import { useMutation } from 'convex/react'
import { api } from '../convex/_generated/api'

function StartWorkoutButton({ userId }) {
  const createWorkout = useMutation(api.workoutLogs.createWorkoutLog)

  const handleStart = async () => {
    const workoutId = await createWorkout({
      userId,
      workoutType: 'strength'
    })
    console.log('Workout started:', workoutId)
  }

  return <button onClick={handleStart}>Start Workout</button>
}
```

### Example: Log a Meal

```typescript
import { useMutation } from 'convex/react'
import { api } from '../convex/_generated/api'

function LogMealButton({ userId }) {
  const addDietLog = useMutation(api.dietLogs.addDietLog)

  const handleLogMeal = async () => {
    await addDietLog({
      userId,
      mealType: 'breakfast',
      title: 'Oatmeal Bowl',
      description: 'Oats with berries and honey',
      calories: 350
    })
  }

  return <button onClick={handleLogMeal}>Log Meal</button>
}
```

## Next Steps

1. Run the seed script to populate your database
2. Test authentication with sample users
3. Explore the management dashboard with trainer/admin accounts
4. Test client features with customer accounts
5. Build out additional UI components using the backend functions

## Notes

- All timestamps are stored as Unix timestamps (milliseconds)
- Phone numbers are used as unique identifiers for authentication
- PINs are 6-digit strings (stored in plain text - for demo purposes only!)
- Trainer-managed customers are linked to their trainers
- Training plans can be assigned to multiple users
- Diet plans are templates that users can follow
