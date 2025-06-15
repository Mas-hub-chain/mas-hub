import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, Cloud, Code, Webhook, Shield, Coins, Users, BarChart3, Zap, Globe } from "lucide-react"
import Link from "next/link"

const integrationCategories = {
  blockchain: {
    title: "Blockchain Services",
    description: "Native MasChain integrations and blockchain infrastructure",
    integrations: [
      {
        name: "MasChain Token Management",
        description: "Native integration with MasChain token services for asset tokenization",
        status: "Active",
        icon: Coins,
        features: ["Token creation", "Asset management", "Transfer operations", "Metadata handling"],
        setupTime: "5 minutes",
      },
      {
        name: "MasChain e-KYC",
        description: "Automated compliance verification and risk assessment",
        status: "Active",
        icon: Shield,
        features: ["Identity verification", "Risk scoring", "Compliance reporting", "Audit trails"],
        setupTime: "10 minutes",
      },
      {
        name: "MasChain Wallet Services",
        description: "Enterprise wallet management and security",
        status: "Coming Soon",
        icon: Users,
        features: ["Multi-sig wallets", "HSM integration", "Key management", "Transaction signing"],
        setupTime: "15 minutes",
      },
      {
        name: "MasChain Smart Contracts",
        description: "Custom smart contract deployment and management",
        status: "Coming Soon",
        icon: Code,
        features: ["Contract deployment", "Upgrade management", "Event monitoring", "Gas optimization"],
        setupTime: "20 minutes",
      },
    ],
  },
  infrastructure: {
    title: "Infrastructure & Database",
    description: "Scalable infrastructure and data management solutions",
    integrations: [
      {
        name: "Supabase Database",
        description: "Scalable PostgreSQL database with real-time features",
        status: "Active",
        icon: Database,
        features: ["Real-time subscriptions", "Row-level security", "Auto-scaling", "Backup & recovery"],
        setupTime: "5 minutes",
      },
      {
        name: "Vercel Deployment",
        description: "Seamless deployment and hosting platform",
        status: "Active",
        icon: Cloud,
        features: ["Auto-deployment", "Edge functions", "Global CDN", "Analytics"],
        setupTime: "2 minutes",
      },
      {
        name: "Redis Cache",
        description: "High-performance caching and session management",
        status: "Active",
        icon: Zap,
        features: ["Session storage", "Rate limiting", "Pub/Sub messaging", "Data caching"],
        setupTime: "5 minutes",
      },
    ],
  },
  apis: {
    title: "APIs & Webhooks",
    description: "External service integrations and webhook management",
    integrations: [
      {
        name: "REST API Gateway",
        description: "Comprehensive REST APIs for all platform features",
        status: "Active",
        icon: Code,
        features: ["OpenAPI specs", "Rate limiting", "Authentication", "Monitoring"],
        setupTime: "Instant",
      },
      {
        name: "Webhook System",
        description: "Real-time event notifications and integrations",
        status: "Active",
        icon: Webhook,
        features: ["Event filtering", "Retry logic", "Signature verification", "Custom handlers"],
        setupTime: "10 minutes",
      },
      {
        name: "Analytics API",
        description: "Advanced analytics and reporting capabilities",
        status: "Active",
        icon: BarChart3,
        features: ["Custom metrics", "Real-time data", "Export options", "Dashboards"],
        setupTime: "5 minutes",
      },
    ],
  },
  enterprise: {
    title: "Enterprise Solutions",
    description: "Enterprise-grade integrations for large organizations",
    integrations: [
      {
        name: "Single Sign-On (SSO)",
        description: "Enterprise SSO integration with SAML and OAuth",
        status: "Coming Soon",
        icon: Users,
        features: ["SAML 2.0", "OAuth 2.0", "Active Directory", "Custom providers"],
        setupTime: "30 minutes",
      },
      {
        name: "Multi-Region Deployment",
        description: "Global deployment across multiple regions",
        status: "Enterprise",
        icon: Globe,
        features: ["Data residency", "Latency optimization", "Failover", "Compliance"],
        setupTime: "Custom",
      },
    ],
  },
}

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Seamless Integrations</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Connect MAS Hub with your existing infrastructure and third-party services. Built on MasChain's robust
            ecosystem with enterprise-grade reliability.
          </p>
          <div className="mt-12 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-green-100 rounded-2xl transform rotate-2"></div>
              <div className="relative bg-white rounded-2xl p-6 shadow-xl">
                <img
                  src="/images/application-development.png"
                  alt="Seamless Integration Platform"
                  className="w-full max-w-2xl mx-auto"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/docs">View Documentation</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Get Integration Support</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Integrations Tabs */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <Tabs defaultValue="blockchain" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-12">
              <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
              <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
              <TabsTrigger value="apis">APIs</TabsTrigger>
              <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
            </TabsList>

            {Object.entries(integrationCategories).map(([key, category]) => (
              <TabsContent key={key} value={key} className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{category.title}</h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">{category.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {category.integrations.map((integration, index) => (
                    <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <integration.icon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex gap-2">
                            <Badge
                              variant={
                                integration.status === "Active"
                                  ? "default"
                                  : integration.status === "Enterprise"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {integration.status}
                            </Badge>
                            <Badge variant="outline">{integration.setupTime}</Badge>
                          </div>
                        </div>
                        <CardTitle className="text-xl">{integration.name}</CardTitle>
                        <CardDescription className="text-gray-600">{integration.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Key Features:</h4>
                            <ul className="space-y-1">
                              {integration.features.map((feature, featureIndex) => (
                                <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <Button
                            className="w-full"
                            variant={integration.status === "Active" ? "default" : "outline"}
                            disabled={integration.status !== "Active"}
                          >
                            {integration.status === "Active"
                              ? "Configure Integration"
                              : integration.status === "Enterprise"
                                ? "Contact Sales"
                                : "Coming Soon"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Integration Support */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Need Custom Integration?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Our team can help you build custom integrations for your specific needs. Get dedicated support from our
            integration specialists.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/contact">Contact Integration Team</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/docs">View API Documentation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
