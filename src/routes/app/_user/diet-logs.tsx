import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { useState } from 'react'
import { Plus, Utensils } from 'lucide-react'
import { toast } from 'sonner'

import { api } from '../../../../convex/_generated/api'
import { useAuth } from '@/components/auth/useAuth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const Route = createFileRoute('/app/_user/diet-logs')({
  component: RouteComponent,
})

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'postWorkout'

function RouteComponent() {
  const { user } = useAuth()
  const [isAddingMeal, setIsAddingMeal] = useState(false)
  const [mealType, setMealType] = useState<MealType>('breakfast')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [calories, setCalories] = useState('')

  const todayLogs = useQuery(
    api.dietLogs.getTodayDietLogs,
    user ? { userId: user._id } : 'skip',
  )
  const todayCalories = useQuery(
    api.dietLogs.getTodayCalories,
    user ? { userId: user._id } : 'skip',
  )
  const addDietLog = useMutation(api.dietLogs.addDietLog)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !title || !calories) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      await addDietLog({
        userId: user._id,
        mealType,
        title,
        description,
        calories: parseFloat(calories),
      })

      toast.success('Meal logged successfully!')
      setTitle('')
      setDescription('')
      setCalories('')
      setIsAddingMeal(false)
    } catch (error) {
      toast.error('Failed to log meal')
      console.error('Error logging meal:', error)
    }
  }

  const getMealTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      dinner: 'Dinner',
      snack: 'Snack',
      postWorkout: 'Post Workout',
    }
    return labels[type] || type
  }

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Header */}
      <div className="pt-4">
        <h1 className="text-2xl font-bold">Diet Tracking</h1>
        <p className="text-muted-foreground">Log your daily nutrition</p>
      </div>

      {/* Today's Calories Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Calories</CardTitle>
          <CardDescription>Total calories consumed today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">
            {todayCalories?.totalCalories || 0}
            <span className="text-lg text-muted-foreground ml-2">kcal</span>
          </div>
        </CardContent>
      </Card>

      {/* Add Meal Button */}
      {!isAddingMeal && (
        <Button onClick={() => setIsAddingMeal(true)} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Meal
        </Button>
      )}

      {/* Add Meal Form */}
      {isAddingMeal && (
        <Card>
          <CardHeader>
            <CardTitle>Log a Meal</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Meal Type</label>
                <Select
                  value={mealType}
                  onValueChange={(value) => setMealType(value as MealType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                    <SelectItem value="postWorkout">Post Workout</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Meal Title</label>
                <Input
                  placeholder="e.g., Grilled Chicken Salad"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  placeholder="Optional details about the meal"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Calories</label>
                <Input
                  type="number"
                  placeholder="e.g., 450"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Log Meal
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddingMeal(false)
                    setTitle('')
                    setDescription('')
                    setCalories('')
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Today's Meals */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Today's Meals</h2>
        {todayLogs && todayLogs.length > 0 ? (
          todayLogs.map((log) => (
            <Card key={log._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{log.title}</CardTitle>
                    <CardDescription>
                      {getMealTypeLabel(log.mealType)}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{log.calories}</div>
                    <div className="text-xs text-muted-foreground">kcal</div>
                  </div>
                </div>
              </CardHeader>
              {log.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {log.description}
                  </p>
                </CardContent>
              )}
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Utensils className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">No meals logged today</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Start tracking your nutrition by adding your first meal
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
