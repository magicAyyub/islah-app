"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell } from "lucide-react"
import { NotificationItem } from "./notification-item"

interface Notification {
  id: string | number
  title: string
  time: string
  read: boolean
}

interface NotificationsMenuProps {
  notifications: Notification[]
  onViewAll?: () => void
  onNotificationClick?: (id: string | number) => void
}

export function NotificationsMenu({ notifications, onViewAll, onNotificationClick }: NotificationsMenuProps) {
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-[#6c63ff]">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-2 font-medium text-sm">Notifications</div>
        <DropdownMenuSeparator />
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              id={notification.id}
              title={notification.title}
              time={notification.time}
              read={notification.read}
              onClick={() => onNotificationClick && onNotificationClick(notification.id)}
            />
          ))
        ) : (
          <DropdownMenuItem disabled className="p-3 text-center text-gray-500">
            Aucune notification
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-2 cursor-pointer justify-center" onClick={onViewAll}>
          <span className="text-[#6c63ff] text-sm">Voir toutes les notifications</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

