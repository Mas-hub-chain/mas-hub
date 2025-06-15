import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  const error_description = requestUrl.searchParams.get("error_description")
  const origin = requestUrl.origin

  console.log("Auth callback received:", { code: !!code, error, error_description })

  // Handle OAuth errors
  if (error) {
    console.error("OAuth error:", error, error_description)
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?error=${encodeURIComponent(error)}&description=${encodeURIComponent(error_description || "")}`,
    )
  }

  // Handle missing code
  if (!code) {
    console.error("No authorization code provided")
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?error=no_code&description=${encodeURIComponent("No authorization code was provided")}`,
    )
  }

  try {
    const supabase = createClient()

    // Exchange code for session with detailed logging
    console.log("Attempting to exchange code for session...")
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error("Code exchange error:", {
        message: exchangeError.message,
        status: exchangeError.status,
        name: exchangeError.name,
      })

      // Handle specific error types
      if (exchangeError.message.includes("Database error") || exchangeError.message.includes("saving new user")) {
        return NextResponse.redirect(
          `${origin}/auth/auth-code-error?error=database_error&description=${encodeURIComponent("Database error saving new user. Please try again or contact support.")}`,
        )
      }

      return NextResponse.redirect(
        `${origin}/auth/auth-code-error?error=exchange_failed&description=${encodeURIComponent(exchangeError.message)}`,
      )
    }

    if (!data.session) {
      console.error("No session created after code exchange")
      return NextResponse.redirect(
        `${origin}/auth/auth-code-error?error=no_session&description=${encodeURIComponent("Failed to create session")}`,
      )
    }

    // Verify user profile was created
    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", data.user.id)
        .single()

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Profile verification error:", profileError)
        // Don't fail authentication for profile issues, just log
      }

      if (!profile) {
        console.log("Profile not found, will be created by trigger")
      }
    } catch (profileCheckError) {
      console.error("Error checking profile:", profileCheckError)
      // Don't fail authentication for profile check issues
    }

    // Success - redirect to dashboard
    console.log("Authentication successful for user:", data.user?.email)
    return NextResponse.redirect(`${origin}/dashboard`)
  } catch (error) {
    console.error("Unexpected error in auth callback:", error)
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?error=unexpected_error&description=${encodeURIComponent("An unexpected error occurred during authentication")}`,
    )
  }
}
