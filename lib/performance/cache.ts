/**
 * Caching utilities for performance optimization
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>()
  private maxSize: number

  constructor(maxSize = 1000) {
    this.maxSize = maxSize
  }

  set<T>(key: string, data: T, ttlMs = 5 * 60 * 1000): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value
      this.cache.delete(oldestKey)
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) {
      return null
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

// Global cache instance
export const cache = new MemoryCache()

// Auto cleanup every 5 minutes
setInterval(
  () => {
    cache.cleanup()
  },
  5 * 60 * 1000,
)

/**
 * Cache decorator for functions
 */
export function cached<T extends (...args: any[]) => any>(
  fn: T,
  keyGenerator: (...args: Parameters<T>) => string,
  ttlMs = 5 * 60 * 1000,
): T {
  return ((...args: Parameters<T>) => {
    const key = keyGenerator(...args)
    const cached = cache.get(key)

    if (cached !== null) {
      return cached
    }

    const result = fn(...args)

    // Handle promises
    if (result instanceof Promise) {
      return result.then((data) => {
        cache.set(key, data, ttlMs)
        return data
      })
    }

    cache.set(key, result, ttlMs)
    return result
  }) as T
}

/**
 * Cache key generators
 */
export const cacheKeys = {
  userTokens: (userId: string) => `user:${userId}:tokens`,
  kycLogs: () => "kyc:logs:all",
  analytics: (userId: string) => `analytics:${userId}`,
  userProfile: (userId: string) => `profile:${userId}`,
}
