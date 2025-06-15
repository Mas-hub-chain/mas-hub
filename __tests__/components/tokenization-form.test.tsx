import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { TokenizationForm } from "@/components/tokenization/tokenization-form"

// Mock hooks
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}))

jest.mock("@/components/audit/audit-logger", () => ({
  useAuditLogger: () => ({
    logEvent: jest.fn(),
  }),
}))

// Mock fetch
global.fetch = jest.fn()

describe("TokenizationForm", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders all form fields", () => {
    render(<TokenizationForm />)

    expect(screen.getByLabelText(/asset type/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/asset name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /create token/i })).toBeInTheDocument()
  })

  it("submits form with valid data", async () => {
    const mockFetch = global.fetch as jest.Mock
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          tx_hash: "0x123456789",
          token: { id: "token-123" },
        }),
    })

    render(<TokenizationForm />)

    // Fill out form
    fireEvent.change(screen.getByLabelText(/asset name/i), {
      target: { value: "Test Token" },
    })
    fireEvent.change(screen.getByLabelText(/quantity/i), {
      target: { value: "100" },
    })

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /create token/i }))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/tokenization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: expect.stringContaining("Test Token"),
      })
    })
  })

  it("shows loading state during submission", async () => {
    const mockFetch = global.fetch as jest.Mock
    mockFetch.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)))

    render(<TokenizationForm />)

    fireEvent.change(screen.getByLabelText(/asset name/i), {
      target: { value: "Test Token" },
    })
    fireEvent.click(screen.getByRole("button", { name: /create token/i }))

    expect(screen.getByText(/creating token/i)).toBeInTheDocument()
  })

  it("handles form validation", () => {
    render(<TokenizationForm />)

    const submitButton = screen.getByRole("button", { name: /create token/i })
    fireEvent.click(submitButton)

    // HTML5 validation should prevent submission
    const nameInput = screen.getByLabelText(/asset name/i)
    expect(nameInput).toBeInvalid()
  })
})
