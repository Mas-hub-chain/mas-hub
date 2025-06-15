"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, Search, Filter } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface AuditLog {
  id: string
  user_id: string
  action: string
  resource_type: string
  resource_id?: string
  metadata: Record<string, any>
  ip_address: string
  user_agent: string
  created_at: string
  user_email?: string
}

interface AuditFilters {
  search: string
  action: string
  resourceType: string
  dateFrom?: Date
  dateTo?: Date
  userId?: string
}

export function AuditTrail() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<AuditFilters>({
    search: "",
    action: "",
    resourceType: "",
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    hasMore: false,
  })

  useEffect(() => {
    loadAuditLogs()
  }, [filters, pagination.page])

  const loadAuditLogs = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      let query = supabase
        .from("audit_logs")
        .select(
          `
          *,
          profiles!inner(id)
        `,
          { count: "exact" },
        )
        .order("created_at", { ascending: false })

      // Apply filters
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
        query = query.gte("created_at", filters.dateFrom.toISOString())
      }

      if (filters.dateTo) {
        query = query.lte("created_at", filters.dateTo.toISOString())
      }

      if (filters.userId) {
        query = query.eq("user_id", filters.userId)
      }

      // Apply pagination
      const offset = (pagination.page - 1) * pagination.limit
      query = query.range(offset, offset + pagination.limit - 1)

      const { data, error, count } = await query

      if (error) throw error

      setAuditLogs(data || [])
      setPagination((prev) => ({
        ...prev,
        total: count || 0,
        hasMore: (count || 0) > offset + pagination.limit,
      }))
    } catch (error) {
      console.error("Failed to load audit logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportAuditLogs = async () => {
    try {
      const response = await fetch("/api/audit/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      })

      if (!response.ok) throw new Error("Export failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `audit-logs-${format(new Date(), "yyyy-MM-dd")}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Export failed:", error)
    }
  }

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      login: "bg-green-100 text-green-800",
      logout: "bg-gray-100 text-gray-800",
      token_created: "bg-blue-100 text-blue-800",
      kyc_verification: "bg-purple-100 text-purple-800",
      settings_updated: "bg-yellow-100 text-yellow-800",
      page_view: "bg-gray-100 text-gray-600",
      error: "bg-red-100 text-red-800",
    }
    return colors[action] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Audit Trail</h2>
          <p className="text-muted-foreground">Complete system activity log</p>
        </div>
        <Button onClick={exportAuditLogs} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search actions, resources..."
                  value={filters.search}
                  onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Action</label>
              <Select
                value={filters.action}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, action: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All actions</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="logout">Logout</SelectItem>
                  <SelectItem value="token_created">Token Created</SelectItem>
                  <SelectItem value="kyc_verification">KYC Verification</SelectItem>
                  <SelectItem value="settings_updated">Settings Updated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Resource Type</label>
              <Select
                value={filters.resourceType}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, resourceType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All resources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All resources</SelectItem>
                  <SelectItem value="token">Token</SelectItem>
                  <SelectItem value="kyc_log">KYC Log</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="settings">Settings</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateFrom && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateFrom ? (
                      filters.dateTo ? (
                        <>
                          {format(filters.dateFrom, "LLL dd, y")} - {format(filters.dateTo, "LLL dd, y")}
                        </>
                      ) : (
                        format(filters.dateFrom, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={filters.dateFrom}
                    selected={{
                      from: filters.dateFrom,
                      to: filters.dateTo,
                    }}
                    onSelect={(range) => {
                      setFilters((prev) => ({
                        ...prev,
                        dateFrom: range?.from,
                        dateTo: range?.to,
                      }))
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={loadAuditLogs} size="sm">
              Apply Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFilters({
                  search: "",
                  action: "",
                  resourceType: "",
                })
                setPagination((prev) => ({ ...prev, page: 1 }))
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>
            Showing {auditLogs.length} of {pagination.total} entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : auditLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No audit logs found matching your criteria</div>
          ) : (
            <div className="space-y-4">
              {auditLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getActionColor(log.action)}>{log.action.replace("_", " ").toUpperCase()}</Badge>
                      <span className="text-sm text-muted-foreground">{log.resource_type}</span>
                      {log.resource_id && (
                        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{log.resource_id}</span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(log.created_at), "MMM dd, yyyy HH:mm:ss")}
                    </span>
                  </div>

                  <div className="text-sm">
                    <span className="font-medium">User:</span> {log.user_email || log.user_id}
                  </div>

                  <div className="text-sm">
                    <span className="font-medium">IP:</span> {log.ip_address}
                  </div>

                  {Object.keys(log.metadata).length > 0 && (
                    <details className="text-sm">
                      <summary className="cursor-pointer font-medium">Metadata</summary>
                      <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.total > pagination.limit && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasMore}
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
