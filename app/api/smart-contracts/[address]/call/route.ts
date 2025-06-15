import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { MaschainSmartContractClient } from "@/lib/maschain/smart-contracts"
import { logAuditEvent } from "@/lib/actions/audit-actions"

export async function POST(request: NextRequest, { params }: { params: { address: string } }) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { address } = params
    const body = await request.json()
    const { method_name, params: methodParams, from, contract_abi } = body

    if (!method_name || !from) {
      return NextResponse.json({ error: "Missing required fields: method_name, from" }, { status: 400 })
    }

    const client = new MaschainSmartContractClient()

    const callData = {
      from,
      method_name,
      params: methodParams || {},
      ...(contract_abi && { contract_abi }),
    }

    const response = await client.callContract(address, callData)

    // Log the contract interaction
    await logAuditEvent({
      user_id: user.id,
      action: "smart_contract_call",
      resource_type: "smart_contract",
      resource_id: address,
      details: {
        method_name,
        params: methodParams,
        from,
        success: response.success,
      },
    })

    // Store interaction in database
    await supabase.from("contract_interactions").insert({
      contract_address: address,
      user_id: user.id,
      interaction_type: "call",
      method_name,
      parameters: methodParams || {},
      from_address: from,
      success: response.success,
      result: response.success ? response.data?.result : null,
      error_message: response.success ? null : response.error,
      created_at: new Date().toISOString(),
    })

    if (!response.success) {
      return NextResponse.json({ error: response.error }, { status: 500 })
    }

    return NextResponse.json(response.data)
  } catch (error) {
    console.error("Error calling contract method:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
