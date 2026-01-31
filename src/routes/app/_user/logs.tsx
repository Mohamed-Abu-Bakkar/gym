import { createFileRoute } from '@tanstack/react-router'
import { Utensils, Scale, Plus, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsContents,
} from '@/components/animate-ui/components/radix/tabs'
import { Button } from '@/components/ui/button'
import { MOCK_DIET_LOGS, MOCK_WEIGHT_LOGS } from '@/lib/mock-data'

export const Route = createFileRoute('/app/_user/logs')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="pt-4">
        <h1 className="text-2xl font-bold">Logs</h1>
        <p className="text-muted-foreground">Track your diet and weight</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="diet">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="diet">Diet</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
        </TabsList>

        <TabsContents className="mt-4">
          {/* Diet Tab */}
          <TabsContent value="diet" className="space-y-4">
            {/* Daily Calorie Summary */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Today's Calories</CardTitle>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Meal
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold">1,200</div>
                  <div className="text-sm text-muted-foreground">
                    of 2,200 cal goal
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-2 bg-muted rounded-full mt-4">
                    <div
                      className="h-full bg-chart-4 rounded-full transition-all"
                      style={{ width: `${(1200 / 2200) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Meal Breakdown */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'Breakfast', calories: 450, color: 'bg-chart-1' },
                    { name: 'Lunch', calories: 550, color: 'bg-chart-2' },
                    { name: 'Dinner', calories: 0, color: 'bg-chart-3' },
                    { name: 'Snacks', calories: 200, color: 'bg-chart-4' },
                  ].map((meal) => (
                    <div
                      key={meal.name}
                      className="p-3 rounded-lg border bg-card"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${meal.color}`} />
                        <span className="text-xs text-muted-foreground">
                          {meal.name}
                        </span>
                      </div>
                      <div className="text-lg font-semibold">
                        {meal.calories}
                      </div>
                      <div className="text-xs text-muted-foreground">cal</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Calorie Intake Graph */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Intake</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between h-32 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
                    (day, i) => {
                      const calories = [
                        2100, 1950, 2300, 2150, 2000, 2400, 1200,
                      ][i]
                      const height = (calories / 2500) * 100
                      return (
                        <div
                          key={day}
                          className="flex-1 flex flex-col items-center gap-2"
                        >
                          <div
                            className="w-full bg-chart-4 rounded-t-lg relative"
                            style={{ height: `${height}%`, minHeight: '20%' }}
                          />
                          <span className="text-xs text-muted-foreground">
                            {day}
                          </span>
                        </div>
                      )
                    },
                  )}
                </div>
                <div className="text-center mt-4 text-sm text-muted-foreground">
                  Average: 2,014 cal/day
                </div>
              </CardContent>
            </Card>

            {/* Meal Log Entries */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Meals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {MOCK_DIET_LOGS.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-chart-4/10 flex items-center justify-center">
                        <Utensils className="w-5 h-5 text-chart-4" />
                      </div>
                      <div>
                        <div className="font-medium capitalize">
                          {log.mealType}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {log.description}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(log.createdAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{log.calories}</div>
                      <div className="text-xs text-muted-foreground">cal</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Weight Tab */}
          <TabsContent value="weight" className="space-y-4">
            {/* Current Weight */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Current Weight</CardTitle>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Log Weight
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold">
                    {MOCK_WEIGHT_LOGS[0].weight}
                  </div>
                  <div className="text-sm text-muted-foreground">kg</div>

                  {/* Progress indicator */}
                  <div className="mt-6 p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Target Weight
                        </div>
                        <div className="text-xl font-semibold">175 kg</div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-chart-2">
                          <TrendingDown className="w-4 h-4" />
                          <span className="font-semibold">-3.5 kg</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          5.5 kg to go
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weight Over Time Graph */}
            <Card>
              <CardHeader>
                <CardTitle>Weight Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-48">
                  {/* Simple line chart visualization */}
                  <svg className="w-full h-full" viewBox="0 0 300 150">
                    {/* Grid lines */}
                    {[0, 1, 2, 3, 4].map((i) => (
                      <line
                        key={i}
                        x1="0"
                        y1={30 * i}
                        x2="300"
                        y2={30 * i}
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-muted/20"
                      />
                    ))}

                    {/* Weight line */}
                    <polyline
                      points={MOCK_WEIGHT_LOGS.map((log, i) => {
                        const x = (i / (MOCK_WEIGHT_LOGS.length - 1)) * 280 + 10
                        const y = 140 - ((log.weight - 180) / 5) * 120
                        return `${x},${y}`
                      }).join(' ')}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="text-chart-2"
                    />

                    {/* Data points */}
                    {MOCK_WEIGHT_LOGS.map((log, i) => {
                      const x = (i / (MOCK_WEIGHT_LOGS.length - 1)) * 280 + 10
                      const y = 140 - ((log.weight - 180) / 5) * 120
                      return (
                        <circle
                          key={log.id}
                          cx={x}
                          cy={y}
                          r="4"
                          fill="currentColor"
                          className="text-chart-2"
                        />
                      )
                    })}
                  </svg>

                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground py-2">
                    <span>185</span>
                    <span>184</span>
                    <span>183</span>
                    <span>181</span>
                    <span>180</span>
                  </div>
                </div>

                <div className="text-center mt-4 text-sm text-muted-foreground">
                  Last 6 weeks
                </div>
              </CardContent>
            </Card>

            {/* Weight Log Entries */}
            <Card>
              <CardHeader>
                <CardTitle>Weight History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {MOCK_WEIGHT_LOGS.map((log, index) => {
                  const prevWeight = MOCK_WEIGHT_LOGS[index + 1]?.weight
                  const diff = prevWeight ? log.weight - prevWeight : 0

                  return (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-chart-2/10 flex items-center justify-center">
                          <Scale className="w-5 h-5 text-chart-2" />
                        </div>
                        <div>
                          <div className="font-medium">{log.weight} kg</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(log.createdAt).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              },
                            )}
                          </div>
                        </div>
                      </div>
                      {diff !== 0 && (
                        <div
                          className={`text-sm font-medium ${
                            diff < 0 ? 'text-chart-2' : 'text-chart-5'
                          }`}
                        >
                          {diff > 0 ? '+' : ''}
                          {diff.toFixed(1)} kg
                        </div>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>
        </TabsContents>
      </Tabs>
    </div>
  )
}
