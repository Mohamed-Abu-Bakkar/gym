import { Doc } from 'convex/_generated/dataModel'
import { createContext } from 'react'



export interface AuthContextType {
  user: Doc<'users'> | null
  isLoading: boolean
  signIn: (phoneNumber: string, pin: string) => void
  signOut: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)
