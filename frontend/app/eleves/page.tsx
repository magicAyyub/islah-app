"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Search, UserPlus, Trash2, Calendar, User, BookOpen, AlertTriangle } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

type Gender = "male" | "female" | "other"

type Student = {
  id?: number
  first_name: string
  last_name: string
  gender: Gender
  date_of_birth: string
  class_name?: string
}

const genderIcons: Record<Gender, React.ReactNode> = {
  male: <User className="h-6 w-6 text-blue-500" />,
  female: <User className="h-6 w-6 text-pink-500" />,
  other: <User className="h-6 w-6 text-purple-500" />,
}

const genderLabels: Record<Gender, string> = {
  male: "Masculin",
  female: "Féminin",
  other: "Autre",
}

const StudentCard = ({
  student,
  onEdit,
  onDelete,
  onAssignClass,
}: {
  student: Student
  onEdit: (student: Student) => void
  onDelete: (id: number) => void
  onAssignClass: (id: number) => void
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editedStudent, setEditedStudent] = useState(student)
  const avatar = {
    male: ["Kingston", "Easton", "Emery", "Alexander", "Jack", "Mason", "Brian", "Ryan"],
    female: ["Adrian", "Aidan", "Jocelyn", "Maria", "Sophia", "Brooklynn", "Katherine", "Avery"],
  }
  const handleEdit = () => {
    onEdit(editedStudent)
    setIsEditOpen(false)
  }

  const handleDelete = () => {
    if (student.id) {
      onDelete(student.id)
      setIsDeleteOpen(false)
    }
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
      <Card className="h-ful">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-12 w-12">
              <AvatarImage
                src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${
                  avatar[student.gender][Math.floor(Math.random() * avatar[student.gender].length)]
                }`}
              />
              <AvatarFallback>
                {student.first_name[0]}
                {student.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">
                {student.first_name} {student.last_name}
              </h3>
              <div className="flex items-center text-sm text-gray-500">
                {genderIcons[student.gender]}
                <span className="ml-1">{genderLabels[student.gender]}</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm">{format(new Date(student.date_of_birth), "dd MMMM yyyy", { locale: fr })}</span>
            </div>
            {student.class_name && (
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
                <Badge variant="secondary">{student.class_name}</Badge>
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)}>
              Modifier
            </Button>
            <Button variant="outline" size="sm" onClick={() => student.id && onAssignClass(student.id)}>
              {student.class_name ? "Changer" : "Assigner"} classe
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setIsDeleteOpen(true)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l&apos;étudiant</DialogTitle>
            <DialogDescription>Modifiez les informations de l&apos;étudiant ici.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="first_name" className="text-right">
                Prénom
              </Label>
              <Input
                id="first_name"
                value={editedStudent.first_name}
                onChange={(e) => setEditedStudent({ ...editedStudent, first_name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="last_name" className="text-right">
                Nom
              </Label>
              <Input
                id="last_name"
                value={editedStudent.last_name}
                onChange={(e) => setEditedStudent({ ...editedStudent, last_name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gender" className="text-right">
                Genre
              </Label>
              <Select
                value={editedStudent.gender}
                onValueChange={(value: Gender) => setEditedStudent({ ...editedStudent, gender: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionnez un genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Masculin</SelectItem>
                  <SelectItem value="female">Féminin</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date_of_birth" className="text-right">
                Date de naissance
              </Label>
              <Input
                id="date_of_birth"
                type="date"
                value={editedStudent.date_of_birth}
                onChange={(e) => setEditedStudent({ ...editedStudent, date_of_birth: e.target.value })}
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
              Êtes-vous sûr de vouloir supprimer {student.first_name} {student.last_name} ? Cette action est
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

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newStudent, setNewStudent] = useState<Omit<Student, "id">>({
    first_name: "",
    last_name: "",
    gender: "other",
    date_of_birth: "",
  })
  const [activeTab, setActiveTab] = useState<"all" | "male" | "female" | "other">("all")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const loadStudents = useCallback(
    async (search = "") => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/students${search ? `?search=${search}` : ""}`)
        if (!response.ok) throw new Error("Erreur lors du chargement des étudiants")
        const data: Student[] = await response.json()
        setStudents(data)
      } catch (error) {
        console.error("Erreur:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les étudiants. Veuillez réessayer.",
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
    loadStudents(initialSearch)
  }, [searchParams, loadStudents])

  const handleSearch = () => {
    router.push(`/students?search=${searchTerm}`)
    loadStudents(searchTerm)
  }

  const handleEdit = async (student: Student) => {
    try {
      const response = await fetch(`/api/students/${student.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      })
      if (!response.ok) throw new Error("Erreur lors de la mise à jour")
      toast({
        title: "Mise à jour réussie",
        description: `Les informations de ${student.first_name} ${student.last_name} ont été mises à jour.`,
      })
      loadStudents(searchTerm)
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "La mise à jour a échoué. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  const handleAddStudent = async () => {
    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      })
      if (!response.ok) throw new Error("Erreur lors de l'ajout de l'étudiant")
      toast({
        title: "Étudiant ajouté",
        description: `${newStudent.first_name} ${newStudent.last_name} a été ajouté avec succès.`,
      })
      setIsAddDialogOpen(false)
      setNewStudent({ first_name: "", last_name: "", gender: "other", date_of_birth: "" })
      loadStudents(searchTerm)
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "L'ajout de l'étudiant a échoué. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/students/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Erreur lors de la suppression")
      toast({
        title: "Suppression réussie",
        description: "L'étudiant a été supprimé avec succès.",
      })
      loadStudents(searchTerm)
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "La suppression a échoué. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  const handleAssignClass = async (id: number) => {
    // TODO: This is a placeholder function. You would typically open a dialog to select a class
    // and then send a request to assign the selected class to the student.
    toast({
      title: "Fonctionnalité à implémenter",
      description: "L'assignation de classe sera bientôt disponible.",
    })
  }

  const filteredStudents = students.filter(
    (student) =>
      (activeTab === "all" || student.gender === activeTab) &&
      (student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.last_name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="container mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">Gestion des Étudiants</h1>
        <p className="text-xl text-gray-600">Visualisez, ajoutez, modifiez et gérez les informations des étudiants</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-between items-center mb-6"
      >
        <div className="flex space-x-2">
          <Input
            placeholder="Rechercher un étudiant..."
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
              Ajouter un étudiant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouvel étudiant</DialogTitle>
              <DialogDescription>Remplissez les informations pour ajouter un nouvel étudiant.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="first_name" className="text-right">
                  Prénom
                </Label>
                <Input
                  id="first_name"
                  value={newStudent.first_name}
                  onChange={(e) => setNewStudent({ ...newStudent, first_name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="last_name" className="text-right">
                  Nom
                </Label>
                <Input
                  id="last_name"
                  value={newStudent.last_name}
                  onChange={(e) => setNewStudent({ ...newStudent, last_name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="gender" className="text-right">
                  Genre
                </Label>
                <Select
                  value={newStudent.gender}
                  onValueChange={(value: Gender) => setNewStudent({ ...newStudent, gender: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionnez un genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Masculin</SelectItem>
                    <SelectItem value="female">Féminin</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date_of_birth" className="text-right">
                  Date de naissance
                </Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={newStudent.date_of_birth}
                  onChange={(e) => setNewStudent({ ...newStudent, date_of_birth: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddStudent}>Ajouter l'étudiant</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "all" | "male" | "female" | "other")}>
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="male">Masculin</TabsTrigger>
          <TabsTrigger value="female">Féminin</TabsTrigger>
          <TabsTrigger value="other">Autre</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : filteredStudents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-10"
        >
          <p className="text-gray-500 mb-4">Aucun étudiant n&apos;a été trouvé.</p>
          <Button onClick={() => loadStudents()} variant="outline">
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
            {filteredStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAssignClass={handleAssignClass}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}

