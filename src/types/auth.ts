export interface User {
  id: string
  email: string
  name: string
  role: "admin"
  centerId?: string
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}
