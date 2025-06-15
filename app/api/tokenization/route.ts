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
    const { asset_type, metadata } = body

    // Create token on MasChain
    const masChainResponse = await maschain.createToken({
      asset_type,
      metadata,
      tenant_id: user.id,
    })

    if (!masChainResponse.success) {
      return NextResponse.json({ error: masChainResponse.error }, { status: 400 })
    }

    // Store in Supabase
    const { data, error } = await supabase
      .from("tokens")
      .insert({
        tenant_id: user.id,
        asset_type,
        metadata,
        tx_hash: masChainResponse.transaction_hash,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      token: data,
      tx_hash: masChainResponse.transaction_hash,
    })
  } catch (error) {
    console.error("Tokenization error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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

    const { data, error } = await supabase
      .from("tokens")
      .select("*")
      .eq("tenant_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ tokens: data })
  } catch (error) {
    console.error("Token fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
