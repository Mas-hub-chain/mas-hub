"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowLeft, Home } from "lucide-react"
import Link from "next/link"

export default function AuthCodeErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const description = searchParams.get("description")

  const getErrorMessage = () => {
    switch (error) {
      case "no_code":
        return "No authentication code was provided."
      case "exchange_failed":
        return "Failed to exchange authentication code for session."
      case "no_session":
        return "Failed to create authentication session."
      case "access_denied":
        return "Access was denied. You may have cancelled the authentication process."
      case "server_error":
        return "A server error occurred during authentication."
      case "temporarily_unavailable":
        return "The authentication service is temporarily unavailable."
      default:
        return "An unexpected error occurred during authentication."
    }
  }

  const getErrorDetails = () => {
    const commonReasons = [
      "The authentication link was already used",
      "The authentication link has expired",
      "The authentication code was modified or incomplete",
      "There was a network issue during authentication",
    ]

    if (description) {
      return [description, ...commonReasons]
    }

    return commonReasons
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">Authentication Error</CardTitle>
          <CardDescription className="text-gray-600">There was a problem with your authentication.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">{getErrorMessage()}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">This can happen for several reasons:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              {getErrorDetails().map((reason, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col space-y-2 pt-4">
            <Button asChild className="w-full">
              <Link href="/auth/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Login
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go to Homepage
              </Link>
            </Button>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-xs text-gray-500">If this problem persists, please contact support.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
