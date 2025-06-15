import { AnalyticsOverview } from "@/components/dashboard/analytics-overview"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Reporting</h1>
        <p className="text-gray-600 mt-2">Monitor platform performance and usage metrics</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <AnalyticsOverview />
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Analytics</CardTitle>
              <CardDescription>Detailed transaction metrics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">Advanced transaction analytics coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Reports</CardTitle>
              <CardDescription>KYC verification and compliance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">Compliance reporting features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
