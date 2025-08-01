"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Filter, Download, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StudentsTable } from "@/components/students/students-table"
import { StudentDialog } from "@/components/students/student-dialog"
import { api } from "@/lib/api"
import type { Student } from "@/types"

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalStudents, setTotalStudents] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  const fetchStudents = async (page = 1, search = "") => {
    setIsLoading(true)
    try {
      const response = await api.getStudents(page, 20, search)
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

  useEffect(() => {
    fetchStudents(1, searchTerm)
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
    setIsDialogOpen(true)
  }

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student)
    setIsDialogOpen(true)
  }

  const handleStudentSaved = () => {
    fetchStudents(currentPage, searchTerm)
    setIsDialogOpen(false)
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Élèves</h1>
            <p className="text-gray-600 mt-1">Gérez les profils et informations des élèves</p>
          </div>
          <Button
            onClick={handleAddStudent}
            className="bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvel élève
          </Button>
        </motion.div>

        {/* Stats Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-full">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-emerald-100">Total des élèves</p>
                  <p className="text-3xl font-bold">{totalStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un élève..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="hover:bg-gray-50 bg-transparent">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
            <Button variant="outline" className="hover:bg-gray-50 bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>
        </motion.div>

        {/* Students Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Liste des élèves</CardTitle>
              <CardDescription>
                {totalStudents} élève{totalStudents !== 1 ? "s" : ""} au total
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StudentsTable
                students={students}
                isLoading={isLoading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onEditStudent={handleEditStudent}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Student Dialog */}
        <StudentDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          student={selectedStudent}
          onSave={handleStudentSaved}
        />
      </div>
    </DashboardLayout>
  )
}
