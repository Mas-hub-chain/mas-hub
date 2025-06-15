# @mashub/sdk

Official TypeScript/JavaScript SDK for MAS Hub - Enterprise blockchain platform built on MasChain.

## Installation

```bash
npm install @mashub/sdk
# or
yarn add @mashub/sdk
# or
pnpm add @mashub/sdk
```

## Quick Start

```typescript
import { MasHubSDK } from '@mashub/sdk'

// Initialize the SDK
const masHub = new MasHubSDK({
  apiKey: 'your-api-key',
  environment: 'production' // or 'staging', 'development'
})

// Create a smart contract project
const project = await masHub.contracts.createProject({
  project_name: 'SupplyChainTracker',
  description: 'Track product provenance and authenticity'
})

// Create a token
const token = await masHub.tokens.create({
  asset_type: 'PHYSICAL',
  metadata: {
    name: 'Product Token #123',
    description: 'Represents ownership of physical product',
    quantity: 1000,
    attributes: [
      { trait_type: 'Category', value: 'Electronics' },
      { trait_type: 'Serial Number', value: 'SN123456789' }
    ]
  }
})

// Perform KYC verification
const kycResult = await masHub.compliance.performKYC({
  wallet_address: '0x1234567890123456789012345678901234567890',
  user_id: 'user_123'
})
```

## Configuration

```typescript
const masHub = new MasHubSDK({
  apiKey: 'your-api-key',           // Required: Your MAS Hub API key
  environment: 'production',        // Optional: 'development' | 'staging' | 'production'
  baseUrl: 'https://custom.url',    // Optional: Custom base URL
  timeout: 30000,                   // Optional: Request timeout in ms (default: 30000)
  retries: 3,                       // Optional: Number of retries (default: 3)
  debug: false                      // Optional: Enable debug logging (default: false)
})
```

## Modules

### Smart Contracts

```typescript
// Create project
const project = await masHub.contracts.createProject({
  project_name: 'MyContract',
  description: 'My smart contract project'
})

// List projects
const { projects, pagination } = await masHub.contracts.listProjects()

// Deploy contract
const deployment = await masHub.contracts.deploy(
  'project-slug',
  'version-slug',
  {
    wallet_options: {
      type: 'organisation',
      address: '0xYourWalletAddress'
    },
    deployment_params: [{
      sc_artifact_id: 123,
      params: { initialSupply: 1000000 },
      order: 1
    }]
  }
)

// Call contract method (read-only)
const result = await masHub.contracts.call('0xContractAddress', {
  from: '0xYourAddress',
  method_name: 'balanceOf',
  params: { account: '0xTargetAddress' }
})

// Execute contract method (write)
const txResult = await masHub.contracts.execute('0xContractAddress', {
  wallet_options: {
    type: 'organisation',
    address: '0xYourAddress'
  },
  method_name: 'transfer',
  params: {
    to: '0xRecipientAddress',
    amount: 100
  }
})
```

### Tokenization

```typescript
// Create token
const token = await masHub.tokens.create({
  asset_type: 'PHYSICAL',
  metadata: {
    name: 'Product Token',
    description: 'Represents physical product ownership',
    image: 'https://example.com/image.jpg',
    quantity: 1000,
    attributes: [
      { trait_type: 'Category', value: 'Electronics' },
      { trait_type: 'Brand', value: 'TechCorp' }
    ]
  }
})

// List tokens
const { tokens, pagination } = await masHub.tokens.list({
  asset_type: 'PHYSICAL',
  status: 'confirmed',
  page: 1
})

// Transfer token
const transfer = await masHub.tokens.transfer('token-id', {
  to: '0xRecipientAddress',
  amount: 100,
  memo: 'Product sale'
})
```

### Compliance

```typescript
// Perform KYC
const kycResult = await masHub.compliance.performKYC({
  wallet_address: '0x1234567890123456789012345678901234567890',
  user_id: 'user_123',
  document_type: 'passport',
  document_number: 'A12345678',
  full_name: 'John Doe',
  date_of_birth: '1990-01-01'
})

// Get KYC status
const status = await masHub.compliance.getKYCStatus('0xWalletAddress')

// Log audit event
await masHub.compliance.logAuditEvent({
  action: 'TOKEN_TRANSFER',
  user_id: 'user_123',
  details: {
    token_id: 'token_456',
    amount: 100,
    recipient: '0xRecipientAddress'
  },
  ip_address: '192.168.1.1'
})

// Export audit logs
const auditLogs = await masHub.compliance.exportAuditLogs({
  start_date: '2025-01-01',
  end_date: '2025-01-31',
  action: 'TOKEN_TRANSFER'
})
```

### Analytics

```typescript
// Get overview analytics
const overview = await masHub.analytics.getOverview('24h')

// Query specific metrics
const transactionMetrics = await masHub.analytics.query({
  metric: 'transactions',
  timeframe: '7d',
  filters: {
    contract_address: '0xContractAddress'
  }
})

// Get contract analytics
const contractAnalytics = await masHub.analytics.getContractAnalytics('0xContractAddress')
```

## Error Handling

```typescript
import { MasHubError, AuthenticationError, NetworkError } from '@mashub/sdk'

try {
  const project = await masHub.contracts.createProject({
    project_name: 'MyProject'
  })
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Authentication failed:', error.message)
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message)
  } else if (error instanceof MasHubError) {
    console.error('MAS Hub error:', error.message, error.code)
  } else {
    console.error('Unknown error:', error)
  }
}
```

## TypeScript Support

The SDK is written in TypeScript and provides full type definitions:

```typescript
import type { 
  SmartContractProject, 
  Token, 
  KYCResult,
  AnalyticsResult 
} from '@mashub/sdk'

const project: SmartContractProject = await masHub.contracts.createProject({
  project_name: 'TypedProject',
  description: 'Fully typed project'
})
```

## Testing

```typescript
// Test API connectivity
const isConnected = await masHub.ping()
console.log('API connected:', isConnected)

// Get SDK configuration
const config = masHub.getConfig()
console.log('SDK config:', config)
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [https://docs.mas-hub.com](https://docs.mas-hub.com)
- **GitHub Issues**: [https://github.com/Mas-hub-chain/mas-hub/issues](https://github.com/your-org/mas-hub/issues)
- **Email**: mashub.chain@gmail.com
```
