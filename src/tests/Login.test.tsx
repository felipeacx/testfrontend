import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import { Login } from "../views/Login"
import { AuthProvider } from "../contexts/AuthContext"

describe("Login Component", () => {
  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    )
  }

  it("should render login form", () => {
    renderLogin()

    expect(screen.getByText("IKUSI")).toBeInTheDocument()
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /iniciar sesión/i })).toBeInTheDocument()
  })

  it("should render email and password inputs", () => {
    renderLogin()

    const emailInput = screen.getByPlaceholderText(/email@ikusi.com/i)
    const passwordInput = screen.getByPlaceholderText(/••••••••/)

    expect(emailInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
  })

  it("should have password input of type password by default", () => {
    renderLogin()

    const passwordInput = screen.getByPlaceholderText(/••••••••/i)
    expect(passwordInput).toHaveAttribute("type", "password")
  })

  it("should render footer with copyright text", () => {
    renderLogin()

    expect(screen.getByText(/© 2025 Ikusi/i)).toBeInTheDocument()
  })
})
