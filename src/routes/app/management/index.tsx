import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { BottomBarAdmin } from '@/components/bottom-bar-admin'
import {
  Activity,
  CalendarClock,
  ChevronRight,
  Ellipsis,
  Phone,
  TrendingUp,
} from 'lucide-react'
import { useAuth } from '@/components/auth/useAuth'
import { useQuery } from 'convex/react'
import { api } from 'convex/_generated/api'

const privilegedRoles = new Set(['trainer', 'admin'])

const quickActionIconMap = {
  programBuilder: Activity,
  sessionCheckins: CalendarClock,
  callClient: Phone,
} as const

export const Route = createFileRoute('/app/management/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && (!user || !privilegedRoles.has(user.role))) {
      const destination = user ? '/app/' : '/'
      navigate({ to: destination })
    }
  }, [user, isLoading, navigate])

  const shouldFetchDashboard = !!user && privilegedRoles.has(user?.role ?? '')

  const dashboardData = useQuery(
    api.dashboard.trainerDashboard,
    shouldFetchDashboard ? { trainerId: user!._id } : 'skip',
  )

  const isDashboardLoading = shouldFetchDashboard && dashboardData === undefined

  if (isLoading || isDashboardLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030304] text-white">
        <p className="text-sm uppercase tracking-[0.4em] text-neutral-500">
          Loading coach view…
        </p>
      </div>
    )
  }

  if (!user || !privilegedRoles.has(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030304] text-white">
        <div className="rounded-3xl border border-white/10 bg-black/40 px-6 py-6 text-center text-sm text-neutral-400">
          <p>Redirecting you to your workspace…</p>
        </div>
      </div>
    )
  }

  if (dashboardData === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030304] text-white">
        <div className="rounded-3xl border border-white/10 bg-black/40 px-6 py-6 text-center text-sm text-neutral-400">
          <p>Seed the Convex data with `pnpm convex:seed`, then refresh.</p>
        </div>
      </div>
    )
  }

  const summary = dashboardData.summary
  const activeClients = dashboardData.activeClients
  const microStats = dashboardData.microStats
  const quickActions = dashboardData.quickActions
  const upcomingSessions = dashboardData.upcomingSessions

  return (
    <div className="relative min-h-screen bg-[#030304] pb-40 pt-12 text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#050505] via-[#050708] to-black" />
      <div className="pointer-events-none absolute inset-x-0 top-32 -z-10 mx-auto h-72 w-72 rounded-full bg-lime-400/10 blur-[160px]" />

      <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4">
        <div className="relative w-full max-w-[420px]">
          <div
            className="absolute -left-20 top-10 h-40 w-40 rounded-full bg-emerald-400/20 blur-[120px]"
            aria-hidden="true"
          />
          <div
            className="absolute -right-16 bottom-24 h-32 w-32 rounded-full bg-lime-400/10 blur-[100px]"
            aria-hidden="true"
          />

          <article className="relative z-10 rounded-[40px] bg-[#0b0c0f]/95 px-7 pb-24 pt-10 shadow-[0_30px_80px_rgba(0,0,0,0.55)] ring-1 ring-white/5">
            <header className="flex items-start justify-between text-sm text-neutral-400">
              <div>
                <p className="text-base font-medium text-white">Dashboard</p>
                <p className="text-xs text-neutral-500">Welcome back, Coach.</p>
              </div>
              <button
                type="button"
                aria-label="Open trainer menu"
                className="rounded-full bg-white/5 p-2 text-white/70 transition hover:bg-white/10"
              >
                <Ellipsis size={16} />
              </button>
            </header>

            <section className="mt-6 rounded-[28px] border border-lime-400/50 bg-gradient-to-r from-[#11180f] via-[#10140b] to-[#0b0e08] p-5 shadow-[0_15px_40px_rgba(130,255,0,0.12)]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lime-200/80">
                Overall Client Progress
              </p>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <span className="text-5xl font-semibold text-white">
                    {summary.progress}%
                  </span>
                  <p className="mt-1 text-xs text-neutral-400">
                    +{summary.trend}% vs last month
                  </p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-lime-300">
                  <TrendingUp size={24} strokeWidth={1.5} />
                </div>
              </div>
              <div className="mt-5 h-2 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-lime-400"
                  style={{ width: `${summary.progress}%` }}
                />
              </div>
              <p className="mt-4 text-right text-xs text-neutral-400">
                {summary.clientsTotal} Active clients
              </p>
            </section>

            <section className="mt-6">
              <div className="mb-4 flex items-center justify-between text-sm text-neutral-400">
                <div>
                  <p className="text-base font-medium text-white">
                    Active Clients
                  </p>
                  <p className="text-xs text-neutral-500">
                    {summary.clientsTotal} total
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-wider text-neutral-300 transition hover:border-white/30 hover:text-white"
                >
                  View All
                </button>
              </div>

              <ul className="space-y-3">
                {activeClients.map((client) => (
                  <li
                    key={client.name}
                    className="group flex items-center justify-between rounded-3xl bg-[#131417] px-4 py-4 text-sm ring-1 ring-white/5 transition duration-200 hover:-translate-y-1 hover:bg-[#181b21]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-[#1d2026] to-[#0f1116]">
                        <span
                          className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full"
                          style={{
                            backgroundColor: client.accentColor,
                            boxShadow: `0 0 10px ${client.accentColor}`,
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-white">{client.name}</p>
                        <p className="text-xs text-neutral-500">
                          {client.focus}
                        </p>
                        <p className="text-[11px] text-neutral-400">
                          {client.status}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-wider text-neutral-500">
                        Progress
                      </p>
                      <p className="text-lg font-semibold text-white">
                        {client.progress}%
                      </p>
                      <ChevronRight
                        className="ml-auto text-neutral-500 transition group-hover:text-white"
                        size={16}
                      />
                    </div>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="mt-6 w-full rounded-2xl bg-gradient-to-r from-lime-400/80 to-lime-300/70 py-3 text-sm font-semibold text-black shadow-[0_15px_40px_rgba(130,255,0,0.25)] transition hover:-translate-y-0.5 hover:brightness-110"
              >
                View All Clients
              </button>
            </section>

            <section className="mt-6 grid gap-3 sm:grid-cols-3">
              {microStats.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-white/5 bg-white/5 px-4 py-4 text-center text-xs text-neutral-400 transition hover:border-white/20 hover:bg-white/10"
                >
                  <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {metric.value}
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    {metric.helper}
                  </p>
                </div>
              ))}
            </section>

            <section className="mt-6 rounded-[30px] border border-white/5 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">
                Coach Shortcuts
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {quickActions.map((action) => {
                  const Icon =
                    quickActionIconMap[
                      action.iconKey as keyof typeof quickActionIconMap
                    ] ?? Activity

                  return (
                    <button
                      key={action.label}
                      type="button"
                      className="flex flex-col items-start gap-2 rounded-2xl border border-white/10 bg-black/30 p-4 text-left transition hover:border-lime-300/40 hover:bg-black/50"
                    >
                      <Icon className="text-lime-300" size={18} />
                      <div>
                        <p className="text-sm font-medium text-white">
                          {action.label}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {action.description}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>

            <section className="mt-6 rounded-[30px] border border-white/5 bg-gradient-to-r from-[#0b1017] to-[#080b11] p-5">
              <div className="mb-4 flex items-center justify-between text-sm text-neutral-400">
                <p className="text-base font-medium text-white">
                  Tonight&apos;s Sessions
                </p>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-neutral-400">
                  Auto-sync
                </span>
              </div>
              <ul className="space-y-3">
                {upcomingSessions.map((slot) => (
                  <li
                    key={slot.name}
                    className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 text-sm text-neutral-300"
                  >
                    <div>
                      <p className="font-medium text-white">{slot.name}</p>
                      <p className="text-xs text-neutral-400">{slot.status}</p>
                    </div>
                    <span className="text-xs text-neutral-400">
                      {slot.time}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </article>
        </div>
      </div>

      <BottomBarAdmin showUserIndicator onPrimaryClick={() => {}} />
    </div>
  )
}
