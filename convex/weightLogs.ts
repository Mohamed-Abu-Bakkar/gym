import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const addWeightLog = mutation({
    args: {
        userId: v.id('users'),
        weight: v.number(), // weight in kg
    },
    handler: async (ctx, args) => {
        const weightLogId = await ctx.db.insert('weightLogs', {
            userId: args.userId,
            weight: args.weight,
            createdAt: Date.now(),
        })
        return weightLogId
    },
})

export const getWeightLogsByUser = query({
    args: {
        userId: v.id('users'),
    },
    handler: async (ctx, args) => {
        const weightLogs = await ctx.db
            .query('weightLogs')
            .withIndex('by_user', (q) => q.eq('userId', args.userId))
            .order('desc')
            .collect()

        return weightLogs
    },
})
