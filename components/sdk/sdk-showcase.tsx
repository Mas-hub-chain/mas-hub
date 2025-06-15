"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Code, Package, Zap, CheckCircle } from "lucide-react"

export function SDKShowcase() {
  const [activeTab, setActiveTab] = useState("install")

  const codeExamples = {
    install: `npm install @mashub/sdk
# or
yarn add @mashub/sdk
# or
pnpm add @mashub/sdk`,

    init: `import { MasHubSDK } from '@mashub/sdk'

const masHub = new MasHubSDK({
  apiKey: 'your-api-key',
  environment: 'production'
})`,

    contract: `// Create smart contract project
const project = await masHub.contracts.createProject({
  project_name: 'SupplyChainTracker',
  description: 'Track product provenance'
})

// Deploy contract
const deployment = await masHub.contracts.deploy(
  project.slug,
  'v1.0.0',
  {
    wallet_options: {
      type: 'organisation',
      address: '0xYourWalletAddress'
    }
  }
)`,

    token: `// Create token
const token = await masHub.tokens.create({
  asset_type: 'PHYSICAL',
  metadata: {
    name: 'Product Token #123',
    description: 'Represents product ownership',
    quantity: 1000
  }
})

// Transfer token
await masHub.tokens.transfer(token.id, {
  to: '0xRecipientAddress',
  amount: 100
})`,
  }

  const features = [
    {
      icon: <Code className="h-5 w-5" />,
      title: "TypeScript First",
      description: "Full type safety and IntelliSense support",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Simple API",
      description: "Complex blockchain operations in one line",
    },
    {
      icon: <Package className="h-5 w-5" />,
      title: "Modular Design",
      description: "Import only what you need",
    },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      title: "Production Ready",
      description: "Built-in error handling and retries",
    },
  ]

  const tabs = [
    { id: "install", label: "Installation" },
    { id: "init", label: "Initialize" },
    { id: "contract", label: "Smart Contracts" },
    { id: "token", label: "Tokenization" },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge variant="secondary" className="px-3 py-1">
          <Package className="h-4 w-4 mr-2" />
          Developer SDK
        </Badge>
        <h2 className="text-3xl font-bold">MAS Hub SDK</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          The easiest way to integrate blockchain functionality into your applications. One SDK, endless possibilities.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="text-center">
            <CardHeader className="pb-3">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                {feature.icon}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Code Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start Examples</CardTitle>
          <CardDescription>Get started with MAS Hub SDK in minutes</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-6 border-b">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className="mb-2"
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Code Display */}
          <div className="relative">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">{codeExamples[activeTab as keyof typeof codeExamples]}</code>
            </pre>
            <Button
              size="sm"
              variant="outline"
              className="absolute top-2 right-2"
              onClick={() => navigator.clipboard.writeText(codeExamples[activeTab as keyof typeof codeExamples])}
            >
              Copy
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="text-center space-y-4 p-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
        <h3 className="text-2xl font-bold">Ready to Build?</h3>
        <p className="text-muted-foreground">Join the growing ecosystem of developers building on MAS Hub</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg">
            <Package className="h-4 w-4 mr-2" />
            Get Started
          </Button>
          <Button size="lg" variant="outline">
            <Code className="h-4 w-4 mr-2" />
            View Documentation
          </Button>
        </div>
      </div>
    </div>
  )
}
