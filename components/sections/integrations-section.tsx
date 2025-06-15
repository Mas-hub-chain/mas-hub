import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const integrations = [
  {
    name: "MasChain Token Management",
    description: "Native integration with MasChain token services",
    status: "Active",
    category: "Blockchain",
  },
  {
    name: "MasChain e-KYC",
    description: "Automated compliance verification and risk assessment",
    status: "Active",
    category: "Compliance",
  },
  {
    name: "MasChain Wallet Services",
    description: "Enterprise wallet management and security",
    status: "Coming Soon",
    category: "Infrastructure",
  },
  {
    name: "MasChain Smart Contracts",
    description: "Custom smart contract deployment and management",
    status: "Coming Soon",
    category: "Development",
  },
  {
    name: "Supabase Database",
    description: "Scalable PostgreSQL database with real-time features",
    status: "Active",
    category: "Database",
  },
  {
    name: "Vercel Deployment",
    description: "Seamless deployment and hosting platform",
    status: "Active",
    category: "Infrastructure",
  },
]

export function IntegrationsSection() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Seamless Integrations</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Built on top of MasChain's robust infrastructure with enterprise-grade integrations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration, index) => (
            <Card key={index} className="border-0 shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{integration.category}</Badge>
                  <Badge variant={integration.status === "Active" ? "default" : "secondary"}>
                    {integration.status}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{integration.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{integration.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
