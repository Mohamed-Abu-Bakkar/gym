import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Scale, Utensils, Plus, Trash2, TrendingDown } from 'lucide-react'
import { useQuery, useMutation } from 'convex/react'
import { toast } from 'sonner'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from '@/components/animate-ui/components/radix/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/components/auth/useAuth'
import { api } from '../../../../convex/_generated/api'

export const Route = createFileRoute('/app/_user/logs')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useAuth()
  const [weight, setWeight] = useState('')
  const [isAddingWeight, setIsAddingWeight] = useState(false)

  // Queries
  const weightLogs = useQuery(
    api.weightLogs.getWeightLogsByUser,
    user ? { userId: user._id } : 'skip',
  )
  const dietLogs = useQuery(
    api.dietLogs.getDietLogsByUser,
    user ? { userId: user._id, limit: 20 } : 'skip',
  )

  // Mutations
  const addWeightLog = useMutation(api.weightLogs.addWeightLog)
  const deleteDietLog = useMutation(api.dietLogs.deleteDietLog)

  const handleAddWeight = async () => {
    const weightValue = parseFloat(weight)
    if (!user || isNaN(weightValue) || weightValue <= 0) {
      toast.error('Please enter a valid weight')
      return
    }

    try {
      await addWeightLog({ userId: user._id, weight: weightValue })
      toast.success('Weight logged successfully!')
      setWeight('')
      setIsAddingWeight(false)
    } catch (error) {
      toast.error('Failed to log weight')
      console.error(error)
    }
  }

  const handleDeleteDiet = async (dietLogId: any) => {
    try {
      await deleteDietLog({ dietLogId })
      toast.success('Diet log deleted')
    } catch (error) {
      toast.error('Failed to delete diet log')
      console.error(error)
    }
  }

  if (!user) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Please sign in to view logs</p>
      </div>
    )
  }

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
            <Card>
              <CardHeader>
                <CardTitle>Diet Logging</CardTitle>
                <CardDescription>Track your daily nutrition</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!dietLogs && (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading...
                  </div>
                )}

                {dietLogs && dietLogs.length === 0 && (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <Utensils className="h-8 w-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">No meals logged yet</h3>
                      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                        Start tracking your nutrition from the dashboard.
                      </p>
                    </div>
                  </div>
                )}

                {dietLogs && dietLogs.length > 0 && (
                  <div className="space-y-3">
                    {dietLogs.map((log) => (
                      <div
                        key={log._id}
                        className="flex items-start justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium uppercase text-muted-foreground">
                              {log.mealType}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(log.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h4 className="font-medium">{log.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {log.description}
                          </p>
                          <div className="mt-2">
                            <span className="text-sm font-semibold text-primary">
                              {log.calories} cal
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteDiet(log._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Weight Tab */}
          <TabsContent value="weight" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Weight Tracking</CardTitle>
                    <CardDescription>
                      Monitor your weight progress
                    </CardDescription>
                  </div>
                  {!isAddingWeight && (
                    <Button size="sm" onClick={() => setIsAddingWeight(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Log Weight
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isAddingWeight && (
                  <div className="flex gap-2 p-4 border rounded-lg bg-muted/50">
                    <Input
                      type="number"
                      placeholder="Weight (kg)"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      step="0.1"
                    />
                    <Button onClick={handleAddWeight}>Save</Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddingWeight(false)
                        setWeight('')
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}

                {!weightLogs && (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading...
                  </div>
                )}

                {weightLogs && weightLogs.length === 0 && (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <Scale className="h-8 w-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">No weight logs yet</h3>
                      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                        Start tracking your weight progress.
                      </p>
                    </div>
                  </div>
                )}

                {weightLogs && weightLogs.length > 0 && (
                  <div className="space-y-3">
                    {weightLogs.map((log, index) => {
                      const prevWeight =
                        index < weightLogs.length - 1
                          ? weightLogs[index + 1].weight
                          : null
                      const change = prevWeight ? log.weight - prevWeight : 0

                      return (
                        <div
                          key={log._id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">
                              {new Date(log.createdAt).toLocaleDateString(
                                'en-US',
                                {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                },
                              )}
                            </div>
                            <div className="text-2xl font-bold">
                              {log.weight} kg
                            </div>
                          </div>
                          {change !== 0 && (
                            <div
                              className={`flex items-center gap-1 text-sm ${
                                change < 0
                                  ? 'text-green-600'
                                  : 'text-orange-600'
                              }`}
                            >
                              <TrendingDown
                                className={`h-4 w-4 ${change > 0 ? 'rotate-180' : ''}`}
                              />
                              {Math.abs(change).toFixed(1)} kg
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </TabsContents>
      </Tabs>
    </div>
  )
}
