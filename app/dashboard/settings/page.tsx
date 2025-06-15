import { NetworkSettings } from "@/components/settings/network-settings"
import { ModuleSettings } from "@/components/settings/module-settings"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Configure your MAS Hub platform settings</p>
      </div>

      <Tabs defaultValue="network" className="space-y-6">
        <TabsList>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
        </TabsList>

        <TabsContent value="network">
          <Card>
            <CardHeader>
              <CardTitle>Network Configuration</CardTitle>
              <CardDescription>Switch between MasChain Testnet and Mainnet</CardDescription>
            </CardHeader>
            <CardContent>
              <NetworkSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules">
          <Card>
            <CardHeader>
              <CardTitle>Module Management</CardTitle>
              <CardDescription>Enable or disable platform modules for your organization</CardDescription>
            </CardHeader>
            <CardContent>
              <ModuleSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
