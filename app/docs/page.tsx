import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Code, Zap, Shield, Database, Webhook, Users, Settings, ExternalLink, Download } from "lucide-react"
import Link from "next/link"

const documentationSections = {
  quickstart: {
    title: "Quick Start",
    description: "Get up and running with MAS Hub in minutes",
    docs: [
      {
        title: "Installation & Setup",
        description: "Step-by-step guide to set up your MAS Hub instance",
        icon: Zap,
        readTime: "5 min",
        difficulty: "Beginner",
        topics: ["Environment setup", "Configuration", "First deployment", "Basic authentication"],
      },
      {
        title: "Your First Token",
        description: "Create and manage your first blockchain asset",
        icon: Code,
        readTime: "10 min",
        difficulty: "Beginner",
        topics: ["Token creation", "Metadata setup", "Asset management", "Transfer operations"],
      },
      {
        title: "Dashboard Overview",
        description: "Navigate the MAS Hub dashboard and key features",
        icon: Settings,
        readTime: "8 min",
        difficulty: "Beginner",
        topics: ["Dashboard navigation", "Module overview", "Settings configuration", "User management"],
      },
    ],
  },
  api: {
    title: "API Reference",
    description: "Complete API documentation and examples",
    docs: [
      {
        title: "Authentication API",
        description: "User authentication and session management",
        icon: Shield,
        readTime: "15 min",
        difficulty: "Intermediate",
        topics: ["JWT tokens", "Session handling", "Role-based access", "SSO integration"],
      },
      {
        title: "Tokenization API",
        description: "Asset tokenization and management endpoints",
        icon: Code,
        readTime: "20 min",
        difficulty: "Intermediate",
        topics: ["Token creation", "Asset queries", "Transfer operations", "Metadata management"],
      },
      {
        title: "Compliance API",
        description: "KYC verification and compliance endpoints",
        icon: Shield,
        readTime: "18 min",
        difficulty: "Advanced",
        topics: ["KYC verification", "Risk assessment", "Compliance reporting", "Audit trails"],
      },
      {
        title: "Webhook API",
        description: "Real-time event notifications and webhooks",
        icon: Webhook,
        readTime: "12 min",
        difficulty: "Intermediate",
        topics: ["Event subscriptions", "Webhook configuration", "Signature verification", "Retry handling"],
      },
    ],
  },
  guides: {
    title: "Integration Guides",
    description: "Detailed guides for common integration scenarios",
    docs: [
      {
        title: "Enterprise Integration",
        description: "Integrate MAS Hub with existing enterprise systems",
        icon: Database,
        readTime: "30 min",
        difficulty: "Advanced",
        topics: ["System architecture", "Data migration", "Security considerations", "Performance optimization"],
      },
      {
        title: "Multi-Tenant Setup",
        description: "Configure multi-tenant architecture for SaaS deployment",
        icon: Users,
        readTime: "25 min",
        difficulty: "Advanced",
        topics: ["Tenant isolation", "Custom branding", "Resource allocation", "Billing integration"],
      },
      {
        title: "Compliance Configuration",
        description: "Set up automated compliance and KYC workflows",
        icon: Shield,
        readTime: "20 min",
        difficulty: "Intermediate",
        topics: ["KYC setup", "Risk rules", "Reporting automation", "Audit configuration"],
      },
    ],
  },
  reference: {
    title: "Reference",
    description: "Technical reference and advanced topics",
    docs: [
      {
        title: "Environment Variables",
        description: "Complete list of configuration options",
        icon: Settings,
        readTime: "10 min",
        difficulty: "Beginner",
        topics: ["Required variables", "Optional settings", "Security configuration", "Performance tuning"],
      },
      {
        title: "Database Schema",
        description: "Database structure and relationships",
        icon: Database,
        readTime: "15 min",
        difficulty: "Advanced",
        topics: ["Table structure", "Relationships", "Indexes", "Migration scripts"],
      },
      {
        title: "Security Best Practices",
        description: "Security guidelines and recommendations",
        icon: Shield,
        readTime: "20 min",
        difficulty: "Advanced",
        topics: ["Authentication security", "Data encryption", "Network security", "Audit logging"],
      },
    ],
  },
}

const quickLinks = [
  { title: "API Playground", href: "/api/docs", icon: Code },
  { title: "SDK Downloads", href: "/downloads", icon: Download },
  { title: "Community Forum", href: "https://community.maschain.com", icon: ExternalLink },
  { title: "Support Portal", href: "/support", icon: Users },
]

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Documentation</h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
                Everything you need to integrate, deploy, and scale your blockchain applications with MAS Hub. From
                quick start guides to advanced API references.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="#quickstart">Get Started</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">Get Support</Link>
                </Button>
              </div>
            </div>

            {/* Development Graphic */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl transform rotate-2"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
                <img src="/images/app-development-concept.svg" alt="MAS Hub Development Platform" className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 px-4 bg-white dark:bg-gray-900">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <link.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-lg">{link.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href={link.href}>
                      Access
                      {link.href.startsWith("http") && <ExternalLink className="ml-2 h-4 w-4" />}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Tabs */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto">
          <Tabs defaultValue="quickstart" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-12">
              <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
              <TabsTrigger value="api">API Reference</TabsTrigger>
              <TabsTrigger value="guides">Guides</TabsTrigger>
              <TabsTrigger value="reference">Reference</TabsTrigger>
            </TabsList>

            {Object.entries(documentationSections).map(([key, section]) => (
              <TabsContent key={key} value={key} className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{section.title}</h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{section.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {section.docs.map((doc, index) => (
                    <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <doc.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline">{doc.readTime}</Badge>
                            <Badge
                              variant={
                                doc.difficulty === "Beginner"
                                  ? "default"
                                  : doc.difficulty === "Intermediate"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {doc.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <CardTitle className="text-xl">{doc.title}</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-300">
                          {doc.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Topics Covered:</h4>
                            <ul className="space-y-1">
                              {doc.topics.map((topic, topicIndex) => (
                                <li
                                  key={topicIndex}
                                  className="flex items-center text-sm text-gray-600 dark:text-gray-300"
                                >
                                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2" />
                                  {topic}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <Button className="w-full">
                            <BookOpen className="mr-2 h-4 w-4" />
                            Read Documentation
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

      {/* Support Section */}
      <section className="py-20 px-4 bg-blue-600 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10">
          <img src="/images/app-maintenance-concept.svg" alt="Support Background" className="w-96 h-96" />
        </div>
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">Need Help?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help you succeed with MAS Hub.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
              asChild
            >
              <Link href="https://community.maschain.com">
                Join Community
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
