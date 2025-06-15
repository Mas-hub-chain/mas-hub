import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

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

    // Get user's network preference from profile
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    const networkSettings = {
      network: profile?.network_preference || "testnet",
      chainId: profile?.network_preference === "mainnet" ? "698" : "699",
      rpcUrl:
        profile?.network_preference === "mainnet" ? "https://rpc.maschain.com" : "https://rpc-testnet.maschain.com",
    }

    return NextResponse.json(networkSettings)
  } catch (error) {
    console.error("Network settings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { network } = body

    if (!["testnet", "mainnet"].includes(network)) {
      return NextResponse.json({ error: "Invalid network" }, { status: 400 })
    }

    // Update user's network preference
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      network_preference: network,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, network })
  } catch (error) {
    console.error("Network settings update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
