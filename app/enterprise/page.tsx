import type { Metadata } from "next"
import { SupplyChainDashboard } from "@/components/enterprise/supply-chain-dashboard"
import { EnterpriseSDKShowcase } from "@/components/enterprise/enterprise-sdk-showcase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Shield, Zap, Globe, CheckCircle, Star, Play } from "lucide-react"

export const metadata: Metadata = {
  title: "Enterprise Solutions | MAS Hub - Production-Ready Blockchain for Supply Chain",
  description:
    "Transform your supply chain with enterprise-grade blockchain solutions. Real-world implementation, proven ROI, and seamless integration with existing systems.",
}

export default function EnterprisePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950 dark:via-gray-900 dark:to-purple-950 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="flex items-center space-x-2 mb-4">
                <Badge variant="default" className="flex items-center space-x-1">
                  <Zap className="h-3 w-3" />
                  <span>Production Ready</span>
                </Badge>
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Shield className="h-3 w-3" />
                  <span>Enterprise Grade</span>
                </Badge>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Transform Your Supply Chain with Blockchain
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground">
                Production-ready blockchain solutions for enterprise supply chain management. Proven ROI, seamless
                integration, and real-world problem solving on MasChain.
              </p>

              <div className="flex items-center space-x-4">
                <Button size="lg" className="text-lg px-8">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Live Demo
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  <Building2 className="mr-2 h-5 w-5" />
                  Enterprise Trial
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-green-600">580%</div>
                  <p className="text-sm text-muted-foreground">3-Year ROI</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-600">6 months</div>
                  <p className="text-sm text-muted-foreground">Payback Period</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-purple-600">95%</div>
                  <p className="text-sm text-muted-foreground">Fraud Reduction</p>
                </div>
              </div>
            </div>

            {/* Launch Graphic */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
                <img src="/images/app-launch-concept.svg" alt="Enterprise Blockchain Launch" className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Success Stories */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted by Leading Enterprises</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See how industry leaders are using MAS Hub to solve real-world supply chain challenges
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Badge variant="outline">Pharmaceutical</Badge>
                </div>
                <CardTitle>Global Pharma Corp</CardTitle>
                <CardDescription>
                  "MAS Hub reduced our compliance costs by 40% while improving traceability to 99.8%"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Compliance Cost Reduction</span>
                    <Badge variant="default">40%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Traceability Improvement</span>
                    <Badge variant="default">99.8%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Audit Preparation Time</span>
                    <Badge variant="secondary">-85%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Badge variant="outline">Luxury Goods</Badge>
                </div>
                <CardTitle>Premium Fashion House</CardTitle>
                <CardDescription>
                  "Eliminated counterfeit products and increased customer trust by 300%"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Counterfeit Reduction</span>
                    <Badge variant="default">100%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Customer Trust</span>
                    <Badge variant="default">+300%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Brand Protection Value</span>
                    <Badge variant="secondary">$5.8M</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Badge variant="outline">Food Safety</Badge>
                </div>
                <CardTitle>Organic Food Distributor</CardTitle>
                <CardDescription>
                  "Reduced recall response time by 90% and improved supply chain visibility"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Recall Response Time</span>
                    <Badge variant="default">-90%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Supply Chain Visibility</span>
                    <Badge variant="default">100%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Quality Assurance</span>
                    <Badge variant="secondary">99.2%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Live Dashboard Demo */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Live Enterprise Dashboard</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience real-time supply chain monitoring and compliance tracking in action
            </p>
          </div>

          <SupplyChainDashboard />
        </div>
      </section>

      {/* SDK Showcase */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <EnterpriseSDKShowcase />
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4">Enterprise-Grade Features</h2>
                <p className="text-muted-foreground max-w-2xl">
                  Built for scale, security, and seamless integration with your existing systems
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <Shield className="h-8 w-8 text-blue-600 mb-2" />
                    <CardTitle>Enterprise Security</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>SOC 2 Type II Compliance</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>End-to-end encryption</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Multi-signature wallets</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Zap className="h-8 w-8 text-yellow-600 mb-2" />
                    <CardTitle>High Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>1000+ TPS throughput</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Sub-second confirmations</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Auto-scaling infrastructure</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Globe className="h-8 w-8 text-green-600 mb-2" />
                    <CardTitle>Global Integration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Multi-language SDKs</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>ERP system connectors</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Multi-region deployment</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Building2 className="h-8 w-8 text-purple-600 mb-2" />
                    <CardTitle>Enterprise Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>24/7 global support</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Dedicated account manager</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Custom training programs</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Mobile Design Graphic */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl transform -rotate-3"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <img src="/images/mobile-app-design-concept.svg" alt="Mobile Enterprise Solutions" className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10">
          <img src="/images/app-maintenance-concept.svg" alt="Maintenance Background" className="w-80 h-80" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Supply Chain?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join leading enterprises who are already seeing measurable results with MAS Hub. Start your free trial today
            or schedule a personalized demo.
          </p>

          <div className="flex items-center justify-center space-x-4 mb-8">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              <Play className="mr-2 h-5 w-5" />
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 border-white text-white hover:bg-white hover:text-blue-600"
            >
              <Building2 className="mr-2 h-5 w-5" />
              Schedule Demo
            </Button>
          </div>

          <p className="text-sm opacity-75">
            No credit card required • 30-day free trial • Enterprise support included
          </p>
        </div>
      </section>
    </div>
  )
}
