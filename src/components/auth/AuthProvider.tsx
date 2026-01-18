import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { useQuery } from 'convex/react'
import { api } from 'convex/_generated/api'
import { Doc } from 'convex/_generated/dataModel'
import { env } from '@/env'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userSession, setUserSession] = useState<Doc<'users'> | null>(null)
  const signIn = (phoneNumber: string, pin: string) => {
    const user = useQuery(api.users.signInQuery, { phoneNumber, pin })
    if (user) {
      setUserSession(user)
      localStorage.setItem(
        'session',
        JSON.stringify({
          user,
          expiresAt: Date.now() + parseInt(env.VITE_AUTH_EXPIRY_TIME),
        }),
      )
    }
  }

  const signOut = () => {
    setUserSession(null)
    localStorage.removeItem('session')
  }

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
      const storedSession = localStorage.getItem('session')
      if (storedSession) {
				const { user, expiresAt } = JSON.parse(storedSession);
				if (Date.now() > expiresAt) {
					localStorage.removeItem('session');
				}	
				signIn(user.phoneNumber, user.pin);
      }
      setIsLoading(false)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user: userSession, isLoading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}
