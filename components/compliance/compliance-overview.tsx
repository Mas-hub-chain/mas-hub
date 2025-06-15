"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ComplianceBadge } from "./compliance-badge"
import type { KYCLog } from "@/lib/types"

export function ComplianceOverview() {
  const [kycLogs, setKycLogs] = useState<KYCLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchKycLogs()
  }, [])

  const fetchKycLogs = async () => {
    try {
      const response = await fetch("/api/compliance/kyc")
      const data = await response.json()
      setKycLogs(data.kyc_logs || [])
    } catch (error) {
      console.error("Failed to fetch KYC logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    total: kycLogs.length,
    verified: kycLogs.filter((log) => log.verified).length,
    lowRisk: kycLogs.filter((log) => log.status === "low_risk").length,
    mediumRisk: kycLogs.filter((log) => log.status === "medium_risk").length,
    highRisk: kycLogs.filter((log) => log.status === "high_risk").length,
  }

  if (loading) {
    return <div>Loading compliance data...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Verifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Verified Addresses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.total > 0 ? Math.round((stats.verified / stats.total) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Verifications</CardTitle>
          <CardDescription>Latest KYC verification results</CardDescription>
        </CardHeader>
        <CardContent>
          {kycLogs.length === 0 ? (
            <p className="text-gray-600 text-center py-4">No verifications yet.</p>
          ) : (
            <div className="space-y-4">
              {kycLogs.slice(0, 10).map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-mono text-sm">{log.wallet_address}</p>
                    <p className="text-xs text-gray-500">Risk Score: {log.risk_score.toFixed(2)}</p>
                  </div>
                  <ComplianceBadge status={log.status} verified={log.verified} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
