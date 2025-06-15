/**
 * Real-time notification system using Supabase with error handling
 */

import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  data?: Record<string, any>
  created_at: string
}

class NotificationManager {
  private supabase = createClient()
  private listeners: Map<string, Function[]> = new Map()

  /**
   * Subscribe to real-time notifications for a user with error handling
   */
  subscribe(userId: string, callback: (notification: Notification) => void) {
    try {
      const channel = this.supabase
        .channel(`notifications:${userId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            try {
              const notification = payload.new as Notification
              callback(notification)

              // Show toast notification
              toast({
                title: notification.title,
                description: notification.message,
                variant: notification.type === "error" ? "destructive" : "default",
              })
            } catch (err) {
              console.warn("Error processing notification:", err)
            }
          },
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            console.log("Successfully subscribed to notifications")
          } else if (status === "CHANNEL_ERROR") {
            console.warn("Failed to subscribe to notifications channel")
          }
        })

      // Store cleanup function
      const listeners = this.listeners.get(userId) || []
      listeners.push(() => {
        try {
          this.supabase.removeChannel(channel)
        } catch (err) {
          console.warn("Error removing channel:", err)
        }
      })
      this.listeners.set(userId, listeners)

      return () => this.unsubscribe(userId)
    } catch (error) {
      console.error("Failed to subscribe to notifications:", error)
      throw error
    }
  }

  /**
   * Unsubscribe from notifications
   */
  unsubscribe(userId: string) {
    const listeners = this.listeners.get(userId) || []
    listeners.forEach((cleanup) => {
      try {
        cleanup()
      } catch (err) {
        console.warn("Error during cleanup:", err)
      }
    })
    this.listeners.delete(userId)
  }

  /**
   * Send notification to user with error handling
   */
  async send(notification: Omit<Notification, "id" | "created_at" | "read">) {
    try {
      const { error } = await this.supabase.from("notifications").insert({
        ...notification,
        read: false,
      })

      if (error) {
        // Check if it's a table doesn't exist error
        if (error.code === "42P01") {
          console.warn("Notifications table doesn't exist. Please run database migrations.")
          return
        }
        throw error
      }
    } catch (error) {
      console.error("Failed to send notification:", error)
      throw error
    }
  }

  /**
   * Mark notification as read with error handling
   */
  async markAsRead(notificationId: string) {
    try {
      const { error } = await this.supabase.from("notifications").update({ read: true }).eq("id", notificationId)

      if (error) {
        if (error.code === "42P01") {
          console.warn("Notifications table doesn't exist. Please run database migrations.")
          return
        }
        throw error
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
      throw error
    }
  }

  /**
   * Get unread notifications count with error handling
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await this.supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("read", false)

      if (error) {
        if (error.code === "42P01") {
          console.warn("Notifications table doesn't exist. Please run database migrations.")
          return 0
        }
        throw error
      }

      return count || 0
    } catch (error) {
      console.error("Failed to get unread count:", error)
      return 0
    }
  }

  /**
   * Get user notifications with pagination and error handling
   */
  async getNotifications(userId: string, page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit

      const { data, error, count } = await this.supabase
        .from("notifications")
        .select("*", { count: "exact" })
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        if (error.code === "42P01") {
          console.warn("Notifications table doesn't exist. Please run database migrations.")
          return {
            notifications: [],
            total: 0,
            hasMore: false,
          }
        }
        throw error
      }

      return {
        notifications: data as Notification[],
        total: count || 0,
        hasMore: (count || 0) > offset + limit,
      }
    } catch (error) {
      console.error("Failed to get notifications:", error)
      throw error
    }
  }
}

export const notificationManager = new NotificationManager()
