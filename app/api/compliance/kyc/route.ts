import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getMasChainClient } from "@/lib/maschain/client"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const maschain = getMasChainClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { wallet_address } = body

    // Perform KYC with MasChain
    const masChainResponse = await maschain.performKYC({ wallet_address })

    if (!masChainResponse.success) {
      return NextResponse.json({ error: masChainResponse.error }, { status: 400 })
    }

    const kycData = masChainResponse.data

    // Store in Supabase
    const { data, error } = await supabase
      .from("kyc_logs")
      .upsert({
        wallet_address,
        risk_score: kycData.risk_score,
        status: kycData.risk_level,
        verified: kycData.verified,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      kyc_result: data,
    })
  } catch (error) {
    console.error("KYC error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
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

    const { data, error } = await supabase
      .from("kyc_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ kyc_logs: data })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
