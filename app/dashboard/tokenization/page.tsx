import { TokenizationForm } from "@/components/tokenization/tokenization-form"
import { TokenList } from "@/components/tokenization/token-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TokenizationPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tokenization</h1>
        <p className="text-gray-600 mt-2">Create and manage digital assets on MasChain</p>
      </div>

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList>
          <TabsTrigger value="create">Create Token</TabsTrigger>
          <TabsTrigger value="manage">Manage Tokens</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Digital Asset</CardTitle>
              <CardDescription>Tokenize invoices, loyalty points, contracts, NFTs, and custom assets</CardDescription>
            </CardHeader>
            <CardContent>
              <TokenizationForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage">
          <TokenList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
