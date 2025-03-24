"use client"

import type React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, LogOut, Settings, User } from "lucide-react"
import Link from "next/link"

interface UserNavProps {
  user: {
    name: string
    role: string
    avatar?: string
    initials: string
    avatarColor?: string
  }
  menuItems?: {
    icon: React.ReactNode
    label: string
    href?: string
    onClick?: () => void
    color?: string
  }[]
  onLogout: () => void
}

export function UserNav({ user, menuItems = [], onLogout }: UserNavProps) {
  const avatarColor = user.avatarColor || "bg-[#e6f4ea] text-[#34a853]"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className={avatarColor}>{user.initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-sm">
            <span className="font-medium">{user.name}</span>
            <span className="text-xs text-gray-500">{user.role}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* Default menu items */}
        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Mon profil</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Paramètres</span>
        </DropdownMenuItem>

        {/* Custom menu items */}
        {menuItems.map((item, index) =>
          item.href ? (
            <DropdownMenuItem key={index} className="cursor-pointer">
              <Link href={item.href} className="flex items-center w-full">
                <div className="mr-2 h-4 w-4">{item.icon}</div>
                <span className={item.color}>{item.label}</span>
              </Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem key={index} className="cursor-pointer" onClick={item.onClick}>
              <div className="mr-2 h-4 w-4">{item.icon}</div>
              <span className={item.color}>{item.label}</span>
            </DropdownMenuItem>
          ),
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-red-600" onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

