"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import NoData from "@/components/ui/NoData"
import AnimatedTableRow from "@/components/AnimatedTableRow"

type Parent = {
  id?: number;
  last_name: string;
  first_name: string;
  email: string;
  phone: string;
  registration_date: string;
}

const ParentRow = ({ parent, onEdit, index }: { parent: Parent; onEdit: (parent: Parent) => void; index: number }) => {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editedParent, setEditedParent] = useState(parent)
  const mapping_keys: { [key in keyof Omit<Parent, 'id' | 'registration_date'>]: string } = {
    "last_name": "Nom",
    "first_name": "Prénom",
    "email": "Email",
    "phone": "Téléphone",
  }

  const handleEdit = () => {
    onEdit(editedParent)
    setIsEditOpen(false)
  }

  return (
    <AnimatedTableRow key={parent.id} delay={index * 0.05}>
      <TableCell>{parent.last_name}</TableCell>
      <TableCell>{parent.first_name}</TableCell>
      <TableCell>{parent.email}</TableCell>
      <TableCell>{parent.phone}</TableCell>
      <TableCell>{parent.registration_date}</TableCell>
      <TableCell>
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Éditer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Édition de {parent.first_name} {parent.last_name}</DialogTitle>
              <DialogDescription>
                Modifiez les informations du parent ici.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {Object.entries(editedParent).map(([key, value]) => (
                key !== 'id' && key !== 'registration_date' && (
                  <div key={key} className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor={key} className="text-right">
                      {mapping_keys[key as keyof typeof mapping_keys]}
                    </Label>
                    <Input
                      id={key}
                      name={key}
                      value={value}
                      onChange={(e) => setEditedParent({ ...editedParent, [key]: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                )
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>Annuler</Button>
              <Button onClick={handleEdit}>Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TableCell>
    </AnimatedTableRow>
  )
}

export default function ParentsPage() {
  const [parents, setParents] = useState<Parent[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newParent, setNewParent] = useState<Omit<Parent, 'id' | 'registration_date'>>({ last_name: '', first_name: '', email: '', phone: '' })
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const mapping_keys = {
    "last_name": "Nom",
    "first_name": "Prénom",
    "email": "Email",
    "phone": "Téléphone",
  }

  const loadParents = useCallback(async (search: string = "") => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/parents`)
      if (!response.ok) throw new Error('Erreur lors du chargement des parents')
      const data: Parent[] = await response.json()
    
      if (search) {
        const filteredParents = data.filter((parent) => (
          parent.last_name.toLowerCase().includes(search.toLowerCase()) ||
          parent.first_name.toLowerCase().includes(search.toLowerCase()) ||
          parent.email.toLowerCase().includes(search.toLowerCase()) ||
          parent.phone.includes(search)
        ))
        setParents(filteredParents)
      }
      setParents(data);
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les parents. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    const initialSearch = searchParams.get('search') || ""
    setSearchTerm(initialSearch)
    loadParents(initialSearch)
  }, [searchParams, loadParents])

  const handleSearch = () => {
    router.push(`/api/parents?search=${searchTerm}`)
    loadParents(searchTerm)
  }

  const handleEdit = async (parent: Parent) => {
    try {
      const response = await fetch(`/api/parents/${parent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parent),
      })
      if (!response.ok) throw new Error('Erreur lors de la mise à jour')
      toast({
        title: "Mise à jour réussie",
        description: `Les informations de ${parent.first_name} ${parent.last_name} ont été mises à jour.`,
      })
      loadParents(searchTerm)
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: "Erreur",
        description: "La mise à jour a échoué. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  const handleAddParent = async () => {
    try {
      const response = await fetch('/api/parents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...newParent, registration_date: new Date().toISOString().split('T')[0]}),
      })
      if (!response.ok) throw new Error('Erreur lors de l\'ajout du parent')
      toast({
        title: "Parent ajouté",
        description: `${newParent.first_name} ${newParent.last_name} a été ajouté avec succès.`,
      })
      setIsAddDialogOpen(false)
      setNewParent({ last_name: '', first_name: '', email: '', phone: '' })
      loadParents(searchTerm)
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: "Erreur",
        description: "L'ajout du parent a échoué. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gestion des Parents</h1>
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Input
            placeholder="Rechercher un parent..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={handleSearch}>Rechercher</Button>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Ajouter un parent</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau parent</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour ajouter un nouveau parent.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {Object.entries(newParent).map(([key, value]) => (
                <div key={key} className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={key} className="text-right">
                    {mapping_keys[key as keyof typeof mapping_keys]}
                  </Label>
                  <Input
                    id={key}
                    name={key}
                    value={value}
                    onChange={(e) => setNewParent({ ...newParent, [key]: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleAddParent}>Ajouter le parent</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? (
        <div>Chargement...</div>
      ) : (
        parents.length === 0 ? (
          <NoData message="Aucun parent n'a été trouvé." onRetry={() => loadParents(searchTerm)} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Date d&apos;inscription</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parents.map((parent, index) => (
                <ParentRow 
                  key={parent.id} 
                  parent={parent} 
                  onEdit={handleEdit}
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

