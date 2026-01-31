import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

const MealTypeValidator = v.union(
    v.literal('breakfast'),
    v.literal('lunch'),
    v.literal('dinner'),
    v.literal('snack'),
    v.literal('postWorkout'),
)

// Add a diet log
export const addDietLog = mutation({
    args: {
        userId: v.id('users'),
        mealType: MealTypeValidator,
        title: v.string(),
        description: v.string(),
        calories: v.number(),
    },
    handler: async (ctx, args) => {
        const now = Date.now()

        const dietLogId = await ctx.db.insert('dietLogs', {
            userId: args.userId,
            mealType: args.mealType,
            title: args.title,
            description: args.description,
            calories: args.calories,
            createdAt: now,
        })

        return dietLogId
    },
})

// Get diet logs by user
export const getDietLogsByUser = query({
    args: {
        userId: v.id('users'),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        let query = ctx.db
            .query('dietLogs')
            .withIndex('by_user', (q) => q.eq('userId', args.userId))
            .order('desc')

        const dietLogs = args.limit
            ? await query.take(args.limit)
            : await query.collect()

        return dietLogs
    },
})

// Get diet logs for today
export const getTodayDietLogs = query({
    args: {
        userId: v.id('users'),
    },
    handler: async (ctx, args) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayTimestamp = today.getTime()

        const dietLogs = await ctx.db
            .query('dietLogs')
            .withIndex('by_user', (q) => q.eq('userId', args.userId))
            .filter((q) => q.gte(q.field('createdAt'), todayTimestamp))
            .collect()

        return dietLogs
    },
})

// Get calories consumed today
export const getTodayCalories = query({
    args: {
        userId: v.id('users'),
    },
    handler: async (ctx, args) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayTimestamp = today.getTime()

        const dietLogs = await ctx.db
            .query('dietLogs')
            .withIndex('by_user', (q) => q.eq('userId', args.userId))
            .filter((q) => q.gte(q.field('createdAt'), todayTimestamp))
            .collect()

        const totalCalories = dietLogs.reduce((sum, log) => sum + log.calories, 0)

        return {
            totalCalories,
            logs: dietLogs,
        }
    },
})

// Delete a diet log
export const deleteDietLog = mutation({
    args: {
        dietLogId: v.id('dietLogs'),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.dietLogId)
        return { success: true }
    },
})

// Update a diet log
export const updateDietLog = mutation({
    args: {
        dietLogId: v.id('dietLogs'),
        mealType: v.optional(MealTypeValidator),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        calories: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { dietLogId, ...updates } = args

        await ctx.db.patch(dietLogId, updates)

        return dietLogId
    },
})

// Get diet stats for a user
export const getDietStats = query({
    args: {
        userId: v.id('users'),
    },
    handler: async (ctx, args) => {
        const dietLogs = await ctx.db
            .query('dietLogs')
            .withIndex('by_user', (q) => q.eq('userId', args.userId))
            .collect()

        const totalLogs = dietLogs.length
        const totalCalories = dietLogs.reduce((sum, log) => sum + log.calories, 0)
        const averageCalories = totalLogs > 0 ? totalCalories / totalLogs : 0

        return {
            totalLogs,
            totalCalories,
            averageCalories,
        }
    },
})
