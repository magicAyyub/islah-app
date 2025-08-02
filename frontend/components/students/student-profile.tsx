"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  CreditCard,
  UserCheck,
  BookOpen,
  Edit,
  Flag,
  AlertTriangle,
  Users,
  X,
} from "lucide-react"
import { api } from "@/lib/api"
import type { Student } from "@/types"

interface StudentProfileProps {
  studentId: number
  isOpen: boolean
  onClose: () => void
  onEdit: (student: Student) => void
}

interface StudentGrade {
  id: number
  subject: string
  grade_value: number
  max_grade: number
  grade_type: string
  assessment_date: string
  comments?: string
}

interface StudentAttendance {
  id: number
  attendance_date: string
  status: string
  arrival_time?: string
  notes?: string
}

interface StudentPayment {
  id: number
  amount: number
  payment_date: string
  payment_type: string
  payment_method: string
  description?: string
  receipt_number?: string
}

export function StudentProfile({ studentId, isOpen, onClose, onEdit }: StudentProfileProps) {
  const [student, setStudent] = useState<Student | null>(null)
  const [grades, setGrades] = useState<StudentGrade[]>([])
  const [attendance, setAttendance] = useState<StudentAttendance[]>([])
  const [payments, setPayments] = useState<StudentPayment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (isOpen && studentId) {
      fetchStudentData()
    }
  }, [isOpen, studentId])

  const fetchStudentData = async () => {
    setIsLoading(true)
    try {
      const [studentData, gradesData, attendanceData] = await Promise.all([
        api.getStudent(studentId),
        api.getStudentGrades(studentId).catch(() => []),
        api.getStudentAttendance(studentId).catch(() => []),
      ])

      setStudent(studentData)
      setGrades(gradesData || [])
      setAttendance(attendanceData || [])
    } catch (error) {
      console.error("Error fetching student data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status?: string) => {
    const variants = {
      confirmed: { bg: "bg-green-100", text: "text-green-800", label: "Confirmé" },
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "En attente" },
      cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Annulé" },
    }

    const statusKey = status || "pending"
    const variant = variants[statusKey as keyof typeof variants] || variants.pending

    return <Badge className={`${variant.bg} ${variant.text}`}>{variant.label}</Badge>
  }

  const getFlagBadges = (student: Student) => {
    const activeFlags = student.flags?.filter((flag) => flag.is_active) || []
    if (activeFlags.length === 0) return null

    const flagColors = {
      payment_issue: "bg-red-100 text-red-800",
      bounced_check: "bg-orange-100 text-orange-800",
      late_payment: "bg-yellow-100 text-yellow-800",
      behavior: "bg-purple-100 text-purple-800",
      other: "bg-gray-100 text-gray-800",
    }

    return (
      <div className="flex gap-2 flex-wrap">
        {activeFlags.map((flag) => (
          <Badge
            key={flag.id}
            className={`${flagColors[flag.flag_type as keyof typeof flagColors] || flagColors.other}`}
            title={`Signalé le ${new Date(flag.flagged_date).toLocaleDateString("fr-FR")}: ${flag.reason}`}
          >
            <Flag className="w-3 h-3 mr-1" />
            {flag.flag_type.replace("_", " ")}
          </Badge>
        ))}
      </div>
    )
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    return age
  }

  const getAttendanceRate = () => {
    if (attendance.length === 0) return 0
    const presentCount = attendance.filter((a) => a.status === "present").length
    return Math.round((presentCount / attendance.length) * 100)
  }

  const getAverageGrade = () => {
    if (grades.length === 0) return 0
    const total = grades.reduce((sum, grade) => sum + (grade.grade_value / grade.max_grade) * 20, 0)
    return Math.round((total / grades.length) * 10) / 10
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement du profil...</p>
            </div>
          </div>
        ) : student ? (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20 ring-4 ring-white/20">
                    <AvatarFallback className="bg-white/20 text-white text-2xl font-bold">
                      {student.first_name[0]}
                      {student.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold">
                        {student.first_name} {student.last_name}
                      </h1>
                      {student.flags?.some((flag) => flag.is_active) && (
                        <AlertTriangle className="w-6 h-6 text-yellow-300" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-emerald-100">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {calculateAge(student.date_of_birth)} ans
                      </span>
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-4 h-4" />
                        {student.class?.name || "Aucune classe"}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {student.gender === "M" ? "Masculin" : "Féminin"}
                      </span>
                    </div>
                    {getFlagBadges(student)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    onClick={() => onEdit(student)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" onClick={onClose}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                <div className="border-b bg-gray-50 px-6">
                  <TabsList className="bg-transparent">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-white">
                      Vue d'ensemble
                    </TabsTrigger>
                    <TabsTrigger value="academic" className="data-[state=active]:bg-white">
                      Académique
                    </TabsTrigger>
                    <TabsTrigger value="attendance" className="data-[state=active]:bg-white">
                      Présences
                    </TabsTrigger>
                    <TabsTrigger value="payments" className="data-[state=active]:bg-white">
                      Paiements
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-6">
                  <TabsContent value="overview" className="space-y-6 mt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Quick Stats */}
                      <div className="lg:col-span-1 space-y-4">
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Statistiques rapides</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Taux de présence</span>
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-green-500 transition-all duration-300"
                                    style={{ width: `${getAttendanceRate()}%` }}
                                  />
                                </div>
                                <span className="text-sm font-semibold">{getAttendanceRate()}%</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Moyenne générale</span>
                              <span className="text-sm font-semibold">{getAverageGrade()}/20</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Statut</span>
                              {getStatusBadge(student.registration_status)}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Parent Information */}
                        {student.parent && (
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Parent/Tuteur
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {student.parent.first_name} {student.parent.last_name}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Phone className="w-4 h-4" />
                                  {student.parent.phone}
                                </div>
                                {student.parent.email && (
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Mail className="w-4 h-4" />
                                    {student.parent.email}
                                  </div>
                                )}
                                {student.parent.address && (
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    {student.parent.address}
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>

                      {/* Personal Information */}
                      <div className="lg:col-span-2">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <User className="w-5 h-5" />
                              Informations personnelles
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Date de naissance</label>
                                  <p className="text-gray-900">
                                    {new Date(student.date_of_birth).toLocaleDateString("fr-FR", {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </p>
                                </div>
                                {student.place_of_birth && (
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Lieu de naissance</label>
                                    <p className="text-gray-900">{student.place_of_birth}</p>
                                  </div>
                                )}
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Genre</label>
                                  <p className="text-gray-900">{student.gender === "M" ? "Masculin" : "Féminin"}</p>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Année scolaire</label>
                                  <p className="text-gray-900">{student.academic_year}</p>
                                </div>
                                {student.registration_date && (
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Date d'inscription</label>
                                    <p className="text-gray-900">
                                      {new Date(student.registration_date).toLocaleDateString("fr-FR")}
                                    </p>
                                  </div>
                                )}
                                <div>
                                  <label className="text-sm font-medium text-gray-500">ID Élève</label>
                                  <p className="text-gray-900 font-mono">#{student.id.toString().padStart(4, "0")}</p>
                                </div>
                              </div>
                            </div>

                            {/* Active Flags Section */}
                            {student.flags && student.flags.some((flag) => flag.is_active) && (
                              <>
                                <Separator className="my-6" />
                                <div>
                                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                                    Signalements actifs
                                  </label>
                                  <div className="mt-3 space-y-2">
                                    {student.flags
                                      .filter((flag) => flag.is_active)
                                      .map((flag) => (
                                        <div
                                          key={flag.id}
                                          className="p-3 bg-amber-50 border border-amber-200 rounded-lg"
                                        >
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <p className="font-medium text-amber-900 capitalize">
                                                {flag.flag_type.replace("_", " ")}
                                              </p>
                                              <p className="text-sm text-amber-700">{flag.reason}</p>
                                            </div>
                                            <div className="text-xs text-amber-600">
                                              {new Date(flag.flagged_date).toLocaleDateString("fr-FR")}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              </>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="academic" className="space-y-6 mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5" />
                          Notes et évaluations
                        </CardTitle>
                        <CardDescription>Historique des notes et évaluations de l'élève</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {grades.length > 0 ? (
                          <div className="space-y-4">
                            {grades.map((grade) => (
                              <div key={grade.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                  <h4 className="font-semibold">{grade.subject}</h4>
                                  <p className="text-sm text-gray-600">{grade.grade_type}</p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(grade.assessment_date).toLocaleDateString("fr-FR")}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold">
                                    {grade.grade_value}/{grade.max_grade}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {Math.round((grade.grade_value / grade.max_grade) * 20 * 10) / 10}/20
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">Aucune note enregistrée</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="attendance" className="space-y-6 mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <UserCheck className="w-5 h-5" />
                          Historique des présences
                        </CardTitle>
                        <CardDescription>Suivi de l'assiduité de l'élève</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {attendance.length > 0 ? (
                          <div className="space-y-3">
                            {attendance.slice(0, 10).map((record) => (
                              <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-3 h-3 rounded-full ${
                                      record.status === "present"
                                        ? "bg-green-500"
                                        : record.status === "absent"
                                          ? "bg-red-500"
                                          : "bg-yellow-500"
                                    }`}
                                  />
                                  <div>
                                    <p className="font-medium">
                                      {new Date(record.attendance_date).toLocaleDateString("fr-FR")}
                                    </p>
                                    {record.arrival_time && (
                                      <p className="text-sm text-gray-600">Arrivée: {record.arrival_time}</p>
                                    )}
                                  </div>
                                </div>
                                <Badge variant={record.status === "present" ? "default" : "destructive"}>
                                  {record.status === "present"
                                    ? "Présent"
                                    : record.status === "absent"
                                      ? "Absent"
                                      : "Retard"}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">Aucune présence enregistrée</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="payments" className="space-y-6 mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CreditCard className="w-5 h-5" />
                          Historique des paiements
                        </CardTitle>
                        <CardDescription>Suivi des paiements et frais scolaires</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8">
                          <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">Fonctionnalité en cours de développement</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <p className="text-gray-600">Erreur lors du chargement du profil</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
