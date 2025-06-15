"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotifications } from "./notification-provider"
import { formatDistanceToNow } from "date-fns"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, refreshNotifications, isLoading, error } = useNotifications()

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id)
    } catch (err) {
      console.error("Failed to mark notification as read:", err)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          Notifications
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {error && (
          <div className="p-2">
            <Alert variant="destructive">
              <AlertDescription className="text-sm">
                {error}
                <Button variant="ghost" size="sm" onClick={refreshNotifications} className="ml-2 h-6 px-2">
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )}

        <ScrollArea className="h-[300px]">
          {notifications.length === 0 && !isLoading && !error ? (
            <div className="p-4 text-center text-sm text-muted-foreground">No notifications yet</div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start p-3 cursor-pointer"
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center justify-center" onClick={refreshNotifications}>
              Refresh Notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
