"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, Shield, Zap, TrendingUp, Activity } from "lucide-react"

interface DashboardStats {
  totalTokens: number
  pendingTokens: number
  totalKyc: number
  verifiedKyc: number
  recentTransactions: number
  successRate: number
}

export function RealTimeDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTokens: 0,
    pendingTokens: 0,
    totalKyc: 0,
    verifiedKyc: 0,
    recentTransactions: 0,
    successRate: 0,
  })
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    // Load initial data
    loadDashboardStats()

    // Set up real-time subscriptions
    const tokenChannel = supabase
      .channel("dashboard-tokens")
      .on("postgres_changes", { event: "*", schema: "public", table: "tokens" }, () => {
        loadDashboardStats()
      })
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED")
      })

    const kycChannel = supabase
      .channel("dashboard-kyc")
      .on("postgres_changes", { event: "*", schema: "public", table: "kyc_logs" }, () => {
        loadDashboardStats()
      })
      .subscribe()

    const webhookChannel = supabase
      .channel("dashboard-webhooks")
      .on("postgres_changes", { event: "*", schema: "public", table: "webhook_logs" }, () => {
        loadDashboardStats()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(tokenChannel)
      supabase.removeChannel(kycChannel)
      supabase.removeChannel(webhookChannel)
    }
  }, [])

  const loadDashboardStats = async () => {
    try {
      const supabase = createClient()

      const [tokensResult, kycResult, webhooksResult] = await Promise.all([
        supabase.from("tokens").select("status"),
        supabase.from("kyc_logs").select("verified"),
        supabase
          .from("webhook_logs")
          .select("processed")
          .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
      ])

      const tokens = tokensResult.data || []
      const kyc = kycResult.data || []
      const webhooks = webhooksResult.data || []

      const totalTokens = tokens.length
      const pendingTokens = tokens.filter((t) => t.status === "pending").length
      const totalKyc = kyc.length
      const verifiedKyc = kyc.filter((k) => k.verified).length
      const recentTransactions = webhooks.length
      const processedWebhooks = webhooks.filter((w) => w.processed).length
      const successRate = webhooks.length > 0 ? (processedWebhooks / webhooks.length) * 100 : 0

      setStats({
        totalTokens,
        pendingTokens,
        totalKyc,
        verifiedKyc,
        recentTransactions,
        successRate,
      })
    } catch (error) {
      console.error("Failed to load dashboard stats:", error)
    }
  }

  const statCards = [
    {
      title: "Total Tokens",
      value: stats.totalTokens,
      subtitle: `${stats.pendingTokens} pending`,
      icon: Coins,
      color: "text-blue-600",
    },
    {
      title: "KYC Verifications",
      value: stats.totalKyc,
      subtitle: `${stats.verifiedKyc} verified`,
      icon: Shield,
      color: "text-green-600",
    },
    {
      title: "24h Transactions",
      value: stats.recentTransactions,
      subtitle: "Recent activity",
      icon: Zap,
      color: "text-yellow-600",
    },
    {
      title: "Success Rate",
      value: `${stats.successRate.toFixed(1)}%`,
      subtitle: "Platform reliability",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Real-time Dashboard</h2>
        <div className="flex items-center gap-2">
          <Activity className={`h-4 w-4 ${isConnected ? "text-green-500" : "text-red-500"}`} />
          <Badge variant={isConnected ? "default" : "destructive"}>{isConnected ? "Connected" : "Disconnected"}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
            </CardContent>
            {isConnected && <div className="absolute top-0 right-0 w-1 h-full bg-green-500 animate-pulse" />}
          </Card>
        ))}
      </div>
    </div>
  )
}
