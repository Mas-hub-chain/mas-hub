import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth/auth-provider"
import { NotificationProvider } from "@/components/realtime/notification-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MAS Hub - Enterprise Blockchain Integration Platform",
  description: "Modular SaaS platform for enterprise Web3 adoption using MasChain infrastructure",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
