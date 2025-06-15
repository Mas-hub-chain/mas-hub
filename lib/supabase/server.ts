import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// Export the createServerClient function as a named export
export { createServerClient } from "@supabase/ssr"

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
      set(name, value, options) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
          console.warn("Cookie set error (can be ignored in Server Components):", error)
        }
      },
      remove(name, options) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch (error) {
          // The `delete` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
          console.warn("Cookie remove error (can be ignored in Server Components):", error)
        }
      },
    },
  })
}
