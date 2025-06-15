"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ComplianceBadge } from "./compliance-badge"
import { useAuditLogger } from "@/components/audit/audit-logger"

export function KYCForm() {
  const [loading, setLoading] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [result, setResult] = useState<any>(null)
  const { toast } = useToast()
  const { logEvent } = useAuditLogger()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/compliance/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet_address: walletAddress }),
      })

      const data = await response.json()

      if (data.success) {
        // Log the KYC verification event
        await logEvent({
          action: "kyc_verification",
          resource_type: "kyc_log",
          resource_id: data.kyc_result.id,
          metadata: {
            wallet_address: walletAddress,
            risk_score: data.kyc_result.risk_score,
            status: data.kyc_result.status,
          },
        })

        setResult(data.kyc_result)
        toast({
          title: "KYC Verification Complete",
          description: `Risk Score: ${data.kyc_result.risk_score.toFixed(2)}`,
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify wallet address. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="wallet">Wallet Address</Label>
          <Input
            id="wallet"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="0x..."
            required
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Verifying..." : "Verify Address"}
        </Button>
      </form>

      {result && (
        <div className="p-4 border rounded-lg bg-gray-50">
          <h3 className="font-semibold mb-3">Verification Result</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Wallet Address:</span>
              <span className="font-mono text-sm">{result.wallet_address}</span>
            </div>
            <div className="flex justify-between">
              <span>Risk Score:</span>
              <span>{result.risk_score.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <ComplianceBadge status={result.status} verified={result.verified} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
