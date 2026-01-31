import { createFileRoute } from '@tanstack/react-router'
import {
  Activity,
  Clock,
  TrendingUp,
  Flame,
  Scale,
  UtensilsCrossed,
  Camera,
  X,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MOCK_WORKOUT_LOGS } from '@/lib/mock-data'
import { ChartRadialLabel } from '@/components/charts/chart-radial-label'
import { TodayProgressChart } from '@/components/charts/today-progress-chart'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useState } from 'react'
import { toast } from 'sonner'
import { MEAL_TYPES } from '@/lib/constants'

export const Route = createFileRoute('/app/_user/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [weightDrawerOpen, setWeightDrawerOpen] = useState(false)
  const [weight, setWeight] = useState('')

  const [dietDrawerOpen, setDietDrawerOpen] = useState(false)
  const [mealType, setMealType] =
    useState<(typeof MEAL_TYPES)[number]>('breakfast')
  const [dietTitle, setDietTitle] = useState('')
  const [dietDescription, setDietDescription] = useState('')
  const [calories, setCalories] = useState('')

  const handleLogWeight = () => {
    const weightValue = parseFloat(weight)
    if (isNaN(weightValue) || weightValue <= 0) {
      toast.error('Please enter a valid weight')
      return
    }

    // TODO: Call convex mutation to save weight
    // await addWeightLog({ userId: currentUser.id, weight: weightValue })
    toast.success(`Weight logged: ${weightValue} kg`)
    setWeight('')
    setWeightDrawerOpen(false)
  }

  const handleLogDiet = () => {
    if (!dietTitle.trim()) {
      toast.error('Please enter a meal title')
      return
    }
    const caloriesValue = parseFloat(calories)
    if (isNaN(caloriesValue) || caloriesValue <= 0) {
      toast.error('Please enter valid calories')
      return
    }

    // TODO: Call convex mutation to save diet
    // await addDietLog({ userId: currentUser.id, mealType, title: dietTitle, description: dietDescription, calories: caloriesValue })
    toast.success(
      `${mealType.charAt(0).toUpperCase() + mealType.slice(1)} logged!`,
    )
    setDietTitle('')
    setDietDescription('')
    setCalories('')
    setDietDrawerOpen(false)
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="pt-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Weekly Summary */}

      <Card>
        <CardHeader>
          <CardTitle>Weekly Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Simple Bar Chart - Calories Burned */}
          <div>
            <h3 className="text-sm font-medium mb-3">Calories Burned</h3>
            <div className="flex items-end justify-between h-32 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
                (day, i) => {
                  const calories = [350, 0, 320, 340, 300, 360, 150][i]
                  const height = (calories / 400) * 100
                  return (
                    <div
                      key={day}
                      className="flex-1 flex flex-col items-center gap-2"
                    >
                      <div
                        className="w-full bg-muted rounded-t-lg relative"
                        style={{
                          height: `${height}%`,
                          minHeight: calories > 0 ? '20%' : '0',
                        }}
                      >
                        <div className="absolute inset-0 bg-chart-1 rounded-t-lg" />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {day}
                      </span>
                    </div>
                  )
                },
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Flame className="w-4 h-4" />
                <span className="text-sm">Total Calories</span>
              </div>
              <div className="text-2xl font-bold">1,820</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Total Time</span>
              </div>
              <div className="text-2xl font-bold">5h 15m</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Activity className="w-4 h-4" />
                <span className="text-sm">Workouts</span>
              </div>
              <div className="text-2xl font-bold">5</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Avg/Day</span>
              </div>
              <div className="text-2xl font-bold">260 cal</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Stats - Radial Chart */}
      <TodayProgressChart />

      {/* Quick Access */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full" size="lg">
            <Activity className="w-5 h-5 mr-2" />
            Start Today's Workout
          </Button>
          <Button
            className="w-full"
            size="lg"
            variant="outline"
            onClick={() => setWeightDrawerOpen(true)}
          >
            <Scale className="w-5 h-5 mr-2" />
            Log Weight
          </Button>
          <Button
            className="w-full"
            size="lg"
            variant="outline"
            onClick={() => setDietDrawerOpen(true)}
          >
            <UtensilsCrossed className="w-5 h-5 mr-2" />
            Log Diet
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {MOCK_WORKOUT_LOGS.slice(0, 3).map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium capitalize">
                    {log.workoutType} Workout
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {log.duration} min • {log.caloriesBurned} cal
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(log.startTime).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Weight Log Drawer */}
      <Drawer open={weightDrawerOpen} onOpenChange={setWeightDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => setWeightDrawerOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Scale className="h-7 w-7 text-primary" />
            </div>
            <DrawerTitle className="text-center text-xl">
              Log Your Weight
            </DrawerTitle>
            <DrawerDescription className="text-center">
              Track your weight progress over time
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-4">
            <div className="space-y-6">
              <div className="space-y-3">
                <label
                  htmlFor="weight"
                  className="block text-sm font-medium text-muted-foreground text-center"
                >
                  Current Weight
                </label>
                <div className="flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      const current = parseFloat(weight) || 70
                      setWeight((current - 0.5).toFixed(1))
                    }}
                    className="h-14 w-14 rounded-full p-0"
                  >
                    <span className="text-xl font-semibold">-</span>
                  </Button>

                  <div className="relative flex-1 max-w-[200px]">
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleLogWeight()
                        }
                      }}
                      className="pr-12 text-2xl h-14 text-center font-bold"
                      autoFocus
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-lg">
                      kg
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      const current = parseFloat(weight) || 70
                      setWeight((current + 0.5).toFixed(1))
                    }}
                    className="h-14 w-14 rounded-full p-0"
                  >
                    <span className="text-xl font-semibold">+</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DrawerFooter className="pt-2">
            <Button
              onClick={handleLogWeight}
              size="lg"
              className="w-full"
              disabled={!weight || parseFloat(weight) <= 0}
            >
              <Scale className="mr-2 h-4 w-4" />
              Log Weight
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Diet Log Drawer */}
      <Drawer open={dietDrawerOpen} onOpenChange={setDietDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => setDietDrawerOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <UtensilsCrossed className="h-7 w-7 text-primary" />
            </div>
            <DrawerTitle className="text-center text-xl">
              Log Your Meal
            </DrawerTitle>
            <DrawerDescription className="text-center">
              Track your nutrition and calories
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-4">
            <div className="space-y-4">
              {/* Meal Type Tabs */}
              <Tabs
                defaultValue="breakfast"
                value={mealType}
                onValueChange={(v) => setMealType(v as typeof mealType)}
              >
                <TabsList className="grid w-full grid-cols-5">
                  {MEAL_TYPES.map((type) => (
                    <TabsTrigger
                      key={type}
                      value={type}
                      className="text-xs capitalize"
                    >
                      {type === 'postWorkout' ? 'Post' : type}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              {/* Camera Button */}
              <Button variant="outline" className="w-full h-32 border-dashed">
                <div className="flex flex-col items-center gap-2">
                  <Camera className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Add Photo
                  </span>
                </div>
              </Button>

              {/* Title Input */}
              <div className="space-y-2">
                <label htmlFor="diet-title" className="text-sm font-medium">
                  Meal Title
                </label>
                <Input
                  id="diet-title"
                  type="text"
                  placeholder="e.g., Grilled Chicken Salad"
                  value={dietTitle}
                  onChange={(e) => setDietTitle(e.target.value)}
                  className="h-11"
                />
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <label
                  htmlFor="diet-description"
                  className="text-sm font-medium"
                >
                  Description
                </label>
                <textarea
                  id="diet-description"
                  placeholder="Add notes about your meal..."
                  value={dietDescription}
                  onChange={(e) => setDietDescription(e.target.value)}
                  className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Calories Input */}
              <div className="space-y-2">
                <label htmlFor="calories" className="text-sm font-medium">
                  Calories
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      const current = parseFloat(calories) || 0
                      setCalories(Math.max(0, current - 50).toString())
                    }}
                    className="h-11 w-11 rounded-full p-0"
                  >
                    <span className="text-xl font-semibold">-</span>
                  </Button>

                  <div className="relative flex-1">
                    <Input
                      id="calories"
                      type="number"
                      step="10"
                      placeholder="0"
                      value={calories}
                      onChange={(e) => setCalories(e.target.value)}
                      className="pr-16 text-lg h-11 text-center font-semibold"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                      kcal
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      const current = parseFloat(calories) || 0
                      setCalories((current + 50).toString())
                    }}
                    className="h-11 w-11 rounded-full p-0"
                  >
                    <span className="text-xl font-semibold">+</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DrawerFooter className="pt-2">
            <Button
              onClick={handleLogDiet}
              size="lg"
              className="w-full"
              disabled={
                !dietTitle.trim() || !calories || parseFloat(calories) <= 0
              }
            >
              <UtensilsCrossed className="mr-2 h-4 w-4" />
              Log Meal
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
