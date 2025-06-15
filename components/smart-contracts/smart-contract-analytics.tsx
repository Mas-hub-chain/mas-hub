"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Activity, TrendingUp, Zap, AlertTriangle, CheckCircle } from "lucide-react"

interface SmartContractAnalytics {
  totalContracts: number
  activeContracts: number
  totalTransactions: number
  totalGasUsed: number
  averageGasPrice: number
  successRate: number
  deploymentTrend: Array<{
    date: string
    deployments: number
    interactions: number
  }>
  gasUsageTrend: Array<{
    date: string
    gasUsed: number
    cost: number
  }>
  contractsByStatus: Array<{
    status: string
    count: number
    color: string
  }>
  topContracts: Array<{
    name: string
    address: string
    interactions: number
    gasUsed: number
    lastActivity: string
  }>
  vulnerabilities: Array<{
    contract: string
    severity: "low" | "medium" | "high" | "critical"
    count: number
  }>
}

export function SmartContractAnalytics() {
  const [analytics, setAnalytics] = useState<SmartContractAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("7d")

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/smart-contracts/analytics?range=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  // Mock data for demonstration
  const mockAnalytics: SmartContractAnalytics = {
    totalContracts: 24,
    activeContracts: 18,
    totalTransactions: 1247,
    totalGasUsed: 2847392,
    averageGasPrice: 0,
    successRate: 94.2,
    deploymentTrend: [
      { date: "2024-01-01", deployments: 3, interactions: 45 },
      { date: "2024-01-02", deployments: 5, interactions: 67 },
      { date: "2024-01-03", deployments: 2, interactions: 89 },
      { date: "2024-01-04", deployments: 7, interactions: 123 },
      { date: "2024-01-05", deployments: 4, interactions: 98 },
      { date: "2024-01-06", deployments: 6, interactions: 156 },
      { date: "2024-01-07", deployments: 3, interactions: 134 },
    ],
    gasUsageTrend: [
      { date: "2024-01-01", gasUsed: 234567, cost: 0 },
      { date: "2024-01-02", gasUsed: 345678, cost: 0 },
      { date: "2024-01-03", gasUsed: 456789, cost: 0 },
      { date: "2024-01-04", gasUsed: 567890, cost: 0 },
      { date: "2024-01-05", gasUsed: 432109, cost: 0 },
      { date: "2024-01-06", gasUsed: 654321, cost: 0 },
      { date: "2024-01-07", gasUsed: 543210, cost: 0 },
    ],
    contractsByStatus: [
      { status: "Active", count: 18, color: "#10b981" },
      { status: "Inactive", count: 4, color: "#6b7280" },
      { status: "Failed", count: 2, color: "#ef4444" },
    ],
    topContracts: [
      {
        name: "TokenContract",
        address: "0x1234...5678",
        interactions: 456,
        gasUsed: 234567,
        lastActivity: "2024-01-07T10:30:00Z",
      },
      {
        name: "NFTMarketplace",
        address: "0x2345...6789",
        interactions: 234,
        gasUsed: 345678,
        lastActivity: "2024-01-07T09:15:00Z",
      },
      {
        name: "StakingPool",
        address: "0x3456...7890",
        interactions: 123,
        gasUsed: 456789,
        lastActivity: "2024-01-06T16:45:00Z",
      },
    ],
    vulnerabilities: [
      { contract: "TokenContract", severity: "low", count: 2 },
      { contract: "NFTMarketplace", severity: "medium", count: 1 },
      { contract: "StakingPool", severity: "high", count: 1 },
    ],
  }

  const data = analytics || mockAnalytics

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "text-yellow-600"
      case "medium":
        return "text-orange-600"
      case "high":
        return "text-red-600"
      case "critical":
        return "text-red-800"
      default:
        return "text-gray-600"
    }
  }

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case "low":
        return "secondary"
      case "medium":
        return "outline"
      case "high":
        return "destructive"
      case "critical":
        return "destructive"
      default:
        return "secondary"
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contracts</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalContracts}</div>
            <p className="text-xs text-muted-foreground">{data.activeContracts} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalTransactions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{data.successRate}% success rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gas Used</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(data.totalGasUsed / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Avg: {data.averageGasPrice} gwei</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.successRate}%</div>
            <Progress value={data.successRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="gas">Gas Usage</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deployment & Interaction Trends</CardTitle>
              <CardDescription>Contract deployments and interactions over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.deploymentTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="deployments" fill="#3b82f6" name="Deployments" />
                  <Bar dataKey="interactions" fill="#10b981" name="Interactions" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gas Usage Trends</CardTitle>
              <CardDescription>Gas consumption over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.gasUsageTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="gasUsed" stroke="#3b82f6" strokeWidth={2} name="Gas Used" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Contract Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={data.contractsByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="count"
                    >
                      {data.contractsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {data.contractsByStatus.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-sm">
                        {entry.status}: {entry.count}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Contracts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.topContracts.map((contract, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{contract.name}</div>
                        <div className="text-sm text-muted-foreground font-mono">{contract.address}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{contract.interactions} interactions</div>
                        <div className="text-xs text-muted-foreground">{(contract.gasUsed / 1000).toFixed(1)}k gas</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Security Analysis
              </CardTitle>
              <CardDescription>Vulnerability assessment of deployed contracts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.vulnerabilities.map((vuln, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{vuln.contract}</div>
                      <div className="text-sm text-muted-foreground">{vuln.count} vulnerabilities found</div>
                    </div>
                    <Badge variant={getSeverityBadgeVariant(vuln.severity)}>{vuln.severity.toUpperCase()}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
