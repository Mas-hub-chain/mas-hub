/**
 * Webhook signature verification for MasChain webhooks
 */

import { createHmac, timingSafeEqual } from "crypto"

export interface WebhookConfig {
  secret: string
  tolerance?: number // Time tolerance in seconds (default: 300 = 5 minutes)
}

export interface WebhookPayload {
  timestamp: string
  event_type: string
  transaction_hash?: string
  data: Record<string, any>
}

/**
 * Verify webhook signature using HMAC-SHA256
 */
export function verifyWebhookSignature(payload: string, signature: string, config: WebhookConfig): boolean {
  try {
    // Remove 'sha256=' prefix if present
    const cleanSignature = signature.replace(/^sha256=/, "")

    // Generate expected signature
    const expectedSignature = createHmac("sha256", config.secret).update(payload).digest("hex")

    // Use timing-safe comparison to prevent timing attacks
    const signatureBuffer = Buffer.from(cleanSignature, "hex")
    const expectedBuffer = Buffer.from(expectedSignature, "hex")

    if (signatureBuffer.length !== expectedBuffer.length) {
      return false
    }

    return timingSafeEqual(signatureBuffer, expectedBuffer)
  } catch (error) {
    console.error("Signature verification error:", error)
    return false
  }
}

/**
 * Verify webhook timestamp to prevent replay attacks
 */
export function verifyWebhookTimestamp(timestamp: string, tolerance = 300): boolean {
  try {
    const webhookTime = new Date(timestamp).getTime()
    const currentTime = Date.now()
    const timeDiff = Math.abs(currentTime - webhookTime) / 1000

    return timeDiff <= tolerance
  } catch (error) {
    console.error("Timestamp verification error:", error)
    return false
  }
}

/**
 * Parse and validate webhook payload
 */
export function parseWebhookPayload(rawPayload: string): WebhookPayload | null {
  try {
    const payload = JSON.parse(rawPayload)

    // Validate required fields
    if (!payload.timestamp || !payload.event_type) {
      throw new Error("Missing required fields")
    }

    // Validate timestamp format
    if (isNaN(new Date(payload.timestamp).getTime())) {
      throw new Error("Invalid timestamp format")
    }

    return payload as WebhookPayload
  } catch (error) {
    console.error("Payload parsing error:", error)
    return null
  }
}

/**
 * Complete webhook verification
 */
export function verifyWebhook(
  rawPayload: string,
  signature: string,
  config: WebhookConfig,
): { valid: boolean; payload?: WebhookPayload; error?: string } {
  // Parse payload
  const payload = parseWebhookPayload(rawPayload)
  if (!payload) {
    return { valid: false, error: "Invalid payload format" }
  }

  // Verify timestamp
  if (!verifyWebhookTimestamp(payload.timestamp, config.tolerance)) {
    return { valid: false, error: "Timestamp verification failed" }
  }

  // Verify signature
  if (!verifyWebhookSignature(rawPayload, signature, config)) {
    return { valid: false, error: "Signature verification failed" }
  }

  return { valid: true, payload }
}
