import { KYCForm } from "@/components/compliance/kyc-form"
import { ComplianceOverview } from "@/components/compliance/compliance-overview"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CompliancePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Compliance & KYC</h1>
        <p className="text-gray-600 mt-2">Manage compliance verification and risk assessment</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="verify">Verify Address</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <ComplianceOverview />
        </TabsContent>

        <TabsContent value="verify">
          <Card>
            <CardHeader>
              <CardTitle>KYC Verification</CardTitle>
              <CardDescription>Submit wallet addresses for basic compliance verification</CardDescription>
            </CardHeader>
            <CardContent>
              <KYCForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
