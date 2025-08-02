"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Filter, Download, Users, UserPlus, FileText, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StudentsTable } from "@/components/students/students-table"
import { StudentFormDialog } from "@/components/students/student-form-dialog"
import { StudentsFilters } from "@/components/students/students-filters"
import { api } from "@/lib/api"
import type { Student } from "@/types"

interface StudentFilters {
  class_id?: string
  registration_status?: string
  gender?: string
  academic_year?: string
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalStudents, setTotalStudents] = useState(0)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<StudentFilters>({})
  const [stats, setStats] = useState({
    newThisMonth: 0,
    pending: 0,
    presentToday: 0
  })

  const fetchStudents = async (page = 1, search = "", appliedFilters = filters) => {
    setIsLoading(true)
    try {
      const response = await api.getStudents(page, 20, search, appliedFilters)
      setStudents(response.items || [])
      setTotalPages(response.pages || 1)
      setTotalStudents(response.total || 0)
      setCurrentPage(page)
    } catch (error) {
      console.error("Error fetching students:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFiltersChange = (newFilters: StudentFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
    fetchStudents(1, searchTerm, newFilters)
  }

  const fetchStatistics = async () => {
    try {
      const statsResponse = await api.getStudentStatistics()
      setStats({
        newThisMonth: statsResponse.new_this_month,
        pending: statsResponse.pending,
        presentToday: statsResponse.present_today
      })
    } catch (error) {
      console.error("Error fetching statistics:", error)
    }
  }

  useEffect(() => {
    fetchStudents(1, searchTerm)
    fetchStatistics() // Fetch statistics efficiently
  }, [searchTerm])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    fetchStudents(page, searchTerm)
  }

  const handleAddStudent = () => {
    setSelectedStudent(null)
    setIsFormOpen(true)
  }

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student)
    setIsFormOpen(true)
  }

  const handleStudentSaved = () => {
    fetchStudents(currentPage, searchTerm)
    fetchStatistics() // Refresh stats when a student is added/updated
    setIsFormOpen(false)
  }

    const quickStats = [
    { label: "Total élèves", value: totalStudents, icon: Users, color: "emerald" },
    { label: "Nouveaux ce mois", value: stats.newThisMonth, icon: UserPlus, color: "blue" },
    { label: "En attente", value: stats.pending, icon: FileText, color: "amber" },
    { label: "Présents aujourd'hui", value: stats.presentToday, icon: Calendar, color: "green" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header with Islamic touch */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-blue-600/10 rounded-2xl"></div>
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-100 rounded-xl">
                      <Users className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">Gestion des Élèves</h1>
                      <p className="text-lg font-arabic text-emerald-600">إدارة الطلاب</p>
                    </div>
                  </div>
                  <p className="text-gray-600 max-w-2xl">
                    Gérez les inscriptions, profils et informations des élèves de l'École Islah. Suivez leur parcours
                    académique et spirituel.
                  </p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleAddStudent}
                    size="lg"
                    className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg px-8 py-3 text-lg"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Nouvel Élève
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Rechercher un élève par nom, prénom..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-12 h-12 text-lg border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="h-12 px-6 border-gray-200 hover:bg-emerald-50 hover:border-emerald-200"
                  >
                    <Filter className="w-5 h-5 mr-2" />
                    Filtres
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 px-6 border-gray-200 hover:bg-blue-50 hover:border-blue-200 bg-transparent"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Exporter
                  </Button>
                </div>
              </div>

              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-gray-200"
                >
                  <StudentsFilters 
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                  />
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Students Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Liste des Élèves</CardTitle>
                  <CardDescription className="text-base mt-1">
                    {totalStudents} élève{totalStudents !== 1 ? "s" : ""} 
                    {searchTerm || Object.values(filters).some(value => value && value !== "all") 
                      ? " trouvé" + (totalStudents !== 1 ? "s" : "")
                      : " inscrit" + (totalStudents !== 1 ? "s" : "")} 
                    à l'École Islah
                  </CardDescription>
                </div>
                <div className="text-sm text-gray-500">
                  {totalStudents > 0 && `Page ${currentPage} sur ${totalPages}`}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <StudentsTable
                students={students}
                isLoading={isLoading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onEditStudent={handleEditStudent}
                searchTerm={searchTerm}
                hasActiveFilters={Object.values(filters).some(value => value && value !== "all")}
                onRefresh={() => {
                  fetchStudents(currentPage, searchTerm)
                  fetchStatistics()
                }}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Student Form Dialog */}
        <StudentFormDialog
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          student={selectedStudent}
          onSave={handleStudentSaved}
        />
      </div>
    </DashboardLayout>
  )
}
