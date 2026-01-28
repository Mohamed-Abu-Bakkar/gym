import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth/useAuth'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Activity,
  KeyRound,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from 'lucide-react'
import { Fragment, type FormEvent, useEffect, useState } from 'react'

export const Route = createFileRoute('/')({ component: RouteComponent })

const heroSignals = [
  { label: 'Coach Capacity', value: '76%', helper: '13 clients synced' },
  { label: 'Check-ins Due', value: '04', helper: 'Due today' },
  { label: 'Recovery Flags', value: '2', helper: 'Sleep & stress' },
]

const protocolChecklist = [
  'Phone number must already exist in Convex users table',
  'Use the exact 6-digit PIN shared during onboarding',
  'Sessions auto-expire per env.VITE_AUTH_EXPIRY_TIME',
]

function RouteComponent() {
  const navigate = useNavigate()
  const { signIn, isLoading, user } = useAuth()

  const [phoneNumber, setPhoneNumber] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (!isLoading && user) {
      const destination =
        user.role === 'trainer' || user.role === 'admin'
          ? '/app/management/'
          : '/app/'
      navigate({ to: destination })
    }
  }, [isLoading, user, navigate])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    const cleanedPhone = phoneNumber.replace(/[^+\d]/g, '')
    const cleanedPin = pin.replace(/\D/g, '')

    if (cleanedPhone.length < 10 || cleanedPin.length !== 6) {
      setError(
        'Enter your registered phone number and 6-digit PIN to continue.',
      )
      return
    }

    setPending(true)
    try {
      const authenticatedUser = await signIn(cleanedPhone, cleanedPin)
      if (!authenticatedUser) {
        setError('Invalid phone number or PIN. Please try again.')
        return
      }
      setSuccess('Access granted. Redirecting you now…')
    } catch (signinError) {
      console.error(signinError)
      setError('Unable to reach the server. Please retry in a few seconds.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030304] text-white">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#050505] via-[#070708] to-[#010101]" />
      <div className="pointer-events-none absolute inset-x-0 top-1/3 h-[420px] w-full bg-lime-400/10 blur-[200px]" />
      <div className="pointer-events-none absolute -left-44 bottom-0 h-72 w-72 rounded-full bg-emerald-400/15 blur-[160px]" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-16">
        <div className="relative w-full max-w-[390px]">
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-[56px] bg-gradient-to-b from-white/5 to-transparent blur-[40px]" />
          <div className="pointer-events-none absolute inset-3 -z-20 rounded-[56px] border border-white/5 bg-black/40" />

          <div className="relative z-10 rounded-[48px] border border-white/10 bg-[#090a0f]/90 px-6 pb-10 pt-8 shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl">
            <header className="text-center">
              {/* <p className="text-[11px] uppercase tracking-[0.4em] text-lime-200/70">
                Coach Console
              </p> */}
              <h1 className="mt-3 text-3xl font-semibold">Sign back in</h1>
              {/* <p className="mt-2 text-sm text-neutral-500">
                Phone + PIN authenticate directly against the Convex users table to unlock the trainer nerve-center.
              </p> */}
            </header>

            {/* <section className="mt-6 rounded-[32px] border border-lime-400/40 bg-gradient-to-br from-[#11160f] to-[#090c08] p-5 shadow-[0_15px_40px_rgba(130,255,0,0.12)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-400">Overall sync</p>
                  <p className="text-4xl font-semibold text-white">76%</p>
                  <p className="text-xs text-lime-200">+12% vs last cycle</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/40 p-3 text-lime-200">
                  <Sparkles size={26} strokeWidth={1.2} />
                </div>
              </div>
              <div className="mt-4 h-1.5 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-lime-400 to-emerald-300" style={{ width: '76%' }} />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-center text-xs text-neutral-400">
                {heroSignals.slice(0, 2).map(signal => (
                  <div key={signal.label} className="rounded-2xl border border-white/5 bg-white/5 px-3 py-3">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                      {signal.label}
                    </p>
                    <p className="mt-1 text-xl font-semibold text-white">{signal.value}</p>
                    <p className="text-[11px] text-neutral-400">{signal.helper}</p>
                  </div>
                ))}
              </div>
            </section> */}

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="text-[10px] uppercase tracking-[0.35em] text-neutral-500">
                  Phone Number
                </label>
                <div className="mt-2 flex items-center rounded-[28px] border border-white/10 bg-black/40 px-4 py-3 focus-within:border-lime-300/70 focus-within:ring-2 focus-within:ring-lime-300/30">
                  <Smartphone className="text-neutral-500" size={16} />
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+14155550123"
                    value={phoneNumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                    className="ml-3 w-full border-none bg-transparent text-base text-white placeholder:text-neutral-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.35em] text-neutral-500">
                  6-digit PIN
                </label>
                <div className="mt-2 flex items-center rounded-[28px] border border-white/10 bg-black/40 px-4 py-3 focus-within:border-lime-300/70 focus-within:ring-2 focus-within:ring-lime-300/30">
                  <KeyRound className="text-neutral-500" size={16} />
                  <input
                    type="password"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="••••••"
                    value={pin}
                    onChange={(event) =>
                      setPin(event.target.value.replace(/\D/g, '').slice(0, 6))
                    }
                    maxLength={6}
                    className="ml-3 w-full border-none bg-transparent text-2xl tracking-[0.4em] text-white placeholder:text-neutral-600 focus:outline-none"
                  />
                </div>
                <p className="mt-2 text-[11px] text-neutral-500">
                  Reset PINs straight from Convex — values stay unhashed by
                  design.
                </p>
              </div>

              {error && (
                <p
                  className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
                  role="alert"
                >
                  {error}
                </p>
              )}

              {success && (
                <p
                  className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200"
                  role="status"
                >
                  {success}
                </p>
              )}

              <Button
                type="submit"
                disabled={pending || isLoading}
                className="group flex w-full items-center justify-center rounded-[30px] bg-lime-400/90 py-3 text-base font-semibold text-black shadow-[0_18px_45px_rgba(130,255,0,0.25)] transition hover:brightness-110"
              >
                {pending ? 'Checking credentials…' : 'Enter the dashboard'}
              </Button>
            </form>

            {/* <div className="mt-6 space-y-3 rounded-[28px] border border-white/10 bg-black/20 p-4 text-xs text-neutral-400">
              {protocolChecklist.map((step, index) => (
                <Fragment key={step}>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-lime-300" />
                    <p>{step}</p>
                  </div>
                  {index < protocolChecklist.length - 1 && (
                    <div className="mx-auto w-full border-t border-white/5" />
                  )}
                </Fragment>
              ))}
            </div> */}
          </div>

          <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-white/15" />
        </div>
      </div>
    </div>
  )
}
