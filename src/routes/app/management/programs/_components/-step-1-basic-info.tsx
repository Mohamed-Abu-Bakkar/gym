import type { ProgramFormData } from '../new'

type StepBasicInfoProps = {
  programForm: ProgramFormData
  setProgramForm: React.Dispatch<React.SetStateAction<ProgramFormData>>
}

export function StepBasicInfo({
  programForm,
  setProgramForm,
}: StepBasicInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium">Program Name *</label>
        <input
          className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-base"
          placeholder="e.g., Strength Builder 12-Week"
          value={programForm.name}
          onChange={(e) =>
            setProgramForm((prev) => ({ ...prev, name: e.target.value }))
          }
          autoFocus
        />
      </div>
      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-base"
          rows={6}
          placeholder="Describe the program goals, approach, and what participants can expect..."
          value={programForm.description}
          onChange={(e) =>
            setProgramForm((prev) => ({ ...prev, description: e.target.value }))
          }
        />
      </div>
      <div>
        <label className="text-sm font-medium">Duration (Weeks)</label>
        <input
          type="number"
          min="1"
          max="52"
          className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-base"
          value={programForm.durationWeeks}
          onChange={(e) =>
            setProgramForm((prev) => ({
              ...prev,
              durationWeeks: parseInt(e.target.value) || 1,
            }))
          }
        />
        <p className="text-xs text-muted-foreground mt-2">
          Recommended: 4-12 weeks for most programs
        </p>
      </div>
    </div>
  )
}
