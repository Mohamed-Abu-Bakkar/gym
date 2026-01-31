# Management Area Overview

This document captures everything implemented inside `/app/management` so teammates can see what exists and why.

## Access + Shell

- All management routes live under the shared layout in `route.tsx` and render inside a max-width container with the `BottomBarAdmin` navigation.
- `TrainerManagementProvider` wraps the outlet so every screen consumes the same mock-backed store for clients, programs, readiness data, and quick actions.
- Auth guard logic sits inside each route component to keep the console limited to `trainer` and `admin` roles.

## Screens + Purpose

### Dashboard (`index.tsx`)

- **Coach header**: Typography block with greeting, date, focus note, and two `Button` components (`Clear check-ins`, `New block`). The clear action iterates flagged clients through `moveClient('active')`.
- **Readiness card**: `Card` with title, helper copy, weekly load stat, progress bar bound to `summary.readinessScore`.
- **Metric grid**: Four `Card` tiles (Check-ins, Programs updated, Hybrid sessions, Readiness alerts) sourced from `metrics` array.
- **Roster preview**: `Card` containing `Tabs` (`active` | `flagged`), readiness chips, progress bars, and a `View full roster` `Button` that routes to `/app/management/clients`.
- **Quick actions**: `Card` showing two-column grid of clickable tiles (icons from `quickActionIconMap`) for Program Builder, Session Check-ins, Call Client, Readiness Review.
- **Upcoming sessions**: `Card` listing `sessions` array items with status tag and start time.
- **Operations board**: `Card` with three columns showing `opsBoard` notes (status label + description) so coaches can see pending deliverables.

### Clients List (`clients/index.tsx`)

- **Search panel**: Border box containing a search input (`Search` icon + `<input>`) to filter roster plus a tally pill for total clients.
- **Active roster list**: For each client card (`Link`), we render identity info, readiness bar, and action buttons (`Edit`, `Flag`, `Remove`). Buttons call `openEditDrawer`, `moveClient`, and `deleteClient` respectively.
- **Flagged roster list**: Similar layout but tinted destructive colors and actions (`Edit`, `Resolve`, `Remove`). Resolve toggles the record back to `active` via `moveClient`.
- **Add client button**: Primary `Button` near the header opens the drawer in create mode (defaults to active list).
- **Client drawer**: `Drawer` with form fields for Name, Focus, Status, Readiness select, Progress slider (number input), Accent color input, and list selector. Submitting triggers `createClient` or `updateClient`.

### Client Detail (`clients/$clientId.tsx`)

- **Back link + hero card**: Provides navigation, plan label, compliance block, readiness number, and status card.
- **Metrics grid**: `Card` pair displaying performance metrics (weekly volume, sleep average, or data from context) using `detail.metrics`.
- **Readiness drivers**: `Card` with labeled progress bars for sleep, recovery, training load from `detail.readinessBreakdown`.
- **Client status controls**: `Card` containing a form with inputs for status, readiness select, list select, save button, and destructive `Remove client` button (calls `deleteClient`).
- **Recent sessions**: `Card` listing `recentWorkouts` with date/load text or a placeholder message if empty.
- **Action queue**: `Card` showing `detail.actionItems` or empty-state copy.
- **Log workout form**: `Card` with inputs for title, focus, notes, readiness tag. Submit invokes `logClientWorkout`.
- **Log nutrition form**: `Card` with inputs for meal type, description, calories, time stamp. Submit invokes `logClientNutrition`.
- **Nutrition snapshots**: `Card` listing `nutritionLog` entries; shows fallback text when none exist.

### Programs (`programs/index.tsx`)

- **Summary header**: Displays daily label, back button, and `New program` button that opens the drawer.
- **Stat cards**: `Card` pair showing counts for “Active templates” (live + review) and “Athletes assigned” (plus drafts) computed from `programs`.
- **Program shelf**: `Card` listing each program as a selectable button. Each block includes metadata, `Edit` button (opens drawer with data), and `Delete` button.
- **Featured detail panel**: When a program is selected, renders mission card, block timeline (three generated timeline cards), resources list, plus `Duplicate` and `Delete` buttons tied to `duplicateProgram` / `deleteProgram`.
- **Program drawer**: Form with fields for name, focus, level, status, duration weeks, athlete count, headline, overview, goal, and progression notes. Submit either creates via `createProgram` (auto-builds blocks) or updates via `updateProgram`.

## Patterns, Logging, and Reviews

| Action                    | Where it lives                                        | Immediate output                                                                                            | Long-term value / notes                                                                                  |
| ------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Assign workout**        | Program drawer + featured panel                       | Creates/updates a block timeline (“Workout Pattern”) that defines the client schedule to be assigned later. | Keeps structured programming ready so client calendars can be populated once assignment wiring is added. |
| **Assign diet**           | Client detail → Nutrition card (manual logging today) | Links contextual meal notes/photos (placeholder) to the athlete.                                            | Provides audit trail and will support “view diet” review once image upload hooks are wired.              |
| **Pattern finalization**  | Planned “Pattern” button (todo)                       | Commits workout + nutrition plan to a client’s active calendar.                                             | Pushes patterns into daily checklists so they appear in Active Client dashboards.                        |
| **Log workout**           | Client detail → “Log workout” card                    | Adds checklist-style entries to `recentWorkouts`, updating completion status.                               | Feeds readiness/compliance scoring across dashboard metrics.                                             |
| **View diet**             | Client detail → “Nutrition snapshots” card            | Lets coaches audit meal records (text today, photos later).                                                 | Ensures diet adhesion before altering macros or caloric load.                                            |
| **Log weight**            | Upcoming: dedicated form (not built yet)              | Captures daily weight data point needed for analytics.                                                      | Enables automatic weekly average comparison (This Week vs Last Week).                                    |
| **Weight trend analysis** | Planned background calc using weight log              | Produces “Weekly Average Weight” deltas that show trends.                                                   | Supports weekly reviews to judge if current pattern is effective.                                        |

Daily operational map:

- **Assign Pattern** → Use Programs page to craft the workout/diet template, then (future) press the Pattern button to push it onto the client calendar.
- **Daily Logging** → Clients log workouts, nutrition, and weight; trainers record manual entries in the detail page forms. These updates populate the “Active client” dashboard cards and readiness score.
- **Missed Task** → When workout logs are not checked off, `progress` drops which surfaces the athlete inside the flagged list and lowers the readiness bar.
- **Weekly Review** → Once weight logging is in place, coaches will see “This Week vs Last Week” average comparisons to guide macro or training tweaks.

## CRUD coverage

- Clients: create, update, move between active/flagged, delete, log workouts, log meals, edit readiness status.
- Programs: create, edit, duplicate, delete, and manage overview metadata.
- Readiness/ops widgets re-use the same store so state changes flow across every screen without additional wiring.
