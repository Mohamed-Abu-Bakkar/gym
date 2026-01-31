import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { StepBasicInfo } from './_components/-step-1-basic-info'
import { StepSelectDays } from './_components/-step-2-select-days'
import { StepAddExercises } from './_components/-step-3-add-exercises'
import { StepReview } from './_components/-step-4-review'

export const Route = createFileRoute('/app/management/programs/new')({
  component: RouteComponent,
})

export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export type ExerciseSet = {
  reps?: number
  weight?: number
  notes?: string
}

export type Exercise = {
  exerciseName: string
  noOfSets: number
  sets: ExerciseSet[]
}

export type DayWorkout = {
  day: DayOfWeek
  exercises: Exercise[]
}

export type ProgramFormData = {
  name: string
  description: string
  durationWeeks: number
  days: DayWorkout[]
}

function RouteComponent() {
  const navigate = useNavigate()
  const [formStep, setFormStep] = useState(1)
  const [programForm, setProgramForm] = useState<ProgramFormData>({
    name: '',
    description: '',
    durationWeeks: 4,
    days: [],
  })

  const handleProgramSubmit = () => {
    console.log('Program created:', programForm)
    // TODO: Save to convex
    navigate({ to: '/app/management/programs' })
  }

  const canProceed = () => {
    switch (formStep) {
      case 1:
        return programForm.name.trim() !== ''
      case 2:
        return programForm.days.length > 0
      case 3:
        return programForm.days.every((d) => d.exercises.length > 0)
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Create Training Program</h1>
            <p className="text-muted-foreground mt-1">
              Step {formStep} of 4 - Build a comprehensive workout program
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate({ to: '/app/management/programs' })}
          >
            Cancel
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center">
          <div className="flex items-center max-w-2xl w-full">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition ${
                    formStep >= step
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted bg-background text-muted-foreground'
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 transition ${
                      formStep > step ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <Card>
          <CardHeader>
            <CardTitle>
              {formStep === 1 && 'Basic Information'}
              {formStep === 2 && 'Select Training Days'}
              {formStep === 3 && 'Add Exercises'}
              {formStep === 4 && 'Review Program'}
            </CardTitle>
            <CardDescription>
              {formStep === 1 &&
                'Enter the program name, description, and duration'}
              {formStep === 2 && 'Choose which days of the week to train'}
              {formStep === 3 && 'Add exercises for each training day'}
              {formStep === 4 && 'Review your program before creating'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {formStep === 1 && (
              <StepBasicInfo
                programForm={programForm}
                setProgramForm={setProgramForm}
              />
            )}
            {formStep === 2 && (
              <StepSelectDays
                programForm={programForm}
                setProgramForm={setProgramForm}
              />
            )}
            {formStep === 3 && (
              <StepAddExercises
                programForm={programForm}
                setProgramForm={setProgramForm}
              />
            )}
            {formStep === 4 && <StepReview programForm={programForm} />}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setFormStep(Math.max(1, formStep - 1))}
            disabled={formStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          {formStep < 4 ? (
            <Button
              size="lg"
              onClick={() => setFormStep(formStep + 1)}
              disabled={!canProceed()}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button size="lg" onClick={handleProgramSubmit}>
              Create Program
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
