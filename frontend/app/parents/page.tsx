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

type Parent = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateInscription: string;
}

const ParentRow = ({ parent, onEdit }: { parent: Parent; onEdit: (parent: Parent) => void }) => {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editedParent, setEditedParent] = useState(parent)

  const handleEdit = () => {
    onEdit(editedParent)
    setIsEditOpen(false)
  }

  return (
    <TableRow key={parent.id}>
      <TableCell>{parent.nom}</TableCell>
      <TableCell>{parent.prenom}</TableCell>
      <TableCell>{parent.email}</TableCell>
      <TableCell>{parent.telephone}</TableCell>
      <TableCell>{new Date(parent.dateInscription).toLocaleDateString()}</TableCell>
      <TableCell>
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Éditer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Édition de {parent.prenom} {parent.nom}</DialogTitle>
              <DialogDescription>
                Modifiez les informations du parent ici.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {Object.entries(editedParent).map(([key, value]) => (
                key !== 'id' && key !== 'dateInscription' && (
                  <div key={key} className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor={key} className="text-right">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
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
    </TableRow>
  )
}

export default function ParentsPage() {
  const [parents, setParents] = useState<Parent[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newParent, setNewParent] = useState<Omit<Parent, 'id' | 'dateInscription'>>({ nom: '', prenom: '', email: '', telephone: '' })
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const loadParents = useCallback(async (search: string = "") => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/parents?search=${search}`)
      if (!response.ok) throw new Error('Erreur lors du chargement des parents')
      const data = await response.json()
      setParents(data)
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
        description: `Les informations de ${parent.prenom} ${parent.nom} ont été mises à jour.`,
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
        body: JSON.stringify(newParent),
      })
      if (!response.ok) throw new Error('Erreur lors de l\'ajout du parent')
      toast({
        title: "Parent ajouté",
        description: `${newParent.prenom} ${newParent.nom} a été ajouté avec succès.`,
      })
      setIsAddDialogOpen(false)
      setNewParent({ nom: '', prenom: '', email: '', telephone: '' })
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
                    {key.charAt(0).toUpperCase() + key.slice(1)}
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
              {parents.map((parent) => (
                <ParentRow 
                  key={parent.id} 
                  parent={parent} 
                  onEdit={handleEdit}
                />
              ))}
            </TableBody>
          </Table>
        )
      )}
    </div>
  )
}

