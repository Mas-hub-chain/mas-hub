"use server"

import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

interface AuditEventData {
  action: string
  resource_type: string
  resource_id?: string
  details?: Record<string, any>
}

export async function logAuditEvent(eventData: AuditEventData) {
  try {
    const supabase = createClient()
    const headersList = headers()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("Failed to get user for audit log:", userError)
      return { success: false, error: "User not authenticated" }
    }

    // Get client information
    const userAgent = headersList.get("user-agent") || "unknown"
    const forwardedFor = headersList.get("x-forwarded-for")
    const realIp = headersList.get("x-real-ip")
    const clientIp = forwardedFor?.split(",")[0] || realIp || "unknown"

    // Insert audit log
    const { error: insertError } = await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: eventData.action,
      resource_type: eventData.resource_type,
      resource_id: eventData.resource_id,
      details: eventData.details || {},
      ip_address: clientIp,
      user_agent: userAgent,
      timestamp: new Date().toISOString(),
    })

    if (insertError) {
      console.error("Failed to insert audit log:", insertError)
      return { success: false, error: insertError.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Audit logging error:", error)
    return { success: false, error: "Failed to log audit event" }
  }
}

export async function logPageView(pageName: string) {
  return logAuditEvent({
    action: "page_view",
    resource_type: "page",
    details: { page_name: pageName },
  })
}
