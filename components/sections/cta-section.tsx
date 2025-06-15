import { Button } from "@/components/ui/button"
import { ArrowRight, Zap } from "lucide-react"
export function CTASection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/blockchain-illustration.png')] bg-no-repeat bg-center bg-cover opacity-10"></div>
      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Transform Your Enterprise?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join leading enterprises who are already seeing measurable results with MAS Hub. Start your blockchain
            transformation today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              <Zap className="mr-2 h-5 w-5" />
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600"
            >
              <ArrowRight className="mr-2 h-5 w-5" />
              Schedule Demo
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">500+</div>
              <p className="text-blue-100">Enterprise Clients</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">99.9%</div>
              <p className="text-blue-100">Uptime SLA</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <p className="text-blue-100">Global Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
