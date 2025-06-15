import { SmartContractDashboard } from "@/components/smart-contracts/smart-contract-dashboard"
import { createClient } from "@/lib/supabase/server"

export default async function SmartContractsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Smart Contracts</h1>
        <p className="text-gray-600 mt-2">Create, deploy, and manage your custom smart contracts on MasChain</p>
      </div>

      <SmartContractDashboard />
    </div>
  )
}
