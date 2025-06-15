"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, Shield, Zap, Clock, User } from "lucide-react"

interface ActivityItem {
  id: string
  type: string
  title: string
  description: string
  status: string
  timestamp: string
  icon: any
}

// Mock activity data to prevent errors
// const mockActivities = [
//   {
//     id: '1',
//     type: 'token_created',
//     description: 'New token created',
//     timestamp: new Date().toISOString(),
//     user: 'System'
//   },
//   {
//     id: '2',
//     type: 'kyc_verified',
//     description: 'KYC verification completed',
//     timestamp: new Date(Date.now() - 3600000).toISOString(),
//     user: 'System'
//   }
// ]

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Initial load
    fetchActivities()

    // Set up real-time subscriptions
    const tokenChannel = supabase
      .channel("tokens")
      .on("postgres_changes", { event: "*", schema: "public", table: "tokens" }, handleTokenChange)
      .subscribe()

    const kycChannel = supabase
      .channel("kyc_logs")
      .on("postgres_changes", { event: "*", schema: "public", table: "kyc_logs" }, handleKYCChange)
      .subscribe()

    const webhookChannel = supabase
      .channel("webhook_logs")
      .on("postgres_changes", { event: "*", schema: "public", table: "webhook_logs" }, handleWebhookChange)
      .subscribe()

    return () => {
      supabase.removeChannel(tokenChannel)
      supabase.removeChannel(kycChannel)
      supabase.removeChannel(webhookChannel)
    }
  }, [])

  const fetchActivities = async () => {
    try {
      const supabase = createClient()

      // Fetch recent activities from multiple tables
      const [tokensResult, kycResult, webhooksResult] = await Promise.all([
        supabase.from("tokens").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("kyc_logs").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("webhook_logs").select("*").order("created_at", { ascending: false }).limit(5),
      ])

      const allActivities: ActivityItem[] = []

      // Process tokens
      tokensResult.data?.forEach((token) => {
        allActivities.push({
          id: `token-${token.id}`,
          type: "token",
          title: "Token Created",
          description: `${token.metadata.name} (${token.asset_type})`,
          status: token.status,
          timestamp: token.created_at,
          icon: Coins,
        })
      })

      // Process KYC logs
      kycResult.data?.forEach((kyc) => {
        allActivities.push({
          id: `kyc-${kyc.id}`,
          type: "kyc",
          title: "KYC Verification",
          description: `${kyc.wallet_address.slice(0, 10)}...`,
          status: kyc.verified ? "verified" : "pending",
          timestamp: kyc.created_at,
          icon: Shield,
        })
      })

      // Process webhooks
      webhooksResult.data?.forEach((webhook) => {
        allActivities.push({
          id: `webhook-${webhook.id}`,
          type: "webhook",
          title: "Webhook Event",
          description: webhook.event_type.replace("_", " "),
          status: webhook.processed ? "processed" : "pending",
          timestamp: webhook.created_at,
          icon: Zap,
        })
      })

      // Sort by timestamp and take latest 10
      allActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      setActivities(allActivities.slice(0, 10))
    } catch (error) {
      console.error("Failed to fetch activities:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTokenChange = (payload: any) => {
    const token = payload.new
    const newActivity: ActivityItem = {
      id: `token-${token.id}`,
      type: "token",
      title: "Token Created",
      description: `${token.metadata.name} (${token.asset_type})`,
      status: token.status,
      timestamp: token.created_at,
      icon: Coins,
    }

    setActivities((prev) => [newActivity, ...prev.slice(0, 9)])
  }

  const handleKYCChange = (payload: any) => {
    const kyc = payload.new
    const newActivity: ActivityItem = {
      id: `kyc-${kyc.id}`,
      type: "kyc",
      title: "KYC Verification",
      description: `${kyc.wallet_address.slice(0, 10)}...`,
      status: kyc.verified ? "verified" : "pending",
      timestamp: kyc.created_at,
      icon: Shield,
    }

    setActivities((prev) => [newActivity, ...prev.slice(0, 9)])
  }

  const handleWebhookChange = (payload: any) => {
    const webhook = payload.new
    const newActivity: ActivityItem = {
      id: `webhook-${webhook.id}`,
      type: "webhook",
      title: "Webhook Event",
      description: webhook.event_type.replace("_", " "),
      status: webhook.processed ? "processed" : "pending",
      timestamp: webhook.created_at,
      icon: Zap,
    }

    setActivities((prev) => [newActivity, ...prev.slice(0, 9)])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
      case "verified":
      case "processed":
        return "default"
      case "pending":
        return "secondary"
      case "failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Clock className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No recent activity</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                <div className="flex-shrink-0">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {activity.type.replace("_", " ")}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
