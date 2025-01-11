"use client"

import { useState } from 'react'
import { Poppins } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import { globalStyles } from '@/lib/theme'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import { ToastAction } from "@/components/ui/toast"
import { Toaster } from "@/components/ui/toaster"
import Link from 'next/link'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/eleves", label: "Élèves" },
    { href: "/parents", label: "Parents" },
    { href: "/classes", label: "Classes" },
    { href: "/paiements", label: "Paiements" },
  ]

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      </head>
      <body className={cn(
        poppins.variable,
        "font-sans antialiased bg-background text-foreground min-h-screen flex flex-col"
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link href="/" className="flex items-center space-x-2">
                    <span className="font-bold text-xl text-primary">École Islah</span>
                  </Link>
                </div>
                <nav className="hidden md:flex items-center space-x-6">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href} className="text-sm font-medium transition-colors hover:text-primary">
                      {item.label}
                    </Link>
                  ))}
                  <Button asChild>
                    <Link href="/inscription">Inscription</Link>
                  </Button>
                </nav>
                <div className="flex items-center space-x-4">
                  <ModeToggle />
                  <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon" className="md:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                      <nav className="flex flex-col space-y-4">
                        {navItems.map((item) => (
                          <Link key={item.href} href={item.href} className="text-sm font-medium transition-colors hover:text-primary" onClick={() => setIsOpen(false)}>
                            {item.label}
                          </Link>
                        ))}
                        <Button asChild onClick={() => setIsOpen(false)}>
                          <Link href="/inscription">Inscription</Link>
                        </Button>
                      </nav>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1">
            <div className="container mx-auto py-6 px-4 md:px-6 lg:px-8">
              {children}
            </div>
          </main>
          <footer className="border-t">
            <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between">
              <p className="text-sm text-muted-foreground">
                © 2023 École Islah. Tous droits réservés.
              </p>
              <nav className="flex items-center space-x-4 mt-4 md:mt-0">
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Politique de confidentialité
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Conditions d&apos;utilisation
                </a>
              </nav>
            </div>
          </footer>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

