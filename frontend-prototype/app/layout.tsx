import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from './providers/AuthProvider'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "École Islah - Système de Gestion",
  description: "Système de gestion intégré pour l'éducation et le suivi des élèves",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
        lang="fr"
        className="light"
        style={{ scrollBehavior: "smooth", WebkitFontSmoothing: "antialiased",colorScheme: "light" }}
    >
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

