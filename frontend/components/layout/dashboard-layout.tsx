"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CreditCard,
  BookOpen,
  UserCheck,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  School,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"
import { ProfileDropdown } from "@/components/layout/profile-dropdown"
import { cn } from "@/lib/utils"
import { IslamicHeader } from "@/components/layout/islamic-header"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  { name: "Élèves", href: "/students", icon: Users },
  { name: "Classes", href: "/classes", icon: GraduationCap },
  { name: "Notes", href: "/academics", icon: BookOpen },
  { name: "Présences", href: "/attendance", icon: UserCheck },
  { name: "Paiements", href: "/payments", icon: CreditCard },
  { name: "Rapports", href: "/reports", icon: BarChart3 },
  { name: "Paramètres", href: "/settings", icon: Settings },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, router, isLoading])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <IslamicHeader />
      <div className="flex">
        {/* Mobile sidebar backdrop */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.div
          initial={false}
          animate={
            isMobile
              ? {
                  x: sidebarOpen ? 0 : "-100%",
                }
              : {}
          }
          className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:z-30"
        >
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center gap-3 px-6 border-b">
              <div className="flex items-center justify-center w-10 h-10 bg-emerald-600 rounded-lg">
                <School className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">École Islah</h1>
                <p className="text-xs text-gray-500">Gestion scolaire</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <motion.div key={item.name} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 transition-all duration-200",
                        isActive
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
                          : "hover:bg-emerald-50 hover:text-emerald-700",
                      )}
                      onClick={() => {
                        router.push(item.href)
                        setSidebarOpen(false)
                      }}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Button>
                  </motion.div>
                )
              })}
            </nav>

            {/* User section */}
            <div className="border-t p-4">
              <div className="flex items-center gap-3 mb-4">
                <Avatar>
                  <AvatarFallback className="bg-emerald-600 text-white">
                    {user.first_name?.[0] || user.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{user.first_name || user.username}</p>
                  <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full justify-start gap-3 hover:bg-red-50 hover:text-red-700 hover:border-red-200 bg-transparent"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
          {/* Top bar */}
          <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white/80 backdrop-blur-sm px-6">
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>

            {/* Page title - dynamically generated from pathname */}
            <div className="flex-1">

            </div>

            {/* Profile Dropdown */}
            <ProfileDropdown user={user} onLogout={handleLogout} />

            {/* Mobile close button */}
            {sidebarOpen && (
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>

          {/* Page content */}
          <main className="flex-1 p-8 overflow-auto">
            <div className="max-w-6xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                {children}
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
