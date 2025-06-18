'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { MockAuthService } from '@/lib/mock/services'
import type { MockMember } from '@/lib/mock/data'

type AuthContextType = {
  user: any | null
  member: MockMember | null
  loading: boolean
  isAdmin: boolean
  isMember: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  member: null,
  loading: true,
  isAdmin: false,
  isMember: false,
  signOut: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [member, setMember] = useState<MockMember | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isMember, setIsMember] = useState(false)

  const updateAuthState = () => {
    const currentMember = MockAuthService.getCurrentUser()
    if (currentMember) {
      setUser({ id: currentMember.id, email: currentMember.email })
      setMember(currentMember)
      setIsAdmin(currentMember.role === 'admin')
      setIsMember(currentMember.role === 'member')
    } else {
      setUser(null)
      setMember(null)
      setIsAdmin(false)
      setIsMember(false)
    }
  }

  useEffect(() => {
    // Get current user from localStorage
    updateAuthState()
    setLoading(false)

    // Listen for storage changes (for cross-tab sync)
    const handleStorageChange = () => {
      updateAuthState()
    }

    // Listen for custom auth events (for same-tab updates)
    const handleAuthChange = () => {
      updateAuthState()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('authStateChanged', handleAuthChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('authStateChanged', handleAuthChange)
    }
  }, [])

  const signOut = async () => {
    await MockAuthService.signOut()
    setUser(null)
    setMember(null)
    setIsAdmin(false)
    setIsMember(false)
    // Trigger auth state change event
    window.dispatchEvent(new Event('authStateChanged'))
  }

  return (
    <AuthContext.Provider value={{ user, member, loading, isAdmin, isMember, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}