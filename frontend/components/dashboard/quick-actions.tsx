"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Users, Phone, Eye, TrendingUp, AlertTriangle, Calendar } from "lucide-react"
import { api } from "@/lib/api"
import type { Student, Parent } from "@/types"

interface QuickActionsProps {
  userRole?: string
}

interface SearchResult {
  type: 'student' | 'parent'
  id: number
  name: string
  details: string
  flags?: number
}

export function QuickActions({ userRole }: QuickActionsProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleQuickSearch = async (term: string) => {
    setSearchTerm(term)
    if (term.length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const [studentsRes, parentsRes] = await Promise.all([
        api.quickSearchStudents(term, 5).catch(() => []),
        api.quickSearchParents(term, 3).catch(() => [])
      ])

      const results: SearchResult[] = []

      // Add students (already properly filtered by backend)
      if (Array.isArray(studentsRes)) {
        studentsRes.forEach((student: Student) => {
          const activeFlags = student.flags?.filter(flag => flag.is_active).length || 0
          results.push({
            type: 'student',
            id: student.id,
            name: `${student.first_name} ${student.last_name}`,
            details: `${student.class?.name || 'Aucune classe'} • ${student.academic_year}`,
            flags: activeFlags > 0 ? activeFlags : undefined
          })
        })
      }

      // Add parents (already properly filtered by backend)
      if (Array.isArray(parentsRes)) {
        parentsRes.forEach((parent: Parent) => {
          results.push({
            type: 'parent',
            id: parent.id,
            name: `${parent.first_name} ${parent.last_name}`,
            details: parent.phone || parent.email || 'Aucun contact'
          })
        })
      }

      setSearchResults(results.slice(0, 6))
    } catch (error) {
      console.error("Error searching:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleViewProfile = (result: SearchResult) => {
    if (result.type === 'student') {
      router.push(`/students?view=${result.id}`)
    } else {
      // For now, redirect to students page filtered by parent
      router.push(`/students?parent=${result.id}`)
    }
    setSearchTerm("")
    setSearchResults([])
  }

  const quickStats = [
    {
      label: "Aujourd'hui",
      value: "3 nouvelles inscriptions",
      icon: TrendingUp,
      color: "emerald",
      onClick: () => router.push("/students?filter=new_today")
    },
    {
      label: "Signalements",
      value: "2 élèves signalés",
      icon: AlertTriangle,
      color: "amber",
      onClick: () => router.push("/students?filter=flagged")
    },
    {
      label: "Programme",
      value: "5 cours prévus",
      icon: Calendar,
      color: "blue",
      onClick: () => router.push("/classes?view=today")
    }
  ]

  return (
    <div className="space-y-6">
      {/* Quick Search */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Search className="w-5 h-5 text-emerald-600" />
            Recherche rapide
          </CardTitle>
          <CardDescription className="text-base">Trouvez rapidement un élève ou parent</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Input
              placeholder="Tapez le nom d'un élève ou parent..."
              value={searchTerm}
              onChange={(e) => handleQuickSearch(e.target.value)}
              className="h-12 text-base pr-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          
          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3 max-h-80 overflow-y-auto"
            >
              {searchResults.map((result) => (
                <motion.div
                  key={`${result.type}-${result.id}`}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 border rounded-lg hover:bg-emerald-50 hover:border-emerald-200 cursor-pointer transition-all duration-200"
                  onClick={() => handleViewProfile(result)}
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="text-sm bg-emerald-100 text-emerald-700 font-semibold">
                        {result.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-semibold text-base text-gray-900 truncate">{result.name}</p>
                        {result.type === 'student' ? (
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs font-medium">
                            Élève
                          </Badge>
                        ) : (
                          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 text-xs font-medium">
                            Parent
                          </Badge>
                        )}
                        {result.flags && result.flags > 0 && (
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-xs font-medium">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {result.flags} signalement{result.flags > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{result.details}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <Eye className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
          
          {isSearching && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3 text-gray-500">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600"></div>
                <span className="text-sm">Recherche en cours...</span>
              </div>
            </div>
          )}

          {searchTerm.length >= 2 && !isSearching && searchResults.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-base font-medium mb-1">Aucun résultat trouvé</p>
              <p className="text-sm">Aucun élève ou parent ne correspond à "{searchTerm}"</p>
            </div>
          )}

          {searchTerm.length > 0 && searchTerm.length < 2 && (
            <div className="text-center py-6 text-gray-400">
              <p className="text-sm">Tapez au moins 2 caractères pour rechercher</p>
            </div>
          )}

          {searchTerm.length === 0 && (
            <div className="text-center py-6 text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Commencez à taper pour rechercher des élèves ou parents</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats & Actions */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Aperçu du jour</CardTitle>
          <CardDescription className="text-base">Informations importantes aujourd'hui</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="p-4 border rounded-lg hover:bg-emerald-50 hover:border-emerald-200 cursor-pointer transition-all duration-200 group"
                onClick={stat.onClick}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-${stat.color}-100 group-hover:bg-${stat.color}-200 transition-colors`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-gray-900">{stat.label}</p>
                    <p className="text-sm text-gray-600">{stat.value}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
