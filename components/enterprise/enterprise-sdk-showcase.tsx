"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Code, Download, ExternalLink, Copy, CheckCircle, Globe } from "lucide-react"

interface SDKExample {
  language: string
  title: string
  description: string
  code: string
  features: string[]
}

export function EnterpriseSDKShowcase() {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const sdkExamples: Record<string, SDKExample> = {
    javascript: {
      language: "JavaScript/TypeScript",
      title: "Web & Node.js Integration",
      description: "Full-featured SDK for web applications and Node.js backends",
      code: `// Install: npm install @mashub/sdk
import { MasHubSDK } from '@mashub/sdk'

// Initialize SDK
const masHub = new MasHubSDK({
  apiKey: process.env.MASHUB_API_KEY,
  network: 'maschain-mainnet',
  environment: 'production'
})

// Create and track pharmaceutical asset
async function trackPharmaceuticalBatch() {
  try {
    // Create new asset on blockchain
    const asset = await masHub.assets.create({
      type: 'pharmaceutical',
      name: 'COVID-19 Vaccine Batch #A2024',
      metadata: {
        manufacturer: 'Pfizer',
        batchNumber: 'PF-2024-001',
        expiryDate: '2024-12-31',
        storageTemp: { min: -80, max: -60 }
      },
      compliance: {
        standards: ['FDA', 'WHO', 'EMA'],
        certifications: ['GMP', 'GDP']
      }
    })

    return asset
  } catch (error) {
    console.error('Asset tracking failed:', error)
    throw error
  }
}`,
      features: [
        "Real-time asset tracking",
        "Automated compliance monitoring",
        "Multi-stakeholder workflows",
        "Event-driven architecture",
        "Enterprise authentication",
        "Comprehensive error handling",
      ],
    },
    python: {
      language: "Python",
      title: "Data Science & Automation",
      description: "Python SDK for data analysis, ML integration, and automation",
      code: `# Install: pip install mashub-sdk
from mashub import MasHubSDK
import pandas as pd
from datetime import datetime, timedelta

# Initialize SDK
mas_hub = MasHubSDK(
    api_key=os.getenv('MASHUB_API_KEY'),
    network='maschain-mainnet',
    environment='production'
)

class SupplyChainAnalytics:
    def __init__(self):
        self.sdk = mas_hub
        
    async def analyze_compliance_trends(self, days=30):
        """Analyze compliance trends over time"""
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        # Fetch compliance data
        compliance_data = await self.sdk.analytics.get_compliance_metrics(
            start_date=start_date,
            end_date=end_date,
            asset_types=['pharmaceutical', 'food', 'luxury']
        )
        
        return compliance_data`,
      features: [
        "Data science integration",
        "ML-powered risk prediction",
        "Automated reporting",
        "Pandas DataFrame support",
        "Batch processing",
        "Statistical analysis tools",
      ],
    },
    java: {
      language: "Java",
      title: "Enterprise System Integration",
      description: "Java SDK for enterprise systems, ERP integration, and microservices",
      code: `// Maven dependency
import com.mashub.sdk.MasHubSDK;
import com.mashub.sdk.models.*;
import org.springframework.stereotype.Service;

@Service
public class EnterpriseSupplyChainService {
    
    private final MasHubSDK masHubSDK;
    
    public EnterpriseSupplyChainService() {
        this.masHubSDK = MasHubSDK.builder()
            .apiKey(System.getenv("MASHUB_API_KEY"))
            .network("maschain-mainnet")
            .environment("production")
            .build();
    }
    
    public CompletableFuture<Asset> createAssetFromERP(ERPAssetData erpData) {
        return CompletableFuture.supplyAsync(() -> {
            AssetCreationRequest request = AssetCreationRequest.builder()
                .type(AssetType.fromERPCategory(erpData.getCategory()))
                .name(erpData.getProductName())
                .build();
            
            return masHubSDK.assets().create(request);
        });
    }
}`,
      features: [
        "Spring Boot integration",
        "ERP system connectivity",
        "Async processing",
        "Enterprise workflows",
        "Event-driven architecture",
        "Comprehensive error handling",
      ],
    },
    rest: {
      language: "REST API",
      title: "Universal HTTP Integration",
      description: "RESTful APIs for any programming language or platform",
      code: `# Authentication
curl -X POST https://api.mashub.com/v1/auth/token \\
  -H "Content-Type: application/json" \\
  -d '{
    "client_id": "your_client_id",
    "client_secret": "your_client_secret",
    "grant_type": "client_credentials"
  }'

# Create Asset
curl -X POST https://api.mashub.com/v1/assets \\
  -H "Authorization: Bearer eyJ..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "pharmaceutical",
    "name": "COVID-19 Vaccine Batch #A2024",
    "metadata": {
      "manufacturer": "Pfizer",
      "batch_number": "PF-2024-001"
    }
  }'`,
      features: [
        "RESTful HTTP APIs",
        "OAuth 2.0 authentication",
        "Real-time WebSocket events",
        "Comprehensive documentation",
        "Rate limiting & quotas",
        "Multi-format responses",
      ],
    },
  }

  const copyToClipboard = async (code: string, language: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(language)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Clean Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Enterprise SDK & API Suite</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Production-ready SDKs and APIs for seamless integration with your enterprise systems. Built for scale,
          security, and real-world deployment on MasChain.
        </p>
      </div>

      {/* SDK Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Integration</CardTitle>
          <CardDescription>
            Select your preferred programming language or platform to see integration examples
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(sdkExamples).map(([key, sdk]) => (
              <Button
                key={key}
                variant={selectedLanguage === key ? "default" : "outline"}
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => setSelectedLanguage(key)}
              >
                <div className="text-2xl">
                  {key === "javascript" && "🟨"}
                  {key === "python" && "🐍"}
                  {key === "java" && "☕"}
                  {key === "rest" && "🌐"}
                </div>
                <span className="text-sm font-medium">{sdk.language}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SDK Details */}
      {selectedLanguage && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Code Example */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{sdkExamples[selectedLanguage].title}</CardTitle>
                    <CardDescription>{sdkExamples[selectedLanguage].description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(sdkExamples[selectedLanguage].code, selectedLanguage)}
                    >
                      {copiedCode === selectedLanguage ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>{sdkExamples[selectedLanguage].code}</code>
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Features & Resources */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sdkExamples[selectedLanguage].features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Code className="mr-2 h-4 w-4" />
                    API Documentation
                    <ExternalLink className="ml-auto h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="mr-2 h-4 w-4" />
                    SDK Download
                    <ExternalLink className="ml-auto h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Globe className="mr-2 h-4 w-4" />
                    Live Examples
                    <ExternalLink className="ml-auto h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join leading enterprises who are already using MAS Hub to transform their supply chains with blockchain
            technology. Get started with our free developer tier.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button size="lg">
              <Code className="mr-2 h-5 w-5" />
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline">
              <ExternalLink className="mr-2 h-5 w-5" />
              Schedule Demo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
