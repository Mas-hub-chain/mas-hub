/**
 * MasChain Smart Contract API Client
 * Handles all smart contract operations including projects, versions, deployment, and interaction
 */

import { getMasChainClient } from "./client"

export interface SmartContractProject {
  project_name: string
  slug: string
  description?: string
  version?: string
  last_deployed_at?: string
  created_at: string
  updated_at: string
}

export interface SmartContractVersion {
  status: string
  compile_type: string
  version: string
  slug: string
  compiler_settings: {
    solidity: {
      version: string
      settings?: {
        optimizer?: {
          enabled: boolean
          runs: number
        }
      }
    }
  }
  packages: string[]
  contract_files?: Array<{
    filename: string
    url: string
  }>
  artifacts?: Array<{
    id: number
    contract_name: string
    contract_abi: any[]
    bytecode: string
    source_code: string
  }>
  slither_file?: string
  last_compiled_at?: string
  last_deployed_at?: string
  latest_error: string
  vulnerabilities: number
  created_at: string
  updated_at: string
}

export interface DeploymentParams {
  sc_artifact_id: number
  params?: Record<string, any>
  order: number
  signed_trx?: string
}

export interface WalletOptions {
  type: "organisation" | "end_user" | "non_custodial"
  address: string
}

export interface DeploymentRequest {
  wallet_options: WalletOptions
  deployment_params: DeploymentParams[]
  callback_url?: string
}

export interface DeployedContract {
  contract_address: string
  deployment_params: any[]
  contract_name: string
  project_name: string
  version: string
  deployed_at: string
}

export interface ContractInteractionRequest {
  from: string
  method_name: string
  contract_abi?: any[]
  params?: Record<string, any>
}

export interface ContractExecutionRequest {
  wallet_options: WalletOptions
  method_name: string
  contract_abi?: any[]
  params?: Record<string, any>
  signed_trx?: string
  callback_url?: string
}

export class MasChainSmartContractClient {
  private client = getMasChainClient()

  // Project Management
  async listProjects(page = 1): Promise<{ result: SmartContractProject[]; pagination: any }> {
    try {
      const response = await this.client.makeRequest(`/api/contract/projects?page=${page}`)
      console.log("MasChain listProjects response:", response)
      return response
    } catch (error) {
      console.error("Error listing projects:", error)
      throw error
    }
  }

  async getProject(projectSlug: string): Promise<{ result: SmartContractProject }> {
    try {
      return await this.client.makeRequest(`/api/contract/projects/${projectSlug}`)
    } catch (error) {
      console.error("Error getting project:", error)
      throw error
    }
  }

  async createProject(data: { project_name: string; description?: string }): Promise<{ result: SmartContractProject }> {
    try {
      console.log("Creating project with MasChain API:", data)
      const response = await this.client.makeRequest(`/api/contract/projects`, {
        method: "POST",
        body: JSON.stringify(data),
      })
      console.log("MasChain createProject response:", response)
      return response
    } catch (error) {
      console.error("Error creating project:", error)
      throw error
    }
  }

  async updateProject(
    projectSlug: string,
    data: { project_name: string; description?: string },
  ): Promise<{ result: SmartContractProject }> {
    try {
      return await this.client.makeRequest(`/api/contract/projects/${projectSlug}`, {
        method: "PUT",
        body: JSON.stringify(data),
      })
    } catch (error) {
      console.error("Error updating project:", error)
      throw error
    }
  }

  // Version Management
  async listVersions(projectSlug: string, page = 1): Promise<{ result: SmartContractVersion[]; pagination: any }> {
    try {
      return await this.client.makeRequest(`/api/contract/projects/${projectSlug}/versions?page=${page}`)
    } catch (error) {
      console.error("Error listing versions:", error)
      throw error
    }
  }

  async getVersion(projectSlug: string, versionSlug: string): Promise<{ result: SmartContractVersion }> {
    try {
      return await this.client.makeRequest(`/api/contract/projects/${projectSlug}/versions/${versionSlug}`)
    } catch (error) {
      console.error("Error getting version:", error)
      throw error
    }
  }

  async createVersion(
    projectSlug: string,
    data: {
      version: string
      compiler_settings: any
      contract_files: File[]
      packages?: string[]
    },
  ): Promise<{ result: SmartContractVersion }> {
    try {
      const formData = new FormData()
      formData.append("version", data.version)
      formData.append("compiler_settings[solidity][version]", data.compiler_settings.solidity.version)

      if (data.compiler_settings.solidity.settings?.optimizer) {
        formData.append(
          "compiler_settings[solidity][settings][optimizer][enabled]",
          data.compiler_settings.solidity.settings.optimizer.enabled ? "1" : "0",
        )
        formData.append(
          "compiler_settings[solidity][settings][optimizer][runs]",
          data.compiler_settings.solidity.settings.optimizer.runs.toString(),
        )
      }

      data.contract_files.forEach((file) => {
        formData.append("contract_files[]", file)
      })

      data.packages?.forEach((pkg) => {
        formData.append("packages[]", pkg)
      })

      return await this.client.makeRequest(`/api/contract/projects/${projectSlug}/versions`, {
        method: "POST",
        body: formData,
        headers: {}, // Let browser set content-type for FormData
      })
    } catch (error) {
      console.error("Error creating version:", error)
      throw error
    }
  }

  // Deployment
  async deployVersion(
    projectSlug: string,
    versionSlug: string,
    deploymentRequest: DeploymentRequest,
  ): Promise<{ result: any }> {
    try {
      return await this.client.makeRequest(`/api/contract/projects/${projectSlug}/versions/${versionSlug}/deploy`, {
        method: "POST",
        body: JSON.stringify(deploymentRequest),
      })
    } catch (error) {
      console.error("Error deploying version:", error)
      throw error
    }
  }

  // Contract Interaction
  async listDeployedContracts(filters?: {
    version?: string
    deployment_id?: string
  }): Promise<{ result: DeployedContract[]; pagination: any }> {
    try {
      const params = new URLSearchParams()
      if (filters?.version) params.append("filter-version", filters.version)
      if (filters?.deployment_id) params.append("filter-deployment_id", filters.deployment_id)

      return await this.client.makeRequest(`/api/contract/smart-contracts?${params.toString()}`)
    } catch (error) {
      console.error("Error listing deployed contracts:", error)
      throw error
    }
  }

  async getContractDetails(contractAddress: string): Promise<{ result: any }> {
    try {
      return await this.client.makeRequest(`/api/contract/smart-contracts/${contractAddress}`)
    } catch (error) {
      console.error("Error getting contract details:", error)
      throw error
    }
  }

  async callContract(contractAddress: string, request: ContractInteractionRequest): Promise<{ result: any }> {
    try {
      return await this.client.makeRequest(`/api/contract/smart-contracts/${contractAddress}/call`, {
        method: "POST",
        body: JSON.stringify(request),
      })
    } catch (error) {
      console.error("Error calling contract:", error)
      throw error
    }
  }

  async executeContract(contractAddress: string, request: ContractExecutionRequest): Promise<{ result: any }> {
    try {
      return await this.client.makeRequest(`/api/contract/smart-contracts/${contractAddress}/execute`, {
        method: "POST",
        body: JSON.stringify(request),
      })
    } catch (error) {
      console.error("Error executing contract:", error)
      throw error
    }
  }

  // Utilities
  async getChainId(): Promise<{ result: number }> {
    try {
      return await this.client.makeRequest("/api/contract/utils/chain-id")
    } catch (error) {
      console.error("Error getting chain ID:", error)
      throw error
    }
  }

  async getGasPrice(): Promise<{ result: number }> {
    try {
      return await this.client.makeRequest("/api/contract/utils/gas-price")
    } catch (error) {
      console.error("Error getting gas price:", error)
      throw error
    }
  }

  async getCompilerVersions(): Promise<{ result: string[] }> {
    try {
      return await this.client.makeRequest("/api/contract/utils/compiler-versions")
    } catch (error) {
      console.error("Error getting compiler versions:", error)
      throw error
    }
  }

  async estimateGas(params: {
    from?: string
    to?: string
    value?: string
    data?: string
    nonce?: number
  }): Promise<{ result: number }> {
    try {
      return await this.client.makeRequest("/api/contract/utils/estimate-gas", {
        method: "POST",
        body: JSON.stringify(params),
      })
    } catch (error) {
      console.error("Error estimating gas:", error)
      throw error
    }
  }

  async simulateTransaction(params: {
    from?: string
    to?: string
    value?: string
    data?: string
    nonce?: number
    gasPrice?: number
  }): Promise<{ result: { success: boolean; message?: string } }> {
    try {
      return await this.client.makeRequest("/api/contract/utils/simulate-transaction", {
        method: "POST",
        body: JSON.stringify(params),
      })
    } catch (error) {
      console.error("Error simulating transaction:", error)
      throw error
    }
  }

  async encodeDeployment(params: {
    abi: any[]
    bytecode: string
    params?: Record<string, any>
  }): Promise<{ result: string }> {
    try {
      return await this.client.makeRequest("/api/contract/utils/deploy-encode", {
        method: "POST",
        body: JSON.stringify(params),
      })
    } catch (error) {
      console.error("Error encoding deployment:", error)
      throw error
    }
  }

  async encodeExecution(params: {
    abi: any[]
    contract_address: string
    method_name: string
    params?: Record<string, any>
  }): Promise<{ result: string }> {
    try {
      return await this.client.makeRequest("/api/contract/utils/execute-encode", {
        method: "POST",
        body: JSON.stringify(params),
      })
    } catch (error) {
      console.error("Error encoding execution:", error)
      throw error
    }
  }

  // Webhook Management
  async listWebhooks(projectSlug: string, versionSlug: string): Promise<{ result: any[]; pagination: any }> {
    try {
      return await this.client.makeRequest(`/api/contract/projects/${projectSlug}/versions/${versionSlug}/webhooks`)
    } catch (error) {
      console.error("Error listing webhooks:", error)
      throw error
    }
  }

  async createWebhook(
    projectSlug: string,
    versionSlug: string,
    data: {
      url: string
      capture_anonymous: boolean
      subscribed_events?: Array<{
        contract_address: string
        event: string
      }>
    },
  ): Promise<{ result: any }> {
    try {
      return await this.client.makeRequest(`/api/contract/projects/${projectSlug}/versions/${versionSlug}/webhooks`, {
        method: "POST",
        body: JSON.stringify(data),
      })
    } catch (error) {
      console.error("Error creating webhook:", error)
      throw error
    }
  }

  async updateWebhook(
    projectSlug: string,
    versionSlug: string,
    webhookId: string,
    data: {
      url: string
      capture_anonymous: boolean
      subscribed_events?: Array<{
        contract_address: string
        event: string
      }>
      status?: "active" | "inactive"
    },
  ): Promise<{ result: any }> {
    try {
      return await this.client.makeRequest(
        `/api/contract/projects/${projectSlug}/versions/${versionSlug}/webhooks/${webhookId}`,
        {
          method: "PUT",
          body: JSON.stringify(data),
        },
      )
    } catch (error) {
      console.error("Error updating webhook:", error)
      throw error
    }
  }

  async deleteWebhook(projectSlug: string, versionSlug: string, webhookId: string): Promise<{ result: null }> {
    try {
      return await this.client.makeRequest(
        `/api/contract/projects/${projectSlug}/versions/${versionSlug}/webhooks/${webhookId}`,
        {
          method: "DELETE",
        },
      )
    } catch (error) {
      console.error("Error deleting webhook:", error)
      throw error
    }
  }
}

// Export singleton instance
export const masChainSmartContracts = new MasChainSmartContractClient()

// Add alias export for compatibility
export { MasChainSmartContractClient as MaschainSmartContractClient }
