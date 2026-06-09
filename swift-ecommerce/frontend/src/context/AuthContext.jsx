import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

const TOKEN_KEY = 'ss360_token'
const USER_KEY = 'ss360_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))

  const isAdmin = user?.role === 'ADMIN'
  const isAuthenticated = Boolean(token && user)

  const login = useCallback((userData, jwtToken) => {
    localStorage.setItem(TOKEN_KEY, jwtToken)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
    setToken(jwtToken)
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  useEffect(() => {
    if (!token) return
    // Verificar expiración del JWT de forma ligera (sin verificar firma)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        logout()
      }
    } catch {
      logout()
    }
  }, [token, logout])

  return (
    <AuthContext.Provider value={{ user, token, isAdmin, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
