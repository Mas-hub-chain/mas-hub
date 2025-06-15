import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { MaschainSmartContractClient } from "@/lib/maschain/smart-contracts"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const versionFilter = searchParams.get("filter-version")
    const deploymentIdFilter = searchParams.get("filter-deployment_id")

    const client = new MaschainSmartContractClient()

    const params: any = {}
    if (versionFilter) params["filter-version"] = versionFilter
    if (deploymentIdFilter) params["filter-deployment_id"] = deploymentIdFilter

    const response = await client.listDeployedContracts(params)

    if (!response.success) {
      return NextResponse.json({ error: response.error }, { status: 500 })
    }

    // Store deployed contracts in our database for tracking
    if (response.data?.result) {
      for (const contract of response.data.result) {
        await supabase.from("deployed_contracts").upsert(
          {
            contract_address: contract.contract_address,
            contract_name: contract.contract_name,
            project_name: contract.project_name,
            version: contract.version,
            deployed_at: contract.deployed_at,
            deployment_params: contract.deployment_params,
            user_id: user.id,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "contract_address",
          },
        )
      }
    }

    return NextResponse.json(response.data)
  } catch (error) {
    console.error("Error fetching deployed contracts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
