import type React from "react"
import { DashboardNav } from "@/components/layout/dashboard-nav"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav user={user} />
      <div className="lg:pl-64">
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
