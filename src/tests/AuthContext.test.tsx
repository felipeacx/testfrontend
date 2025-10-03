import { describe, it, expect, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { AuthProvider } from "../contexts/AuthContext"
import { useAuth } from "../hooks/useAuth"

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("should initialize with no user", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    )

    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it("should login successfully with valid credentials", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    )

    const { result } = renderHook(() => useAuth(), { wrapper })

    let loginResult: boolean = false
    await act(async () => {
      loginResult = await result.current.login("admin@ikusi.com", "password123")
    })

    expect(loginResult).toBe(true)
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toMatchObject({
      email: "admin@ikusi.com",
      name: "admin",
      role: "admin",
      centerId: "ikusi-hq",
    })
    expect(result.current.user?.id).toBeDefined()
  })

  it("should login with any non-empty email and password", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    )

    const { result } = renderHook(() => useAuth(), { wrapper })

    let loginResult: boolean = false
    await act(async () => {
      loginResult = await result.current.login("test@example.com", "password123")
    })

    expect(loginResult).toBe(true)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it("should logout and clear user data", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    )

    const { result } = renderHook(() => useAuth(), { wrapper })

    // Login first
    await act(async () => {
      await result.current.login("admin@ikusi.com", "password123")
    })

    expect(result.current.isAuthenticated).toBe(true)

    // Then logout
    act(() => {
      result.current.logout()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(localStorage.getItem("ikusi_token")).toBeNull()
  })

  it("should persist user in localStorage", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    )

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login("admin@ikusi.com", "password123")
    })

    const storedUser = localStorage.getItem("ikusi_user")
    expect(storedUser).toBeTruthy()

    const parsedUser = JSON.parse(storedUser!)
    expect(parsedUser.email).toBe("admin@ikusi.com")
  })
})
