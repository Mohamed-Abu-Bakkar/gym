import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

const ExerciseValidator = v.object({
    createdAt: v.number(),
    exerciseName: v.string(),
    sets: v.optional(v.number()),
    reps: v.optional(v.number()),
    weight: v.optional(v.number()),
    notes: v.optional(v.string()),
})

// Add exercises to a workout log
export const addExercises = mutation({
    args: {
        workoutLogId: v.id('workoutLogs'),
        exercises: v.array(ExerciseValidator),
    },
    handler: async (ctx, args) => {
        const now = Date.now()

        // Check if workout already exists for this workout log
        const existingWorkout = await ctx.db
            .query('workouts')
            .withIndex('by_workout_log', (q) =>
                q.eq('workoutLogId', args.workoutLogId),
            )
            .first()

        if (existingWorkout) {
            // Update existing workout
            await ctx.db.patch(existingWorkout._id, {
                exercises: [...existingWorkout.exercises, ...args.exercises],
                updatedAt: now,
            })
            return existingWorkout._id
        } else {
            // Create new workout
            const workoutId = await ctx.db.insert('workouts', {
                workoutLogId: args.workoutLogId,
                exercises: args.exercises,
                createdAt: now,
                updatedAt: now,
            })
            return workoutId
        }
    },
})

// Get exercises for a workout log
export const getExercisesByWorkoutLog = query({
    args: {
        workoutLogId: v.id('workoutLogs'),
    },
    handler: async (ctx, args) => {
        const workout = await ctx.db
            .query('workouts')
            .withIndex('by_workout_log', (q) =>
                q.eq('workoutLogId', args.workoutLogId),
            )
            .first()

        return workout?.exercises || []
    },
})

// Update an exercise
export const updateExercise = mutation({
    args: {
        workoutLogId: v.id('workoutLogs'),
        exerciseIndex: v.number(),
        updates: v.object({
            exerciseName: v.optional(v.string()),
            sets: v.optional(v.number()),
            reps: v.optional(v.number()),
            weight: v.optional(v.number()),
            notes: v.optional(v.string()),
        }),
    },
    handler: async (ctx, args) => {
        const workout = await ctx.db
            .query('workouts')
            .withIndex('by_workout_log', (q) =>
                q.eq('workoutLogId', args.workoutLogId),
            )
            .first()

        if (!workout) {
            throw new Error('Workout not found')
        }

        const exercises = [...workout.exercises]
        exercises[args.exerciseIndex] = {
            ...exercises[args.exerciseIndex],
            ...args.updates,
        }

        await ctx.db.patch(workout._id, {
            exercises,
            updatedAt: Date.now(),
        })

        return workout._id
    },
})

// Delete an exercise
export const deleteExercise = mutation({
    args: {
        workoutLogId: v.id('workoutLogs'),
        exerciseIndex: v.number(),
    },
    handler: async (ctx, args) => {
        const workout = await ctx.db
            .query('workouts')
            .withIndex('by_workout_log', (q) =>
                q.eq('workoutLogId', args.workoutLogId),
            )
            .first()

        if (!workout) {
            throw new Error('Workout not found')
        }

        const exercises = workout.exercises.filter(
            (_, index) => index !== args.exerciseIndex,
        )

        await ctx.db.patch(workout._id, {
            exercises,
            updatedAt: Date.now(),
        })

        return workout._id
    },
})
