"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

export function NetworkSettings() {
  const [isMainnet, setIsMainnet] = useState(false)
  const { toast } = useToast()

  const handleNetworkToggle = (checked: boolean) => {
    setIsMainnet(checked)
    toast({
      title: "Network Changed",
      description: `Switched to ${checked ? "Mainnet" : "Testnet"}`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label htmlFor="network-toggle">Network Environment</Label>
          <p className="text-sm text-gray-600">Toggle between MasChain Testnet and Mainnet</p>
        </div>
        <Switch id="network-toggle" checked={isMainnet} onCheckedChange={handleNetworkToggle} />
      </div>

      <div className="p-4 border rounded-lg bg-gray-50">
        <h4 className="font-medium mb-2">Current Configuration</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Network:</span>
            <span className="font-medium">{isMainnet ? "MasChain Mainnet" : "MasChain Testnet"}</span>
          </div>
          <div className="flex justify-between">
            <span>Chain ID:</span>
            <span className="font-mono">{isMainnet ? "698" : "699"}</span>
          </div>
          <div className="flex justify-between">
            <span>RPC URL:</span>
            <span className="font-mono text-xs">
              {isMainnet ? "https://rpc.maschain.com" : "https://rpc-testnet.maschain.com"}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-800 mb-1">⚠️ Important Notice</h4>
        <p className="text-sm text-yellow-700">
          Switching networks will affect all blockchain operations. Make sure to update your application configuration
          accordingly.
        </p>
      </div>
    </div>
  )
}
