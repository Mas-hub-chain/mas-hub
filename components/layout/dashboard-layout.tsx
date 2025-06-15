"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { LayoutDashboard, Coins, Shield, Wallet, Settings, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { UserNav } from "./user-nav"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"

// Define navigation items
const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tokenization", href: "/dashboard/tokenization", icon: Coins },
  { name: "Compliance", href: "/dashboard/compliance", icon: Shield },
  { name: "Wallet", href: "/dashboard/wallet", icon: Wallet },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

// Replace the existing DashboardLayout function with this:
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", sidebarOpen ? "block" : "hidden")}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <div className="text-xl font-bold text-blue-600">MAS Hub</div>
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
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium",
                  pathname === item.href ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100",
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
        <div className="flex flex-col flex-grow bg-white border-r">
          <div className="flex h-16 items-center px-4 border-b">
            <div className="text-xl font-bold text-blue-600">MAS Hub</div>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium",
                  pathname === item.href ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100",
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="flex h-16 items-center justify-between px-4 border-b bg-white lg:px-8">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-4 ml-auto">
            <ModeToggle />
            <UserNav user={user} />
          </div>
        </div>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
