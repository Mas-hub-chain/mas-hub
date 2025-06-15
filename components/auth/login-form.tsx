"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { Github, Mail, Loader2 } from "lucide-react"

export function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        throw error
      }

      if (data.user) {
        toast({
          title: "Welcome back!",
          description: "You have been successfully signed in.",
        })
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error: any) {
      console.error("Email login error:", error)
      toast({
        title: "Sign In Failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: "google" | "github") => {
    setOauthLoading(provider)

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })

      if (error) {
        throw error
      }

      // OAuth redirect will happen automatically
    } catch (error: any) {
      console.error(`${provider} OAuth error:`, error)
      toast({
        title: "Authentication Failed",
        description: error.message || `Failed to sign in with ${provider}. Please try again.`,
        variant: "destructive",
      })
      setOauthLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleOAuthLogin("google")}
          disabled={oauthLoading !== null}
        >
          {oauthLoading === "google" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Mail className="mr-2 h-4 w-4" />
          )}
          Continue with Google
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleOAuthLogin("github")}
          disabled={oauthLoading !== null}
        >
          {oauthLoading === "github" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Github className="mr-2 h-4 w-4" />
          )}
          Continue with GitHub
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500 dark:bg-gray-950">Or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="Enter your email"
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
            placeholder="Enter your password"
            required
            disabled={loading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading || oauthLoading !== null}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    </div>
  )
}
