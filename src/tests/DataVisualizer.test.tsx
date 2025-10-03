import { describe, it, expect, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { DataVisualizer } from "../components/DataVisualizer"
import { IkusiService } from "../services/ikusiService"

vi.mock("../services/ikusiService")

describe("DataVisualizer Component", () => {
  const mockOnNavigate = vi.fn()

  it("should render global summary", async () => {
    const mockSummary = {
      employees: 1220,
      revenue: 296500000,
      projects: 164,
      centers: 10,
      countries: 8,
    }

    vi.mocked(IkusiService.getGlobalSummary).mockResolvedValue(mockSummary)

    render(<DataVisualizer level="global" onNavigate={mockOnNavigate} />)

    await waitFor(() => {
      expect(screen.getByText("1,220")).toBeInTheDocument()
      expect(screen.getByText("164")).toBeInTheDocument()
      expect(screen.getByText("10")).toBeInTheDocument()
    })
  })

  it("should show loading state", () => {
    vi.mocked(IkusiService.getGlobalSummary).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    )

    render(<DataVisualizer level="global" onNavigate={mockOnNavigate} />)

    expect(screen.getByText("Cargando datos")).toBeInTheDocument()
  })
})
