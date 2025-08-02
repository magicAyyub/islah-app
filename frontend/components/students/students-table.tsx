"use client"

import { motion } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Edit, Eye, MoreHorizontal, ChevronLeft, ChevronRight, Users, Search, Filter, Flag, UserX, AlertTriangle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { api } from "@/lib/api"
import type { Student } from "@/types"

interface StudentsTableProps {
  students: Student[]
  isLoading: boolean
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onEditStudent: (student: Student) => void
  searchTerm?: string
  hasActiveFilters?: boolean
  onRefresh?: () => void
}

export function StudentsTable({
  students,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onEditStudent,
  searchTerm = "",
  hasActiveFilters = false,
  onRefresh,
}: StudentsTableProps) {
  const [flagDialogOpen, setFlagDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [flagType, setFlagType] = useState("")
  const [flagReason, setFlagReason] = useState("")
  const [expelReason, setExpelReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getStatusBadge = (status?: string) => {
    const variants = {
      confirmed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800",
    }

    const labels = {
      confirmed: "Confirmé",
      pending: "En attente",
      cancelled: "Annulé",
    }

    const statusKey = status || "pending"
    return (
      <Badge className={variants[statusKey as keyof typeof variants] || variants.pending}>
        {labels[statusKey as keyof typeof labels] || statusKey}
      </Badge>
    )
  }

  const getFlagBadge = (student: Student) => {
    const activeFlags = student.flags?.filter(flag => flag.is_active) || []
    if (activeFlags.length === 0) return null

    const flagColors = {
      payment_issue: "bg-red-100 text-red-800",
      bounced_check: "bg-orange-100 text-orange-800", 
      late_payment: "bg-yellow-100 text-yellow-800",
      behavior: "bg-purple-100 text-purple-800",
      other: "bg-gray-100 text-gray-800"
    }

    return (
      <div className="flex gap-1 flex-wrap">
        {activeFlags.map(flag => (
          <Badge 
            key={flag.id} 
            className={`text-xs ${flagColors[flag.flag_type as keyof typeof flagColors] || flagColors.other}`}
            title={flag.reason}
          >
            <Flag className="w-3 h-3 mr-1" />
            {flag.flag_type.replace('_', ' ')}
          </Badge>
        ))}
      </div>
    )
  }

  const handleFlagStudent = async () => {
    if (!selectedStudent || !flagType || !flagReason) return
    
    setIsSubmitting(true)
    try {
      await api.flagStudent(selectedStudent.id, flagType, flagReason)
      setFlagDialogOpen(false)
      setFlagType("")
      setFlagReason("")
      setSelectedStudent(null)
      onRefresh?.()
    } catch (error) {
      console.error("Error flagging student:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUnflagStudent = async (studentId: number) => {
    try {
      await api.unflagStudent(studentId)
      onRefresh?.()
    } catch (error) {
      console.error("Error unflagging student:", error)
    }
  }

  const handleExpelStudent = async (studentId: number, reason: string) => {
    try {
      await api.expelStudent(studentId, reason)
      onRefresh?.()
    } catch (error) {
      console.error("Error expelling student:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Empty state when no students found
  if (!isLoading && students.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-gray-100 rounded-full">
            {searchTerm || hasActiveFilters ? (
              <Search className="w-8 h-8 text-gray-400" />
            ) : (
              <Users className="w-8 h-8 text-gray-400" />
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {searchTerm || hasActiveFilters 
                ? "Aucun résultat trouvé" 
                : "Aucun élève inscrit"}
            </h3>
            <p className="text-gray-500 max-w-md">
              {searchTerm || hasActiveFilters 
                ? `Aucun élève ne correspond à votre recherche${searchTerm ? ` "${searchTerm}"` : ""} ou aux filtres sélectionnés. Essayez de modifier vos critères de recherche.`
                : "Il n'y a pas encore d'élèves inscrits dans le système. Commencez par ajouter votre premier élève."}
            </p>
          </div>

          {searchTerm || hasActiveFilters ? (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Filter className="w-4 h-4" />
              <span>Essayez de modifier vos filtres ou votre recherche</span>
            </div>
          ) : null}
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Élève</TableHead>
              <TableHead>Classe</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Année scolaire</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student, index) => (
              <motion.tr
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-emerald-100 text-emerald-700">
                        {student.first_name[0]}
                        {student.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {student.first_name} {student.last_name}
                        </p>
                        {student.flags?.some(flag => flag.is_active) && (
                          <div title="Élève signalé">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(student.date_of_birth).toLocaleDateString("fr-FR")}
                      </p>
                      {getFlagBadge(student)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{student.class?.name || "Non assigné"}</span>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">
                      {student.parent?.first_name} {student.parent?.last_name}
                    </p>
                    <p className="text-sm text-gray-500">{student.parent?.phone}</p>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(student.registration_status)}</TableCell>
                <TableCell>
                  <span className="text-sm">{student.academic_year}</span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        Voir le profil
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditStudent(student)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      {/* Flag/Unflag Student */}
                      {student.flags?.some(flag => flag.is_active) ? (
                        <DropdownMenuItem 
                          onClick={() => handleUnflagStudent(student.id)}
                          className="text-green-600"
                        >
                          <Flag className="w-4 h-4 mr-2" />
                          Retirer signalement
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedStudent(student)
                            setFlagDialogOpen(true)
                          }}
                          className="text-amber-600"
                        >
                          <Flag className="w-4 h-4 mr-2" />
                          Signaler élève
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuSeparator />
                      
                      {/* Expel Student */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem 
                            className="text-red-600 focus:text-red-600"
                            onSelect={(e) => e.preventDefault()}
                          >
                            <UserX className="w-4 h-4 mr-2" />
                            Renvoyer élève
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Renvoyer {student.first_name} {student.last_name}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action est <strong>irréversible</strong> et supprimera définitivement toutes les données de l'élève (profil, paiements, notes, etc.). 
                              Cette option ne devrait être utilisée que dans des cas graves.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="my-4">
                            <Label htmlFor="expel-reason">Raison du renvoi (obligatoire)</Label>
                            <Textarea
                              id="expel-reason"
                              placeholder="Expliquez la raison du renvoi..."
                              value={expelReason}
                              onChange={(e) => setExpelReason(e.target.value)}
                              className="mt-2"
                            />
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setExpelReason("")}>
                              Annuler
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                if (expelReason.trim()) {
                                  handleExpelStudent(student.id, expelReason)
                                  setExpelReason("")
                                }
                              }}
                              disabled={!expelReason.trim()}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Confirmer le renvoi
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Page {currentPage} sur {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Suivant
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
      
      {/* Flag Student Dialog */}
      <Dialog open={flagDialogOpen} onOpenChange={setFlagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Signaler {selectedStudent?.first_name} {selectedStudent?.last_name}</DialogTitle>
            <DialogDescription>
              Ajoutez un signalement pour cet élève. Cela vous aidera à suivre les problèmes de paiement ou autres.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="flag-type">Type de signalement</Label>
              <Select value={flagType} onValueChange={setFlagType}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="payment_issue">Problème de paiement</SelectItem>
                  <SelectItem value="bounced_check">Chèque sans provision</SelectItem>
                  <SelectItem value="late_payment">Retard de paiement</SelectItem>
                  <SelectItem value="behavior">Problème de comportement</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="flag-reason">Raison du signalement</Label>
              <Textarea
                id="flag-reason"
                placeholder="Décrivez la raison du signalement..."
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setFlagDialogOpen(false)
                setFlagType("")
                setFlagReason("")
                setSelectedStudent(null)
              }}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleFlagStudent}
              disabled={!flagType || !flagReason.trim() || isSubmitting}
            >
              {isSubmitting ? "Signalement..." : "Signaler"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
