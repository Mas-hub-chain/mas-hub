"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SmartContractProjects } from "./smart-contract-projects"
import { DeployedContracts } from "./deployed-contracts"
import { ContractInteraction } from "./contract-interaction"
import { SmartContractAnalytics } from "./smart-contract-analytics"

export function SmartContractDashboard() {
  const [activeTab, setActiveTab] = useState("projects")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="deployed">Deployed Contracts</TabsTrigger>
        <TabsTrigger value="interact">Interact</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="projects" className="space-y-6">
        <SmartContractProjects />
      </TabsContent>

      <TabsContent value="deployed" className="space-y-6">
        <DeployedContracts />
      </TabsContent>

      <TabsContent value="interact" className="space-y-6">
        <ContractInteraction />
      </TabsContent>

      <TabsContent value="analytics" className="space-y-6">
        <SmartContractAnalytics />
      </TabsContent>
    </Tabs>
  )
}
