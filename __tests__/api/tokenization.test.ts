import { createMocks } from "node-mocks-http"
import { POST, GET } from "@/app/api/tokenization/route"

// Mock Supabase
jest.mock("@/lib/supabase/server", () => ({
  createClient: () => ({
    auth: {
      getUser: jest.fn(() => ({
        data: { user: { id: "test-user-id" } },
        error: null,
      })),
    },
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({
            data: {
              id: "test-token-id",
              tenant_id: "test-user-id",
              asset_type: "invoice",
              metadata: { name: "Test Token" },
              status: "pending",
            },
            error: null,
          })),
        })),
      })),
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => ({
            data: [],
            error: null,
          })),
        })),
      })),
    })),
  }),
}))

// Mock MasChain client
jest.mock("@/lib/maschain/client", () => ({
  getMasChainClient: () => ({
    createToken: jest.fn(() => ({
      success: true,
      transaction_hash: "0x123456789",
    })),
  }),
}))

describe("/api/tokenization", () => {
  describe("POST", () => {
    it("should create a token successfully", async () => {
      const { req } = createMocks({
        method: "POST",
        body: {
          asset_type: "invoice",
          metadata: {
            name: "Test Token",
            description: "Test description",
            quantity: 1,
          },
        },
      })

      const response = await POST(req as any)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.tx_hash).toBe("0x123456789")
    })

    it("should return 401 for unauthenticated requests", async () => {
      // Mock unauthenticated user
      const mockCreateClient = require("@/lib/supabase/server").createClient
      mockCreateClient.mockReturnValueOnce({
        auth: {
          getUser: jest.fn(() => ({
            data: { user: null },
            error: new Error("Unauthorized"),
          })),
        },
      })

      const { req } = createMocks({
        method: "POST",
        body: {
          asset_type: "invoice",
          metadata: { name: "Test Token" },
        },
      })

      const response = await POST(req as any)
      expect(response.status).toBe(401)
    })
  })

  describe("GET", () => {
    it("should fetch tokens for authenticated user", async () => {
      const { req } = createMocks({
        method: "GET",
      })

      const response = await GET(req as any)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty("tokens")
      expect(Array.isArray(data.tokens)).toBe(true)
    })
  })
})
