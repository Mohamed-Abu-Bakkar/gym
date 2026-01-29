import { createFileRoute } from '@tanstack/react-router'
import { Activity, Clock, TrendingUp, Flame } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MOCK_WORKOUT_LOGS } from '@/lib/mock-data'
import { ChartRadialLabel } from '@/components/charts/chart-radial-label'
import { TodayProgressChart } from '@/components/charts/today-progress-chart'

export const Route = createFileRoute('/app/_user/')({
  component: RouteComponent,
})

function RouteComponent() {
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

      {/* Today's Stats - Radial Chart */}
      <TodayProgressChart />

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

      {/* Quick Access */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="w-full" size="lg">
            <Activity className="w-5 h-5 mr-2" />
            Start Today's Workout
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
    </div>
  )
}
