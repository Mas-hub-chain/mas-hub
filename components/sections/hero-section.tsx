import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Enterprise <span className="text-blue-600">Blockchain</span> Integration
                <br />
                <span className="text-blue-600">In Minutes</span>, Not Months.
              </h1>

              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                MAS Hub is a modular SaaS platform that makes Web3 adoption seamless for enterprises. Tokenize assets,
                automate compliance, and integrate blockchain without the complexity.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8 py-4" asChild>
                <Link href="/dashboard">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4" asChild>
                <Link href="/enterprise">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-600">580%</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">3-Year ROI</p>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-green-600">6mo</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Payback Period</p>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-purple-600">95%</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Fraud Reduction</p>
              </div>
            </div>
          </div>

          {/* Graphic Side */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl transform rotate-3"></div>
            <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl">
              <img
                src="/images/blockchain-illustration.png"
                alt="MAS Hub Blockchain Integration Platform"
                className="w-full max-w-lg mx-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
