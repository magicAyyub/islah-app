"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import NoData from "@/components/ui/NoData"
import AnimatedTableRow from "@/components/AnimatedTableRow"

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
}

type Classe = {
  id?: number
  name: string
  teacher: string
  capacity: number
  registered: number
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<Classe[]>([])
  const [newClass, setNewClass] = useState<Classe>({ name: "", teacher: "", capacity: 0, registered: 0 })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const loadClasses = useCallback(async () => {
    try {
      const response = await fetch("/api/classes")
      if (!response.ok) throw new Error("Erreur lors de la récupération des classes.")
      const data = await response.json()
      setClasses(data)
    } catch (error) {
      console.error(error)
      toast({ title: "Erreur", description: "Une erreur est survenue lors de la récupération des classes." })
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
        body: JSON.stringify(
          {
            name: newClass.name,
            teacher: newClass.teacher,
            capacity: newClass.capacity,
            registered: 0,
          }
        )
      })
      if (!response.ok) throw new Error("Erreur lors de l'ajout de la classe.")
      const data = await response.json()
      setClasses([...classes, data])
    } catch (error) {
      console.error(error)
      toast({ title: "Erreur", description: "Une erreur est survenue lors de l'ajout de la classe." })
    }
    setIsDialogOpen(false)
    toast({
      title: "Classe ajoutée",
      description: `La classe ${newClass.name} a été ajoutée avec succès.`,
    })
  }

  return (
    <motion.div
      className="container mx-auto p-4"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <h1 className="text-3xl font-bold mb-4">Gestion des Classes</h1>
      <p className="mb-4">Visualisez et gérez les classes de l&apos;École Islah</p>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Gestion des Classes</CardTitle>
          <CardDescription>Visualisez et gérez les classes de l&apos;École Islah</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Liste des Classes</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(true)}>Ajouter une Classe</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter une Nouvelle Classe</DialogTitle>
                  <DialogDescription>Remplissez les informations pour créer une nouvelle classe.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Nom</Label>
                    <Input
                      id="name"
                      name="name"
                      value={newClass.name}
                      onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="teacher" className="text-right">Enseignant</Label>
                    <Input
                      id="teacher"
                      name="teacher"
                      value={newClass.teacher}
                      onChange={(e) => setNewClass({ ...newClass, teacher: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="capacity" className="text-right">Capacité</Label>
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      value={newClass.capacity}
                      onChange={(e) => setNewClass({ ...newClass, capacity: Number(e.target.value) })}
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
          {classes.length === 0 ? (
            <NoData message="Aucune classe n'a été trouvée." onRetry={loadClasses} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Enseignant</TableHead>
                  <TableHead>Capacité</TableHead>
                  <TableHead>Inscrits</TableHead>
                  <TableHead>Places Disponibles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map((classe, index) => (
                  <AnimatedTableRow key={classe.id} delay={index * 0.05}>
                    <TableCell className="font-medium">{classe.name}</TableCell>
                    <TableCell>{classe.teacher}</TableCell>
                    <TableCell>{classe.capacity}</TableCell>
                    <TableCell>{classe.registered}</TableCell>
                    <TableCell>
                      <span className={classe.capacity - classe.registered > 5 ? "text-green-600" : "text-red-600"}>
                        {classe.capacity - classe.registered}
                      </span>
                    </TableCell>
                  </AnimatedTableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

