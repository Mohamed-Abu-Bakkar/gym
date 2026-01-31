import { mutation } from './_generated/server'

// Seed script to populate the database with sample data
export const seedDatabase = mutation({
    handler: async (ctx) => {
        const now = Date.now()

        // Create admin user
        const adminId = await ctx.db.insert('users', {
            name: 'Admin User',
            phoneNumber: '1000000000',
            email: 'admin@gym.com',
            pin: '000000',
            role: 'admin',
            goal: 'generalFitness',
            createdAt: now,
            updatedAt: now,
        })

        // Create trainer user
        const trainerId = await ctx.db.insert('users', {
            name: 'John Trainer',
            phoneNumber: '1111111111',
            email: 'trainer@gym.com',
            pin: '111111',
            role: 'trainer',
            goal: 'generalFitness',
            createdAt: now,
            updatedAt: now,
        })

        // Create trainer user meta
        await ctx.db.insert('userMeta', {
            userId: trainerId,
            age: 30,
            gender: 'Male',
            height: 180,
            focusArea: 'Strength Training',
            progressPercent: 85,
            accentColor: '#3b82f6',
            createdAt: now,
            updatedAt: now,
        })

        // Create client users
        const client1Id = await ctx.db.insert('users', {
            name: 'Sarah Johnson',
            phoneNumber: '2222222222',
            email: 'sarah@example.com',
            pin: '222222',
            role: 'trainerManagedCustomer',
            goal: 'weightLoss',
            trainerId: trainerId,
            createdAt: now,
            updatedAt: now,
        })

        await ctx.db.insert('userMeta', {
            userId: client1Id,
            age: 28,
            gender: 'Female',
            height: 165,
            focusArea: 'Weight Loss',
            progressPercent: 45,
            readinessNote: 'Ready to train hard!',
            accentColor: '#ec4899',
            emergencyContactName: 'Mike Johnson',
            emergencyContactPhone: '9999999991',
            createdAt: now,
            updatedAt: now,
        })

        const client2Id = await ctx.db.insert('users', {
            name: 'Mike Chen',
            phoneNumber: '3333333333',
            email: 'mike@example.com',
            pin: '333333',
            role: 'trainerManagedCustomer',
            goal: 'muscleGain',
            trainerId: trainerId,
            createdAt: now,
            updatedAt: now,
        })

        await ctx.db.insert('userMeta', {
            userId: client2Id,
            age: 25,
            gender: 'Male',
            height: 175,
            focusArea: 'Muscle Building',
            progressPercent: 60,
            readinessNote: 'Feeling strong!',
            accentColor: '#10b981',
            emergencyContactName: 'Lisa Chen',
            emergencyContactPhone: '9999999992',
            createdAt: now,
            updatedAt: now,
        })

        const client3Id = await ctx.db.insert('users', {
            name: 'Emma Davis',
            phoneNumber: '4444444444',
            email: 'emma@example.com',
            pin: '444444',
            role: 'selfManagedCustomer',
            goal: 'endurance',
            createdAt: now,
            updatedAt: now,
        })

        await ctx.db.insert('userMeta', {
            userId: client3Id,
            age: 32,
            gender: 'Female',
            height: 170,
            focusArea: 'Cardio & Endurance',
            progressPercent: 70,
            accentColor: '#f59e0b',
            emergencyContactName: 'Tom Davis',
            emergencyContactPhone: '9999999993',
            createdAt: now,
            updatedAt: now,
        })

        // Create training plans
        const strengthPlanId = await ctx.db.insert('trainingPlans', {
            name: 'Beginner Strength Training',
            description: 'A comprehensive 8-week strength training program for beginners',
            durationWeeks: 8,
            days: [
                {
                    day: 'mon',
                    exercises: [
                        {
                            exerciseName: 'Barbell Bench Press',
                            noOfSets: 3,
                            sets: [
                                { reps: 10, weight: 60 },
                                { reps: 8, weight: 70 },
                                { reps: 6, weight: 80 },
                            ],
                        },
                        {
                            exerciseName: 'Barbell Squat',
                            noOfSets: 3,
                            sets: [
                                { reps: 10, weight: 80 },
                                { reps: 8, weight: 90 },
                                { reps: 6, weight: 100 },
                            ],
                        },
                        {
                            exerciseName: 'Lat Pulldown',
                            noOfSets: 3,
                            sets: [
                                { reps: 12, weight: 50 },
                                { reps: 10, weight: 55 },
                                { reps: 8, weight: 60 },
                            ],
                        },
                    ],
                },
                {
                    day: 'wed',
                    exercises: [
                        {
                            exerciseName: 'Deadlift',
                            noOfSets: 3,
                            sets: [
                                { reps: 8, weight: 100 },
                                { reps: 6, weight: 110 },
                                { reps: 4, weight: 120 },
                            ],
                        },
                        {
                            exerciseName: 'Barbell Overhead Press',
                            noOfSets: 3,
                            sets: [
                                { reps: 10, weight: 40 },
                                { reps: 8, weight: 45 },
                                { reps: 6, weight: 50 },
                            ],
                        },
                        {
                            exerciseName: 'Bent-Over Barbell Row',
                            noOfSets: 3,
                            sets: [
                                { reps: 10, weight: 60 },
                                { reps: 8, weight: 70 },
                                { reps: 6, weight: 75 },
                            ],
                        },
                    ],
                },
                {
                    day: 'fri',
                    exercises: [
                        {
                            exerciseName: 'Leg Press',
                            noOfSets: 4,
                            sets: [
                                { reps: 12, weight: 150 },
                                { reps: 10, weight: 170 },
                                { reps: 8, weight: 190 },
                                { reps: 6, weight: 200 },
                            ],
                        },
                        {
                            exerciseName: 'Incline Dumbbell Press',
                            noOfSets: 3,
                            sets: [
                                { reps: 10, weight: 25 },
                                { reps: 8, weight: 30 },
                                { reps: 6, weight: 35 },
                            ],
                        },
                        {
                            exerciseName: 'Cable Triceps Pushdown',
                            noOfSets: 3,
                            sets: [
                                { reps: 12, weight: 30 },
                                { reps: 10, weight: 35 },
                                { reps: 8, weight: 40 },
                            ],
                        },
                    ],
                },
            ],
            createdBy: trainerId,
            createdAt: now,
            updatedAt: now,
        })

        const cardioEndurancePlanId = await ctx.db.insert('trainingPlans', {
            name: 'Cardio & Endurance Builder',
            description: '6-week cardio and endurance focused training program',
            durationWeeks: 6,
            days: [
                {
                    day: 'tue',
                    exercises: [
                        {
                            exerciseName: 'Walking Lunges',
                            noOfSets: 4,
                            sets: [
                                { reps: 20, notes: 'Each leg' },
                                { reps: 20, notes: 'Each leg' },
                                { reps: 20, notes: 'Each leg' },
                                { reps: 20, notes: 'Each leg' },
                            ],
                        },
                        {
                            exerciseName: 'Plank',
                            noOfSets: 3,
                            sets: [
                                { notes: '30 seconds' },
                                { notes: '45 seconds' },
                                { notes: '60 seconds' },
                            ],
                        },
                    ],
                },
                {
                    day: 'thu',
                    exercises: [
                        {
                            exerciseName: 'Bulgarian Split Squat',
                            noOfSets: 3,
                            sets: [
                                { reps: 12, weight: 20, notes: 'Each leg' },
                                { reps: 10, weight: 25, notes: 'Each leg' },
                                { reps: 8, weight: 30, notes: 'Each leg' },
                            ],
                        },
                        {
                            exerciseName: 'Russian Twist',
                            noOfSets: 3,
                            sets: [
                                { reps: 30, weight: 10 },
                                { reps: 30, weight: 12 },
                                { reps: 30, weight: 15 },
                            ],
                        },
                    ],
                },
                {
                    day: 'sat',
                    exercises: [
                        {
                            exerciseName: 'Push-Ups',
                            noOfSets: 4,
                            sets: [{ reps: 15 }, { reps: 12 }, { reps: 10 }, { reps: 8 }],
                        },
                        {
                            exerciseName: 'Hanging Leg Raises',
                            noOfSets: 3,
                            sets: [{ reps: 10 }, { reps: 8 }, { reps: 6 }],
                        },
                    ],
                },
            ],
            createdBy: trainerId,
            createdAt: now,
            updatedAt: now,
        })

        // Assign training plans to clients
        await ctx.db.patch(client1Id, {
            trainingPlanId: strengthPlanId,
            updatedAt: now,
        })

        await ctx.db.patch(client2Id, {
            trainingPlanId: strengthPlanId,
            updatedAt: now,
        })

        await ctx.db.patch(client3Id, {
            trainingPlanId: cardioEndurancePlanId,
            updatedAt: now,
        })

        // Create diet plans
        const weightLossDietId = await ctx.db.insert('dietPlans', {
            name: 'Weight Loss Meal Plan',
            description: 'Balanced calorie-deficit meal plan for healthy weight loss',
            goal: 'Weight Loss',
            durationWeeks: 8,
            activeDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
            dailyCalorieTarget: 1800,
            hydrationTarget: '3 liters',
            coachNote:
                'Stay consistent with meals and hydration. Avoid processed foods.',
            mealTemplate: [
                {
                    mealType: 'breakfast',
                    title: 'Oatmeal with Berries',
                    description: '1 cup oatmeal, mixed berries, almond milk, chia seeds',
                    calories: 350,
                },
                {
                    mealType: 'lunch',
                    title: 'Grilled Chicken Salad',
                    description:
                        'Grilled chicken breast, mixed greens, olive oil dressing',
                    calories: 450,
                },
                {
                    mealType: 'snack',
                    title: 'Greek Yogurt & Nuts',
                    description: '1 cup Greek yogurt, handful of almonds',
                    calories: 200,
                },
                {
                    mealType: 'dinner',
                    title: 'Baked Salmon with Veggies',
                    description: 'Salmon fillet, roasted vegetables, quinoa',
                    calories: 550,
                },
                {
                    mealType: 'postWorkout',
                    title: 'Protein Shake',
                    description: 'Whey protein, banana, almond butter',
                    calories: 250,
                },
            ],
            createdBy: trainerId,
            createdAt: now,
            updatedAt: now,
        })

        const muscleGainDietId = await ctx.db.insert('dietPlans', {
            name: 'Muscle Building Meal Plan',
            description: 'High-protein, calorie-surplus plan for muscle growth',
            goal: 'Muscle Gain',
            durationWeeks: 12,
            activeDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
            dailyCalorieTarget: 3000,
            hydrationTarget: '4 liters',
            coachNote:
                'Focus on protein intake (2g per kg body weight). Eat every 3-4 hours.',
            mealTemplate: [
                {
                    mealType: 'breakfast',
                    title: 'Protein Pancakes',
                    description: '4 egg whites, oats, banana, peanut butter',
                    calories: 550,
                },
                {
                    mealType: 'lunch',
                    title: 'Beef & Rice Bowl',
                    description: 'Lean beef, brown rice, broccoli, avocado',
                    calories: 750,
                },
                {
                    mealType: 'snack',
                    title: 'Chicken Wrap',
                    description: 'Whole wheat wrap, grilled chicken, hummus',
                    calories: 400,
                },
                {
                    mealType: 'dinner',
                    title: 'Steak with Sweet Potato',
                    description: 'Ribeye steak, sweet potato, asparagus',
                    calories: 800,
                },
                {
                    mealType: 'postWorkout',
                    title: 'Mass Gainer Shake',
                    description: 'Whey protein, oats, banana, whole milk, peanut butter',
                    calories: 500,
                },
            ],
            createdBy: trainerId,
            createdAt: now,
            updatedAt: now,
        })

        // Create workout logs for clients
        const workoutLog1Id = await ctx.db.insert('workoutLogs', {
            userId: client1Id,
            startTime: now - 7 * 24 * 60 * 60 * 1000, // 7 days ago
            endTime: now - 7 * 24 * 60 * 60 * 1000 + 3600000, // 1 hour later
            status: 'completed',
            workoutType: 'strength',
            duration: 60,
            caloriesBurned: 350,
            createdAt: now - 7 * 24 * 60 * 60 * 1000,
            updatedAt: now - 7 * 24 * 60 * 60 * 1000,
        })

        await ctx.db.insert('workouts', {
            workoutLogId: workoutLog1Id,
            exercises: [
                {
                    createdAt: now - 7 * 24 * 60 * 60 * 1000,
                    exerciseName: 'Barbell Bench Press',
                    sets: 3,
                    reps: 10,
                    weight: 60,
                    notes: 'Felt good',
                },
                {
                    createdAt: now - 7 * 24 * 60 * 60 * 1000,
                    exerciseName: 'Barbell Squat',
                    sets: 3,
                    reps: 10,
                    weight: 80,
                    notes: 'Good form',
                },
                {
                    createdAt: now - 7 * 24 * 60 * 60 * 1000,
                    exerciseName: 'Lat Pulldown',
                    sets: 3,
                    reps: 12,
                    weight: 50,
                },
            ],
            createdAt: now - 7 * 24 * 60 * 60 * 1000,
            updatedAt: now - 7 * 24 * 60 * 60 * 1000,
        })

        const workoutLog2Id = await ctx.db.insert('workoutLogs', {
            userId: client2Id,
            startTime: now - 3 * 24 * 60 * 60 * 1000, // 3 days ago
            endTime: now - 3 * 24 * 60 * 60 * 1000 + 4500000, // 75 minutes
            status: 'completed',
            workoutType: 'strength',
            duration: 75,
            caloriesBurned: 450,
            createdAt: now - 3 * 24 * 60 * 60 * 1000,
            updatedAt: now - 3 * 24 * 60 * 60 * 1000,
        })

        await ctx.db.insert('workouts', {
            workoutLogId: workoutLog2Id,
            exercises: [
                {
                    createdAt: now - 3 * 24 * 60 * 60 * 1000,
                    exerciseName: 'Deadlift',
                    sets: 3,
                    reps: 8,
                    weight: 120,
                    notes: 'New PR!',
                },
                {
                    createdAt: now - 3 * 24 * 60 * 60 * 1000,
                    exerciseName: 'Barbell Overhead Press',
                    sets: 3,
                    reps: 10,
                    weight: 45,
                },
                {
                    createdAt: now - 3 * 24 * 60 * 60 * 1000,
                    exerciseName: 'Bent-Over Barbell Row',
                    sets: 3,
                    reps: 10,
                    weight: 70,
                },
            ],
            createdAt: now - 3 * 24 * 60 * 60 * 1000,
            updatedAt: now - 3 * 24 * 60 * 60 * 1000,
        })

        // Create diet logs
        await ctx.db.insert('dietLogs', {
            userId: client1Id,
            mealType: 'breakfast',
            title: 'Oatmeal with Berries',
            description: 'Oats, blueberries, almond milk',
            calories: 350,
            createdAt: now - 2 * 60 * 60 * 1000, // 2 hours ago
        })

        await ctx.db.insert('dietLogs', {
            userId: client1Id,
            mealType: 'lunch',
            title: 'Grilled Chicken Salad',
            description: 'Chicken breast, mixed greens, olive oil',
            calories: 450,
            createdAt: now - 6 * 60 * 60 * 1000, // 6 hours ago
        })

        await ctx.db.insert('dietLogs', {
            userId: client2Id,
            mealType: 'breakfast',
            title: 'Protein Pancakes',
            description: 'Eggs, oats, banana, peanut butter',
            calories: 550,
            createdAt: now - 3 * 60 * 60 * 1000, // 3 hours ago
        })

        await ctx.db.insert('dietLogs', {
            userId: client2Id,
            mealType: 'postWorkout',
            title: 'Mass Gainer Shake',
            description: 'Whey protein, oats, banana, milk',
            calories: 500,
            createdAt: now - 1 * 60 * 60 * 1000, // 1 hour ago
        })

        // Create weight logs
        await ctx.db.insert('weightLogs', {
            userId: client1Id,
            weight: 72.5,
            createdAt: now - 30 * 24 * 60 * 60 * 1000, // 30 days ago
        })

        await ctx.db.insert('weightLogs', {
            userId: client1Id,
            weight: 71.8,
            createdAt: now - 23 * 24 * 60 * 60 * 1000,
        })

        await ctx.db.insert('weightLogs', {
            userId: client1Id,
            weight: 71.2,
            createdAt: now - 16 * 24 * 60 * 60 * 1000,
        })

        await ctx.db.insert('weightLogs', {
            userId: client1Id,
            weight: 70.5,
            createdAt: now - 9 * 24 * 60 * 60 * 1000,
        })

        await ctx.db.insert('weightLogs', {
            userId: client1Id,
            weight: 70.0,
            createdAt: now - 2 * 24 * 60 * 60 * 1000,
        })

        await ctx.db.insert('weightLogs', {
            userId: client2Id,
            weight: 78.0,
            createdAt: now - 30 * 24 * 60 * 60 * 1000,
        })

        await ctx.db.insert('weightLogs', {
            userId: client2Id,
            weight: 79.2,
            createdAt: now - 23 * 24 * 60 * 60 * 1000,
        })

        await ctx.db.insert('weightLogs', {
            userId: client2Id,
            weight: 80.5,
            createdAt: now - 16 * 24 * 60 * 60 * 1000,
        })

        await ctx.db.insert('weightLogs', {
            userId: client2Id,
            weight: 81.8,
            createdAt: now - 9 * 24 * 60 * 60 * 1000,
        })

        await ctx.db.insert('weightLogs', {
            userId: client2Id,
            weight: 83.0,
            createdAt: now - 2 * 24 * 60 * 60 * 1000,
        })

        return {
            success: true,
            message: 'Database seeded successfully',
            created: {
                users: 4,
                userMeta: 4,
                trainingPlans: 2,
                dietPlans: 2,
                workoutLogs: 2,
                workouts: 2,
                dietLogs: 4,
                weightLogs: 10,
            },
        }
    },
})

// Clear all data from the database (use with caution!)
export const clearDatabase = mutation({
    handler: async (ctx) => {
        // Delete all records from each table
        const tables = [
            'users',
            'userMeta',
            'workoutLogs',
            'workouts',
            'dietLogs',
            'weightLogs',
            'trainingPlans',
            'dietPlans',
        ] as const

        let totalDeleted = 0

        for (const table of tables) {
            const records = await ctx.db.query(table).collect()
            for (const record of records) {
                await ctx.db.delete(record._id)
                totalDeleted++
            }
        }

        return {
            success: true,
            message: 'Database cleared successfully',
            deletedRecords: totalDeleted,
        }
    },
})
