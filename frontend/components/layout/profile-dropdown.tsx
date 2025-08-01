"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, LogOut, ChevronDown, Shield, Bell, HelpCircle, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProfileDropdownProps {
  user: {
    id: number
    username: string
    first_name?: string
    last_name?: string
    email?: string
    role: string
    is_active: boolean
  }
  onLogout: () => void
}

export function ProfileDropdown({ user, onLogout }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const router = useRouter()

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: "bg-purple-100 text-purple-800 border-purple-200",
      teacher: "bg-blue-100 text-blue-800 border-blue-200",
      staff: "bg-green-100 text-green-800 border-green-200",
    }

    const labels = {
      admin: "Administrateur",
      teacher: "Enseignant",
      staff: "Personnel",
    }

    return (
      <Badge className={cn("text-xs font-medium border", variants[role as keyof typeof variants] || variants.staff)}>
        {labels[role as keyof typeof labels] || role}
      </Badge>
    )
  }

  const menuItems = [
    {
      icon: Shield,
      label: "Mon profil",
      description: "Gérer mes informations personnelles",
      onClick: () => {
        router.push("/profile")
        setIsOpen(false)
      },
    },
    {
      icon: Settings,
      label: "Paramètres",
      description: "Préférences et configuration",
      onClick: () => {
        router.push("/settings")
        setIsOpen(false)
      },
    },
    {
      icon: Bell,
      label: "Notifications",
      description: "Gérer les alertes et rappels",
      onClick: () => {
        router.push("/notifications")
        setIsOpen(false)
      },
    },
    {
      icon: HelpCircle,
      label: "Aide & Support",
      description: "Documentation et assistance",
      onClick: () => {
        router.push("/help")
        setIsOpen(false)
      },
    },
  ]

  return (
    <div className="relative">
      {/* Profile Button */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          variant="ghost"
          className={cn(
            "flex items-center gap-3 p-2 h-auto hover:bg-emerald-50 transition-all duration-200",
            isOpen && "bg-emerald-50",
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Avatar className="h-8 w-8 ring-2 ring-emerald-100">
            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-sm font-semibold">
              {user.first_name?.[0] || user.username[0].toUpperCase()}
              {user.last_name?.[0] || user.username[1]?.toUpperCase() || ""}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-gray-900">{user.first_name || user.username}</p>
            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
          </div>
          <ChevronDown
            className={cn("w-4 h-4 text-gray-400 transition-transform duration-200", isOpen && "rotate-180")}
          />
        </Button>
      </motion.div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

            {/* Dropdown Content */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 top-full mt-2 z-50"
            >
              <Card className="w-80 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                <CardContent className="p-0">
                  {/* User Info Header */}
                  <div className="p-6 border-b bg-gradient-to-r from-emerald-50 to-blue-50">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 ring-2 ring-white shadow-lg">
                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-semibold">
                          {user.first_name?.[0] || user.username[0].toUpperCase()}
                          {user.last_name?.[0] || user.username[1]?.toUpperCase() || ""}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{user.email || "Aucun email"}</p>
                        {getRoleBadge(user.role)}
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    {menuItems.map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ x: 4 }}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-3 p-3 h-auto hover:bg-emerald-50 transition-all duration-200"
                          onClick={item.onClick}
                        >
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <item.icon className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="text-left flex-1">
                            <p className="font-medium text-gray-900">{item.label}</p>
                            <p className="text-xs text-gray-500">{item.description}</p>
                          </div>
                        </Button>
                      </motion.div>
                    ))}

                    {/* Theme Toggle */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      whileHover={{ x: 4 }}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 p-3 h-auto hover:bg-emerald-50 transition-all duration-200"
                        onClick={() => setIsDarkMode(!isDarkMode)}
                      >
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {isDarkMode ? (
                            <Sun className="w-4 h-4 text-gray-600" />
                          ) : (
                            <Moon className="w-4 h-4 text-gray-600" />
                          )}
                        </div>
                        <div className="text-left flex-1">
                          <p className="font-medium text-gray-900">{isDarkMode ? "Mode clair" : "Mode sombre"}</p>
                          <p className="text-xs text-gray-500">Changer l'apparence</p>
                        </div>
                      </Button>
                    </motion.div>
                  </div>

                  {/* Logout Section */}
                  <div className="border-t p-2">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 }}
                      whileHover={{ x: 4 }}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 p-3 h-auto hover:bg-red-50 hover:text-red-700 transition-all duration-200"
                        onClick={() => {
                          onLogout()
                          setIsOpen(false)
                        }}
                      >
                        <div className="p-2 bg-red-100 rounded-lg">
                          <LogOut className="w-4 h-4 text-red-600" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="font-medium">Déconnexion</p>
                          <p className="text-xs text-gray-500">Quitter la session</p>
                        </div>
                      </Button>
                    </motion.div>
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-3 bg-gray-50 border-t">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>École Islah v1.0</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>En ligne</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
