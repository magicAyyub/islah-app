"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Moon, Sun, User } from "lucide-react"
import { useTheme } from "next-themes"
import { Settings, LogOut } from "lucide-react"
import { useState } from "react"
import { Menu } from "lucide-react"
import { navItems } from "./side-nav"
import { useRole, type UserRole } from "@/app/role-access"
import { Badge } from "@/components/ui/badge"

export function TopNav() {
  const { setTheme } = useTheme()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const { userRole, setUserRole } = useRole()

  // Role display names
  const roleDisplayNames: Record<UserRole, string> = {
    admin: "Administrator",
    teacher: "Teacher",
    agent: "Registration Agent",
    accountant: "Accountant",
  }

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole as UserRole))

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-self-center"> 
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Islah School</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
          <Badge variant="outline" className="hidden md:flex">
            {roleDisplayNames[userRole as UserRole]}
          </Badge>
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" alt="@user" />
                    <AvatarFallback>US</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">User Name</p>
                    <p className="text-xs leading-none text-muted-foreground">user@islahschool.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setUserRole("admin")}>
                  {userRole === "admin" && <span className="mr-2">✓</span>}
                  Administrator
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUserRole("teacher")}>
                  {userRole === "teacher" && <span className="mr-2">✓</span>}
                  Teacher
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUserRole("agent")}>
                  {userRole === "agent" && <span className="mr-2">✓</span>}
                  Registration Agent
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUserRole("accountant")}>
                  {userRole === "accountant" && <span className="mr-2">✓</span>}
                  Accountant
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-b">
          <div className="container py-2">
            <Badge variant="outline" className="mb-2 w-full justify-center">
              {roleDisplayNames[userRole as UserRole]}
            </Badge>
            <nav className="grid grid-cols-2 gap-2">
              {filteredNavItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

