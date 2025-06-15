"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { notificationManager, type Notification } from "@/lib/realtime/notifications"

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => Promise<void>
  refreshNotifications: () => Promise<void>
  isLoading: boolean
  error: string | null
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: async () => {},
  refreshNotifications: async () => {},
  isLoading: false,
  error: null,
})

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setNotifications([])
      setUnreadCount(0)
      setError(null)
      return
    }

    // Load initial notifications with error handling
    loadNotifications()
    loadUnreadCount()

    // Subscribe to real-time updates with error handling
    let unsubscribe: (() => void) | null = null

    try {
      unsubscribe = notificationManager.subscribe(user.id, (notification) => {
        setNotifications((prev) => [notification, ...prev])
        setUnreadCount((prev) => prev + 1)
      })
    } catch (err) {
      console.warn("Failed to subscribe to notifications:", err)
      setError("Real-time notifications unavailable")
    }

    return () => {
      if (unsubscribe) {
        try {
          unsubscribe()
        } catch (err) {
          console.warn("Error unsubscribing from notifications:", err)
        }
      }
    }
  }, [user])

  const loadNotifications = async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const { notifications } = await notificationManager.getNotifications(user.id, 1, 50)
      setNotifications(notifications)
    } catch (error) {
      console.error("Failed to load notifications:", error)
      setError("Failed to load notifications")
      setNotifications([])
    } finally {
      setIsLoading(false)
    }
  }

  const loadUnreadCount = async () => {
    if (!user) return

    try {
      const count = await notificationManager.getUnreadCount(user.id)
      setUnreadCount(count)
    } catch (error) {
      console.error("Failed to load unread count:", error)
      setUnreadCount(0)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await notificationManager.markAsRead(id)
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
      setError(null)
    } catch (error) {
      console.error("Failed to mark as read:", error)
      setError("Failed to update notification")
    }
  }

  const refreshNotifications = async () => {
    await Promise.all([loadNotifications(), loadUnreadCount()])
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        refreshNotifications,
        isLoading,
        error,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
