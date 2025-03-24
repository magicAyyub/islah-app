"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpenCheck, Mail, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simuler l'envoi d'un email de réinitialisation
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
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
          <p className="text-[#6c63ff]">Récupération de mot de passe</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#e0ddff]">
          <div className="p-8">
            <div className="flex items-center mb-6">
              <Link href="/login" className="text-[#6c63ff] hover:text-[#5a52e0] flex items-center">
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Retour à la connexion</span>
              </Link>
            </div>

            <h2 className="text-2xl font-semibold text-[#2d2a54] mb-4">Mot de passe oublié ?</h2>
            <p className="text-gray-600 mb-6">
              Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success ? (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="font-medium">Email envoyé avec succès !</span>
                </div>
                <p className="text-green-600 text-sm">
                  Veuillez vérifier votre boîte de réception et suivre les instructions pour réinitialiser votre mot de
                  passe.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-[#2d2a54] text-base">
                    Adresse email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Entrez votre adresse email"
                      className="pl-10 border-[#e0ddff] focus:border-[#6c63ff] focus:ring-[#6c63ff] h-12 text-base"
                      required
                    />
                  </div>
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
                      Envoi en cours...
                    </div>
                  ) : (
                    "Envoyer le lien de réinitialisation"
                  )}
                </Button>
              </form>
            )}
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

