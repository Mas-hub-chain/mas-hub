import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { ModuleCards } from "@/components/dashboard/module-cards"
import { ActivityFeed } from "@/components/realtime/activity-feed"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome to your MAS Hub enterprise integration platform, {user?.user_metadata?.company_name || "User"}
        </p>
      </div>

      <DashboardOverview />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ModuleCards />
        </div>
        <div>
          <ActivityFeed />
        </div>
      </div>
    </div>
  )
}
