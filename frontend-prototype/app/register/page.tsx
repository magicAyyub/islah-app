"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpenCheck, User, AlertCircle, CheckCircle, Eye, EyeOff, Lock, ArrowLeft } from "lucide-react"
import { register } from '../lib/api'
import { useAuth } from '../lib/auth'

export default function RegisterPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: '',
    role: 'staff' as const,
  });

  // Protect route - only allow admin access
  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'admin') {
      router.push('/'); // Redirect non-admin users to home
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await register(formData);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  // Don't render anything while checking authentication
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0eeff] to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-block mb-4 p-3 bg-white rounded-full shadow-md">
            <div className="w-20 h-20 rounded-full bg-[#6c63ff] flex items-center justify-center">
              <BookOpenCheck className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-[#2d2a54]">École Islah</h1>
          <p className="text-[#6c63ff]">Créer un nouveau compte</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#e0ddff]">
          <div className="p-8">
            <div className="flex items-center mb-6">
              <Link href="/" className="text-[#6c63ff] hover:text-[#5a52e0] flex items-center">
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Retour au tableau de bord</span>
              </Link>
            </div>

            {success ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold text-[#2d2a54] mb-4">Compte créé avec succès !</h2>
                <p className="text-gray-600 mb-6">
                  Le nouveau compte utilisateur a été créé avec succès.
                </p>
                <Button
                  onClick={() => {
                    setSuccess(false);
                    setFormData({
                      username: '',
                      password: '',
                      full_name: '',
                      role: 'staff',
                    });
                  }}
                  className="bg-[#6c63ff] hover:bg-[#5a52e0] transition-all duration-300"
                >
                  Créer un autre compte
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-semibold text-[#2d2a54] mb-6">Création de compte</h2>

                {error && (
                  <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-3">
                    <Label htmlFor="username" className="text-[#2d2a54] text-base">
                      Nom d&apos;utilisateur
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="Nom d'utilisateur"
                        className="pl-10 border-[#e0ddff] focus:border-[#6c63ff] focus:ring-[#6c63ff] h-12 text-base"
                        required
                        value={formData.username}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="full_name" className="text-[#2d2a54] text-base">
                      Nom complet
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="full_name"
                        type="text"
                        placeholder="Nom complet"
                        className="pl-10 border-[#e0ddff] focus:border-[#6c63ff] focus:ring-[#6c63ff] h-12 text-base"
                        required
                        value={formData.full_name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-[#2d2a54] text-base">
                      Mot de passe
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mot de passe"
                        className="pl-10 pr-10 border-[#e0ddff] focus:border-[#6c63ff] focus:ring-[#6c63ff] h-12 text-base"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
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

                  <div className="space-y-3">
                    <Label htmlFor="role" className="text-[#2d2a54] text-base">
                      Rôle
                    </Label>
                    <select
                      id="role"
                      className="w-full pl-3 border-[#e0ddff] focus:border-[#6c63ff] focus:ring-[#6c63ff] h-12 text-base rounded-md"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="staff">Staff</option>
                      <option value="teacher">Enseignant</option>
                      <option value="parent">Parent</option>
                    </select>
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
                        Création en cours...
                      </div>
                    ) : (
                      "Créer le compte"
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <span>© {new Date().getFullYear()} École Islah</span>
          </div>
        </div>
      </div>
    </div>
  )
}

