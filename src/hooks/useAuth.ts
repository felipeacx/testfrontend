import { useContext } from "react"
import { AuthenticationContext } from "../contexts/AuthContext"

export const useAuth = () => {
  const context = useContext(AuthenticationContext)
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de AuthProvider")
  }
  return context
}
