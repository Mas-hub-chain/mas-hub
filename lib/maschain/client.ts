/**
 * MasChain API Client
 * Integrates with MasChain services for tokenization, KYC, and wallet management
 */
import { getEnv, getMasChainNetwork } from "@/lib/env"

export interface MasChainConfig {
  apiUrl: string
  clientId: string
  clientSecret: string
  network: "testnet" | "mainnet"
}

export interface TokenizationRequest {
  asset_type: string
  metadata: {
    name: string
    description: string
    quantity: number
    custom_metadata?: Record<string, any>
  }
  tenant_id: string
}

export interface KYCRequest {
  wallet_address: string
}

export interface MasChainResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  transaction_hash?: string
}

export class MasChainClient {
  private config: MasChainConfig
  private accessToken?: string
  private mockMode: boolean

  constructor(config: MasChainConfig, mockMode = false) {
    this.config = config
    this.mockMode = mockMode || process.env.NODE_ENV === "development"

    // Log mock mode status
    if (this.mockMode) {
      console.log("MasChain client running in mock mode")
    }
  }

  /**
   * Authenticate with MasChain API
   */
  private async authenticate(): Promise<void> {
    if (this.mockMode) {
      this.accessToken = "mock-token-for-development"
      return
    }

    try {
      const response = await fetch(`${this.config.apiUrl}/auth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed")
      }

      this.accessToken = data.access_token
    } catch (error) {
      console.error("MasChain authentication error:", error)
      throw error
    }
  }

  /**
   * Make authenticated API request
   */
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<MasChainResponse<T>> {
    if (this.mockMode) {
      return this.mockResponse(endpoint, options)
    }

    if (!this.accessToken) {
      await this.authenticate()
    }

    try {
      const response = await fetch(`${this.config.apiUrl}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken}`,
          ...options.headers,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "API request failed",
        }
      }

      return {
        success: true,
        data,
        transaction_hash: data.transaction_hash,
      }
    } catch (error) {
      console.error("MasChain API error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  /**
   * Generate mock responses for development
   */
  private mockResponse<T>(endpoint: string, options: RequestInit = {}): MasChainResponse<T> {
    const body = options.body ? JSON.parse(options.body as string) : {}

    // Mock different endpoints
    if (endpoint.includes("token-management/create")) {
      return {
        success: true,
        data: {
          token_id: `mock-token-${Date.now()}`,
          asset_type: body.asset_type,
          name: body.name,
          status: "pending",
        } as unknown as T,
        transaction_hash: `0x${Math.random().toString(16).substring(2, 66)}`,
      }
    }

    if (endpoint.includes("e-kyc-management/verify")) {
      const riskScore = Math.random() * 100
      return {
        success: true,
        data: {
          wallet_address: body.wallet_address,
          risk_score: riskScore,
          risk_level: riskScore < 30 ? "low_risk" : riskScore < 70 ? "medium_risk" : "high_risk",
          verified: riskScore < 70,
        } as unknown as T,
      }
    }

    if (endpoint.includes("wallet-management/create")) {
      return {
        success: true,
        data: {
          wallet_id: `mock-wallet-${Date.now()}`,
          address: `0x${Math.random().toString(16).substring(2, 42)}`,
          type: "hybrid",
        } as unknown as T,
      }
    }

    // Default mock response
    return {
      success: true,
      data: { message: "Mock response" } as unknown as T,
    }
  }

  /**
   * Create a new token on MasChain
   * @see https://docs.maschain.com/services/token-management
   */
  async createToken(request: TokenizationRequest): Promise<MasChainResponse> {
    return this.makeRequest("/services/token-management/create", {
      method: "POST",
      body: JSON.stringify({
        asset_type: request.asset_type,
        name: request.metadata.name,
        description: request.metadata.description,
        quantity: request.metadata.quantity,
        metadata: request.metadata.custom_metadata || {},
        network: this.config.network,
      }),
    })
  }

  /**
   * Perform KYC verification
   * @see https://docs.maschain.com/services/e-kyc-management
   */
  async performKYC(request: KYCRequest): Promise<MasChainResponse> {
    return this.makeRequest("/services/e-kyc-management/verify", {
      method: "POST",
      body: JSON.stringify({
        wallet_address: request.wallet_address,
        verification_level: "basic",
        network: this.config.network,
      }),
    })
  }

  /**
   * Create a new wallet
   * @see https://docs.maschain.com/services/wallet-management
   */
  async createWallet(userId: string): Promise<MasChainResponse> {
    return this.makeRequest("/services/wallet-management/create", {
      method: "POST",
      body: JSON.stringify({
        user_id: userId,
        wallet_type: "hybrid",
        network: this.config.network,
      }),
    })
  }

  /**
   * Deploy a smart contract
   * @see https://docs.maschain.com/services/custom-smart-contract
   */
  async deployContract(contractData: any): Promise<MasChainResponse> {
    return this.makeRequest("/services/custom-smart-contract/deploy", {
      method: "POST",
      body: JSON.stringify({
        ...contractData,
        network: this.config.network,
      }),
    })
  }
}

/**
 * Get MasChain client instance
 */
export function getMasChainClient(): MasChainClient {
  // For server-side usage
  const config: MasChainConfig = {
    apiUrl: getEnv("MASCHAIN_API_URL", true),
    clientId: getEnv("MASCHAIN_CLIENT_ID", true),
    clientSecret: getEnv("MASCHAIN_CLIENT_SECRET", true),
    network: getMasChainNetwork(),
  }

  // Enable mock mode in development or if explicitly set
  const mockMode = process.env.NODE_ENV === "development" || process.env.MASCHAIN_MOCK_MODE === "true"

  return new MasChainClient(config, mockMode)
}
