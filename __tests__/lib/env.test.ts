import { validateEnv, getEnv, getMasChainNetwork } from "@/lib/env"

describe("Environment Validation", () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  describe("validateEnv", () => {
    it("should return no errors for valid environment", () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co"
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
      process.env.MASCHAIN_API_URL = "https://api.maschain.com"
      process.env.MASCHAIN_CLIENT_ID = "test-client-id"
      process.env.MASCHAIN_CLIENT_SECRET = "test-client-secret"
      process.env.MASCHAIN_NETWORK = "testnet"

      const errors = validateEnv()
      expect(errors).toHaveLength(0)
    })

    it("should return errors for missing required variables", () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL
      delete process.env.MASCHAIN_CLIENT_ID

      const errors = validateEnv()
      expect(errors).toContain("NEXT_PUBLIC_SUPABASE_URL is required but not set")
      expect(errors).toContain("MASCHAIN_CLIENT_ID is required but not set")
    })

    it("should validate URL patterns", () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "invalid-url"
      process.env.MASCHAIN_API_URL = "http://insecure.com"

      const errors = validateEnv()
      expect(errors).toContain("NEXT_PUBLIC_SUPABASE_URL: Must be a valid Supabase URL (https://*.supabase.co)")
    })

    it("should validate network values", () => {
      process.env.MASCHAIN_NETWORK = "invalid-network"

      const errors = validateEnv()
      expect(errors).toContain("MASCHAIN_NETWORK: Must be either 'testnet' or 'mainnet'")
    })
  })

  describe("getEnv", () => {
    it("should return environment variable value", () => {
      process.env.TEST_VAR = "test-value"
      expect(getEnv("TEST_VAR")).toBe("test-value")
    })

    it("should throw error for missing required variable", () => {
      expect(() => getEnv("MISSING_VAR")).toThrow("Environment variable MISSING_VAR is required but not set")
    })

    it("should return empty string for optional missing variable", () => {
      expect(getEnv("MISSING_VAR", false)).toBe("")
    })
  })

  describe("getMasChainNetwork", () => {
    it("should return testnet by default", () => {
      delete process.env.MASCHAIN_NETWORK
      expect(getMasChainNetwork()).toBe("testnet")
    })

    it("should return mainnet when set", () => {
      process.env.MASCHAIN_NETWORK = "mainnet"
      expect(getMasChainNetwork()).toBe("mainnet")
    })

    it("should default to testnet for invalid values", () => {
      process.env.MASCHAIN_NETWORK = "invalid"
      expect(getMasChainNetwork()).toBe("testnet")
    })
  })
})
