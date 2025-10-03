import { createContext, useState, useEffect } from "react"
import type { ReactNode } from "react"
import type { AuthContextType } from "../types/auth"
import type { User } from "../types/auth"

const AuthenticationContext = createContext<AuthContextType | undefined>(undefined)

export { AuthenticationContext }

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem("ikusi_token")
    const savedUser = localStorage.getItem("ikusi_user")

    if (savedToken && savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch {
        localStorage.removeItem("ikusi_token")
        localStorage.removeItem("ikusi_user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email && password) {
      const newUser: User = {
        id: "usr_" + Date.now(),
        email,
        name: email.split("@")[0],
        role: "admin",
        centerId: "ikusi-hq",
      }

      const token = "ikusi_token_" + Date.now()

      localStorage.setItem("ikusi_token", token)
      localStorage.setItem("ikusi_user", JSON.stringify(newUser))

      setUser(newUser)
      setLoading(false)
      return true
    }

    setLoading(false)
    return false
  }

  const logout = () => {
    localStorage.removeItem("ikusi_token")
    localStorage.removeItem("ikusi_user")
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
  }

  return <AuthenticationContext.Provider value={value}>{children}</AuthenticationContext.Provider>
}
