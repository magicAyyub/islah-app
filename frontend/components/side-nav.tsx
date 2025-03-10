"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  CreditCard,
  FileText,
  Home,
  Settings,
  LogOut,
} from "lucide-react"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRole, type UserRole } from "@/app/role-access"

export const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
    roles: ["admin", "teacher", "agent", "accountant"],
  },
  {
    title: "Students",
    href: "/students",
    icon: Users,
    roles: ["admin", "teacher", "agent"],
  },
  {
    title: "Classes",
    href: "/classes",
    icon: GraduationCap,
    roles: ["admin", "teacher", "agent"],
  },
  {
    title: "Subjects",
    href: "/subjects",
    icon: BookOpen,
    roles: ["admin", "teacher"],
  },
  {
    title: "Schedule",
    href: "/schedule",
    icon: Calendar,
    roles: ["admin", "teacher", "agent"],
  },
  {
    title: "Attendance",
    href: "/attendance",
    icon: Clock,
    roles: ["admin", "teacher"],
  },
  {
    title: "Payments",
    href: "/payments",
    icon: CreditCard,
    roles: ["admin", "accountant", "agent"],
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
    roles: ["admin", "accountant"],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["admin"],
  },
]

export function SideNav() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { userRole } = useRole()

  useEffect(() => {
    setCollapsed(isMobile)
  }, [isMobile])

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole as UserRole))

  return (
    <div
      className={cn(
        "group flex flex-col gap-4 py-2  h-screen overflow-y-auto sticky top-0 transition-all duration-300",
        collapsed ? "w-16" : "w-60",
      )}
      data-collapsed={collapsed}
    >
      <div className="px-2 py-2 sticky top-0 bg-background z-10">
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex mb-2 w-full justify-end cursor-pointer"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {filteredNavItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <item.icon className="h-4 w-4" />
            {!collapsed && <span>{item.title}</span>}
          </Link>
        ))}
      </nav>
      <div className="mt-auto px-2 sticky bottom-0 py-4 bg-background">
        <Button variant="outline" className="w-full justify-center md:justify-start" asChild>
          <Link href="/logout">
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Logout</span>}
          </Link>
        </Button>
      </div>
    </div>
  )
}

// Add this hook to detect mobile screens
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    window.addEventListener("resize", listener)
    return () => window.removeEventListener("resize", listener)
  }, [matches, query])

  return matches
}

