import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get analytics data
    const [tokensResult, kycResult, webhooksResult] = await Promise.all([
      supabase.from("tokens").select("*").eq("tenant_id", user.id),
      supabase.from("kyc_logs").select("*"),
      supabase.from("webhook_logs").select("*").order("created_at", { ascending: false }).limit(10),
    ])

    const tokens = tokensResult.data || []
    const kycLogs = kycResult.data || []
    const webhooks = webhooksResult.data || []

    // Calculate metrics
    const totalTransactions = tokens.length + kycLogs.length
    const successfulTransactions =
      tokens.filter((t) => t.status === "confirmed").length + kycLogs.filter((k) => k.verified).length
    const successRate = totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0

    // Mock some additional metrics for demo
    const analytics = {
      totalTransactions,
      successRate,
      averageProcessingTime: 2.3,
      monthlyGrowth: 12.5,
      recentActivity: webhooks.map((webhook) => ({
        id: webhook.id,
        type: webhook.event_type.replace("_", " ").toUpperCase(),
        status: webhook.processed ? "success" : "pending",
        timestamp: webhook.created_at,
      })),
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
