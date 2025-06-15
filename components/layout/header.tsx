"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { BlockchainIcon } from "@/components/icons/extracted-icons"

export function Header() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 dark:bg-gray-900/80 dark:border-gray-700">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative">
            <BlockchainIcon className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-blue-600 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          </div>
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            MASCHAIN
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/features"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            Features
          </Link>
          <Link
            href="/integrations"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            Integrations
          </Link>
          <Link
            href="/docs"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            Documentation
          </Link>
          <Link
            href="/contact"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            Contact Us
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <ModeToggle />
          <Button
            asChild
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
