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

export function RegisterForm() {
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
  })
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            company_name: formData.companyName,
          },
        },
      })

      if (error) {
        throw error
      }

      if (data.user) {
        toast({
          title: "Account Created!",
          description: data.user.email_confirmed_at
            ? "Your account has been created successfully."
            : "Please check your email to verify your account.",
        })

        // If email is already confirmed, redirect to dashboard
        if (data.user.email_confirmed_at) {
          router.push("/dashboard")
        } else {
          router.push("/auth/login")
        }
        router.refresh()
      }
    } catch (error: any) {
      console.error("Email registration error:", error)
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthRegister = async (provider: "google" | "github") => {
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
        title: "Registration Failed",
        description: error.message || `Failed to sign up with ${provider}. Please try again.`,
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
          onClick={() => handleOAuthRegister("google")}
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
          onClick={() => handleOAuthRegister("github")}
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

      <form onSubmit={handleEmailRegister} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
            placeholder="Enter your company name"
            required
            disabled={loading}
          />
        </div>

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
            placeholder="Create a password (min. 6 characters)"
            required
            disabled={loading}
            minLength={6}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            placeholder="Confirm your password"
            required
            disabled={loading}
            minLength={6}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading || oauthLoading !== null}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </div>
  )
}
