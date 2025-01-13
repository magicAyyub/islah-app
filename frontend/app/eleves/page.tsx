"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import NoData from "@/components/ui/NoData"
import AnimatedTableRow from "@/components/AnimatedTableRow"

type Student = {
  id?: number;
  last_name: string;
  first_name: string;
  class_id: string;
  birth_date: string;
  registration_date: string;
}

const StudentRow = ({ student, onReinscription, onRenvoi, index }: { student: Student; onReinscription: (student: Student) => void; onRenvoi: (student: Student) => void; index: number }) => {
  const [isReinscriptionOpen, setIsReinscriptionOpen] = useState(false)
  const [isRenvoiOpen, setIsRenvoiOpen] = useState(false)

  return (
    <AnimatedTableRow key={student.id} delay={index * 0.05}>
      <TableCell>{student.last_name}</TableCell>
      <TableCell>{student.first_name}</TableCell>
      <TableCell>{student.class_id}</TableCell>
      <TableCell>{new Date(student.birth_date).toLocaleDateString()}</TableCell>
      <TableCell>{new Date(student.registration_date).toLocaleDateString()}</TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Dialog open={isReinscriptionOpen} onOpenChange={setIsReinscriptionOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">Réinscrire</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Réinscription de {student.first_name} {student.last_name}</DialogTitle>
                <DialogDescription>
                  Confirmez-vous la réinscription de cet élève pour la prochaine année scolaire ?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsReinscriptionOpen(false)}>Annuler</Button>
                <Button onClick={() => {
                  onReinscription(student)
                  setIsReinscriptionOpen(false)
                }}>Confirmer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isRenvoiOpen} onOpenChange={setIsRenvoiOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">Renvoyer</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Renvoi de {student.first_name} {student.last_name}</DialogTitle>
                <DialogDescription>
                  Êtes-vous sûr de vouloir renvoyer cet élève ? Cette action est irréversible.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRenvoiOpen(false)}>Annuler</Button>
                <Button variant="destructive" onClick={() => {
                  onRenvoi(student)
                  setIsRenvoiOpen(false)
                }}>Confirmer le renvoi</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </TableCell>
    </AnimatedTableRow>
  )
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newStudent, setNewStudent] = useState<Omit<Student, 'id' | 'registration_date'>>({ last_name: '', first_name: '', class_id: '', birth_date: '' })
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const loadStudents = useCallback(async (search: string = "") => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/students`);
      if (!response.ok) throw new Error('Erreur lors du chargement des élèves');
      const data: Student[] = await response.json();

      if (search) {
        const filteredStudents = data.filter((student) => {
          return student.first_name.toLowerCase().includes(search.toLowerCase()) || student.last_name.toLowerCase().includes(search.toLowerCase());
        });
        setStudents(filteredStudents);
      }
      setStudents(data);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les élèves. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const initialSearch = searchParams.get('search') || "";
    setSearchTerm(initialSearch);
    loadStudents(initialSearch);
  }, [searchParams, loadStudents]);

  const handleSearch = () => {
    router.push(`/api/students?search=${searchTerm}`)
    loadStudents(searchTerm)
  }

  const handleReinscription = async (student: Student) => {
    try {
      const response = await fetch(`/api/students/${student.id}/reinscription`, { method: 'POST' })
      if (!response.ok) throw new Error('Erreur lors de la réinscription')
      toast({
        title: "Réinscription réussie",
        description: `${student.first_name} ${student.last_name} a été réinscrit avec succès.`,
      })
      loadStudents(searchTerm)
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: "Erreur",
        description: "La réinscription a échoué. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  const handleRenvoi = async (student: Student) => {
    try {
      const response = await fetch(`/api/students/${student.id}/renvoi`, { method: 'POST' })
      if (!response.ok) throw new Error('Erreur lors du renvoi')
      toast({
        title: "Renvoi effectué",
        description: `${student.first_name} ${student.last_name} a été renvoyé.`,
      })
      loadStudents(searchTerm)
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: "Erreur",
        description: "Le renvoi a échoué. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  const handleAddStudent = async () => {
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          last_name: newStudent.last_name,
          first_name: newStudent.first_name,
          class_id: newStudent.class_id,
          birth_date: newStudent.birth_date,
          registration_date: new Date().toISOString().split('T')[0],
        }),
      });
      if (!response.ok) throw new Error('Erreur lors de l\'ajout de l\'élève');
      const addedStudent: Student = await response.json();
      setStudents([addedStudent, ...students]);
      setIsAddDialogOpen(false);
      setNewStudent({ last_name: '', first_name: '', class_id: '', birth_date: '' });
      toast({
        title: "Élève ajouté",
        description: `${newStudent.first_name} ${newStudent.last_name} a été ajouté avec succès.`,
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "L'ajout de l'élève a échoué. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gestion des Élèves</h1>
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Input
            placeholder="Rechercher un élève..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={handleSearch}>Rechercher</Button>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddDialogOpen(true)}>Ajouter un élève</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouvel élève</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour ajouter un nouvel élève.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="last_name" className="text-right">Nom</Label>
                <Input
                  name="last_name"
                  id="last_name"
                  value={newStudent.last_name}
                  onChange={(e) => setNewStudent({ ...newStudent, last_name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="first_name" className="text-right">Prénom</Label>
                <Input
                name="first_name"
                  id="first_name"
                  value={newStudent.first_name}
                  onChange={(e) => setNewStudent({ ...newStudent, first_name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="class_id" className="text-right">Classe</Label>
                <Select
                  name="class_id"
                  id="class_id"
                  value={newStudent.class_id}
                  onValueChange={(value) => setNewStudent({ ...newStudent, class_id: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionnez une classe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">CP</SelectItem>
                    <SelectItem value="2">CE1</SelectItem>
                    <SelectItem value="3">CE2</SelectItem>
                    <SelectItem value="4">CM1</SelectItem>
                    <SelectItem value="5">CM2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="birth_date" className="text-right">Date de naissance</Label>
                <Input
                  id="birth_date"
                  name="birth_date"
                  type="date"
                  value={newStudent.birth_date}
                  onChange={(e) => setNewStudent({ ...newStudent, birth_date: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleAddStudent}>Ajouter l&apos;élève</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? (
        <div>Chargement...</div>
      ) : (
        students.length === 0 ? (
          <NoData message="Aucun élève n'a été trouvé." onRetry={() => loadStudents(searchTerm)} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead>Date de naissance</TableHead>
                <TableHead>Date d&apos;inscription</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student, index) => (
                <StudentRow 
                  key={student.id} 
                  student={student} 
                  onReinscription={handleReinscription}
                  onRenvoi={handleRenvoi}
                  index={index}
                />
              ))}
            </TableBody>
          </Table>
        )
      )}
    </div>
  )
}

