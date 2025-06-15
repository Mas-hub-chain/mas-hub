"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuditLogger } from "@/components/audit/audit-logger"

const assetTypes = [
  { value: "invoice", label: "Invoice" },
  { value: "loyalty_points", label: "Loyalty Points" },
  { value: "contract", label: "Contract" },
  { value: "nft", label: "NFT" },
  { value: "custom", label: "Custom Token" },
]

export function TokenizationForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    asset_type: "",
    name: "",
    description: "",
    quantity: "",
    metadata: "",
  })
  const { toast } = useToast()
  const { logEvent } = useAuditLogger()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/tokenization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asset_type: formData.asset_type,
          metadata: {
            name: formData.name,
            description: formData.description,
            quantity: Number.parseInt(formData.quantity),
            custom_metadata: formData.metadata ? JSON.parse(formData.metadata) : {},
          },
          tenant_id: "demo-tenant", // In real app, get from auth context
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Log the token creation event
        await logEvent({
          action: "token_created",
          resource_type: "token",
          resource_id: result.token.id,
          metadata: {
            asset_type: formData.asset_type,
            name: formData.name,
            tx_hash: result.tx_hash,
          },
        })

        toast({
          title: "Token Created Successfully",
          description: `Transaction hash: ${result.tx_hash}`,
        })
        setFormData({
          asset_type: "",
          name: "",
          description: "",
          quantity: "",
          metadata: "",
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create token. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="asset_type">Asset Type</Label>
          <Select
            value={formData.asset_type}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, asset_type: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select asset type" />
            </SelectTrigger>
            <SelectContent>
              {assetTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Asset Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Enter asset name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
            placeholder="Enter quantity"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Enter asset description"
            rows={3}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="metadata">Custom Metadata (JSON)</Label>
        <Textarea
          id="metadata"
          value={formData.metadata}
          onChange={(e) => setFormData((prev) => ({ ...prev, metadata: e.target.value }))}
          placeholder='{"key": "value", "attribute": "data"}'
          rows={4}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creating Token..." : "Create Token"}
      </Button>
    </form>
  )
}
