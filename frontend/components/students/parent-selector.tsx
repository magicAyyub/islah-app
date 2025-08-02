"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Plus, User, Phone, Mail, MapPin, Loader2, Check } from "lucide-react"
import { api } from "@/lib/api"
import type { Parent } from "@/types"

interface ParentSelectorProps {
  value: string
  onValueChange: (value: string) => void
  label?: string
  required?: boolean
}

export function ParentSelector({
  value,
  onValueChange,
  label = "Parent/Tuteur",
  required = false,
}: ParentSelectorProps) {
  const [parents, setParents] = useState<Parent[]>([])
  const [filteredParents, setFilteredParents] = useState<Parent[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const [newParent, setNewParent] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    address: "",
    emergency_contact: "",
  })

  useEffect(() => {
    fetchParents()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredParents(parents)
    } else {
      const filtered = parents.filter(
        (parent) =>
          parent.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          parent.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          parent.phone.includes(searchTerm) ||
          (parent.email && parent.email.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredParents(filtered)
    }
  }, [searchTerm, parents])

  const fetchParents = async () => {
    setIsLoading(true)
    try {
      const response = await api.getParents("")
      setParents(Array.isArray(response) ? response : [])
      setFilteredParents(Array.isArray(response) ? response : [])
    } catch (error) {
      console.error("Error fetching parents:", error)
      setParents([])
      setFilteredParents([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateParent = async () => {
    if (!newParent.first_name || !newParent.last_name || !newParent.phone) {
      return
    }

    setIsCreating(true)
    try {
      const createdParent = await api.createParent(newParent)
      setParents([...parents, createdParent])
      setFilteredParents([...parents, createdParent])
      onValueChange(createdParent.id.toString())
      setShowCreateForm(false)
      setNewParent({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        address: "",
        emergency_contact: "",
      })
    } catch (error) {
      console.error("Error creating parent:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const selectedParent = parents.find((p) => p.id.toString() === value)

  return (
    <div className="space-y-2">
      <Label className="text-base font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      {/* Selected Parent Display */}
      {selectedParent ? (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-200 rounded-full">
                  <User className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-900">
                    {selectedParent.first_name} {selectedParent.last_name}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-emerald-700">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {selectedParent.phone}
                    </span>
                    {selectedParent.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {selectedParent.email}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(true)}
                className="bg-white hover:bg-emerald-100"
              >
                Changer
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="w-full h-12 justify-start gap-3 text-gray-500 hover:text-gray-700 hover:bg-emerald-50 bg-transparent"
        >
          <User className="w-5 h-5" />
          Sélectionner un parent
        </Button>
      )}

      {/* Parent Selection Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden p-0">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-xl">Sélectionner un parent</DialogTitle>
          </DialogHeader>

          <div className="px-6">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom, téléphone ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            {/* Add New Parent Button */}
            <Button onClick={() => setShowCreateForm(true)} className="w-full mb-4 bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un nouveau parent
            </Button>
          </div>

          {/* Parents List */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                <span className="ml-2 text-gray-600">Chargement des parents...</span>
              </div>
            ) : filteredParents.length === 0 ? (
              <div className="text-center py-8">
                <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  {searchTerm ? "Aucun parent trouvé pour cette recherche" : "Aucun parent enregistré"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredParents.map((parent) => (
                  <motion.div
                    key={parent.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        value === parent.id.toString()
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 hover:border-emerald-300"
                      }`}
                      onClick={() => {
                        onValueChange(parent.id.toString())
                        setIsOpen(false)
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-full">
                              <User className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {parent.first_name} {parent.last_name}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {parent.phone}
                                </span>
                                {parent.email && (
                                  <span className="flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    {parent.email}
                                  </span>
                                )}
                              </div>
                              {parent.address && (
                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {parent.address}
                                </p>
                              )}
                            </div>
                          </div>
                          {value === parent.id.toString() && (
                            <div className="p-1 bg-emerald-600 rounded-full">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Parent Dialog */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau parent</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="parent_first_name">Prénom *</Label>
                <Input
                  id="parent_first_name"
                  value={newParent.first_name}
                  onChange={(e) => setNewParent({ ...newParent, first_name: e.target.value })}
                  placeholder="Prénom"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parent_last_name">Nom *</Label>
                <Input
                  id="parent_last_name"
                  value={newParent.last_name}
                  onChange={(e) => setNewParent({ ...newParent, last_name: e.target.value })}
                  placeholder="Nom de famille"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent_phone">Téléphone *</Label>
              <Input
                id="parent_phone"
                value={newParent.phone}
                onChange={(e) => setNewParent({ ...newParent, phone: e.target.value })}
                placeholder="06 12 34 56 78"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent_email">Email</Label>
              <Input
                id="parent_email"
                type="email"
                value={newParent.email}
                onChange={(e) => setNewParent({ ...newParent, email: e.target.value })}
                placeholder="email@exemple.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent_address">Adresse</Label>
              <Input
                id="parent_address"
                value={newParent.address}
                onChange={(e) => setNewParent({ ...newParent, address: e.target.value })}
                placeholder="Adresse complète"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent_emergency">Contact d'urgence</Label>
              <Input
                id="parent_emergency"
                value={newParent.emergency_contact}
                onChange={(e) => setNewParent({ ...newParent, emergency_contact: e.target.value })}
                placeholder="Nom et téléphone d'urgence"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Annuler
              </Button>
              <Button
                onClick={handleCreateParent}
                disabled={!newParent.first_name || !newParent.last_name || !newParent.phone || isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Créer le parent
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
