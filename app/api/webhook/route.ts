import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const WEBHOOK_SECRET = process.env.MASCHAIN_WEBHOOK_SECRET || "default-webhook-secret"

export async function POST(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  try {
    // Get raw body and signature
    const rawBody = await request.text()
    const signature = request.headers.get("x-maschain-signature") || ""
    const userAgent = request.headers.get("user-agent") || ""

    console.log("Webhook received", {
      requestId,
      signature: signature.substring(0, 20) + "...",
      userAgent,
      bodyLength: rawBody.length,
    })

    // Simple signature verification (basic implementation)
    const isValidSignature = signature && signature.length > 0

    if (!isValidSignature) {
      console.warn("Webhook verification failed - no signature")
      return NextResponse.json({ error: "Webhook verification failed" }, { status: 401 })
    }

    // Parse payload
    let payload
    try {
      payload = JSON.parse(rawBody)
    } catch (error) {
      console.error("Invalid JSON payload", error)
      return NextResponse.json({ error: "Invalid payload format" }, { status: 400 })
    }

    // Validate required fields
    if (!payload.event_type) {
      return NextResponse.json({ error: "Missing event_type" }, { status: 400 })
    }

    const supabase = createClient()

    // Log webhook event
    const { data: webhookLog, error: logError } = await supabase
      .from("webhook_logs")
      .insert({
        event_type: payload.event_type,
        transaction_hash: payload.transaction_hash || null,
        payload: payload.data || {},
        processed: false,
        signature_verified: true,
        user_agent: userAgent,
      })
      .select()
      .single()

    if (logError) {
      console.error("Failed to log webhook", logError)
      return NextResponse.json({ error: "Failed to log webhook" }, { status: 500 })
    }

    // Process webhook based on event type
    let processed = false
    let errorMessage: string | undefined

    try {
      processed = await processWebhookEvent(payload, supabase)
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "Unknown error"
      console.error("Webhook processing failed", error)
    }

    // Update webhook log
    await supabase
      .from("webhook_logs")
      .update({
        processed,
        error_message: errorMessage,
        processed_at: processed ? new Date().toISOString() : null,
      })
      .eq("id", webhookLog.id)

    console.log("Webhook processed", {
      requestId,
      eventType: payload.event_type,
      processed,
      webhookLogId: webhookLog.id,
    })

    return NextResponse.json({
      success: true,
      processed,
      webhook_id: webhookLog.id,
    })
  } catch (error) {
    console.error("Webhook handler error", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function processWebhookEvent(payload: any, supabase: any): Promise<boolean> {
  const { event_type, transaction_hash, data } = payload

  switch (event_type) {
    case "token_minted":
      return await handleTokenMinted(transaction_hash, data, supabase)

    case "kyc_completed":
      return await handleKYCCompleted(data, supabase)

    case "transaction_confirmed":
      return await handleTransactionConfirmed(transaction_hash, data, supabase)

    case "wallet_created":
      return await handleWalletCreated(data, supabase)

    default:
      console.warn("Unknown webhook event type", event_type)
      return true // Consider unknown events as processed
  }
}

async function handleTokenMinted(transactionHash: string, data: any, supabase: any): Promise<boolean> {
  try {
    if (!transactionHash) return false

    // Update token status
    const { error } = await supabase
      .from("tokens")
      .update({
        status: "confirmed",
        confirmed_at: new Date().toISOString(),
      })
      .eq("tx_hash", transactionHash)

    if (error) throw error

    console.log("Token minted processed", { transactionHash })
    return true
  } catch (error) {
    console.error("Failed to process token minted", { error, transactionHash })
    return false
  }
}

async function handleKYCCompleted(data: any, supabase: any): Promise<boolean> {
  try {
    const { wallet_address, risk_score, verified } = data

    if (!wallet_address) return false

    // Update KYC status
    const { error } = await supabase
      .from("kyc_logs")
      .update({
        verified: verified || false,
        risk_score: risk_score || 0,
        verified_at: new Date().toISOString(),
      })
      .eq("wallet_address", wallet_address)

    if (error) throw error

    console.log("KYC completed processed", { wallet_address, verified })
    return true
  } catch (error) {
    console.error("Failed to process KYC completed", { error, data })
    return false
  }
}

async function handleTransactionConfirmed(transactionHash: string, data: any, supabase: any): Promise<boolean> {
  try {
    if (!transactionHash) return false

    // Log transaction confirmation
    const { error } = await supabase.from("transaction_logs").insert({
      transaction_hash: transactionHash,
      status: "confirmed",
      block_number: data?.block_number || null,
      gas_used: data?.gas_used || null,
      confirmed_at: new Date().toISOString(),
    })

    if (error) throw error

    console.log("Transaction confirmed processed", { transactionHash })
    return true
  } catch (error) {
    console.error("Failed to process transaction confirmed", { error, transactionHash })
    return false
  }
}

async function handleWalletCreated(data: any, supabase: any): Promise<boolean> {
  try {
    const { wallet_address, user_id, wallet_type } = data

    if (!wallet_address || !user_id) return false

    // Log wallet creation
    const { error } = await supabase.from("wallet_logs").insert({
      user_id,
      wallet_address,
      wallet_type: wallet_type || "standard",
      created_at: new Date().toISOString(),
    })

    if (error) throw error

    console.log("Wallet created processed", { wallet_address, user_id })
    return true
  } catch (error) {
    console.error("Failed to process wallet created", { error, data })
    return false
  }
}
