import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Coins, Shield, Zap, Puzzle, Globe, Lock, Database, Cloud, Code, Users, BarChart3, Webhook } from "lucide-react"
import Link from "next/link"

const featureCategories = [
  {
    title: "Core Platform",
    description: "Essential blockchain integration capabilities",
    features: [
      {
        icon: Coins,
        title: "Asset Tokenization",
        description: "Transform invoices, contracts, loyalty points, and NFTs into blockchain assets with one click.",
        benefits: ["One-click tokenization", "Multi-asset support", "Automated metadata", "Compliance ready"],
      },
      {
        icon: Shield,
        title: "Automated Compliance",
        description: "Built-in KYC verification and risk assessment powered by MasChain infrastructure.",
        benefits: ["Real-time KYC", "Risk scoring", "Regulatory reporting", "Audit trails"],
      },
      {
        icon: Zap,
        title: "Instant Integration",
        description: "Deploy blockchain solutions in minutes with our pre-built modules and APIs.",
        benefits: ["5-minute setup", "REST APIs", "SDK support", "No-code options"],
      },
    ],
  },
  {
    title: "Enterprise Features",
    description: "Advanced capabilities for large-scale deployments",
    features: [
      {
        icon: Puzzle,
        title: "Modular Architecture",
        description: "Enable only the services you need. Scale up or down based on your requirements.",
        benefits: ["Pay per module", "Custom configurations", "Easy scaling", "Plugin system"],
      },
      {
        icon: Globe,
        title: "Multi-Tenant SaaS",
        description: "Serve multiple enterprises with isolated data and customizable configurations.",
        benefits: ["Data isolation", "Custom branding", "Role-based access", "Tenant analytics"],
      },
      {
        icon: Lock,
        title: "Enterprise Security",
        description: "Bank-grade security with hybrid wallet management and audit trails.",
        benefits: ["HSM integration", "Multi-sig wallets", "Audit logging", "SOC2 compliance"],
      },
    ],
  },
  {
    title: "Developer Tools",
    description: "Comprehensive tools for developers and integrators",
    features: [
      {
        icon: Code,
        title: "Developer APIs",
        description: "Comprehensive REST APIs and SDKs for seamless integration.",
        benefits: ["OpenAPI specs", "Multiple SDKs", "Sandbox environment", "Code examples"],
      },
      {
        icon: Database,
        title: "Data Management",
        description: "Advanced data handling with real-time synchronization and backup.",
        benefits: ["Real-time sync", "Automated backups", "Data export", "Analytics ready"],
      },
      {
        icon: Webhook,
        title: "Event System",
        description: "Real-time webhooks and event streaming for system integration.",
        benefits: ["Real-time events", "Retry logic", "Event filtering", "Custom handlers"],
      },
    ],
  },
  {
    title: "Analytics & Monitoring",
    description: "Insights and monitoring for your blockchain operations",
    features: [
      {
        icon: BarChart3,
        title: "Advanced Analytics",
        description: "Comprehensive analytics dashboard with custom reporting capabilities.",
        benefits: ["Custom dashboards", "Real-time metrics", "Export reports", "API analytics"],
      },
      {
        icon: Cloud,
        title: "Cloud Infrastructure",
        description: "Scalable cloud infrastructure with 99.9% uptime guarantee.",
        benefits: ["Auto-scaling", "Global CDN", "Load balancing", "Disaster recovery"],
      },
      {
        icon: Users,
        title: "Team Management",
        description: "Advanced user management with role-based permissions and SSO.",
        benefits: ["SSO integration", "Role management", "Team analytics", "Access logs"],
      },
    ],
  },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Powerful Features for Enterprise Blockchain</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Everything you need to integrate blockchain technology into your enterprise operations. From tokenization to
            compliance, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/dashboard">Start Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Schedule Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          {featureCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-20">
              <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4">
                  {category.title}
                </Badge>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{category.title}</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">{category.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.features.map((feature, featureIndex) => (
                  <Card key={featureIndex} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <feature.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-center text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of enterprises already using MAS Hub to accelerate their Web3 adoption.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/dashboard">Start Your Free Trial</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
