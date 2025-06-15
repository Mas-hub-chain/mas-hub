/**
 * Rate limiting utility for API routes
 * Implements token bucket algorithm for rate limiting
 */

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  keyGenerator?: (req: Request) => string // Custom key generator
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

class RateLimiter {
  private store: RateLimitStore = {}
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = config
  }

  async isAllowed(req: Request): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = this.config.keyGenerator ? this.config.keyGenerator(req) : this.getDefaultKey(req)
    const now = Date.now()
    const windowStart = now - this.config.windowMs

    // Clean up old entries
    this.cleanup(windowStart)

    // Get or create entry for this key
    let entry = this.store[key]
    if (!entry || entry.resetTime <= now) {
      entry = {
        count: 0,
        resetTime: now + this.config.windowMs,
      }
      this.store[key] = entry
    }

    // Check if request is allowed
    if (entry.count >= this.config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      }
    }

    // Increment counter
    entry.count++

    return {
      allowed: true,
      remaining: this.config.maxRequests - entry.count,
      resetTime: entry.resetTime,
    }
  }

  private getDefaultKey(req: Request): string {
    // Try to get IP from various headers
    const forwarded = req.headers.get("x-forwarded-for")
    const realIP = req.headers.get("x-real-ip")
    const cfConnectingIP = req.headers.get("cf-connecting-ip")

    return forwarded?.split(",")[0] || realIP || cfConnectingIP || "unknown"
  }

  private cleanup(windowStart: number): void {
    Object.keys(this.store).forEach((key) => {
      if (this.store[key].resetTime <= windowStart) {
        delete this.store[key]
      }
    })
  }
}

// Pre-configured rate limiters
export const apiRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per 15 minutes
})

export const authRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 auth attempts per 15 minutes
})

export const webhookRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute
})

export { RateLimiter }
