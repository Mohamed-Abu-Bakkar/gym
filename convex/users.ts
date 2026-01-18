import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const signInQuery = query(
    {
        args: { phoneNumber: v.string(), pin: v.string() },
        handler: async (ctx, args) => {
            const user = await ctx.db
                .query('users')
                .withIndex('by_phone', (q) => q.eq('phoneNumber', args.phoneNumber))
                .filter((q) => q.eq('pin', args.pin))
                .unique()

            return user;
        }
    }
)