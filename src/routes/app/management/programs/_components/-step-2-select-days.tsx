import type { ProgramFormData, DayOfWeek } from '../new'

type StepSelectDaysProps = {
  programForm: ProgramFormData
  setProgramForm: React.Dispatch<React.SetStateAction<ProgramFormData>>
}

const DAYS_OF_WEEK: { value: DayOfWeek; label: string; short: string }[] = [
  { value: 'mon', label: 'Monday', short: 'Mon' },
  { value: 'tue', label: 'Tuesday', short: 'Tue' },
  { value: 'wed', label: 'Wednesday', short: 'Wed' },
  { value: 'thu', label: 'Thursday', short: 'Thu' },
  { value: 'fri', label: 'Friday', short: 'Fri' },
  { value: 'sat', label: 'Saturday', short: 'Sat' },
  { value: 'sun', label: 'Sunday', short: 'Sun' },
]

export function StepSelectDays({
  programForm,
  setProgramForm,
}: StepSelectDaysProps) {
  const addDayToProgram = (day: DayOfWeek) => {
    if (programForm.days.some((d) => d.day === day)) return
    setProgramForm((prev) => ({
      ...prev,
      days: [...prev.days, { day, exercises: [] }],
    }))
  }

  const removeDayFromProgram = (day: DayOfWeek) => {
    setProgramForm((prev) => ({
      ...prev,
      days: prev.days.filter((d) => d.day !== day),
    }))
  }

  return (
    <div className="space-y-6">
      <div className="text-center text-muted-foreground">
        <p>Select the days you want to include in this training program</p>
        <p className="text-sm mt-1">{programForm.days.length} days selected</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {DAYS_OF_WEEK.map((day) => {
          const isSelected = programForm.days.some((d) => d.day === day.value)
          const exerciseCount =
            programForm.days.find((d) => d.day === day.value)?.exercises
              .length || 0

          return (
            <button
              key={day.value}
              type="button"
              onClick={() =>
                isSelected
                  ? removeDayFromProgram(day.value)
                  : addDayToProgram(day.value)
              }
              className={`p-6 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-primary bg-primary/10 shadow-md'
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              <div className="text-center space-y-2">
                <div
                  className={`text-2xl font-bold ${isSelected ? 'text-primary' : ''}`}
                >
                  {day.short}
                </div>
                <div className="text-sm font-medium">{day.label}</div>
                <div className="text-xs text-muted-foreground">
                  {isSelected ? `${exerciseCount} exercises` : 'Tap to add'}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {programForm.days.length === 0 && (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
          <p className="text-sm">No training days selected yet</p>
          <p className="text-xs mt-1">
            Click on the days above to add them to your program
          </p>
        </div>
      )}
    </div>
  )
}
