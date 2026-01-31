import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

const RoleValidator = v.union(
    v.literal('trainer'),
    v.literal('trainerManagedCustomer'),
    v.literal('selfManagedCustomer'),
    v.literal('admin'),
)

const GoalValidator = v.union(
    v.literal('weightLoss'),
    v.literal('muscleGain'),
    v.literal('endurance'),
    v.literal('flexibility'),
    v.literal('generalFitness'),
)

// Sign in query
export const signInQuery = query({
    args: { phoneNumber: v.string(), pin: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query('users')
            .withIndex('by_phone_pin', (q) =>
                q.eq('phoneNumber', args.phoneNumber).eq('pin', args.pin),
            )
            .unique()
        return user
    },
})

// Create a new user
export const createUser = mutation({
    args: {
        name: v.string(),
        phoneNumber: v.string(),
        email: v.optional(v.string()),
        pin: v.string(),
        role: RoleValidator,
        goal: GoalValidator,
        trainerId: v.optional(v.id('users')),
    },
    handler: async (ctx, args) => {
        const now = Date.now()

        // Check if user with phone number already exists
        const existingUser = await ctx.db
            .query('users')
            .withIndex('by_phone', (q) => q.eq('phoneNumber', args.phoneNumber))
            .first()

        if (existingUser) {
            throw new Error('User with this phone number already exists')
        }

        const userId = await ctx.db.insert('users', {
            name: args.name,
            phoneNumber: args.phoneNumber,
            email: args.email,
            pin: args.pin,
            role: args.role,
            goal: args.goal,
            trainerId: args.trainerId,
            createdAt: now,
            updatedAt: now,
        })

        return userId
    },
})

// Get user by ID
export const getUserById = query({
    args: {
        userId: v.id('users'),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId)
        return user
    },
})

// Get all users
export const getAllUsers = query({
    handler: async (ctx) => {
        const users = await ctx.db.query('users').order('desc').collect()
        return users
    },
})

// Get users by trainer
export const getUsersByTrainer = query({
    args: {
        trainerId: v.id('users'),
    },
    handler: async (ctx, args) => {
        const users = await ctx.db
            .query('users')
            .withIndex('by_trainer', (q) => q.eq('trainerId', args.trainerId))
            .collect()

        return users
    },
})

// Update user
export const updateUser = mutation({
    args: {
        userId: v.id('users'),
        name: v.optional(v.string()),
        phoneNumber: v.optional(v.string()),
        email: v.optional(v.string()),
        pin: v.optional(v.string()),
        role: v.optional(RoleValidator),
        goal: v.optional(GoalValidator),
        trainerId: v.optional(v.id('users')),
        trainingPlanId: v.optional(v.id('trainingPlans')),
    },
    handler: async (ctx, args) => {
        const { userId, ...updates } = args

        await ctx.db.patch(userId, {
            ...updates,
            updatedAt: Date.now(),
        })

        return userId
    },
})

// Delete user
export const deleteUser = mutation({
    args: {
        userId: v.id('users'),
    },
    handler: async (ctx, args) => {
        // Delete associated user meta
        const userMeta = await ctx.db
            .query('userMeta')
            .withIndex('by_user', (q) => q.eq('userId', args.userId))
            .first()

        if (userMeta) {
            await ctx.db.delete(userMeta._id)
        }

        // Delete the user
        await ctx.db.delete(args.userId)

        return { success: true }
    },
})

// Get user with meta
export const getUserWithMeta = query({
    args: {
        userId: v.id('users'),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId)

        if (!user) return null

        const userMeta = await ctx.db
            .query('userMeta')
            .withIndex('by_user', (q) => q.eq('userId', args.userId))
            .first()

        return {
            ...user,
            meta: userMeta,
        }
    },
})

// Update user meta
export const updateUserMeta = mutation({
    args: {
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
    },
    handler: async (ctx, args) => {
        const { userId, ...updates } = args
        const now = Date.now()

        // Check if user meta exists
        const existingMeta = await ctx.db
            .query('userMeta')
            .withIndex('by_user', (q) => q.eq('userId', userId))
            .first()

        if (existingMeta) {
            // Update existing meta
            await ctx.db.patch(existingMeta._id, {
                ...updates,
                updatedAt: now,
            })
            return existingMeta._id
        } else {
            // Create new meta
            const metaId = await ctx.db.insert('userMeta', {
                userId,
                ...updates,
                createdAt: now,
                updatedAt: now,
            })
            return metaId
        }
    },
})

// Search users by name or phone
export const searchUsers = query({
    args: {
        searchTerm: v.string(),
    },
    handler: async (ctx, args) => {
        const allUsers = await ctx.db.query('users').collect()

        const filtered = allUsers.filter(
            (user) =>
                user.name.toLowerCase().includes(args.searchTerm.toLowerCase()) ||
                user.phoneNumber.includes(args.searchTerm),
        )

        return filtered
    },
})
