import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

const DayOfWeekValidator = v.union(
    v.literal('mon'),
    v.literal('tue'),
    v.literal('wed'),
    v.literal('thu'),
    v.literal('fri'),
    v.literal('sat'),
    v.literal('sun'),
)

const ExerciseSetValidator = v.object({
    reps: v.optional(v.number()),
    weight: v.optional(v.number()),
    notes: v.optional(v.string()),
})

const ExerciseValidator = v.object({
    exerciseName: v.string(),
    noOfSets: v.number(),
    sets: v.array(ExerciseSetValidator),
})

const DayPlanValidator = v.object({
    day: DayOfWeekValidator,
    exercises: v.array(ExerciseValidator),
})

// Create a training plan
export const createTrainingPlan = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        days: v.array(DayPlanValidator),
        durationWeeks: v.number(),
        createdBy: v.id('users'),
    },
    handler: async (ctx, args) => {
        const now = Date.now()

        const trainingPlanId = await ctx.db.insert('trainingPlans', {
            name: args.name,
            description: args.description,
            days: args.days,
            durationWeeks: args.durationWeeks,
            createdBy: args.createdBy,
            createdAt: now,
            updatedAt: now,
        })

        return trainingPlanId
    },
})

// Get training plans by creator
export const getTrainingPlansByCreator = query({
    args: {
        creatorId: v.id('users'),
    },
    handler: async (ctx, args) => {
        const trainingPlans = await ctx.db
            .query('trainingPlans')
            .withIndex('by_creator', (q) => q.eq('createdBy', args.creatorId))
            .order('desc')
            .collect()

        return trainingPlans
    },
})

// Get all training plans
export const getAllTrainingPlans = query({
    handler: async (ctx) => {
        const trainingPlans = await ctx.db.query('trainingPlans').order('desc').collect()
        return trainingPlans
    },
})

// Get training plan by ID
export const getTrainingPlanById = query({
    args: {
        trainingPlanId: v.id('trainingPlans'),
    },
    handler: async (ctx, args) => {
        const trainingPlan = await ctx.db.get(args.trainingPlanId)
        return trainingPlan
    },
})

// Update a training plan
export const updateTrainingPlan = mutation({
    args: {
        trainingPlanId: v.id('trainingPlans'),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        days: v.optional(v.array(DayPlanValidator)),
        durationWeeks: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { trainingPlanId, ...updates } = args

        await ctx.db.patch(trainingPlanId, {
            ...updates,
            updatedAt: Date.now(),
        })

        return trainingPlanId
    },
})

// Delete a training plan
export const deleteTrainingPlan = mutation({
    args: {
        trainingPlanId: v.id('trainingPlans'),
    },
    handler: async (ctx, args) => {
        // Check if any users are assigned to this plan
        const usersWithPlan = await ctx.db
            .query('users')
            .withIndex('by_training_plan', (q) =>
                q.eq('trainingPlanId', args.trainingPlanId),
            )
            .collect()

        // Remove the plan from users
        for (const user of usersWithPlan) {
            await ctx.db.patch(user._id, {
                trainingPlanId: undefined,
                updatedAt: Date.now(),
            })
        }

        // Delete the training plan
        await ctx.db.delete(args.trainingPlanId)

        return { success: true }
    },
})

// Assign training plan to user
export const assignTrainingPlanToUser = mutation({
    args: {
        userId: v.id('users'),
        trainingPlanId: v.id('trainingPlans'),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.userId, {
            trainingPlanId: args.trainingPlanId,
            updatedAt: Date.now(),
        })

        return { success: true }
    },
})

// Unassign training plan from user
export const unassignTrainingPlanFromUser = mutation({
    args: {
        userId: v.id('users'),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.userId, {
            trainingPlanId: undefined,
            updatedAt: Date.now(),
        })

        return { success: true }
    },
})

// Get users assigned to a training plan
export const getUsersByTrainingPlan = query({
    args: {
        trainingPlanId: v.id('trainingPlans'),
    },
    handler: async (ctx, args) => {
        const users = await ctx.db
            .query('users')
            .withIndex('by_training_plan', (q) =>
                q.eq('trainingPlanId', args.trainingPlanId),
            )
            .collect()

        return users
    },
})
