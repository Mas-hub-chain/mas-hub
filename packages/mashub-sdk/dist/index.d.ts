interface RequestInitWithTimeout extends RequestInit {
    timeout?: number;
}
interface MasHubConfig {
    apiKey: string;
    baseUrl?: string;
    environment?: "development" | "staging" | "production";
    timeout?: number;
    retries?: number;
    debug?: boolean;
}
interface MasHubResponse<T = any> {
    success: boolean;
    data: T;
    status: number;
    headers: Record<string, string>;
}
interface SmartContractProject {
    id: string;
    project_name: string;
    slug: string;
    description?: string;
    version?: string;
    last_deployed_at?: string;
    created_at: string;
    updated_at: string;
}
interface SmartContractVersion {
    id: string;
    status: "draft" | "compiling" | "compiled" | "deployed" | "failed";
    compile_type: string;
    version: string;
    slug: string;
    compiler_settings: {
        solidity: {
            version: string;
            settings?: {
                optimizer?: {
                    enabled: boolean;
                    runs: number;
                };
            };
        };
    };
    packages: string[];
    contract_files?: Array<{
        filename: string;
        url: string;
    }>;
    artifacts?: Array<{
        id: number;
        contract_name: string;
        contract_abi: any[];
        bytecode: string;
        source_code: string;
    }>;
    created_at: string;
    updated_at: string;
}
interface DeployedContract {
    contract_address: string;
    deployment_params: any[];
    contract_name: string;
    project_name: string;
    version: string;
    deployed_at: string;
}
interface DeploymentRequest {
    wallet_options: {
        type: "organisation" | "end_user" | "non_custodial";
        address: string;
    };
    deployment_params: Array<{
        sc_artifact_id: number;
        params?: Record<string, any>;
        order: number;
        signed_trx?: string;
    }>;
    callback_url?: string;
}
interface TokenizationRequest {
    asset_type: "PHYSICAL" | "DIGITAL" | "FINANCIAL";
    metadata: {
        name: string;
        description: string;
        image?: string;
        attributes?: Array<{
            trait_type: string;
            value: string | number;
        }>;
        quantity: number;
        custom_metadata?: Record<string, any>;
    };
    tenant_id?: string;
}
interface Token {
    id: string;
    tenant_id: string;
    asset_type: string;
    metadata: {
        name: string;
        description: string;
        quantity: number;
        custom_metadata?: Record<string, any>;
    };
    tx_hash: string;
    status: "pending" | "confirmed" | "failed";
    created_at: string;
}
interface KYCRequest {
    wallet_address: string;
    user_id?: string;
    document_type?: "passport" | "drivers_license" | "national_id";
    document_number?: string;
    full_name?: string;
    date_of_birth?: string;
}
interface KYCResult {
    wallet_address: string;
    risk_score: number;
    risk_level: "low_risk" | "medium_risk" | "high_risk";
    verified: boolean;
    verification_id: string;
    created_at: string;
}
interface AnalyticsQuery {
    metric: "transactions" | "contracts" | "tokens" | "users";
    timeframe: "1h" | "24h" | "7d" | "30d" | "90d";
    filters?: Record<string, any>;
}
interface AnalyticsResult {
    metric: string;
    value: number;
    change: number;
    timeframe: string;
    data_points: Array<{
        timestamp: string;
        value: number;
    }>;
}
interface WebhookEvent {
    id: string;
    event_type: string;
    transaction_hash?: string;
    contract_address?: string;
    payload: Record<string, any>;
    timestamp: string;
}

declare class ContractsModule {
    private sdk;
    constructor(sdk: MasHubSDK);
    /**
     * Create a new smart contract project
     */
    createProject(data: {
        project_name: string;
        description?: string;
    }): Promise<SmartContractProject>;
    /**
     * List all smart contract projects
     */
    listProjects(page?: number): Promise<{
        projects: SmartContractProject[];
        pagination: any;
    }>;
    /**
     * Get project details
     */
    getProject(projectSlug: string): Promise<SmartContractProject>;
    /**
     * Create a new version for a project
     */
    createVersion(projectSlug: string, data: {
        version: string;
        compiler_settings: any;
        contract_files: File[];
        packages?: string[];
    }): Promise<SmartContractVersion>;
    /**
     * Deploy a smart contract version
     */
    deploy(projectSlug: string, versionSlug: string, deploymentRequest: DeploymentRequest): Promise<any>;
    /**
     * List deployed contracts
     */
    listDeployed(filters?: {
        version?: string;
        deployment_id?: string;
    }): Promise<{
        contracts: DeployedContract[];
        pagination: any;
    }>;
    /**
     * Get contract details by address
     */
    getContract(contractAddress: string): Promise<any>;
    /**
     * Call a smart contract method (read-only)
     */
    call(contractAddress: string, request: {
        from: string;
        method_name: string;
        contract_abi?: any[];
        params?: Record<string, any>;
    }): Promise<any>;
    /**
     * Execute a smart contract method (write)
     */
    execute(contractAddress: string, request: {
        wallet_options: {
            type: "organisation" | "end_user" | "non_custodial";
            address: string;
        };
        method_name: string;
        contract_abi?: any[];
        params?: Record<string, any>;
        signed_trx?: string;
        callback_url?: string;
    }): Promise<any>;
}

declare class TokensModule {
    private sdk;
    constructor(sdk: MasHubSDK);
    /**
     * Create a new token
     */
    create(request: TokenizationRequest): Promise<Token>;
    /**
     * List tokens
     */
    list(filters?: {
        asset_type?: string;
        status?: string;
        page?: number;
    }): Promise<{
        tokens: Token[];
        pagination: any;
    }>;
    /**
     * Get token details
     */
    get(tokenId: string): Promise<Token>;
    /**
     * Transfer token
     */
    transfer(tokenId: string, data: {
        to: string;
        amount: number;
        memo?: string;
    }): Promise<any>;
}

declare class ComplianceModule {
    private sdk;
    constructor(sdk: MasHubSDK);
    /**
     * Perform KYC verification
     */
    performKYC(request: KYCRequest): Promise<KYCResult>;
    /**
     * Get KYC status
     */
    getKYCStatus(walletAddress: string): Promise<KYCResult>;
    /**
     * Log audit event
     */
    logAuditEvent(event: {
        action: string;
        user_id?: string;
        details: Record<string, any>;
        ip_address?: string;
        user_agent?: string;
    }): Promise<any>;
    /**
     * Export audit logs
     */
    exportAuditLogs(filters?: {
        start_date?: string;
        end_date?: string;
        action?: string;
        user_id?: string;
    }): Promise<any>;
}

declare class AnalyticsModule {
    private sdk;
    constructor(sdk: MasHubSDK);
    /**
     * Get analytics data
     */
    query(query: AnalyticsQuery): Promise<AnalyticsResult>;
    /**
     * Get overview analytics
     */
    getOverview(timeframe?: string): Promise<{
        transactions: AnalyticsResult;
        contracts: AnalyticsResult;
        tokens: AnalyticsResult;
        users: AnalyticsResult;
    }>;
    /**
     * Get smart contract analytics
     */
    getContractAnalytics(contractAddress?: string): Promise<any>;
}

declare class MasHubSDK {
    private config;
    private accessToken?;
    readonly contracts: ContractsModule;
    readonly tokens: TokensModule;
    readonly compliance: ComplianceModule;
    readonly analytics: AnalyticsModule;
    constructor(config: MasHubConfig);
    private validateConfig;
    private getBaseUrl;
    /**
     * Make authenticated API request
     */
    request<T = any>(endpoint: string, options?: RequestInitWithTimeout): Promise<MasHubResponse<T>>;
    private handleErrorResponse;
    /**
     * Test API connectivity
     */
    ping(): Promise<boolean>;
    /**
     * Get SDK configuration
     */
    getConfig(): Readonly<MasHubConfig>;
}

declare class MasHubError extends Error {
    readonly code: string;
    readonly statusCode?: number;
    constructor(message: string, code?: string, statusCode?: number);
}
declare class AuthenticationError extends MasHubError {
    constructor(message?: string);
}
declare class NetworkError extends MasHubError {
    constructor(message?: string);
}
declare class ValidationError extends MasHubError {
    constructor(message?: string);
}
declare class RateLimitError extends MasHubError {
    constructor(message?: string);
}

export { AnalyticsModule, AnalyticsQuery, AnalyticsResult, AuthenticationError, ComplianceModule, ContractsModule, DeployedContract, DeploymentRequest, KYCRequest, KYCResult, MasHubConfig, MasHubError, MasHubResponse, MasHubSDK, NetworkError, RateLimitError, RequestInitWithTimeout, SmartContractProject, SmartContractVersion, Token, TokenizationRequest, TokensModule, ValidationError, WebhookEvent };
