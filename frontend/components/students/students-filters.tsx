"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import { api } from "@/lib/api"
import type { Class } from "@/types"

interface Filters {
  class_id?: string
  registration_status?: string
  gender?: string
  academic_year?: string
}

interface StudentsFiltersProps {
  onFiltersChange: (filters: Filters) => void
  filters: Filters
}

export function StudentsFilters({ onFiltersChange, filters }: StudentsFiltersProps) {
  const [classes, setClasses] = useState<Class[]>([])

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const classesRes = await api.getClasses()
      setClasses(Array.isArray(classesRes) ? classesRes : [])
    } catch (error) {
      console.error("Error fetching classes:", error)
      setClasses([])
    }
  }

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value === "all" ? undefined : value
    }
    onFiltersChange(newFilters)
  }

  const handleReset = () => {
    onFiltersChange({})
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4"
    >
      <div className="space-y-2">
        <Label className="text-sm font-medium">Classe</Label>
        <Select
          value={filters.class_id || "all"}
          onValueChange={(value) => handleFilterChange("class_id", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Toutes les classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les classes</SelectItem>
            {classes.map((cls) => (
              <SelectItem key={cls.id} value={cls.id.toString()}>
                {cls.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Statut</Label>
        <Select
          value={filters.registration_status || "all"}
          onValueChange={(value) => handleFilterChange("registration_status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="confirmed">Confirmé</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="cancelled">Annulé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Genre</Label>
        <Select
          value={filters.gender || "all"}
          onValueChange={(value) => handleFilterChange("gender", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tous" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="M">Masculin</SelectItem>
            <SelectItem value="F">Féminin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Année scolaire</Label>
        <Select
          value={filters.academic_year || "all"}
          onValueChange={(value) => handleFilterChange("academic_year", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Toutes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="2024-2025">2024-2025</SelectItem>
            <SelectItem value="2023-2024">2023-2024</SelectItem>
            <SelectItem value="2022-2023">2022-2023</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end">
        <Button variant="outline" className="w-full bg-transparent" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Réinitialiser
        </Button>
      </div>
    </motion.div>
  )
}
