import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, Shield, Zap } from "lucide-react"

const activities = [
  {
    type: "token_created",
    title: "Invoice Token Created",
    description: "INV-2024-001 tokenized successfully",
    time: "2 minutes ago",
    icon: Coins,
    status: "success",
  },
  {
    type: "kyc_verified",
    title: "KYC Verification Complete",
    description: "0x742d...8f3a verified as low risk",
    time: "5 minutes ago",
    icon: Shield,
    status: "success",
  },
  {
    type: "transaction",
    title: "Token Transfer",
    description: "100 loyalty points transferred",
    time: "12 minutes ago",
    icon: Zap,
    status: "pending",
  },
  {
    type: "token_created",
    title: "NFT Minted",
    description: "Certificate #1234 created",
    time: "1 hour ago",
    icon: Coins,
    status: "success",
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest platform operations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <activity.icon className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <Badge variant={activity.status === "success" ? "default" : "secondary"} className="ml-2">
                    {activity.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
