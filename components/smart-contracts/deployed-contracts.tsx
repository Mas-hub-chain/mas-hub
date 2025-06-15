"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Copy, Play, Eye, Activity } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DeployedContract {
  contract_address: string
  contract_name: string
  project_name: string
  version: string
  deployed_at: string
  deployment_params: any[]
  artifact: {
    contract_abi: any[]
    bytecode: string
  }
  deploy_gas_used: number
  total_gas_used: number
}

interface ContractCall {
  method_name: string
  params: Record<string, any>
  result?: any
  error?: string
}

export function DeployedContracts() {
  const [contracts, setContracts] = useState<DeployedContract[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContract, setSelectedContract] = useState<DeployedContract | null>(null)
  const [contractCall, setContractCall] = useState<ContractCall>({ method_name: "", params: {} })
  const [callLoading, setCallLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchDeployedContracts()
  }, [])

  const fetchDeployedContracts = async () => {
    try {
      const response = await fetch("/api/smart-contracts/deployed")
      if (response.ok) {
        const data = await response.json()
        setContracts(data.result || [])
      }
    } catch (error) {
      console.error("Error fetching deployed contracts:", error)
      toast({
        title: "Error",
        description: "Failed to fetch deployed contracts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Address copied to clipboard",
    })
  }

  const callContractMethod = async () => {
    if (!selectedContract || !contractCall.method_name) return

    setCallLoading(true)
    try {
      const response = await fetch(`/api/smart-contracts/${selectedContract.contract_address}/call`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method_name: contractCall.method_name,
          params: contractCall.params,
          from: "0x0000000000000000000000000000000000000000", // Default address
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setContractCall((prev) => ({ ...prev, result: data.result, error: undefined }))
        toast({
          title: "Success",
          description: "Contract method called successfully",
        })
      } else {
        setContractCall((prev) => ({ ...prev, error: data.message, result: undefined }))
        toast({
          title: "Error",
          description: data.message || "Failed to call contract method",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error calling contract method:", error)
      setContractCall((prev) => ({ ...prev, error: "Network error", result: undefined }))
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive",
      })
    } finally {
      setCallLoading(false)
    }
  }

  const getReadOnlyMethods = (abi: any[]) => {
    return abi.filter(
      (item) => item.type === "function" && (item.stateMutability === "view" || item.stateMutability === "pure"),
    )
  }

  const getWriteMethods = (abi: any[]) => {
    return abi.filter(
      (item) => item.type === "function" && item.stateMutability !== "view" && item.stateMutability !== "pure",
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading deployed contracts...
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {contracts.length === 0 ? (
          <Card>
            <CardContent className="text-center p-6">
              <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Deployed Contracts</h3>
              <p className="text-muted-foreground">Deploy your first smart contract to get started</p>
            </CardContent>
          </Card>
        ) : (
          contracts.map((contract) => (
            <Card key={contract.contract_address} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {contract.contract_name}
                      <Badge variant="secondary">{contract.version}</Badge>
                    </CardTitle>
                    <CardDescription>{contract.project_name}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(contract.contract_address)}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy Address
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setSelectedContract(contract)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Interact
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Contract Address</Label>
                    <p className="font-mono text-xs break-all">{contract.contract_address}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Deployed At</Label>
                    <p>{new Date(contract.deployed_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Deploy Gas</Label>
                    <p>{contract.deploy_gas_used?.toLocaleString() || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Total Gas</Label>
                    <p>{contract.total_gas_used?.toLocaleString() || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Contract Interaction Modal/Panel */}
      {selectedContract && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Contract Interaction: {selectedContract.contract_name}
              <Button variant="outline" size="sm" onClick={() => setSelectedContract(null)}>
                Close
              </Button>
            </CardTitle>
            <CardDescription>Interact with deployed contract at {selectedContract.contract_address}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="read" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="read">Read Methods</TabsTrigger>
                <TabsTrigger value="write">Write Methods</TabsTrigger>
              </TabsList>

              <TabsContent value="read" className="space-y-4">
                <div className="space-y-4">
                  <Label>Select Method to Call</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={contractCall.method_name}
                    onChange={(e) => setContractCall((prev) => ({ ...prev, method_name: e.target.value }))}
                  >
                    <option value="">Select a read method...</option>
                    {getReadOnlyMethods(selectedContract.artifact.contract_abi).map((method, index) => (
                      <option key={index} value={method.name}>
                        {method.name}({method.inputs?.map((input: any) => `${input.type} ${input.name}`).join(", ")})
                      </option>
                    ))}
                  </select>

                  <div className="space-y-2">
                    <Label>Parameters (JSON)</Label>
                    <textarea
                      className="w-full p-2 border rounded-md font-mono text-sm"
                      rows={3}
                      placeholder='{"param1": "value1", "param2": "value2"}'
                      value={JSON.stringify(contractCall.params, null, 2)}
                      onChange={(e) => {
                        try {
                          const params = JSON.parse(e.target.value || "{}")
                          setContractCall((prev) => ({ ...prev, params }))
                        } catch (error) {
                          // Invalid JSON, keep current params
                        }
                      }}
                    />
                  </div>

                  <Button onClick={callContractMethod} disabled={callLoading || !contractCall.method_name}>
                    {callLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Calling...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Call Method
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="write" className="space-y-4">
                <Alert>
                  <AlertDescription>
                    Write methods require wallet connection and gas fees. This feature will be available once wallet
                    integration is complete.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4 opacity-50">
                  <Label>Available Write Methods</Label>
                  <ScrollArea className="h-32 border rounded-md p-2">
                    {getWriteMethods(selectedContract.artifact.contract_abi).map((method, index) => (
                      <div key={index} className="text-sm font-mono p-1">
                        {method.name}({method.inputs?.map((input: any) => `${input.type} ${input.name}`).join(", ")})
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              </TabsContent>
            </Tabs>

            {/* Results Display */}
            {(contractCall.result || contractCall.error) && (
              <div className="mt-4 space-y-2">
                <Label>Result</Label>
                <div className="p-3 border rounded-md bg-muted">
                  {contractCall.error ? (
                    <div className="text-red-600 font-mono text-sm">{contractCall.error}</div>
                  ) : (
                    <pre className="text-sm overflow-auto">{JSON.stringify(contractCall.result, null, 2)}</pre>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
