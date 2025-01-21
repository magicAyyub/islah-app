"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Search, Edit, Trash2, User, Phone, Mail, UserPlus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type GuardianRole = "father" | "mother" | "guardian"

type Guardian = {
  id?: number
  first_name: string
  last_name: string
  role: GuardianRole
  phone_number: string
  email?: string
  created_at?: string
}

const roleIcons: Record<GuardianRole, React.ReactNode> = {
  father: <User className="h-6 w-6 text-blue-500" />,
  mother: <User className="h-6 w-6 text-pink-500" />,
  guardian: <User className="h-6 w-6 text-purple-500" />,
}

const roleLabels: Record<GuardianRole, string> = {
  father: "Père",
  mother: "Mère",
  guardian: "Tuteur",
}

const GuardianCard = ({
  guardian,
  onEdit,
  onDelete,
}: { guardian: Guardian; onEdit: (guardian: Guardian) => void; onDelete: (id: number) => void }) => {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editedGuardian, setEditedGuardian] = useState(guardian)

  const handleEdit = () => {
    onEdit(editedGuardian)
    setIsEditOpen(false)
  }

  const handleDelete = () => {
    if (guardian.id) {
      onDelete(guardian.id)
    }
    setIsDeleteOpen(false)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
      className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
    >
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              {roleIcons[guardian.role]}
              <span className="ml-2 font-semibold">{roleLabels[guardian.role]}</span>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" onClick={() => setIsEditOpen(true)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsDeleteOpen(true)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {guardian.first_name} {guardian.last_name}
          </h3>
          <div className="space-y-1">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              <span>{guardian.phone_number}</span>
            </div>
            {guardian.email && (
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>{guardian.email}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le tuteur</DialogTitle>
            <DialogDescription>Modifiez les informations du tuteur ici.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="first_name" className="text-right">
                Prénom
              </Label>
              <Input
                id="first_name"
                value={editedGuardian.first_name}
                onChange={(e) => setEditedGuardian({ ...editedGuardian, first_name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="last_name" className="text-right">
                Nom
              </Label>
              <Input
                id="last_name"
                value={editedGuardian.last_name}
                onChange={(e) => setEditedGuardian({ ...editedGuardian, last_name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Rôle
              </Label>
              <Select
                value={editedGuardian.role}
                onValueChange={(value: GuardianRole) => setEditedGuardian({ ...editedGuardian, role: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionnez un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="father">Père</SelectItem>
                  <SelectItem value="mother">Mère</SelectItem>
                  <SelectItem value="guardian">Tuteur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone_number" className="text-right">
                Téléphone
              </Label>
              <Input
                id="phone_number"
                value={editedGuardian.phone_number}
                onChange={(e) => setEditedGuardian({ ...editedGuardian, phone_number: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={editedGuardian.email || ""}
                onChange={(e) => setEditedGuardian({ ...editedGuardian, email: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEdit}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer {guardian.first_name} {guardian.last_name} ? Cette action est
              irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

export default function ParentsPage() {
  const [guardians, setGuardians] = useState<Guardian[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newGuardian, setNewGuardian] = useState<Omit<Guardian, "id" | "created_at">>({
    first_name: "",
    last_name: "",
    role: "guardian",
    phone_number: "",
    email: "",
  })
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const loadGuardians = useCallback(
    async (search = "") => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/guardians${search ? `?search=${search}` : ""}`)
        if (!response.ok) throw new Error("Erreur lors du chargement des tuteurs")
        const data: Guardian[] = await response.json()
        setGuardians(data)
      } catch (error) {
        console.error("Erreur:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les tuteurs. Veuillez réessayer.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  useEffect(() => {
    const initialSearch = searchParams.get("search") || ""
    setSearchTerm(initialSearch)
    loadGuardians(initialSearch)
  }, [searchParams, loadGuardians])

  const handleSearch = () => {
    router.push(`/parents?search=${searchTerm}`)
    loadGuardians(searchTerm)
  }

  const handleEdit = async (guardian: Guardian) => {
    try {
      const response = await fetch(`/api/guardians/${guardian.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(guardian),
      })
      if (!response.ok) throw new Error("Erreur lors de la mise à jour")
      toast({
        title: "Mise à jour réussie",
        description: `Les informations de ${guardian.first_name} ${guardian.last_name} ont été mises à jour.`,
      })
      loadGuardians(searchTerm)
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "La mise à jour a échoué. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  const handleAddGuardian = async () => {
    try {
      const response = await fetch("/api/guardians", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGuardian),
      })
      if (!response.ok) throw new Error("Erreur lors de l'ajout du tuteur")
      toast({
        title: "Tuteur ajouté",
        description: `${newGuardian.first_name} ${newGuardian.last_name} a été ajouté avec succès.`,
      })
      setIsAddDialogOpen(false)
      setNewGuardian({ first_name: "", last_name: "", role: "guardian", phone_number: "", email: "" })
      loadGuardians(searchTerm)
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "L'ajout du tuteur a échoué. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/guardians/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Erreur lors de la suppression")
      toast({
        title: "Suppression réussie",
        description: "Le tuteur a été supprimé avec succès.",
      })
      loadGuardians(searchTerm)
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "La suppression a échoué. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">Gestion des Tuteurs</h1>
        <p className="text-xl text-gray-600">Visualisez, ajoutez, modifiez et supprimez les informations des tuteurs</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-between items-center mb-6"
      >
        <div className="flex space-x-2">
          <Input
            placeholder="Rechercher un tuteur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Rechercher
          </Button>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Ajouter un tuteur
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau tuteur</DialogTitle>
              <DialogDescription>Remplissez les informations pour ajouter un nouveau tuteur.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="first_name" className="text-right">
                  Prénom
                </Label>
                <Input
                  id="first_name"
                  value={newGuardian.first_name}
                  onChange={(e) => setNewGuardian({ ...newGuardian, first_name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="last_name" className="text-right">
                  Nom
                </Label>
                <Input
                  id="last_name"
                  value={newGuardian.last_name}
                  onChange={(e) => setNewGuardian({ ...newGuardian, last_name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Rôle
                </Label>
                <Select
                  value={newGuardian.role}
                  onValueChange={(value: GuardianRole) => setNewGuardian({ ...newGuardian, role: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionnez un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="father">Père</SelectItem>
                    <SelectItem value="mother">Mère</SelectItem>
                    <SelectItem value="guardian">Tuteur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone_number" className="text-right">
                  Téléphone
                </Label>
                <Input
                  id="phone_number"
                  value={newGuardian.phone_number}
                  onChange={(e) => setNewGuardian({ ...newGuardian, phone_number: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={newGuardian.email || ""}
                  onChange={(e) => setNewGuardian({ ...newGuardian, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddGuardian}>Ajouter le tuteur</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : guardians.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-10"
        >
          <p className="text-gray-500 mb-4">Aucun tuteur n&apos;a été trouvé.</p>
          <Button onClick={() => loadGuardians()} variant="outline">
            Réessayer
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap -mx-2"
        >
          <AnimatePresence>
            {guardians.map((guardian) => (
              <GuardianCard key={guardian.id} guardian={guardian} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}

