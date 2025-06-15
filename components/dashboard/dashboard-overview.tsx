import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, Shield, Zap, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Total Tokens",
    value: "1,234",
    change: "+12%",
    icon: Coins,
    description: "Digital assets created",
  },
  {
    title: "KYC Verifications",
    value: "856",
    change: "+8%",
    icon: Shield,
    description: "Addresses verified",
  },
  {
    title: "Transactions",
    value: "2,847",
    change: "+23%",
    icon: Zap,
    description: "Blockchain operations",
  },
  {
    title: "Success Rate",
    value: "99.2%",
    change: "+0.1%",
    icon: TrendingUp,
    description: "Platform reliability",
  },
]

export function DashboardOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{stat.change}</span> from last month
            </p>
            <CardDescription className="mt-1">{stat.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
