/**
 * Application metrics and monitoring
 */

interface Metric {
  name: string
  value: number
  timestamp: number
  tags?: Record<string, string>
}

class MetricsCollector {
  private metrics: Metric[] = []
  private counters = new Map<string, number>()
  private gauges = new Map<string, number>()
  private histograms = new Map<string, number[]>()

  /**
   * Increment a counter metric
   */
  increment(name: string, value = 1, tags?: Record<string, string>) {
    const current = this.counters.get(name) || 0
    this.counters.set(name, current + value)

    this.addMetric({
      name: `${name}.count`,
      value: current + value,
      timestamp: Date.now(),
      tags,
    })
  }

  /**
   * Set a gauge metric
   */
  gauge(name: string, value: number, tags?: Record<string, string>) {
    this.gauges.set(name, value)

    this.addMetric({
      name: `${name}.gauge`,
      value,
      timestamp: Date.now(),
      tags,
    })
  }

  /**
   * Record a histogram value
   */
  histogram(name: string, value: number, tags?: Record<string, string>) {
    const values = this.histograms.get(name) || []
    values.push(value)
    this.histograms.set(name, values)

    // Keep only last 1000 values to prevent memory issues
    if (values.length > 1000) {
      values.splice(0, values.length - 1000)
    }

    this.addMetric({
      name: `${name}.histogram`,
      value,
      timestamp: Date.now(),
      tags,
    })
  }

  /**
   * Time a function execution
   */
  time<T>(name: string, fn: () => T, tags?: Record<string, string>): T {
    const start = Date.now()
    try {
      const result = fn()
      const duration = Date.now() - start
      this.histogram(`${name}.duration`, duration, tags)
      return result
    } catch (error) {
      const duration = Date.now() - start
      this.histogram(`${name}.duration`, duration, { ...tags, error: "true" })
      throw error
    }
  }

  /**
   * Time an async function execution
   */
  async timeAsync<T>(name: string, fn: () => Promise<T>, tags?: Record<string, string>): Promise<T> {
    const start = Date.now()
    try {
      const result = await fn()
      const duration = Date.now() - start
      this.histogram(`${name}.duration`, duration, tags)
      return result
    } catch (error) {
      const duration = Date.now() - start
      this.histogram(`${name}.duration`, duration, { ...tags, error: "true" })
      throw error
    }
  }

  /**
   * Get histogram statistics
   */
  getHistogramStats(name: string) {
    const values = this.histograms.get(name) || []
    if (values.length === 0) {
      return null
    }

    const sorted = [...values].sort((a, b) => a - b)
    const sum = values.reduce((a, b) => a + b, 0)

    return {
      count: values.length,
      sum,
      avg: sum / values.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    }
  }

  /**
   * Get all current metrics
   */
  getMetrics(): Metric[] {
    return [...this.metrics]
  }

  /**
   * Clear old metrics (keep last hour)
   */
  cleanup() {
    const oneHourAgo = Date.now() - 60 * 60 * 1000
    this.metrics = this.metrics.filter((m) => m.timestamp > oneHourAgo)
  }

  private addMetric(metric: Metric) {
    this.metrics.push(metric)

    // Keep only last 10000 metrics to prevent memory issues
    if (this.metrics.length > 10000) {
      this.metrics.splice(0, this.metrics.length - 10000)
    }
  }
}

// Global metrics instance
export const metrics = new MetricsCollector()

// Auto cleanup every 10 minutes
setInterval(
  () => {
    metrics.cleanup()
  },
  10 * 60 * 1000,
)

// Common application metrics
export const appMetrics = {
  // API metrics
  apiRequest: (method: string, endpoint: string, status: number) => {
    metrics.increment("api.requests", 1, { method, endpoint, status: status.toString() })
  },

  apiDuration: (method: string, endpoint: string, duration: number) => {
    metrics.histogram("api.duration", duration, { method, endpoint })
  },

  // Database metrics
  dbQuery: (table: string, operation: string) => {
    metrics.increment("db.queries", 1, { table, operation })
  },

  dbDuration: (table: string, operation: string, duration: number) => {
    metrics.histogram("db.duration", duration, { table, operation })
  },

  // Business metrics
  tokenCreated: (assetType: string) => {
    metrics.increment("tokens.created", 1, { asset_type: assetType })
  },

  kycVerification: (status: string) => {
    metrics.increment("kyc.verifications", 1, { status })
  },

  userLogin: (method: string) => {
    metrics.increment("auth.logins", 1, { method })
  },

  // Error metrics
  error: (type: string, component: string) => {
    metrics.increment("errors", 1, { type, component })
  },
}
