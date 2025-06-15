// src/modules/contracts.ts
var ContractsModule = class {
  constructor(sdk) {
    this.sdk = sdk;
  }
  /**
   * Create a new smart contract project
   */
  async createProject(data) {
    const response = await this.sdk.request("/smart-contracts/projects", {
      method: "POST",
      body: JSON.stringify(data)
    });
    return response.data;
  }
  /**
   * List all smart contract projects
   */
  async listProjects(page = 1) {
    const response = await this.sdk.request(`/smart-contracts/projects?page=${page}`);
    return {
      projects: response.data.result || [],
      pagination: response.data.pagination || {}
    };
  }
  /**
   * Get project details
   */
  async getProject(projectSlug) {
    const response = await this.sdk.request(`/smart-contracts/projects/${projectSlug}`);
    return response.data;
  }
  /**
   * Create a new version for a project
   */
  async createVersion(projectSlug, data) {
    const formData = new FormData();
    formData.append("version", data.version);
    formData.append("compiler_settings", JSON.stringify(data.compiler_settings));
    data.contract_files.forEach((file) => {
      formData.append("contract_files[]", file);
    });
    data.packages?.forEach((pkg) => {
      formData.append("packages[]", pkg);
    });
    const response = await this.sdk.request(`/smart-contracts/projects/${projectSlug}/versions`, {
      method: "POST",
      body: formData,
      headers: {
        // Remove Content-Type to let browser set it for FormData
        "Content-Type": void 0
      }
    });
    return response.data;
  }
  /**
   * Deploy a smart contract version
   */
  async deploy(projectSlug, versionSlug, deploymentRequest) {
    const response = await this.sdk.request(`/smart-contracts/projects/${projectSlug}/versions/${versionSlug}/deploy`, {
      method: "POST",
      body: JSON.stringify(deploymentRequest)
    });
    return response.data;
  }
  /**
   * List deployed contracts
   */
  async listDeployed(filters) {
    const params = new URLSearchParams();
    if (filters?.version)
      params.append("filter-version", filters.version);
    if (filters?.deployment_id)
      params.append("filter-deployment_id", filters.deployment_id);
    const queryString = params.toString();
    const endpoint = `/smart-contracts/deployed${queryString ? `?${queryString}` : ""}`;
    const response = await this.sdk.request(endpoint);
    return {
      contracts: response.data.result || [],
      pagination: response.data.pagination || {}
    };
  }
  /**
   * Get contract details by address
   */
  async getContract(contractAddress) {
    const response = await this.sdk.request(`/smart-contracts/${contractAddress}`);
    return response.data;
  }
  /**
   * Call a smart contract method (read-only)
   */
  async call(contractAddress, request) {
    const response = await this.sdk.request(`/smart-contracts/${contractAddress}/call`, {
      method: "POST",
      body: JSON.stringify(request)
    });
    return response.data;
  }
  /**
   * Execute a smart contract method (write)
   */
  async execute(contractAddress, request) {
    const response = await this.sdk.request(`/smart-contracts/${contractAddress}/execute`, {
      method: "POST",
      body: JSON.stringify(request)
    });
    return response.data;
  }
};

// src/modules/tokens.ts
var TokensModule = class {
  constructor(sdk) {
    this.sdk = sdk;
  }
  /**
   * Create a new token
   */
  async create(request) {
    const response = await this.sdk.request("/tokenization", {
      method: "POST",
      body: JSON.stringify(request)
    });
    return response.data;
  }
  /**
   * List tokens
   */
  async list(filters) {
    const params = new URLSearchParams();
    if (filters?.asset_type)
      params.append("asset_type", filters.asset_type);
    if (filters?.status)
      params.append("status", filters.status);
    if (filters?.page)
      params.append("page", filters.page.toString());
    const queryString = params.toString();
    const endpoint = `/tokenization${queryString ? `?${queryString}` : ""}`;
    const response = await this.sdk.request(endpoint);
    return {
      tokens: response.data.result || [],
      pagination: response.data.pagination || {}
    };
  }
  /**
   * Get token details
   */
  async get(tokenId) {
    const response = await this.sdk.request(`/tokenization/${tokenId}`);
    return response.data;
  }
  /**
   * Transfer token
   */
  async transfer(tokenId, data) {
    const response = await this.sdk.request(`/tokenization/${tokenId}/transfer`, {
      method: "POST",
      body: JSON.stringify(data)
    });
    return response.data;
  }
};

// src/modules/compliance.ts
var ComplianceModule = class {
  constructor(sdk) {
    this.sdk = sdk;
  }
  /**
   * Perform KYC verification
   */
  async performKYC(request) {
    const response = await this.sdk.request("/compliance/kyc", {
      method: "POST",
      body: JSON.stringify(request)
    });
    return response.data;
  }
  /**
   * Get KYC status
   */
  async getKYCStatus(walletAddress) {
    const response = await this.sdk.request(`/compliance/kyc/${walletAddress}`);
    return response.data;
  }
  /**
   * Log audit event
   */
  async logAuditEvent(event) {
    const response = await this.sdk.request("/audit/log", {
      method: "POST",
      body: JSON.stringify(event)
    });
    return response.data;
  }
  /**
   * Export audit logs
   */
  async exportAuditLogs(filters) {
    const params = new URLSearchParams();
    if (filters?.start_date)
      params.append("start_date", filters.start_date);
    if (filters?.end_date)
      params.append("end_date", filters.end_date);
    if (filters?.action)
      params.append("action", filters.action);
    if (filters?.user_id)
      params.append("user_id", filters.user_id);
    const queryString = params.toString();
    const endpoint = `/audit/export${queryString ? `?${queryString}` : ""}`;
    const response = await this.sdk.request(endpoint);
    return response.data;
  }
};

// src/modules/analytics.ts
var AnalyticsModule = class {
  constructor(sdk) {
    this.sdk = sdk;
  }
  /**
   * Get analytics data
   */
  async query(query) {
    const response = await this.sdk.request("/analytics/query", {
      method: "POST",
      body: JSON.stringify(query)
    });
    return response.data;
  }
  /**
   * Get overview analytics
   */
  async getOverview(timeframe = "24h") {
    const response = await this.sdk.request(`/analytics/overview?timeframe=${timeframe}`);
    return response.data;
  }
  /**
   * Get smart contract analytics
   */
  async getContractAnalytics(contractAddress) {
    const endpoint = contractAddress ? `/smart-contracts/analytics?contract=${contractAddress}` : "/smart-contracts/analytics";
    const response = await this.sdk.request(endpoint);
    return response.data;
  }
};

// src/errors.ts
var MasHubError = class extends Error {
  constructor(message, code = "MASHUB_ERROR", statusCode) {
    super(message);
    this.name = "MasHubError";
    this.code = code;
    this.statusCode = statusCode;
  }
};
var AuthenticationError = class extends MasHubError {
  constructor(message = "Authentication failed") {
    super(message, "AUTHENTICATION_ERROR", 401);
    this.name = "AuthenticationError";
  }
};
var NetworkError = class extends MasHubError {
  constructor(message = "Network request failed") {
    super(message, "NETWORK_ERROR");
    this.name = "NetworkError";
  }
};
var ValidationError = class extends MasHubError {
  constructor(message = "Validation failed") {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
  }
};
var RateLimitError = class extends MasHubError {
  constructor(message = "Rate limit exceeded") {
    super(message, "RATE_LIMIT_ERROR", 429);
    this.name = "RateLimitError";
  }
};

// src/client.ts
var MasHubSDK = class {
  constructor(config) {
    this.validateConfig(config);
    this.config = {
      environment: "production",
      timeout: 3e4,
      retries: 3,
      ...config
    };
    this.contracts = new ContractsModule(this);
    this.tokens = new TokensModule(this);
    this.compliance = new ComplianceModule(this);
    this.analytics = new AnalyticsModule(this);
  }
  validateConfig(config) {
    if (!config.apiKey) {
      throw new MasHubError("API key is required");
    }
    if (!config.baseUrl && !config.environment) {
      throw new MasHubError("Either baseUrl or environment must be specified");
    }
  }
  getBaseUrl() {
    if (this.config.baseUrl) {
      return this.config.baseUrl;
    }
    switch (this.config.environment) {
      case "development":
        return "http://localhost:3000";
      case "staging":
        return "https://staging.mas-hub.vercel.app";
      case "production":
        return "https://mas-hub.vercel.app";
      default:
        throw new MasHubError(`Unknown environment: ${this.config.environment}`);
    }
  }
  /**
   * Make authenticated API request
   */
  async request(endpoint, options = {}) {
    const url = `${this.getBaseUrl()}/api${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || this.config.timeout);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.config.apiKey}`,
      "User-Agent": `MasHub-SDK/1.0.0`,
      ...options.headers
    };
    const requestOptions = {
      ...options,
      headers,
      signal: controller.signal
    };
    try {
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        await this.handleErrorResponse(response);
      }
      const data = await response.json();
      const headersObj = {};
      response.headers.forEach((value, key) => {
        headersObj[key] = value;
      });
      clearTimeout(timeoutId);
      return {
        success: true,
        data,
        status: response.status,
        headers: headersObj
      };
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof MasHubError) {
        throw error;
      }
      throw new NetworkError(`Network request failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
  async handleErrorResponse(response) {
    const contentType = response.headers.get("content-type");
    let errorData = {};
    if (contentType?.includes("application/json")) {
      try {
        errorData = await response.json();
      } catch {
      }
    }
    const message = errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`;
    switch (response.status) {
      case 401:
        throw new AuthenticationError(message);
      case 403:
        throw new MasHubError(`Forbidden: ${message}`);
      case 404:
        throw new MasHubError(`Not found: ${message}`);
      case 429:
        throw new MasHubError(`Rate limit exceeded: ${message}`);
      case 500:
        throw new MasHubError(`Server error: ${message}`);
      default:
        throw new MasHubError(message);
    }
  }
  /**
   * Test API connectivity
   */
  async ping() {
    try {
      await this.request("/health");
      return true;
    } catch {
      return false;
    }
  }
  /**
   * Get SDK configuration
   */
  getConfig() {
    return { ...this.config };
  }
};
export {
  AnalyticsModule,
  AuthenticationError,
  ComplianceModule,
  ContractsModule,
  MasHubError,
  MasHubSDK,
  NetworkError,
  RateLimitError,
  TokensModule,
  ValidationError
};
