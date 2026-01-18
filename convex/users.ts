import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const signInQuery = query(
    {
        args: { phoneNumber: v.string(), pin: v.string() },
        handler: async (ctx, args) => {
            console.log(`Attempting sign-in for phone number: ${args.phoneNumber} with PIN: ${args.pin}`);
            const user = await ctx.db
                .query('users')
                .withIndex('by_phone_pin', q =>
                    q.eq('phoneNumber', args.phoneNumber)
                        .eq('pin', args.pin)
                )
                .unique();
            console.log('Sign-in result:', user);
            return user;
        }
    }
)