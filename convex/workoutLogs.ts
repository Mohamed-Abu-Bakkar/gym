import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

const WorkoutStatusValidator = v.union(
    v.literal('ongoing'),
    v.literal('completed'),
    v.literal('cancelled'),
)

const WorkoutTypeValidator = v.union(
    v.literal('cardio'),
    v.literal('strength'),
    v.literal('flexibility'),
    v.literal('balance'),
)

// Create a workout log
export const createWorkoutLog = mutation({
    args: {
        userId: v.id('users'),
        workoutType: WorkoutTypeValidator,
    },
    handler: async (ctx, args) => {
        const now = Date.now()

        const workoutLogId = await ctx.db.insert('workoutLogs', {
            userId: args.userId,
            startTime: now,
            status: 'ongoing',
            workoutType: args.workoutType,
            createdAt: now,
            updatedAt: now,
        })

        return workoutLogId
    },
})

// Get workout logs by user
export const getWorkoutLogsByUser = query({
    args: {
        userId: v.id('users'),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        let query = ctx.db
            .query('workoutLogs')
            .withIndex('by_user', (q) => q.eq('userId', args.userId))
            .order('desc')

        const workoutLogs = args.limit
            ? await query.take(args.limit)
            : await query.collect()

        return workoutLogs
    },
})

// Get ongoing workout log
export const getOngoingWorkout = query({
    args: {
        userId: v.id('users'),
    },
    handler: async (ctx, args) => {
        const ongoingWorkout = await ctx.db
            .query('workoutLogs')
            .withIndex('by_user', (q) => q.eq('userId', args.userId))
            .filter((q) => q.eq(q.field('status'), 'ongoing'))
            .first()

        return ongoingWorkout
    },
})

// Complete a workout log
export const completeWorkoutLog = mutation({
    args: {
        workoutLogId: v.id('workoutLogs'),
        duration: v.optional(v.number()),
        caloriesBurned: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const now = Date.now()

        await ctx.db.patch(args.workoutLogId, {
            endTime: now,
            status: 'completed',
            duration: args.duration,
            caloriesBurned: args.caloriesBurned,
            updatedAt: now,
        })

        return args.workoutLogId
    },
})

// Cancel a workout log
export const cancelWorkoutLog = mutation({
    args: {
        workoutLogId: v.id('workoutLogs'),
    },
    handler: async (ctx, args) => {
        const now = Date.now()

        await ctx.db.patch(args.workoutLogId, {
            endTime: now,
            status: 'cancelled',
            updatedAt: now,
        })

        return args.workoutLogId
    },
})

// Delete a workout log
export const deleteWorkoutLog = mutation({
    args: {
        workoutLogId: v.id('workoutLogs'),
    },
    handler: async (ctx, args) => {
        // Delete associated workouts first
        const workouts = await ctx.db
            .query('workouts')
            .withIndex('by_workout_log', (q) =>
                q.eq('workoutLogId', args.workoutLogId),
            )
            .collect()

        for (const workout of workouts) {
            await ctx.db.delete(workout._id)
        }

        // Delete the workout log
        await ctx.db.delete(args.workoutLogId)

        return { success: true }
    },
})

// Get workout log by ID
export const getWorkoutLogById = query({
    args: {
        workoutLogId: v.id('workoutLogs'),
    },
    handler: async (ctx, args) => {
        const workoutLog = await ctx.db.get(args.workoutLogId)
        return workoutLog
    },
})

// Get workout stats for a user
export const getWorkoutStats = query({
    args: {
        userId: v.id('users'),
    },
    handler: async (ctx, args) => {
        const workoutLogs = await ctx.db
            .query('workoutLogs')
            .withIndex('by_user', (q) => q.eq('userId', args.userId))
            .collect()

        const totalWorkouts = workoutLogs.length
        const completedWorkouts = workoutLogs.filter(
            (log) => log.status === 'completed',
        ).length
        const totalDuration = workoutLogs.reduce(
            (sum, log) => sum + (log.duration || 0),
            0,
        )
        const totalCalories = workoutLogs.reduce(
            (sum, log) => sum + (log.caloriesBurned || 0),
            0,
        )

        return {
            totalWorkouts,
            completedWorkouts,
            totalDuration,
            totalCalories,
        }
    },
})
