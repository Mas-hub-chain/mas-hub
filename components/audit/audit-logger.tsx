"use client"

import type React from "react"
import { useEffect } from "react"
import { logAuditEvent, logPageView } from "@/lib/actions/audit-actions"

interface AuditEvent {
  action: string
  resource_type: string
  resource_id?: string
  details?: Record<string, any>
}

export function useAuditLogger() {
  const logEvent = async (event: AuditEvent) => {
    try {
      await logAuditEvent(event)
    } catch (error) {
      console.error("Failed to log audit event:", error)
    }
  }

  return { logEvent }
}

// Hook for automatic page view logging
export function usePageViewLogger(pageName: string) {
  useEffect(() => {
    const logView = async () => {
      try {
        await logPageView(pageName)
      } catch (error) {
        console.error("Failed to log page view:", error)
      }
    }

    logView()
  }, [pageName])
}

// Component for wrapping forms with audit logging
export function AuditWrapper({
  children,
  action,
  resourceType,
}: {
  children: React.ReactNode
  action: string
  resourceType: string
}) {
  const { logEvent } = useAuditLogger()

  useEffect(() => {
    logEvent({
      action,
      resource_type: resourceType,
    })
  }, [action, resourceType, logEvent])

  return <>{children}</>
}
