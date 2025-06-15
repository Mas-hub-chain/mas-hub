"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Package,
  Truck,
  MapPin,
  Thermometer,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"

interface Asset {
  id: string
  name: string
  type: "pharmaceutical" | "food" | "luxury" | "electronics"
  status: "in_transit" | "delivered" | "delayed" | "verified"
  location: string
  temperature: number
  humidity: number
  compliance_score: number
  last_updated: string
  stakeholders: string[]
  blockchain_hash: string
}

interface SupplyChainMetrics {
  total_assets: number
  in_transit: number
  compliance_rate: number
  cost_savings: number
  fraud_prevention: number
  stakeholder_satisfaction: number
}

export function SupplyChainDashboard() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [metrics, setMetrics] = useState<SupplyChainMetrics>({
    total_assets: 0,
    in_transit: 0,
    compliance_rate: 0,
    cost_savings: 0,
    fraud_prevention: 0,
    stakeholder_satisfaction: 0,
  })
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)

  // Simulate real-time data updates
  useEffect(() => {
    const mockAssets: Asset[] = [
      {
        id: "PHR-001",
        name: "COVID-19 Vaccine Batch #A2024",
        type: "pharmaceutical",
        status: "in_transit",
        location: "Distribution Center, Kuala Lumpur",
        temperature: -70,
        humidity: 45,
        compliance_score: 98,
        last_updated: "2024-01-15T10:30:00Z",
        stakeholders: ["Pfizer", "Cold Chain Logistics", "Hospital Kuala Lumpur"],
        blockchain_hash: "0x1a2b3c4d5e6f7890abcdef1234567890",
      },
      {
        id: "LUX-002",
        name: "Hermès Birkin Bag #HB2024-001",
        type: "luxury",
        status: "verified",
        location: "Boutique, KLCC",
        temperature: 22,
        humidity: 50,
        compliance_score: 100,
        last_updated: "2024-01-15T09:15:00Z",
        stakeholders: ["Hermès", "Luxury Retail Malaysia", "Authentication Service"],
        blockchain_hash: "0x9876543210fedcba0987654321abcdef",
      },
      {
        id: "FOOD-003",
        name: "Organic Salmon Shipment #OS2024-A",
        type: "food",
        status: "delivered",
        location: "Supermarket Chain, Penang",
        temperature: 4,
        humidity: 85,
        compliance_score: 95,
        last_updated: "2024-01-15T08:45:00Z",
        stakeholders: ["Norwegian Seafood", "Cold Storage Transport", "Retail Chain"],
        blockchain_hash: "0xabcdef1234567890fedcba0987654321",
      },
    ]

    const mockMetrics: SupplyChainMetrics = {
      total_assets: 1247,
      in_transit: 89,
      compliance_rate: 97.8,
      cost_savings: 32.5,
      fraud_prevention: 94.2,
      stakeholder_satisfaction: 96.1,
    }

    setAssets(mockAssets)
    setMetrics(mockMetrics)

    // Simulate real-time updates
    const interval = setInterval(() => {
      setAssets((prev) =>
        prev.map((asset) => ({
          ...asset,
          temperature: asset.temperature + (Math.random() - 0.5) * 2,
          humidity: Math.max(0, Math.min(100, asset.humidity + (Math.random() - 0.5) * 5)),
          last_updated: new Date().toISOString(),
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: Asset["status"]) => {
    switch (status) {
      case "verified":
        return "default"
      case "delivered":
        return "default"
      case "in_transit":
        return "secondary"
      case "delayed":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getComplianceColor = (score: number) => {
    if (score >= 95) return "default"
    if (score >= 85) return "destructive"
    return "destructive"
  }

  return (
    <div className="space-y-6">
      {/* Clean Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Enterprise Supply Chain Dashboard</h1>
          <p className="text-muted-foreground">Real-time monitoring and compliance tracking powered by MasChain</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="default" className="flex items-center space-x-1">
            <Zap className="h-3 w-3" />
            <span>Live on MasChain</span>
          </Badge>
          <Button>
            <Package className="mr-2 h-4 w-4" />
            Add New Asset
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.total_assets.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.in_transit}</div>
            <p className="text-xs text-muted-foreground">Real-time tracking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.compliance_rate}%</div>
            <p className="text-xs text-muted-foreground">+2.1% improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.cost_savings}%</div>
            <p className="text-xs text-muted-foreground">Operational efficiency</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fraud Prevention</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.fraud_prevention}%</div>
            <p className="text-xs text-muted-foreground">Authenticity verified</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.stakeholder_satisfaction}%</div>
            <p className="text-xs text-muted-foreground">Stakeholder rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs defaultValue="assets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assets">Asset Tracking</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Monitor</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Asset List */}
            <Card>
              <CardHeader>
                <CardTitle>Live Asset Tracking</CardTitle>
                <CardDescription>Real-time monitoring of assets across the supply chain</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {assets.map((asset) => (
                      <div
                        key={asset.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedAsset?.id === asset.id ? "bg-muted" : "hover:bg-muted/50"
                        }`}
                        onClick={() => setSelectedAsset(asset)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Package className="h-4 w-4" />
                            <span className="font-medium">{asset.id}</span>
                          </div>
                          <Badge variant={getStatusColor(asset.status)}>{asset.status.replace("_", " ")}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{asset.name}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{asset.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Thermometer className="h-3 w-3" />
                            <span>{asset.temperature.toFixed(1)}°C</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Asset Details */}
            <Card>
              <CardHeader>
                <CardTitle>Asset Details</CardTitle>
                <CardDescription>Detailed information and compliance status</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedAsset ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">{selectedAsset.name}</h3>
                      <p className="text-sm text-muted-foreground">ID: {selectedAsset.id}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Temperature</p>
                        <p className="text-2xl font-bold">{selectedAsset.temperature.toFixed(1)}°C</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Humidity</p>
                        <p className="text-2xl font-bold">{selectedAsset.humidity.toFixed(1)}%</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">Compliance Score</p>
                        <Badge variant={getComplianceColor(selectedAsset.compliance_score)}>
                          {selectedAsset.compliance_score}%
                        </Badge>
                      </div>
                      <Progress value={selectedAsset.compliance_score} className="h-2" />
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Stakeholders</p>
                      <div className="space-y-1">
                        {selectedAsset.stakeholders.map((stakeholder, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span className="text-sm">{stakeholder}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-1">Blockchain Hash</p>
                      <p className="text-xs font-mono bg-muted p-2 rounded">{selectedAsset.blockchain_hash}</p>
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Last updated: {new Date(selectedAsset.last_updated).toLocaleString()}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select an asset to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Monitoring</CardTitle>
              <CardDescription>Automated regulatory compliance tracking and reporting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">FDA</div>
                    <p className="text-sm text-muted-foreground">Pharmaceutical Compliance</p>
                    <Progress value={98} className="mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">ISO</div>
                    <p className="text-sm text-muted-foreground">Quality Standards</p>
                    <Progress value={96} className="mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">GDPR</div>
                    <p className="text-sm text-muted-foreground">Data Protection</p>
                    <Progress value={100} className="mt-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>Key performance indicators and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Delivery Success Rate</span>
                      <span className="text-sm font-bold">98.7%</span>
                    </div>
                    <Progress value={98.7} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Cost Reduction</span>
                      <span className="text-sm font-bold">32.5%</span>
                    </div>
                    <Progress value={32.5} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Fraud Prevention</span>
                      <span className="text-sm font-bold">94.2%</span>
                    </div>
                    <Progress value={94.2} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ROI Calculator</CardTitle>
                <CardDescription>Return on investment from blockchain implementation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Annual Savings</p>
                      <p className="text-2xl font-bold text-green-600">$2.4M</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Implementation Cost</p>
                      <p className="text-2xl font-bold">$400K</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Payback Period</p>
                    <p className="text-3xl font-bold text-blue-600">6 months</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">3-Year ROI</p>
                    <p className="text-3xl font-bold text-purple-600">580%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="blockchain" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>MasChain Integration</CardTitle>
              <CardDescription>Deep integration with MasChain blockchain infrastructure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">1,247</div>
                    <p className="text-sm text-muted-foreground">Smart Contracts</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">45,892</div>
                    <p className="text-sm text-muted-foreground">Transactions</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">99.9%</div>
                    <p className="text-sm text-muted-foreground">Uptime</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">0.02s</div>
                    <p className="text-sm text-muted-foreground">Avg Block Time</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
