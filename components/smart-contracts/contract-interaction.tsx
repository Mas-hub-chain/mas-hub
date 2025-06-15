"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Play, Eye, Wallet, FuelIcon as Gas } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ContractMethod {
  name: string
  type: string
  inputs: Array<{
    name: string
    type: string
    internalType: string
  }>
  outputs: Array<{
    name: string
    type: string
    internalType: string
  }>
  stateMutability: string
}

interface ContractInteractionProps {
  contractAddress: string
  contractAbi: any[]
  contractName: string
}

export function ContractInteraction({ contractAddress, contractAbi, contractName }: ContractInteractionProps) {
  const [selectedMethod, setSelectedMethod] = useState<ContractMethod | null>(null)
  const [methodParams, setMethodParams] = useState<Record<string, string>>({})
  const [callResult, setCallResult] = useState<any>(null)
  const [callError, setCallError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [gasEstimate, setGasEstimate] = useState<number | null>(null)
  const { toast } = useToast()

  const readMethods = contractAbi.filter(
    (method) => method.type === "function" && (method.stateMutability === "view" || method.stateMutability === "pure"),
  )

  const writeMethods = contractAbi.filter(
    (method) => method.type === "function" && method.stateMutability !== "view" && method.stateMutability !== "pure",
  )

  const events = contractAbi.filter((item) => item.type === "event")

  const handleMethodSelect = (method: ContractMethod) => {
    setSelectedMethod(method)
    setMethodParams({})
    setCallResult(null)
    setCallError(null)
    setGasEstimate(null)
  }

  const handleParamChange = (paramName: string, value: string) => {
    setMethodParams((prev) => ({
      ...prev,
      [paramName]: value,
    }))
  }

  const estimateGas = async () => {
    if (!selectedMethod || selectedMethod.stateMutability === "view" || selectedMethod.stateMutability === "pure") {
      return
    }

    try {
      const response = await fetch("/api/smart-contracts/utils/estimate-gas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: contractAddress,
          data: "0x", // This would need proper ABI encoding
          from: "0x0000000000000000000000000000000000000000",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setGasEstimate(data.result)
      }
    } catch (error) {
      console.error("Error estimating gas:", error)
    }
  }

  const callMethod = async () => {
    if (!selectedMethod) return

    setLoading(true)
    setCallResult(null)
    setCallError(null)

    try {
      const isReadMethod = selectedMethod.stateMutability === "view" || selectedMethod.stateMutability === "pure"
      const endpoint = isReadMethod ? "call" : "execute"

      const requestBody = {
        method_name: selectedMethod.name,
        params: methodParams,
        from: "0x0000000000000000000000000000000000000000", // Default address
        ...(isReadMethod
          ? {}
          : {
              wallet_options: {
                type: "organisation",
                address: "0x0000000000000000000000000000000000000000", // This should come from wallet
              },
            }),
      }

      const response = await fetch(`/api/smart-contracts/${contractAddress}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (response.ok) {
        setCallResult(data.result)
        toast({
          title: "Success",
          description: `Method ${selectedMethod.name} executed successfully`,
        })
      } else {
        setCallError(data.message || "Failed to execute method")
        toast({
          title: "Error",
          description: data.message || "Failed to execute method",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error calling method:", error)
      setCallError("Network error occurred")
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedMethod && selectedMethod.stateMutability !== "view" && selectedMethod.stateMutability !== "pure") {
      estimateGas()
    }
  }, [selectedMethod, methodParams])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          Contract Interaction
        </CardTitle>
        <CardDescription>
          Interact with {contractName} at {contractAddress}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="read" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="read">
              <Eye className="h-4 w-4 mr-2" />
              Read ({readMethods.length})
            </TabsTrigger>
            <TabsTrigger value="write">
              <Wallet className="h-4 w-4 mr-2" />
              Write ({writeMethods.length})
            </TabsTrigger>
            <TabsTrigger value="events">Events ({events.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="read" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Select Read Method</Label>
                <select
                  className="w-full mt-1 p-2 border rounded-md"
                  value={selectedMethod?.name || ""}
                  onChange={(e) => {
                    const method = readMethods.find((m) => m.name === e.target.value)
                    if (method) handleMethodSelect(method)
                  }}
                >
                  <option value="">Choose a method...</option>
                  {readMethods.map((method, index) => (
                    <option key={index} value={method.name}>
                      {method.name}({method.inputs.map((input) => `${input.type} ${input.name}`).join(", ")})
                    </option>
                  ))}
                </select>
              </div>

              {selectedMethod && selectedMethod.inputs.length > 0 && (
                <div className="space-y-3">
                  <Label>Method Parameters</Label>
                  {selectedMethod.inputs.map((input, index) => (
                    <div key={index} className="space-y-1">
                      <Label className="text-sm">
                        {input.name} ({input.type})
                      </Label>
                      <Input
                        placeholder={`Enter ${input.type} value`}
                        value={methodParams[input.name] || ""}
                        onChange={(e) => handleParamChange(input.name, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              )}

              <Button onClick={callMethod} disabled={loading || !selectedMethod} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Calling...
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Call Method
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="write" className="space-y-4">
            <Alert>
              <Wallet className="h-4 w-4" />
              <AlertDescription>
                Write methods require wallet connection and may consume gas. Connect your wallet to proceed.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <Label>Select Write Method</Label>
                <select
                  className="w-full mt-1 p-2 border rounded-md"
                  value={selectedMethod?.name || ""}
                  onChange={(e) => {
                    const method = writeMethods.find((m) => m.name === e.target.value)
                    if (method) handleMethodSelect(method)
                  }}
                >
                  <option value="">Choose a method...</option>
                  {writeMethods.map((method, index) => (
                    <option key={index} value={method.name}>
                      {method.name}({method.inputs.map((input) => `${input.type} ${input.name}`).join(", ")})
                    </option>
                  ))}
                </select>
              </div>

              {selectedMethod && selectedMethod.inputs.length > 0 && (
                <div className="space-y-3">
                  <Label>Method Parameters</Label>
                  {selectedMethod.inputs.map((input, index) => (
                    <div key={index} className="space-y-1">
                      <Label className="text-sm">
                        {input.name} ({input.type})
                      </Label>
                      <Input
                        placeholder={`Enter ${input.type} value`}
                        value={methodParams[input.name] || ""}
                        onChange={(e) => handleParamChange(input.name, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {gasEstimate && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Gas className="h-4 w-4" />
                  Estimated Gas: {gasEstimate.toLocaleString()}
                </div>
              )}

              <Button onClick={callMethod} disabled={loading || !selectedMethod} className="w-full" variant="default">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4 mr-2" />
                    Execute Method
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <div className="space-y-3">
              <Label>Contract Events</Label>
              {events.length === 0 ? (
                <p className="text-muted-foreground text-sm">No events defined in this contract</p>
              ) : (
                <div className="space-y-2">
                  {events.map((event, index) => (
                    <div key={index} className="p-3 border rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{event.name}</Badge>
                        {event.anonymous && <Badge variant="secondary">Anonymous</Badge>}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Parameters:{" "}
                        {event.inputs
                          .map((input: any) => `${input.type} ${input.name}${input.indexed ? " (indexed)" : ""}`)
                          .join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Results Display */}
        {(callResult || callError) && (
          <div className="mt-6 space-y-2">
            <Label>Result</Label>
            <div className="p-3 border rounded-md bg-muted">
              {callError ? (
                <div className="text-red-600 text-sm">{callError}</div>
              ) : (
                <pre className="text-sm overflow-auto whitespace-pre-wrap">
                  {typeof callResult === "object" ? JSON.stringify(callResult, null, 2) : String(callResult)}
                </pre>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
