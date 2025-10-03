import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ErrorMessage } from "../components/ErrorMessage"

describe("ErrorMessage Component", () => {
  it("should render error message", () => {
    render(<ErrorMessage message="Test error message" />)

    expect(screen.getByText("Test error message")).toBeInTheDocument()
  })

  it("should render with error type by default", () => {
    const { container } = render(<ErrorMessage message="Error" />)

    expect(container.querySelector(".bg-red-50")).toBeInTheDocument()
    expect(container.querySelector(".border-red-200")).toBeInTheDocument()
  })

  it("should render with warning type", () => {
    const { container } = render(<ErrorMessage message="Warning" type="warning" />)

    expect(container.querySelector(".bg-yellow-50")).toBeInTheDocument()
    expect(container.querySelector(".border-yellow-200")).toBeInTheDocument()
  })

  it("should render with info type", () => {
    const { container } = render(<ErrorMessage message="Info" type="info" />)

    expect(container.querySelector(".bg-blue-50")).toBeInTheDocument()
    expect(container.querySelector(".border-blue-200")).toBeInTheDocument()
  })

  it("should render close button when onClose is provided", () => {
    const onClose = vi.fn()
    render(<ErrorMessage message="Error" onClose={onClose} />)

    const closeButton = screen.getByLabelText("Cerrar")
    expect(closeButton).toBeInTheDocument()
  })

  it("should not render close button when onClose is not provided", () => {
    render(<ErrorMessage message="Error" />)

    expect(screen.queryByLabelText("Cerrar")).not.toBeInTheDocument()
  })

  it("should call onClose when close button is clicked", async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(<ErrorMessage message="Error" onClose={onClose} />)

    const closeButton = screen.getByLabelText("Cerrar")
    await user.click(closeButton)

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
