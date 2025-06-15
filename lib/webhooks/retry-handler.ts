/**
 * Webhook retry mechanism with exponential backoff
 */

import { createClient } from "@/lib/supabase/server"

export interface RetryConfig {
  maxRetries: number
  baseDelay: number // Base delay in milliseconds
  maxDelay: number // Maximum delay in milliseconds
  backoffMultiplier: number
}

export interface WebhookRetryJob {
  id: string
  webhook_log_id: string
  retry_count: number
  next_retry_at: string
  payload: Record<string, any>
  error_message?: string
  created_at: string
}

class WebhookRetryHandler {
  private config: RetryConfig = {
    maxRetries: 5,
    baseDelay: 1000, // 1 second
    maxDelay: 300000, // 5 minutes
    backoffMultiplier: 2,
  }

  /**
   * Schedule webhook for retry
   */
  async scheduleRetry(
    webhookLogId: string,
    payload: Record<string, any>,
    retryCount = 0,
    errorMessage?: string,
  ): Promise<void> {
    if (retryCount >= this.config.maxRetries) {
      console.log(`Max retries reached for webhook ${webhookLogId}`)
      return
    }

    const delay = this.calculateDelay(retryCount)
    const nextRetryAt = new Date(Date.now() + delay)

    const supabase = createClient()

    const { error } = await supabase.from("webhook_retry_jobs").insert({
      webhook_log_id: webhookLogId,
      retry_count: retryCount,
      next_retry_at: nextRetryAt.toISOString(),
      payload,
      error_message: errorMessage,
    })

    if (error) {
      console.error("Failed to schedule webhook retry:", error)
    }
  }

  /**
   * Process pending retries
   */
  async processPendingRetries(): Promise<void> {
    const supabase = createClient()

    const { data: jobs, error } = await supabase
      .from("webhook_retry_jobs")
      .select("*")
      .lte("next_retry_at", new Date().toISOString())
      .order("created_at", { ascending: true })
      .limit(10)

    if (error) {
      console.error("Failed to fetch retry jobs:", error)
      return
    }

    for (const job of jobs || []) {
      await this.processRetryJob(job)
    }
  }

  /**
   * Process individual retry job
   */
  private async processRetryJob(job: WebhookRetryJob): Promise<void> {
    try {
      // Attempt to process the webhook
      const success = await this.processWebhookPayload(job.payload)

      const supabase = createClient()

      if (success) {
        // Mark webhook as processed and remove retry job
        await Promise.all([
          supabase.from("webhook_logs").update({ processed: true }).eq("id", job.webhook_log_id),
          supabase.from("webhook_retry_jobs").delete().eq("id", job.id),
        ])
      } else {
        // Schedule next retry or mark as failed
        await supabase.from("webhook_retry_jobs").delete().eq("id", job.id)

        if (job.retry_count < this.config.maxRetries - 1) {
          await this.scheduleRetry(job.webhook_log_id, job.payload, job.retry_count + 1, "Retry attempt failed")
        } else {
          // Mark as permanently failed
          await supabase
            .from("webhook_logs")
            .update({
              processed: false,
              error_message: "Max retries exceeded",
            })
            .eq("id", job.webhook_log_id)
        }
      }
    } catch (error) {
      console.error(`Error processing retry job ${job.id}:`, error)
    }
  }

  /**
   * Process webhook payload (implement your business logic here)
   */
  private async processWebhookPayload(payload: Record<string, any>): Promise<boolean> {
    try {
      const supabase = createClient()

      switch (payload.event_type) {
        case "token_minted":
          await supabase.from("tokens").update({ status: "confirmed" }).eq("tx_hash", payload.transaction_hash)
          break

        case "kyc_completed":
          await supabase.from("kyc_logs").update({ verified: true }).eq("wallet_address", payload.data.wallet_address)
          break

        case "transaction_confirmed":
          // Handle transaction confirmation
          break

        default:
          console.log("Unknown webhook event type:", payload.event_type)
      }

      return true
    } catch (error) {
      console.error("Webhook processing error:", error)
      return false
    }
  }

  /**
   * Calculate retry delay with exponential backoff
   */
  private calculateDelay(retryCount: number): number {
    const delay = this.config.baseDelay * Math.pow(this.config.backoffMultiplier, retryCount)
    return Math.min(delay, this.config.maxDelay)
  }

  /**
   * Get retry statistics
   */
  async getRetryStats(): Promise<{
    pending: number
    failed: number
    totalRetries: number
  }> {
    const supabase = createClient()

    const [pendingResult, failedResult, totalResult] = await Promise.all([
      supabase.from("webhook_retry_jobs").select("*", { count: "exact", head: true }),
      supabase
        .from("webhook_logs")
        .select("*", { count: "exact", head: true })
        .eq("processed", false)
        .not("error_message", "is", null),
      supabase.from("webhook_retry_jobs").select("retry_count"),
    ])

    const totalRetries = (totalResult.data || []).reduce((sum, job) => sum + job.retry_count, 0)

    return {
      pending: pendingResult.count || 0,
      failed: failedResult.count || 0,
      totalRetries,
    }
  }
}

export const webhookRetryHandler = new WebhookRetryHandler()

// Auto-process retries every minute
if (typeof window === "undefined") {
  setInterval(() => {
    webhookRetryHandler.processPendingRetries()
  }, 60000)
}
