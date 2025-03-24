"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { BookOpenCheck, Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simuler une authentification
    setTimeout(() => {
      setLoading(false)
      router.push("/")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0eeff] to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block mb-4 p-3 bg-white rounded-full shadow-md">
            <div className="w-20 h-20 rounded-full bg-[#6c63ff] flex items-center justify-center">
              <BookOpenCheck className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-[#2d2a54]">École Islah</h1>
          <p className="text-[#6c63ff]">Espace personnel</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#e0ddff]">
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-[#2d2a54] mb-6 text-center">Bienvenue</h2>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-[#2d2a54] text-base">
                  Identifiant
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="text"
                    placeholder="Votre email ou nom d'utilisateur"
                    className="pl-10 border-[#e0ddff] focus:border-[#6c63ff] focus:ring-[#6c63ff] h-12 text-base"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label htmlFor="password" className="text-[#2d2a54] text-base">
                    Mot de passe
                  </Label>
                  <Link href="/forgot-password" className="text-[#6c63ff] text-sm hover:underline">
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Votre mot de passe"
                    className="pl-10 pr-10 border-[#e0ddff] focus:border-[#6c63ff] focus:ring-[#6c63ff] h-12 text-base"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-gray-600">
                  Se souvenir de moi
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#6c63ff] hover:bg-[#5a52e0] transition-all duration-300 h-12 text-base font-medium"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Connexion en cours...
                  </div>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <span>© {new Date().getFullYear()} École Islah</span>
            <span>•</span>
            <Link href="#" className="text-[#6c63ff] hover:underline">
              Aide
            </Link>
            <span>•</span>
            <Link href="#" className="text-[#6c63ff] hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

