"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Code, Play, AlertTriangle, CheckCircle, Clock, Loader2, FileText, Settings, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProjectVersion {
  version: string
  slug: string
  status: "draft" | "compile_queued" | "compiling" | "compiled" | "deploy_queued" | "deploying" | "deployed" | "failed"
  compile_type: string
  compiler_settings: {
    solidity: {
      version: string
      settings?: {
        optimizer?: {
          enabled: boolean
          runs: number
        }
      }
    }
  }
  packages: string[]
  artifacts?: Array<{
    id: number
    contract_name: string
    contract_abi: any[]
    bytecode: string
    source_code: string
  }>
  contract_files?: Array<{
    filename: string
    url: string
  }>
  vulnerabilities?: number
  last_compiled_at?: string
  last_deployed_at?: string
  latest_error?: string
  created_at: string
  updated_at: string
}

interface ProjectVersionsProps {
  projectSlug: string
  projectName: string
}

export function ProjectVersions({ projectSlug, projectName }: ProjectVersionsProps) {
  const [versions, setVersions] = useState<ProjectVersion[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVersion, setSelectedVersion] = useState<ProjectVersion | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [deployDialogOpen, setDeployDialogOpen] = useState(false)
  const { toast } = useToast()

  // Form states
  const [newVersion, setNewVersion] = useState({
    version: "",
    compiler_settings: {
      solidity: {
        version: "0.8.27",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
    packages: [] as string[],
    contract_files: [] as File[],
  })

  const [deployConfig, setDeployConfig] = useState({
    wallet_type: "organisation",
    wallet_address: "",
    deployment_params: [] as Array<{
      sc_artifact_id: number
      params: Record<string, any>
      order: number
    }>,
  })

  useEffect(() => {
    fetchVersions()
  }, [projectSlug])

  const fetchVersions = async () => {
    try {
      const response = await fetch(`/api/smart-contracts/projects/${projectSlug}/versions`)
      if (response.ok) {
        const data = await response.json()
        setVersions(data.result || [])
      }
    } catch (error) {
      console.error("Error fetching versions:", error)
      toast({
        title: "Error",
        description: "Failed to fetch project versions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const createVersion = async () => {
    try {
      const formData = new FormData()
      formData.append("version", newVersion.version)
      formData.append("compiler_settings[solidity][version]", newVersion.compiler_settings.solidity.version)
      formData.append(
        "compiler_settings[solidity][settings][optimizer][enabled]",
        newVersion.compiler_settings.solidity.settings.optimizer.enabled ? "1" : "0",
      )
      formData.append(
        "compiler_settings[solidity][settings][optimizer][runs]",
        newVersion.compiler_settings.solidity.settings.optimizer.runs.toString(),
      )

      newVersion.packages.forEach((pkg) => {
        formData.append("packages[]", pkg)
      })

      newVersion.contract_files.forEach((file) => {
        formData.append("contract_files[]", file)
      })

      const response = await fetch(`/api/smart-contracts/projects/${projectSlug}/versions`, {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Version created successfully",
        })
        setCreateDialogOpen(false)
        fetchVersions()
        // Reset form
        setNewVersion({
          version: "",
          compiler_settings: {
            solidity: {
              version: "0.8.27",
              settings: {
                optimizer: {
                  enabled: true,
                  runs: 200,
                },
              },
            },
          },
          packages: [],
          contract_files: [],
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "Failed to create version",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating version:", error)
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive",
      })
    }
  }

  const deployVersion = async (version: ProjectVersion) => {
    try {
      const response = await fetch(`/api/smart-contracts/projects/${projectSlug}/versions/${version.slug}/deploy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet_options: {
            type: deployConfig.wallet_type,
            address: deployConfig.wallet_address,
          },
          deployment_params: deployConfig.deployment_params,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Deployment initiated successfully",
        })
        setDeployDialogOpen(false)
        fetchVersions()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "Failed to deploy version",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deploying version:", error)
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compiled":
      case "deployed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "compiling":
      case "deploying":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compiled":
      case "deployed":
        return "bg-green-100 text-green-800"
      case "compiling":
      case "deploying":
        return "bg-blue-100 text-blue-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading versions...
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Project Versions</h2>
          <p className="text-muted-foreground">{projectName}</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Version
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Version</DialogTitle>
              <DialogDescription>Create a new version of your smart contract project</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Version Name</Label>
                <Input
                  placeholder="e.g., v1.0.0"
                  value={newVersion.version}
                  onChange={(e) => setNewVersion((prev) => ({ ...prev, version: e.target.value }))}
                />
              </div>

              <div>
                <Label>Solidity Version</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={newVersion.compiler_settings.solidity.version}
                  onChange={(e) =>
                    setNewVersion((prev) => ({
                      ...prev,
                      compiler_settings: {
                        ...prev.compiler_settings,
                        solidity: {
                          ...prev.compiler_settings.solidity,
                          version: e.target.value,
                        },
                      },
                    }))
                  }
                >
                  <option value="0.8.27">0.8.27</option>
                  <option value="0.8.26">0.8.26</option>
                  <option value="0.8.25">0.8.25</option>
                  <option value="0.8.24">0.8.24</option>
                </select>
              </div>

              <div>
                <Label>Contract Files</Label>
                <Input
                  type="file"
                  multiple
                  accept=".sol"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    setNewVersion((prev) => ({ ...prev, contract_files: files }))
                  }}
                />
                <p className="text-sm text-muted-foreground mt-1">Upload Solidity (.sol) files</p>
              </div>

              <div>
                <Label>Packages (Optional)</Label>
                <Textarea
                  placeholder="Enter package names, one per line (e.g., @openzeppelin/contracts)"
                  value={newVersion.packages.join("\n")}
                  onChange={(e) => {
                    const packages = e.target.value.split("\n").filter((pkg) => pkg.trim())
                    setNewVersion((prev) => ({ ...prev, packages }))
                  }}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="optimizer"
                  checked={newVersion.compiler_settings.solidity.settings.optimizer.enabled}
                  onChange={(e) =>
                    setNewVersion((prev) => ({
                      ...prev,
                      compiler_settings: {
                        ...prev.compiler_settings,
                        solidity: {
                          ...prev.compiler_settings.solidity,
                          settings: {
                            ...prev.compiler_settings.solidity.settings,
                            optimizer: {
                              ...prev.compiler_settings.solidity.settings.optimizer,
                              enabled: e.target.checked,
                            },
                          },
                        },
                      },
                    }))
                  }
                />
                <Label htmlFor="optimizer">Enable Optimizer</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={createVersion}
                  disabled={!newVersion.version || newVersion.contract_files.length === 0}
                >
                  Create Version
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {versions.length === 0 ? (
          <Card>
            <CardContent className="text-center p-6">
              <Code className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Versions Created</h3>
              <p className="text-muted-foreground mb-4">Create your first version to start deploying smart contracts</p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Version
              </Button>
            </CardContent>
          </Card>
        ) : (
          versions.map((version) => (
            <Card key={version.slug} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(version.status)}
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {version.version}
                        <Badge className={getStatusColor(version.status)}>{version.status.replace("_", " ")}</Badge>
                      </CardTitle>
                      <CardDescription>Solidity {version.compiler_settings.solidity.version}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {version.status === "compiled" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedVersion(version)
                          setDeployDialogOpen(true)
                        }}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Deploy
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => setSelectedVersion(version)}>
                      <Settings className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Packages</Label>
                    <p>{version.packages.length || "None"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Artifacts</Label>
                    <p>{version.artifacts?.length || 0}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Vulnerabilities</Label>
                    <p className={version.vulnerabilities ? "text-red-600" : "text-green-600"}>
                      {version.vulnerabilities || 0}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Last Updated</Label>
                    <p>{new Date(version.updated_at).toLocaleDateString()}</p>
                  </div>
                </div>

                {version.latest_error && (
                  <Alert className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{version.latest_error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Version Details Dialog */}
      {selectedVersion && (
        <Dialog open={!!selectedVersion} onOpenChange={() => setSelectedVersion(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Version Details: {selectedVersion.version}</DialogTitle>
              <DialogDescription>Detailed information about this version</DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="artifacts">Artifacts</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Status</Label>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(selectedVersion.status)}
                      <Badge className={getStatusColor(selectedVersion.status)}>
                        {selectedVersion.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label>Compiler Version</Label>
                    <p className="mt-1">{selectedVersion.compiler_settings.solidity.version}</p>
                  </div>
                  <div>
                    <Label>Packages</Label>
                    <p className="mt-1">{selectedVersion.packages.join(", ") || "None"}</p>
                  </div>
                  <div>
                    <Label>Vulnerabilities</Label>
                    <p className={`mt-1 ${selectedVersion.vulnerabilities ? "text-red-600" : "text-green-600"}`}>
                      {selectedVersion.vulnerabilities || 0} found
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="artifacts" className="space-y-4">
                {selectedVersion.artifacts?.length ? (
                  <div className="space-y-3">
                    {selectedVersion.artifacts.map((artifact, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-lg">{artifact.contract_name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div>
                              <Label>ABI Functions</Label>
                              <p>{artifact.contract_abi.filter((item) => item.type === "function").length}</p>
                            </div>
                            <div>
                              <Label>Events</Label>
                              <p>{artifact.contract_abi.filter((item) => item.type === "event").length}</p>
                            </div>
                            <div>
                              <Label>Bytecode Size</Label>
                              <p>{(artifact.bytecode.length / 2).toLocaleString()} bytes</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No artifacts available</p>
                )}
              </TabsContent>

              <TabsContent value="files" className="space-y-4">
                {selectedVersion.contract_files?.length ? (
                  <div className="space-y-2">
                    {selectedVersion.contract_files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>{file.filename}</span>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => window.open(file.url, "_blank")}>
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No files available</p>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}

      {/* Deploy Dialog */}
      <Dialog open={deployDialogOpen} onOpenChange={setDeployDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Deploy Version</DialogTitle>
            <DialogDescription>Configure deployment settings for {selectedVersion?.version}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Wallet Type</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={deployConfig.wallet_type}
                onChange={(e) => setDeployConfig((prev) => ({ ...prev, wallet_type: e.target.value }))}
              >
                <option value="organisation">Organisation Wallet</option>
                <option value="end_user">End User Wallet</option>
                <option value="non_custodial">Non-Custodial Wallet</option>
              </select>
            </div>

            <div>
              <Label>Wallet Address</Label>
              <Input
                placeholder="0x..."
                value={deployConfig.wallet_address}
                onChange={(e) => setDeployConfig((prev) => ({ ...prev, wallet_address: e.target.value }))}
              />
            </div>

            {selectedVersion?.artifacts && selectedVersion.artifacts.length > 0 && (
              <div>
                <Label>Deployment Order</Label>
                <div className="space-y-2 mt-2">
                  {selectedVersion.artifacts.map((artifact, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <span className="font-medium">{artifact.contract_name}</span>
                        <p className="text-sm text-muted-foreground">Artifact ID: {artifact.id}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">Order:</Label>
                        <Input
                          type="number"
                          min="1"
                          className="w-16"
                          defaultValue={index + 1}
                          onChange={(e) => {
                            const order = Number.parseInt(e.target.value)
                            setDeployConfig((prev) => ({
                              ...prev,
                              deployment_params: [
                                ...prev.deployment_params.filter((p) => p.sc_artifact_id !== artifact.id),
                                {
                                  sc_artifact_id: artifact.id,
                                  params: {},
                                  order,
                                },
                              ],
                            }))
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Alert>
              <Zap className="h-4 w-4" />
              <AlertDescription>
                Deployment will consume gas fees. Make sure your wallet has sufficient balance.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeployDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => selectedVersion && deployVersion(selectedVersion)}
                disabled={!deployConfig.wallet_address}
              >
                <Play className="h-4 w-4 mr-2" />
                Deploy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
