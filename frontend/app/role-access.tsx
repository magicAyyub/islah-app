"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"

// Define user roles
export type UserRole = "admin" | "teacher" | "agent" | "accountant"

// Define page access permissions
const pagePermissions: Record<string, UserRole[]> = {
  "/": ["admin", "teacher", "agent", "accountant"],
  "/students": ["admin", "teacher", "agent"],
  "/students/new": ["admin", "agent"],
  "/classes": ["admin", "teacher", "agent"],
  "/classes/new": ["admin"],
  "/subjects": ["admin", "teacher"],
  "/subjects/new": ["admin"],
  "/schedule": ["admin", "teacher", "agent"],
  "/schedule/new": ["admin"],
  "/attendance": ["admin", "teacher"],
  "/attendance/calendar-view": ["admin", "teacher"],
  "/payments": ["admin", "accountant", "agent"],
  "/payments/new": ["admin", "accountant"],
  "/reports": ["admin", "accountant"],
  "/settings": ["admin"],
}

// Create context
type RoleContextType = {
  userRole: UserRole
  setUserRole: (role: UserRole) => void
  hasAccess: (path: string) => boolean
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

// Provider component
export function RoleProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>("admin")
  const router = useRouter()
  const pathname = usePathname()

  // Check if user has access to current page
  const hasAccess = (path: string): boolean => {
    // Find the most specific path that matches
    const matchingPaths = Object.keys(pagePermissions)
      .filter((permPath) => path.startsWith(permPath))
      .sort((a, b) => b.length - a.length) // Sort by length descending to get most specific match first

    if (matchingPaths.length === 0) return true // If no matching path, allow access

    const matchingPath = matchingPaths[0]
    return pagePermissions[matchingPath].includes(userRole)
  }

  // Redirect if user doesn't have access to current page
  useEffect(() => {
    if (pathname && !hasAccess(pathname)) {
      router.push("/")
    }
  }, [pathname, userRole, router])

  return <RoleContext.Provider value={{ userRole, setUserRole, hasAccess }}>{children}</RoleContext.Provider>
}

// Hook to use the role context
export function useRole() {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider")
  }
  return context
}

