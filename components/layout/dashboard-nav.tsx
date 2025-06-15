"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { UserNav } from "./user-nav"
import {
  DashboardIcon,
  TokenizationIcon,
  SmartContractIcon,
  ComplianceIcon,
  AnalyticsIcon,
  WalletIcon,
  SecurityShieldIcon,
  BlockchainIcon,
} from "@/components/icons/extracted-icons"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: DashboardIcon },
  { name: "Tokenization", href: "/dashboard/tokenization", icon: TokenizationIcon },
  { name: "Smart Contracts", href: "/dashboard/smart-contracts", icon: SmartContractIcon },
  { name: "Compliance", href: "/dashboard/compliance", icon: ComplianceIcon },
  { name: "Analytics", href: "/dashboard/analytics", icon: AnalyticsIcon },
  { name: "Audit Trail", href: "/dashboard/audit", icon: SecurityShieldIcon },
  { name: "Wallet", href: "/dashboard/wallet", icon: WalletIcon },
  { name: "Settings", href: "/dashboard/settings", icon: SecurityShieldIcon },
]

interface DashboardNavProps {
  user: any
}

export function DashboardNav({ user }: DashboardNavProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile sidebar */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", sidebarOpen ? "block" : "hidden")}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white dark:bg-gray-900">
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <div className="flex items-center space-x-2">
              <BlockchainIcon className="w-8 h-8 text-blue-600" />
              <div className="text-xl font-bold text-blue-600">MAS Hub</div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
          <div className="flex h-16 items-center px-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <BlockchainIcon className="w-8 h-8 text-blue-600" />
              <div className="text-xl font-bold text-blue-600">MAS Hub</div>
            </div>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Top navigation */}
      <div className="lg:pl-64">
        <div className="flex h-16 items-center justify-between px-4 border-b bg-white dark:bg-gray-900 lg:px-8">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-4 ml-auto">
            <ModeToggle />
            <UserNav user={user} />
          </div>
        </div>
      </div>
    </>
  )
}
