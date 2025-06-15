import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, Shield, Zap, Puzzle, Globe, Lock } from "lucide-react"

const features = [
  {
    icon: Coins,
    title: "Asset Tokenization",
    description: "Transform invoices, contracts, loyalty points, and NFTs into blockchain assets with one click.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Shield,
    title: "Automated Compliance",
    description: "Built-in KYC verification and risk assessment powered by MasChain infrastructure.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Zap,
    title: "Instant Integration",
    description: "Deploy blockchain solutions in minutes with our pre-built modules and APIs.",
    gradient: "from-purple-500 to-violet-500",
  },
  {
    icon: Puzzle,
    title: "Modular Architecture",
    description: "Enable only the services you need. Scale up or down based on your requirements.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Globe,
    title: "Multi-Tenant SaaS",
    description: "Serve multiple enterprises with isolated data and customizable configurations.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "Bank-grade security with hybrid wallet management and audit trails.",
    gradient: "from-indigo-500 to-blue-500",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need for Web3 Adoption
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Built specifically for enterprises transitioning to blockchain technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-0">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 group hover:scale-105"
            >
              <CardHeader className="space-y-2">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-300">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
