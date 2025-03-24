"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

interface NotificationItemProps {
  id: string | number
  title: string
  time: string
  read: boolean
  onClick?: () => void
}

export function NotificationItem({ id, title, time, read, onClick }: NotificationItemProps) {
  return (
    <DropdownMenuItem key={id} className="p-3 cursor-pointer" onClick={onClick}>
      <div className="flex items-start gap-2">
        <div className={`w-2 h-2 rounded-full mt-1.5 ${read ? "bg-gray-300" : "bg-[#6c63ff]"}`}></div>
        <div>
          <div className="font-medium text-sm">{title}</div>
          <div className="text-xs text-gray-500">{time}</div>
        </div>
      </div>
    </DropdownMenuItem>
  )
}

