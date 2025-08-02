"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save, User, GraduationCap, Users, X } from "lucide-react"
import { api } from "@/lib/api"
import type { Student, Class } from "@/types"
import { ParentSelector } from "./parent-selector"

interface StudentFormDialogProps {
  isOpen: boolean
  onClose: () => void
  student?: Student | null
  onSave: () => void
}

export function StudentFormDialog({ isOpen, onClose, student, onSave }: StudentFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [classes, setClasses] = useState<Class[]>([])
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    place_of_birth: "",
    gender: "",
    parent_id: "",
    class_id: "",
    academic_year: "2024-2025",
    registration_status: "pending",
    notes: "",
  })

  const steps = [
    {
      id: 1,
      title: "Informations personnelles",
      arabic: "المعلومات الشخصية",
      icon: User,
      description: "Nom, prénom et informations de base",
    },
    {
      id: 2,
      title: "Informations scolaires",
      arabic: "المعلومات المدرسية",
      icon: GraduationCap,
      description: "Classe, année scolaire et statut",
    },
    {
      id: 3,
      title: "Famille et notes",
      arabic: "العائلة والملاحظات",
      icon: Users,
      description: "Parent responsable et informations complémentaires",
    },
  ]

  useEffect(() => {
    if (isOpen) {
      fetchClasses()
      if (student) {
        setFormData({
          first_name: student.first_name,
          last_name: student.last_name,
          date_of_birth: student.date_of_birth,
          place_of_birth: student.place_of_birth || "",
          gender: student.gender,
          parent_id: student.parent_id?.toString() || "",
          class_id: student.class_id?.toString() || "",
          academic_year: student.academic_year,
          registration_status: student.registration_status || "pending",
          notes: "",
        })
      } else {
        setFormData({
          first_name: "",
          last_name: "",
          date_of_birth: "",
          place_of_birth: "",
          gender: "",
          parent_id: "",
          class_id: "",
          academic_year: "2024-2025",
          registration_status: "pending",
          notes: "",
        })
      }
      setCurrentStep(1)
    }
  }, [isOpen, student])

  const fetchClasses = async () => {
    try {
      const classesRes = await api.getClasses()
      setClasses(Array.isArray(classesRes) ? classesRes : [])
    } catch (error) {
      console.error("Error fetching data:", error)
      setClasses([]) // Ensure classes is always an array
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const data = {
        ...formData,
        parent_id: formData.parent_id ? Number.parseInt(formData.parent_id) : null,
        class_id: formData.class_id ? Number.parseInt(formData.class_id) : null,
      }

      if (student) {
        await api.updateStudent(student.id, data)
      } else {
        await api.createStudent(data)
      }

      onSave()
    } catch (error) {
      console.error("Error saving student:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return formData.first_name && formData.last_name && formData.date_of_birth && formData.gender
      case 2:
        return true // Optional fields
      case 3:
        return true // Optional fields
      default:
        return false
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-base font-medium">
                  Prénom *
                </Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="h-12 text-lg"
                  placeholder="Prénom de l'élève"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-base font-medium">
                  Nom de famille *
                </Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="h-12 text-lg"
                  placeholder="Nom de famille"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date_of_birth" className="text-base font-medium">
                  Date de naissance *
                </Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  className="h-12 text-lg"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="place_of_birth" className="text-base font-medium">
                  Lieu de naissance
                </Label>
                <Input
                  id="place_of_birth"
                  value={formData.place_of_birth}
                  onChange={(e) => setFormData({ ...formData, place_of_birth: e.target.value })}
                  className="h-12 text-lg"
                  placeholder="Lieu de naissance"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-base font-medium">
                  Genre *
                </Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue placeholder="Sélectionner le genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculin</SelectItem>
                    <SelectItem value="F">Féminin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="class_id" className="text-base font-medium">
                  Classe
                </Label>
                <Select
                  value={formData.class_id}
                  onValueChange={(value) => setFormData({ ...formData, class_id: value })}
                >
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue placeholder="Sélectionner une classe" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(classes) && classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id.toString()}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="academic_year" className="text-base font-medium">
                  Année scolaire
                </Label>
                <Input
                  id="academic_year"
                  value={formData.academic_year}
                  onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                  className="h-12 text-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="registration_status" className="text-base font-medium">
                Statut d'inscription
              </Label>
              {/* Always show read-only status - no user editing allowed */}
              <div className="h-12 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 flex items-center text-lg text-gray-600">
                {student ? (
                  // Show current status for existing students
                  <>
                    {formData.registration_status === "pending" && "En attente"}
                    {formData.registration_status === "confirmed" && "Confirmé"}
                    {formData.registration_status === "cancelled" && "Annulé"}
                    {!formData.registration_status && "En attente"}
                  </>
                ) : (
                  // For new students
                  "En attente (automatique pour nouveaux élèves)"
                )}
              </div>
            </div>

            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="p-4">
                <p className="text-emerald-800 text-sm">
                  <strong>Note :</strong> L'inscription sera confirmée une fois le paiement initial effectué. Les places
                  sont limitées dans chaque classe.
                </p>
              </CardContent>
            </Card>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <ParentSelector
              value={formData.parent_id}
              onValueChange={(value) => setFormData({ ...formData, parent_id: value })}
              label="Parent/Tuteur responsable"
              required={false}
            />

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-base font-medium">
                Notes et observations
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="min-h-[120px] text-lg"
                placeholder="Informations supplémentaires sur l'élève, besoins particuliers, observations..."
              />
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Informations importantes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Les cours ont lieu les mercredis, samedis et dimanches</li>
                  <li>• Horaires : 10h-13h (matin) et 14h-17h (après-midi)</li>
                  <li>• Pause : 11h20-12h00 (matin) et 15h20-16h00 (après-midi)</li>
                  <li>• Paiement trimestriel requis pour maintenir l'inscription</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <div className="flex h-full">
          {/* Steps Sidebar */}
          <div className="w-80 bg-gradient-to-b from-emerald-50 to-blue-50 p-6 border-r">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {student ? "Modifier l'élève" : "Nouvel élève"}
              </DialogTitle>
              <p className="text-emerald-600 font-arabic text-lg">{student ? "تعديل الطالب" : "طالب جديد"}</p>
            </DialogHeader>

            <div className="space-y-4">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`relative p-4 rounded-xl transition-all duration-200 ${
                    currentStep === step.id
                      ? "bg-white shadow-lg border-2 border-emerald-200"
                      : currentStep > step.id
                        ? "bg-emerald-100 border border-emerald-200"
                        : "bg-white/50 border border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full transition-colors duration-200 ${
                        currentStep === step.id
                          ? "bg-emerald-600 text-white"
                          : currentStep > step.id
                            ? "bg-emerald-500 text-white"
                            : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      <step.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{step.title}</h3>
                      <p className="text-sm font-arabic text-emerald-600">{step.arabic}</p>
                      <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 flex flex-col">
            <div className="p-6 border-b bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{steps[currentStep - 1]?.title}</h2>
                  <p className="text-gray-600">{steps[currentStep - 1]?.description}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
              <div className="flex-1 p-6 overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Form Actions */}
              <div className="p-6 border-t bg-gray-50">
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="px-6 bg-transparent"
                  >
                    Précédent
                  </Button>

                  <div className="flex gap-3">
                    {currentStep < steps.length ? (
                      <Button type="button" onClick={nextStep} disabled={!canProceedToNextStep()} className="px-6">
                        Suivant
                      </Button>
                    ) : (
                      <Button type="submit" disabled={isLoading} className="px-8">
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Enregistrement...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Enregistrer
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
