# Training Programs - Feature Status

## 🚧 Status: Coming Soon

Training program management is **planned for future integration** with the Convex backend.

## 📍 Current State

All training program pages have "Coming Soon" placeholders:

### Management Section (Trainer/Admin)

- **`/app/management/programs`** - Program list page
- **`/app/management/programs/new`** - Program creation page
- **`/app/management/programs/$programId`** - Program details page

### Client Section

- **`/app/_user/workouts`** - View assigned training programs

## ✅ Backend Ready

The Convex backend **already has full support** for training programs:

### Available Functions (`convex/trainingPlans.ts`):

- ✅ `createTrainingPlan` - Create new training program
- ✅ `getTrainingPlansByCreator` - Get programs by creator
- ✅ `getAllTrainingPlans` - Get all programs
- ✅ `getTrainingPlanById` - Get specific program
- ✅ `updateTrainingPlan` - Update program details
- ✅ `deleteTrainingPlan` - Delete program
- ✅ `assignTrainingPlanToUser` - Assign program to user
- ✅ `unassignTrainingPlanFromUser` - Remove program from user
- ✅ `getUsersByTrainingPlan` - Get users with specific program

### Data Structure:

```typescript
{
  name: string,
  description: string,
  durationWeeks: number,
  days: [
    {
      day: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun',
      exercises: [
        {
          exerciseName: string,
          noOfSets: number,
          sets: [
            {
              reps?: number,
              weight?: number,
              notes?: string
            }
          ]
        }
      ]
    }
  ],
  createdBy: userId,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 📊 Sample Data Available

The seed script (`convex/seed.ts`) creates:

- 2 training plans (Strength Training & Cardio/Endurance)
- Complete exercise lists with sets/reps/weights
- Assigned to sample clients

## 🎯 When You're Ready to Implement

### 1. Management Section

Connect the existing pages to Convex:

```typescript
// In /app/management/programs/index.tsx
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'

const trainingPlans = useQuery(api.trainingPlans.getAllTrainingPlans)
```

### 2. Client Section

Show assigned program:

```typescript
// In /app/_user/workouts.tsx
const user = useAuth().user
const assignedPlan = useQuery(
  api.trainingPlans.getTrainingPlanById,
  user?.trainingPlanId ? { trainingPlanId: user.trainingPlanId } : 'skip',
)
```

### 3. Program Builder

The UI components already exist in:

- `/src/routes/app/management/programs/_components/`

Just connect them to the backend mutations.

## 📝 Next Steps

When ready to implement:

1. Remove "Coming Soon" placeholders
2. Connect UI to existing Convex backend
3. Test with seeded data
4. Add form validation
5. Implement assignment flow

## 💡 Why "Coming Soon"?

The backend is complete, but the **UI integration** is deferred to:

- Focus on core features first (workout logging, diet tracking)
- Ensure stable authentication flow
- Allow for iterative UI/UX improvements

The groundwork is solid - when you're ready, implementation will be straightforward!
