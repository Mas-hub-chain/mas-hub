import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Coins, Shield, Wallet, Settings, TrendingUp } from "lucide-react"
import Link from "next/link"

const modules = [
  {
    title: "Tokenization",
    description: "Create and manage digital assets on MasChain",
    icon: Coins,
    href: "/dashboard/tokenization",
    status: "active",
    features: ["Asset Creation", "Metadata Management", "Transfer Tracking"],
  },
  {
    title: "Compliance & KYC",
    description: "Automated compliance verification and risk assessment",
    icon: Shield,
    href: "/dashboard/compliance",
    status: "active",
    features: ["Address Verification", "Risk Scoring", "Audit Trails"],
  },
  {
    title: "Analytics & Reporting",
    description: "Monitor platform performance and usage metrics",
    icon: TrendingUp,
    href: "/dashboard/analytics",
    status: "active",
    features: ["Performance Metrics", "Usage Analytics", "Custom Reports"],
  },
  {
    title: "Wallet Management",
    description: "Hybrid wallet solutions for enterprise use",
    icon: Wallet,
    href: "/dashboard/wallet",
    status: "coming_soon",
    features: ["Multi-Sig Support", "Hot/Cold Storage", "Access Control"],
  },
  {
    title: "Smart Contracts",
    description: "Deploy and manage custom smart contracts",
    icon: Settings,
    href: "/dashboard/contracts",
    status: "coming_soon",
    features: ["Contract Templates", "Deployment Tools", "Event Monitoring"],
  },
]

export function ModuleCards() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Platform Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((module, index) => (
          <Card key={index} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <module.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <Badge variant={module.status === "active" ? "default" : "secondary"}>
                      {module.status === "active" ? "Active" : "Coming Soon"}
                    </Badge>
                  </div>
                </div>
              </div>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 mb-4">
                {module.features.map((feature, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full" disabled={module.status !== "active"}>
                <Link href={module.href}>{module.status === "active" ? "Open Module" : "Coming Soon"}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
