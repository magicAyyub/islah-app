import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SideNav } from "@/components/side-nav"
import { TopNav } from "@/components/top-nav"
import { RoleProvider } from "./role-access"
import { Toaster } from "@/components/ui/sonner"

export const metadata = {
  title: "Islah School Management System",
  description: "An internal tool for Islamic school management",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <RoleProvider>
            <div className="relative flex min-h-screen flex-col">
              <TopNav />
              <div className="flex flex-1 shrink-0">
                <aside className="hidden md:flex flex-shrink-0 border-r bg-background">
                  <div className="sticky top-0 h-[calc(100vh-4rem)] overflow-y-auto py-6">
                    <SideNav />
                  </div>
                </aside>
                <main className="flex-1 overflow-x-hidden px-4 py-6 md:px-6">{children}</main>
                <Toaster />
              </div>
            </div>
          </RoleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

