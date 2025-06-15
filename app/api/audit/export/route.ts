import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
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

    const filters = await request.json()

    // Build query with filters
    let query = supabase
      .from("audit_logs")
      .select(`
        *,
        profiles!inner(id)
      `)
      .order("created_at", { ascending: false })

    // Apply filters (same logic as in the component)
    if (filters.search) {
      query = query.or(`action.ilike.%${filters.search}%,resource_type.ilike.%${filters.search}%`)
    }

    if (filters.action) {
      query = query.eq("action", filters.action)
    }

    if (filters.resourceType) {
      query = query.eq("resource_type", filters.resourceType)
    }

    if (filters.dateFrom) {
      query = query.gte("created_at", filters.dateFrom)
    }

    if (filters.dateTo) {
      query = query.lte("created_at", filters.dateTo)
    }

    if (filters.userId) {
      query = query.eq("user_id", filters.userId)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    // Convert to CSV
    const csvHeaders = [
      "Timestamp",
      "User ID",
      "Action",
      "Resource Type",
      "Resource ID",
      "IP Address",
      "User Agent",
      "Metadata",
    ]

    const csvRows = (data || []).map((log) => [
      log.created_at,
      log.user_id,
      log.action,
      log.resource_type,
      log.resource_id || "",
      log.ip_address,
      log.user_agent,
      JSON.stringify(log.metadata),
    ])

    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")),
    ].join("\n")

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="audit-logs-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("Audit export error:", error)
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}
