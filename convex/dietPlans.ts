import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { MEAL_TYPES } from './schema'

const DayOfWeekValidator = v.union(
    v.literal('mon'),
    v.literal('tue'),
    v.literal('wed'),
    v.literal('thu'),
    v.literal('fri'),
    v.literal('sat'),
    v.literal('sun'),
)

const MealTypeValidator = v.union(
    v.literal('breakfast'),
    v.literal('lunch'),
    v.literal('dinner'),
    v.literal('snack'),
    v.literal('postWorkout'),
)

export const createDietPlan = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        goal: v.optional(v.string()),
        durationWeeks: v.optional(v.number()),
        activeDays: v.array(DayOfWeekValidator),
        dailyCalorieTarget: v.optional(v.number()),
        hydrationTarget: v.optional(v.string()),
        coachNote: v.optional(v.string()),
        mealTemplate: v.array(
            v.object({
                mealType: MealTypeValidator,
                title: v.string(),
                description: v.string(),
                calories: v.number(),
            }),
        ),
        createdBy: v.id('users'),
    },
    handler: async (ctx, args) => {
        const now = Date.now()

        const dietPlanId = await ctx.db.insert('dietPlans', {
            name: args.name,
            description: args.description,
            goal: args.goal,
            durationWeeks: args.durationWeeks,
            activeDays: args.activeDays,
            dailyCalorieTarget: args.dailyCalorieTarget,
            hydrationTarget: args.hydrationTarget,
            coachNote: args.coachNote,
            mealTemplate: args.mealTemplate,
            createdBy: args.createdBy,
            createdAt: now,
            updatedAt: now,
        })

        return dietPlanId
    },
})

export const getDietPlansByUser = query({
    args: {
        userId: v.id('users'),
    },
    handler: async (ctx, args) => {
        const dietPlans = await ctx.db
            .query('dietPlans')
            .withIndex('by_creator', (q) => q.eq('createdBy', args.userId))
            .order('desc')
            .collect()

        return dietPlans
    },
})

export const getDietPlanById = query({
    args: {
        dietPlanId: v.id('dietPlans'),
    },
    handler: async (ctx, args) => {
        const dietPlan = await ctx.db.get(args.dietPlanId)
        return dietPlan
    },
})

export const updateDietPlan = mutation({
    args: {
        dietPlanId: v.id('dietPlans'),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        goal: v.optional(v.string()),
        durationWeeks: v.optional(v.number()),
        activeDays: v.optional(v.array(DayOfWeekValidator)),
        dailyCalorieTarget: v.optional(v.number()),
        hydrationTarget: v.optional(v.string()),
        coachNote: v.optional(v.string()),
        mealTemplate: v.optional(
            v.array(
                v.object({
                    mealType: MealTypeValidator,
                    title: v.string(),
                    description: v.string(),
                    calories: v.number(),
                }),
            ),
        ),
    },
    handler: async (ctx, args) => {
        const { dietPlanId, ...updates } = args

        await ctx.db.patch(dietPlanId, {
            ...updates,
            updatedAt: Date.now(),
        })

        return dietPlanId
    },
})

export const deleteDietPlan = mutation({
    args: {
        dietPlanId: v.id('dietPlans'),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.dietPlanId)
        return { success: true }
    },
})
