import { useAuth } from '@/components/auth/useAuth'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import {
  Activity,
  Droplets,
  Flame,
  LayoutGrid,
  Menu,
  Moon,
  Plus,
  SunMedium,
  UtensilsCrossed,
} from 'lucide-react'

const memberRoles = new Set(['trainerManagedCustomer', 'selfManagedCustomer'])

const macros = [
  {
    label: 'Carb',
    amount: '160g',
    remaining: '120g left',
    accent: 'from-sky-500 to-blue-500',
  },
  {
    label: 'Protein',
    amount: '140g',
    remaining: '80g left',
    accent: 'from-indigo-400 to-purple-500',
  },
  {
    label: 'Fat',
    amount: '55g',
    remaining: '110g left',
    accent: 'from-rose-400 to-orange-400',
  },
]

const activitySeries = [
  { day: 'Mon', minutes: 45 },
  { day: 'Tue', minutes: 35 },
  { day: 'Wed', minutes: 62 },
  { day: 'Thu', minutes: 28 },
  { day: 'Fri', minutes: 70 },
  { day: 'Sat', minutes: 40 },
  { day: 'Sun', minutes: 55 },
]

const goal = {
  progress: 73,
  calories: 850,
  plan: 'Fitness Plan',
  quote:
    'Discipline is doing what needs to be done, even if you do not want to do it.',
}

const habitCards = [
  {
    label: 'Hydration',
    value: '2.1 L',
    helper: 'Goal 3.0 L',
    icon: Droplets,
  },
  {
    label: 'Sleep',
    value: '7h 45m',
    helper: 'Last night',
    icon: Moon,
  },
]

const navItems = [
  { label: 'Overview', icon: LayoutGrid, active: true },
  { label: 'Macros', icon: Flame },
  { label: 'Sessions', icon: Activity },
  { label: 'Meals', icon: UtensilsCrossed },
]

export const Route = createFileRoute('/app/_user/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate({ to: '/' })
      } else if (!memberRoles.has(user.role)) {
        navigate({ to: '/app/management/' })
      }
    }
  }, [user, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#040305] text-white">
        <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">
          Syncing your plan…
        </p>
      </div>
    )
  }

  if (!user || !memberRoles.has(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#040305] text-white">
        <div className="rounded-3xl border border-white/10 bg-black/40 px-5 py-4 text-sm text-neutral-400">
          Redirecting you to the right space…
        </div>
      </div>
    )
  }

  const maxMinutes = Math.max(...activitySeries.map((day) => day.minutes))

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#040305] text-white">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#07070b] via-[#05060a] to-[#030305]" />
      <div className="pointer-events-none absolute inset-x-0 top-24 h-72 bg-blue-500/10 blur-[180px]" />
      <div className="pointer-events-none absolute -right-28 bottom-12 h-56 w-56 rounded-full bg-purple-500/20 blur-[140px]" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-16">
        <div className="w-full max-w-[420px]">
          <article className="rounded-[44px] border border-white/10 bg-black/35 px-6 pb-32 pt-8 shadow-[0_25px_70px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
            <header>
              <h1 className="mt-1 text-2xl font-semibold">Dashboard</h1>
              <p className="text-sm text-neutral-400">
                Welcome back, {user.name?.split(' ')[0] ?? 'Athlete'}
              </p>
              <div className="mt-4 inline-flex items-center gap-3 rounded-[24px] border border-white/10 bg-white/5 px-4 py-2 text-sm text-neutral-300">
                <Menu size={16} /> {goal.plan}
              </div>
              <div className="mt-3 text-[13px] text-neutral-500">
                Overall Goal
              </div>
              <div className="mt-1 flex items-center justify-between text-sm">
                <span className="text-neutral-400">{goal.quote}</span>
                <span className="text-sky-300">{goal.progress}%</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-blue-500"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </header>

            <section className="mt-6 rounded-[32px] border border-white/10 bg-gradient-to-b from-[#0b0b12] to-[#05050a] p-6">
              <div className="flex flex-col gap-6 lg:flex-row">
                <div className="relative flex size-32 items-center justify-center rounded-full bg-black/40">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(#58b9ff ${goal.progress * 3.6}deg, #1c1d25 0deg)`,
                    }}
                  />
                  <div className="relative flex size-24 flex-col items-center justify-center rounded-full bg-[#05050a] text-center">
                    <span className="text-3xl font-semibold text-white">
                      {goal.calories}
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      kcal left
                    </span>
                  </div>
                </div>
                <div className="flex-1 space-y-3 text-sm text-neutral-300">
                  {macros.map((macro) => (
                    <div
                      key={macro.label}
                      className="rounded-2xl border border-white/5 bg-white/5 p-3 transition hover:border-sky-300/40 hover:bg-white/10"
                    >
                      <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-500">
                        {macro.label}
                      </p>
                      <p className="text-lg font-semibold text-white">
                        {macro.amount}
                      </p>
                      <div className="mt-2 h-1 rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${macro.accent}`}
                        />
                      </div>
                      <p className="mt-1 text-[11px] text-neutral-400">
                        {macro.remaining}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="mt-6 rounded-[32px] border border-white/10 bg-gradient-to-b from-[#0a0d14] to-[#05070d] p-6 text-sm text-neutral-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-500">Activity Time</p>
                  <p className="text-2xl font-semibold text-white">5h 55m</p>
                </div>
                <div className="rounded-2xl border border-white/5 px-4 py-1 text-xs text-neutral-400">
                  This Week
                </div>
              </div>

              <div className="mt-6 flex items-end gap-3">
                {activitySeries.map(({ day, minutes }) => (
                  <div
                    key={day}
                    className="flex flex-1 flex-col items-center gap-2 text-[11px] text-neutral-500"
                  >
                    <div className="flex h-24 w-full items-end rounded-full bg-white/5 p-1">
                      <div
                        className={`w-full rounded-full bg-gradient-to-t ${minutes === maxMinutes ? 'from-cyan-500 to-blue-500' : 'from-white/20 to-sky-400/70'}`}
                        style={{ height: `${(minutes / maxMinutes) * 100}%` }}
                      />
                    </div>
                    <span>{day}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                    Duration
                  </p>
                  <p className="mt-2 text-xl font-semibold text-white">
                    312 min
                  </p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                    Calories
                  </p>
                  <p className="mt-2 text-xl font-semibold text-white">
                    2,430 kcal
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-6 grid gap-3 sm:grid-cols-2">
              {habitCards.map((card) => (
                <div
                  key={card.label}
                  className="flex items-center justify-between rounded-[28px] border border-white/10 bg-white/5 px-5 py-4 text-sm text-neutral-300 transition hover:border-white/30 hover:bg-white/10"
                >
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-500">
                      {card.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-white">
                      {card.value}
                    </p>
                    <p className="text-xs text-neutral-400">{card.helper}</p>
                  </div>
                  <card.icon className="text-sky-300" size={24} />
                </div>
              ))}
              <div className="flex items-center justify-between rounded-[28px] border border-white/10 bg-gradient-to-r from-[#0b0f16] to-[#080a0f] px-5 py-4 text-sm text-neutral-300">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-500">
                    Sunlight
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    45 min
                  </p>
                  <p className="text-xs text-neutral-400">Outdoor exposure</p>
                </div>
                <SunMedium className="text-amber-300" size={24} />
              </div>
            </section>
          </article>

          <nav className="pointer-events-auto relative -mt-16 flex items-center justify-center">
            <div className="flex h-16 items-center gap-6 rounded-full bg-black/70 px-8 py-3 shadow-[0_15px_45px_rgba(0,0,0,0.6)] backdrop-blur">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  className={`${item.active ? 'text-sky-300' : 'text-neutral-500'} transition hover:text-white`}
                  aria-label={item.label}
                >
                  <item.icon size={20} />
                </button>
              ))}
              <button
                className="relative -mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-sky-400 text-black shadow-[0_15px_40px_rgba(59,130,246,0.35)] transition hover:scale-105"
                aria-label="Primary action"
              >
                <Plus size={32} strokeWidth={1.5} />
              </button>
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}
