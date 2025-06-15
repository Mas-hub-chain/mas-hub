/**
 * Input validation and sanitization utilities
 */

import { z } from "zod"

// Common validation schemas
export const schemas = {
  email: z.string().email("Invalid email format"),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address format"),
  uuid: z.string().uuid("Invalid UUID format"),
  assetType: z.enum(["invoice", "loyalty_points", "contract", "nft", "custom"]),
  network: z.enum(["testnet", "mainnet"]),
  positiveInteger: z.number().int().positive("Must be a positive integer"),
  nonEmptyString: z.string().min(1, "Field cannot be empty"),
  jsonObject: z.record(z.any()),
}

// Tokenization request validation
export const tokenizationSchema = z.object({
  asset_type: schemas.assetType,
  metadata: z.object({
    name: schemas.nonEmptyString.max(100, "Name too long"),
    description: z.string().max(500, "Description too long"),
    quantity: schemas.positiveInteger,
    custom_metadata: schemas.jsonObject.optional(),
  }),
  tenant_id: schemas.uuid,
})

// KYC request validation
export const kycSchema = z.object({
  wallet_address: schemas.walletAddress,
})

// Settings validation
export const networkSettingsSchema = z.object({
  network: schemas.network,
})

export const moduleSettingsSchema = z.object({
  modules: z.record(z.boolean()),
})

// User profile validation
export const profileSchema = z.object({
  company_name: z.string().max(100, "Company name too long").optional(),
  industry: z.string().max(50, "Industry too long").optional(),
})

/**
 * Sanitize HTML content to prevent XSS
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
}

/**
 * Validate and sanitize JSON input
 */
export function validateJson(input: string): any {
  try {
    const parsed = JSON.parse(input)
    // Recursively sanitize string values
    return sanitizeJsonValues(parsed)
  } catch (error) {
    throw new Error("Invalid JSON format")
  }
}

function sanitizeJsonValues(obj: any): any {
  if (typeof obj === "string") {
    return sanitizeHtml(obj)
  } else if (Array.isArray(obj)) {
    return obj.map(sanitizeJsonValues)
  } else if (obj && typeof obj === "object") {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(obj)) {
      sanitized[sanitizeHtml(key)] = sanitizeJsonValues(value)
    }
    return sanitized
  }
  return obj
}

/**
 * Validate request body against schema
 */
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`)
      throw new Error(`Validation failed: ${messages.join(", ")}`)
    }
    throw error
  }
}
