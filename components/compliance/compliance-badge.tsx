import { Badge } from "@/components/ui/badge"
import { Shield, ShieldAlert, ShieldX } from "lucide-react"

interface ComplianceBadgeProps {
  status: string
  verified: boolean
}

export function ComplianceBadge({ status, verified }: ComplianceBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "low_risk":
        return {
          variant: "default" as const,
          icon: Shield,
          text: "Low Risk",
          className: "bg-green-100 text-green-800",
        }
      case "medium_risk":
        return {
          variant: "secondary" as const,
          icon: ShieldAlert,
          text: "Medium Risk",
          className: "bg-yellow-100 text-yellow-800",
        }
      case "high_risk":
        return {
          variant: "destructive" as const,
          icon: ShieldX,
          text: "High Risk",
          className: "bg-red-100 text-red-800",
        }
      default:
        return {
          variant: "outline" as const,
          icon: Shield,
          text: "Unknown",
          className: "",
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={config.className}>
      <Icon className="w-3 h-3 mr-1" />
      {config.text}
      {verified && " ✓"}
    </Badge>
  )
}
