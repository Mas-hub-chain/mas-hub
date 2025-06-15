"use client"

import { useState } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

const modules = [
  {
    id: "tokenization",
    name: "Tokenization",
    description: "Enable asset tokenization capabilities",
    enabled: true,
  },
  {
    id: "compliance",
    name: "Compliance & KYC",
    description: "Enable compliance verification features",
    enabled: true,
  },
  {
    id: "wallet",
    name: "Wallet Management",
    description: "Enable wallet creation and management",
    enabled: false,
  },
  {
    id: "contracts",
    name: "Smart Contracts",
    description: "Enable smart contract deployment and management",
    enabled: false,
  },
  {
    id: "analytics",
    name: "Analytics & Reporting",
    description: "Enable advanced analytics and reporting features",
    enabled: false,
  },
]

export function ModuleSettings() {
  const [moduleStates, setModuleStates] = useState(
    modules.reduce(
      (acc, module) => ({
        ...acc,
        [module.id]: module.enabled,
      }),
      {},
    ),
  )
  const { toast } = useToast()

  const handleModuleToggle = (moduleId: string, enabled: boolean) => {
    setModuleStates((prev) => ({
      ...prev,
      [moduleId]: enabled,
    }))

    const moduleName = modules.find((m) => m.id === moduleId)?.name
    toast({
      title: "Module Updated",
      description: `${moduleName} has been ${enabled ? "enabled" : "disabled"}`,
    })
  }

  return (
    <div className="space-y-4">
      {modules.map((module) => (
        <Card key={module.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{module.name}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </div>
              <Switch
                checked={moduleStates[module.id] || false}
                onCheckedChange={(checked) => handleModuleToggle(module.id, checked)}
              />
            </div>
          </CardHeader>
        </Card>
      ))}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-1">💡 Module Management</h4>
        <p className="text-sm text-blue-700">
          Enable only the modules your organization needs. This helps optimize performance and reduces complexity for
          your users.
        </p>
      </div>
    </div>
  )
}
