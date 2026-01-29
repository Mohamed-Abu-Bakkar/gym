'use client'

import { RadialBar, RadialBarChart } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { TODAY_STATS } from '@/lib/mock-data'
import { SlidingNumber } from '@/components/animate-ui/primitives/texts/sliding-number'

const chartConfig = {
  calories: {
    label: 'Calories',
    color: 'var(--chart-1)',
  },
  workout: {
    label: 'Workout',
    color: 'var(--chart-2)',
  },
  steps: {
    label: 'Steps',
    color: 'var(--chart-4)',
  },
} satisfies ChartConfig

export function TodayProgressChart() {
  const caloriesPercent = Math.round(
    (TODAY_STATS.goals.calories.current / TODAY_STATS.goals.calories.target) *
      100,
  )
  const workoutPercent = Math.round(
    (TODAY_STATS.goals.workoutTime.current /
      TODAY_STATS.goals.workoutTime.target) *
      100,
  )
  const stepsPercent = Math.round(
    (TODAY_STATS.goals.steps.current / TODAY_STATS.goals.steps.target) * 100,
  )

  const chartData = [
    { metric: 'steps', value: stepsPercent, fill: 'var(--color-steps)' },
    { metric: 'workout', value: workoutPercent, fill: 'var(--color-workout)' },
    {
      metric: 'calories',
      value: caloriesPercent,
      fill: 'var(--color-calories)',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-8">
          {/* Radial Chart */}
          <div className="relative overflow-visible">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square w-60 h-60 overflow-visible"
            >
              <RadialBarChart
                data={chartData}
                startAngle={-90}
                endAngle={270}
                innerRadius={23}
                outerRadius={83}
              >
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel nameKey="metric" />}
                />
                <RadialBar dataKey="value" background cornerRadius={8} />
              </RadialBarChart>
            </ChartContainer>

            {/* Center Text */}
            {/* <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="flex items-end gap-1 text-xl font-bold tabular-nums">
                <SlidingNumber
                  number={caloriesPercent}
                  fromNumber={0}
                />
                <span>%</span>
              </div>
            </div> */}
          </div>

          {/* Legends */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-chart-1" />
              <div>
                <div className="text-sm font-medium">Calories</div>
                <div className="text-xs text-muted-foreground">
                  {TODAY_STATS.goals.calories.current} /{' '}
                  {TODAY_STATS.goals.calories.target} cal
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-chart-2" />
              <div>
                <div className="text-sm font-medium">fat</div>
                <div className="text-xs text-muted-foreground">
                  {TODAY_STATS.goals.workoutTime.current} /{' '}
                  {TODAY_STATS.goals.workoutTime.target} min
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-chart-4" />
              <div>
                <div className="text-sm font-medium">Workout</div>
                <div className="text-xs text-muted-foreground">
                  {TODAY_STATS.goals.steps.current.toLocaleString()} /{' '}
                  {TODAY_STATS.goals.steps.target.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
