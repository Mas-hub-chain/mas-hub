import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Get client IP from various headers
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")
  const cfConnectingIP = request.headers.get("cf-connecting-ip")

  const ip = forwarded?.split(",")[0] || realIP || cfConnectingIP || "unknown"

  return NextResponse.json({ ip })
}
