import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { masChainSmartContracts } from "@/lib/maschain/smart-contracts"
import { validateRequest, schemas } from "@/lib/security/input-validation"
import { z } from "zod"

const createProjectSchema = z.object({
  project_name: schemas.nonEmptyString.max(255),
  description: z.string().max(1000).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")

    // Get projects from MasChain API
    try {
      const masChainResponse = await masChainSmartContracts.listProjects(page)

      if (!masChainResponse.result) {
        return NextResponse.json({ error: "Failed to fetch projects from MasChain" }, { status: 400 })
      }

      // Store/sync projects in local database
      for (const project of masChainResponse.result) {
        await supabase.from("smart_contract_projects").upsert(
          {
            tenant_id: user.id,
            project_name: project.project_name,
            slug: project.slug,
            description: project.description,
            version: project.version,
            last_deployed_at: project.last_deployed_at,
            created_at: project.created_at,
            updated_at: project.updated_at,
          },
          {
            onConflict: "tenant_id,slug",
          },
        )
      }

      return NextResponse.json({
        result: masChainResponse.result,
        pagination: masChainResponse.pagination,
      })
    } catch (masChainError) {
      console.error("MasChain API error:", masChainError)

      // Fallback to local database if MasChain API fails
      const { data: projects, error } = await supabase
        .from("smart_contract_projects")
        .select("*")
        .eq("tenant_id", user.id)
        .order("created_at", { ascending: false })
        .range((page - 1) * 10, page * 10 - 1)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      const { count } = await supabase
        .from("smart_contract_projects")
        .select("*", { count: "exact", head: true })
        .eq("tenant_id", user.id)

      return NextResponse.json({
        result: projects,
        pagination: {
          current_page: page,
          per_page: 10,
          total: count || 0,
          last_page: Math.ceil((count || 0) / 10),
        },
      })
    }
  } catch (error) {
    console.error("Smart contract projects fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = validateRequest(createProjectSchema, body)

    console.log("Creating project with data:", validatedData)

    // Create project on MasChain
    try {
      const masChainResponse = await masChainSmartContracts.createProject(validatedData)

      console.log("MasChain response:", masChainResponse)

      if (!masChainResponse.result) {
        console.error("MasChain API error - no result:", masChainResponse)
        return NextResponse.json(
          {
            error: "Failed to create project on MasChain",
            details: masChainResponse,
          },
          { status: 400 },
        )
      }

      // Store in local database
      const { data: project, error } = await supabase
        .from("smart_contract_projects")
        .upsert(
          {
            tenant_id: user.id,
            project_name: masChainResponse.result.project_name,
            slug: masChainResponse.result.slug,
            description: masChainResponse.result.description,
            version: masChainResponse.result.version,
            created_at: masChainResponse.result.created_at,
            updated_at: masChainResponse.result.updated_at,
          },
          {
            onConflict: "tenant_id,slug",
          },
        )
        .select()
        .single()

      if (error) {
        console.error("Database error:", error)
        // Don't fail if database insert fails, return MasChain result
        return NextResponse.json({
          success: true,
          result: masChainResponse.result,
        })
      }

      return NextResponse.json({
        success: true,
        result: project || masChainResponse.result,
      })
    } catch (masChainError: any) {
      console.error("MasChain API error:", masChainError)

      // Return detailed error information
      return NextResponse.json(
        {
          error: "Failed to create project on MasChain",
          details: masChainError.message || masChainError,
          stack: process.env.NODE_ENV === "development" ? masChainError.stack : undefined,
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("Smart contract project creation error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
