"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Plus, RefreshCw, Search, Clock, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

type DayOfWeek = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY"
type EnrollmentStatus = "active" | "completed" | "withdrawn"

type Classe = {
  id?: number
  name: string
  capacity: number
  day_of_week: DayOfWeek
  start_time: string
  end_time: string
  registered?: number
  enrollmentStatus?: EnrollmentStatus
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}

const daysOfWeek: DayOfWeek[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]

const NoData = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <motion.div
    className="text-center py-10"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <p className="text-gray-500 mb-4">{message}</p>
    <Button onClick={onRetry} variant="outline">
      <RefreshCw className="mr-2 h-4 w-4" />
      Réessayer
    </Button>
  </motion.div>
)

const AnimatedTableRow = ({ children, delay }: { children: React.ReactNode; delay: number }) => (
  <motion.tr initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}>
    {children}
  </motion.tr>
)

const StatusBadge = ({ status }: { status: EnrollmentStatus }) => {
  const statusConfig = {
    active: { label: "Actif", variant: "success" as const },
    completed: { label: "Terminé", variant: "secondary" as const },
    withdrawn: { label: "Retiré", variant: "destructive" as const },
  }

  const config = statusConfig[status]

  return <Badge variant={config.variant}>{config.label}</Badge>
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<Classe[]>([])
  const [newClass, setNewClass] = useState<Classe>({
    name: "",
    capacity: 0,
    day_of_week: "MONDAY",
    start_time: "",
    end_time: "",
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")

  const loadClasses = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/classes")
      if (!response.ok) throw new Error("Erreur lors de la récupération des classes.")
      const data = await response.json()
      setClasses(data)
    } catch (error) {
      console.error(error)
      toast({ title: "Erreur", description: "Une erreur est survenue lors de la récupération des classes." })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadClasses()
  }, [loadClasses])

  const handleAddClass = async () => {
    try {
      const response = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClass),
      })
      if (!response.ok) throw new Error("Erreur lors de l'ajout de la classe.")
      const data = await response.json()
      setClasses([...classes, data])
      setNewClass({
        name: "",
        capacity: 0,
        day_of_week: "MONDAY",
        start_time: "",
        end_time: "",
      })
      setIsDialogOpen(false)
      toast({
        title: "Classe ajoutée",
        description: `La classe ${newClass.name} a été ajoutée avec succès.`,
      })
    } catch (error) {
      console.error(error)
      toast({ title: "Erreur", description: "Une erreur est survenue lors de l'ajout de la classe." })
    }
  }

  const filteredClasses = classes
    .filter(
      (classe) =>
        classe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classe.day_of_week.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "day") return daysOfWeek.indexOf(a.day_of_week) - daysOfWeek.indexOf(b.day_of_week)
      if (sortBy === "capacity") return b.capacity - a.capacity
      if (sortBy === "time") return a.start_time.localeCompare(b.start_time)
      return 0
    })

  const formatDay = (day: DayOfWeek) => {
    return format(new Date(2021, 0, daysOfWeek.indexOf(day) + 1), "EEEE", { locale: fr })
  }

  return (
    <motion.div className="container mx-auto p-4" initial="hidden" animate="visible" variants={fadeIn}>
      <h1 className="text-3xl font-bold mb-4">Gestion des Classes</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Gestion des Classes</CardTitle>
          <CardDescription>Visualisez et gérez les classes de l&apos;École Islah</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Rechercher une classe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Search className="text-gray-400" />
            </div>
            <div className="flex items-center space-x-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nom</SelectItem>
                  <SelectItem value="day">Jour</SelectItem>
                  <SelectItem value="capacity">Capacité</SelectItem>
                  <SelectItem value="time">Heure de début</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter une Classe
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter une Nouvelle Classe</DialogTitle>
                    <DialogDescription>Remplissez les informations pour créer une nouvelle classe.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Nom
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={newClass.name}
                        onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="capacity" className="text-right">
                        Capacité
                      </Label>
                      <Input
                        id="capacity"
                        name="capacity"
                        type="number"
                        value={newClass.capacity}
                        onChange={(e) => setNewClass({ ...newClass, capacity: Number(e.target.value) })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="day_of_week" className="text-right">
                        Jour
                      </Label>
                      <Select
                        value={newClass.day_of_week}
                        onValueChange={(value: DayOfWeek) => setNewClass({ ...newClass, day_of_week: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Sélectionnez un jour" />
                        </SelectTrigger>
                        <SelectContent>
                          {daysOfWeek.map((day) => (
                            <SelectItem key={day} value={day}>
                              {formatDay(day)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="start_time" className="text-right">
                        Heure de début
                      </Label>
                      <Input
                        id="start_time"
                        name="start_time"
                        type="time"
                        value={newClass.start_time}
                        onChange={(e) => setNewClass({ ...newClass, start_time: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="end_time" className="text-right">
                        Heure de fin
                      </Label>
                      <Input
                        id="end_time"
                        name="end_time"
                        type="time"
                        value={newClass.end_time}
                        onChange={(e) => setNewClass({ ...newClass, end_time: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddClass}>Ajouter la Classe</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredClasses.length === 0 ? (
            <NoData message="Aucune classe n'a été trouvée." onRetry={loadClasses} />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Jour</TableHead>
                    <TableHead>Horaire</TableHead>
                    <TableHead>Capacité</TableHead>
                    <TableHead>Inscrits</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredClasses.map((classe, index) => (
                      <AnimatedTableRow key={classe.id} delay={index * 0.05}>
                        <TableCell className="font-medium">{classe.name}</TableCell>
                        <TableCell>{formatDay(classe.day_of_week)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            {classe.start_time} - {classe.end_time}
                          </div>
                        </TableCell>
                        <TableCell>{classe.capacity}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                            {classe.registered || 0}
                          </div>
                        </TableCell>
                        <TableCell>
                          {classe.enrollmentStatus ? (
                            <StatusBadge status={classe.enrollmentStatus} />
                          ) : (
                            <Badge variant={classe.registered === classe.capacity ? "destructive" : "default"}>
                              {classe.registered === classe.capacity ? "Complet" : "Places disponibles"}
                            </Badge>
                          )}
                        </TableCell>
                      </AnimatedTableRow>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

