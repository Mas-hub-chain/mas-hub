import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()

    // Test database connection
    const { error: dbError } = await supabase.from("tokens").select("id").limit(1)

    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "unknown",
      environment: process.env.NODE_ENV || "unknown",
      services: {
        database: dbError ? "unhealthy" : "healthy",
        maschain: "healthy", // Could add actual MasChain health check
      },
    }

    if (dbError) {
      health.status = "unhealthy"
      return NextResponse.json(health, { status: 503 })
    }

    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Health check failed",
      },
      { status: 503 },
    )
  }
}
