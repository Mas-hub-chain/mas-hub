/**
 * Database performance optimization utilities
 */

import { createClient } from "@/lib/supabase/server"

/**
 * Optimized query builder for common patterns
 */
export class QueryBuilder {
  private supabase = createClient()

  /**
   * Get paginated results with optimized queries
   */
  async getPaginated<T>(
    table: string,
    options: {
      page?: number
      limit?: number
      orderBy?: string
      orderDirection?: "asc" | "desc"
      filters?: Record<string, any>
      select?: string
    } = {},
  ) {
    const {
      page = 1,
      limit = 20,
      orderBy = "created_at",
      orderDirection = "desc",
      filters = {},
      select = "*",
    } = options

    let query = this.supabase.from(table).select(select, { count: "exact" })

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value)
      }
    })

    // Apply ordering and pagination
    query = query.order(orderBy, { ascending: orderDirection === "asc" }).range((page - 1) * limit, page * limit - 1)

    const { data, error, count } = await query

    if (error) {
      throw new Error(`Database query failed: ${error.message}`)
    }

    return {
      data: data as T[],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasNext: page * limit < (count || 0),
        hasPrev: page > 1,
      },
    }
  }

  /**
   * Batch insert with conflict resolution
   */
  async batchInsert<T>(
    table: string,
    records: T[],
    options: {
      onConflict?: string
      batchSize?: number
    } = {},
  ) {
    const { onConflict, batchSize = 100 } = options
    const results = []

    // Process in batches to avoid overwhelming the database
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize)

      let query = this.supabase.from(table).insert(batch)

      if (onConflict) {
        query = query.onConflict(onConflict)
      }

      const { data, error } = await query.select()

      if (error) {
        throw new Error(`Batch insert failed: ${error.message}`)
      }

      results.push(...(data || []))
    }

    return results
  }

  /**
   * Optimized search with full-text search
   */
  async search<T>(
    table: string,
    searchTerm: string,
    searchColumns: string[],
    options: {
      limit?: number
      filters?: Record<string, any>
    } = {},
  ) {
    const { limit = 50, filters = {} } = options

    let query = this.supabase.from(table).select("*")

    // Apply filters first
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value)
      }
    })

    // Apply text search across multiple columns
    const searchConditions = searchColumns.map((col) => `${col}.ilike.%${searchTerm}%`).join(",")

    query = query.or(searchConditions).limit(limit)

    const { data, error } = await query

    if (error) {
      throw new Error(`Search failed: ${error.message}`)
    }

    return data as T[]
  }
}

/**
 * Connection pool management
 */
export class ConnectionManager {
  private static instance: ConnectionManager
  private connections = new Map<string, any>()

  static getInstance(): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager()
    }
    return ConnectionManager.instance
  }

  getConnection(key: string) {
    if (!this.connections.has(key)) {
      this.connections.set(key, createClient())
    }
    return this.connections.get(key)
  }

  closeConnection(key: string) {
    const connection = this.connections.get(key)
    if (connection) {
      // Supabase client doesn't need explicit closing
      this.connections.delete(key)
    }
  }

  closeAllConnections() {
    this.connections.clear()
  }
}

export const queryBuilder = new QueryBuilder()
export const connectionManager = ConnectionManager.getInstance()
