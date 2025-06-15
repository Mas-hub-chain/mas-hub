import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const range = searchParams.get("range") || "7d"

    // Calculate date range
    const now = new Date()
    const daysBack = range === "30d" ? 30 : range === "90d" ? 90 : 7
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)

    // Get contract statistics
    const { data: contractStats } = await supabase
      .from("smart_contract_projects")
      .select(`
        *,
        smart_contract_versions(*)
      `)
      .eq("user_id", user.id)

    const { data: deployedContracts } = await supabase.from("deployed_contracts").select("*").eq("user_id", user.id)

    const { data: interactions } = await supabase
      .from("contract_interactions")
      .select("*")
      .eq("user_id", user.id)
      .gte("created_at", startDate.toISOString())

    // Calculate analytics
    const totalContracts = contractStats?.length || 0
    const activeContracts = deployedContracts?.length || 0
    const totalTransactions = interactions?.length || 0
    const successfulTransactions = interactions?.filter((i) => i.success).length || 0
    const successRate = totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0

    // Generate trend data
    const deploymentTrend = []
    const gasUsageTrend = []

    for (let i = daysBack - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split("T")[0]

      const dayInteractions = interactions?.filter((interaction) => interaction.created_at.startsWith(dateStr)) || []

      deploymentTrend.push({
        date: dateStr,
        deployments: 0, // Would need deployment tracking
        interactions: dayInteractions.length,
      })

      gasUsageTrend.push({
        date: dateStr,
        gasUsed: Math.floor(Math.random() * 500000) + 100000, // Mock data
        cost: 0, // MasChain has 0 gas cost
      })
    }

    const analytics = {
      totalContracts,
      activeContracts,
      totalTransactions,
      totalGasUsed: gasUsageTrend.reduce((sum, day) => sum + day.gasUsed, 0),
      averageGasPrice: 0, // MasChain has 0 gas price
      successRate: Math.round(successRate * 10) / 10,
      deploymentTrend,
      gasUsageTrend,
      contractsByStatus: [
        { status: "Active", count: activeContracts, color: "#10b981" },
        { status: "Inactive", count: Math.max(0, totalContracts - activeContracts), color: "#6b7280" },
        { status: "Failed", count: 0, color: "#ef4444" },
      ],
      topContracts:
        deployedContracts?.slice(0, 5).map((contract) => ({
          name: contract.contract_name,
          address: contract.contract_address.substring(0, 10) + "...",
          interactions: interactions?.filter((i) => i.contract_address === contract.contract_address).length || 0,
          gasUsed: Math.floor(Math.random() * 100000) + 50000, // Mock data
          lastActivity: contract.updated_at,
        })) || [],
      vulnerabilities: [], // Would integrate with security scanning
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Error fetching smart contract analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
