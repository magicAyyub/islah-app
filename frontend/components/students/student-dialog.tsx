"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save } from "lucide-react"
import { api } from "@/lib/api"
import type { Student, Parent, Class } from "@/types"

interface StudentDialogProps {
  isOpen: boolean
  onClose: () => void
  student?: Student | null
  onSave: () => void
}

export function StudentDialog({ isOpen, onClose, student, onSave }: StudentDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [parents, setParents] = useState<Parent[]>([])
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
  })

  useEffect(() => {
    if (isOpen) {
      fetchParentsAndClasses()
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
        })
      }
    }
  }, [isOpen, student])

  const fetchParentsAndClasses = async () => {
    try {
      const [parentsRes, classesRes] = await Promise.all([api.getParents(), api.getClasses()])
      setParents(parentsRes || [])
      setClasses(classesRes || [])
    } catch (error) {
      console.error("Error fetching data:", error)
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{student ? "Modifier l'élève" : "Nouvel élève"}</DialogTitle>
          <DialogDescription>
            {student ? "Modifiez les informations de l'élève" : "Ajoutez un nouvel élève au système"}
          </DialogDescription>
        </DialogHeader>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">Prénom *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Nom *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date de naissance *</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="place_of_birth">Lieu de naissance</Label>
              <Input
                id="place_of_birth"
                value={formData.place_of_birth}
                onChange={(e) => setFormData({ ...formData, place_of_birth: e.target.value })}
                placeholder="Lieu de naissance"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Genre *</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculin</SelectItem>
                  <SelectItem value="F">Féminin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parent_id">Parent</Label>
              <Select
                value={formData.parent_id}
                onValueChange={(value) => setFormData({ ...formData, parent_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un parent" />
                </SelectTrigger>
                <SelectContent>
                  {parents.map((parent) => (
                    <SelectItem key={parent.id} value={parent.id.toString()}>
                      {parent.first_name} {parent.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="class_id">Classe</Label>
              <Select
                value={formData.class_id}
                onValueChange={(value) => setFormData({ ...formData, class_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une classe" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id.toString()}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="academic_year">Année scolaire</Label>
              <Input
                id="academic_year"
                value={formData.academic_year}
                onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registration_status">Statut d'inscription</Label>
              <Select
                value={formData.registration_status}
                onValueChange={(value) => setFormData({ ...formData, registration_status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="confirmed">Confirmé</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
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
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  )
}
