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

    // Get user's module preferences from profile
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    const defaultModules = {
      tokenization: true,
      compliance: true,
      wallet: false,
      contracts: false,
      analytics: false,
    }

    const moduleSettings = profile?.module_preferences || defaultModules

    return NextResponse.json({ modules: moduleSettings })
  } catch (error) {
    console.error("Module settings error:", error)
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

    const { modules } = body

    // Update user's module preferences
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      module_preferences: modules,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, modules })
  } catch (error) {
    console.error("Module settings update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
