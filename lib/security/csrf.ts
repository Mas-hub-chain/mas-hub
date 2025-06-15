/**
 * CSRF protection utilities
 */

import { createHash, randomBytes } from "crypto"

const CSRF_SECRET = process.env.CSRF_SECRET || "default-csrf-secret-change-in-production"

/**
 * Generate CSRF token
 */
export function generateCSRFToken(sessionId: string): string {
  const timestamp = Date.now().toString()
  const nonce = randomBytes(16).toString("hex")
  const payload = `${sessionId}:${timestamp}:${nonce}`

  const hash = createHash("sha256")
    .update(payload + CSRF_SECRET)
    .digest("hex")

  return Buffer.from(`${payload}:${hash}`).toString("base64")
}

/**
 * Verify CSRF token
 */
export function verifyCSRFToken(token: string, sessionId: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8")
    const [session, timestamp, nonce, hash] = decoded.split(":")

    if (session !== sessionId) {
      return false
    }

    // Check if token is not older than 1 hour
    const tokenTime = Number.parseInt(timestamp)
    const now = Date.now()
    if (now - tokenTime > 60 * 60 * 1000) {
      return false
    }

    // Verify hash
    const payload = `${session}:${timestamp}:${nonce}`
    const expectedHash = createHash("sha256")
      .update(payload + CSRF_SECRET)
      .digest("hex")

    return hash === expectedHash
  } catch (error) {
    return false
  }
}

/**
 * CSRF middleware for API routes
 */
export function withCSRF(handler: Function) {
  return async (req: Request, ...args: any[]) => {
    if (req.method === "GET" || req.method === "HEAD") {
      return handler(req, ...args)
    }

    const token = req.headers.get("x-csrf-token")
    const sessionId = req.headers.get("x-session-id") || "anonymous"

    if (!token || !verifyCSRFToken(token, sessionId)) {
      return new Response(JSON.stringify({ error: "Invalid CSRF token" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      })
    }

    return handler(req, ...args)
  }
}
