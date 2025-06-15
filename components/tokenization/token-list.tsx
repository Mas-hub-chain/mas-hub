"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import type { Token } from "@/lib/types"

export function TokenList() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTokens()
  }, [])

  const fetchTokens = async () => {
    try {
      const response = await fetch("/api/tokenization?tenant_id=demo-tenant")
      const data = await response.json()
      setTokens(data.tokens || [])
    } catch (error) {
      console.error("Failed to fetch tokens:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading tokens...</div>
  }

  return (
    <div className="space-y-4">
      {tokens.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">No tokens created yet.</p>
          </CardContent>
        </Card>
      ) : (
        tokens.map((token) => (
          <Card key={token.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{token.metadata.name}</CardTitle>
                  <CardDescription>
                    {token.asset_type.replace("_", " ").toUpperCase()} • {token.metadata.quantity} units
                  </CardDescription>
                </div>
                <Badge variant={token.status === "confirmed" ? "default" : "secondary"}>{token.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{token.metadata.description}</p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">Created: {new Date(token.created_at).toLocaleDateString()}</div>
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Explorer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
