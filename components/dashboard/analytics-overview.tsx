"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity, Clock } from "lucide-react"

interface AnalyticsData {
  totalTransactions: number
  successRate: number
  averageProcessingTime: number
  monthlyGrowth: number
  recentActivity: Array<{
    id: string
    type: string
    status: string
    timestamp: string
    amount?: number
  }>
}

export function AnalyticsOverview() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics/overview")
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading analytics...</div>
  }

  if (!analytics) {
    return <div>Failed to load analytics data</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalTransactions.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {analytics.monthlyGrowth > 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              )}
              {Math.abs(analytics.monthlyGrowth)}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.successRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Platform reliability</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageProcessingTime}s</div>
            <p className="text-xs text-muted-foreground">Transaction speed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{analytics.monthlyGrowth}%</div>
            <p className="text-xs text-muted-foreground">Platform adoption</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest platform operations and transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{activity.type}</p>
                  <p className="text-xs text-muted-foreground">{new Date(activity.timestamp).toLocaleString()}</p>
                </div>
                <Badge variant={activity.status === "success" ? "default" : "secondary"}>{activity.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
