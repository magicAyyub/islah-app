"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import NoData from "@/components/ui/NoData"
import AnimatedTableRow from "@/components/AnimatedTableRow"

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
}

type Payment = {
  id?: number;
  student_id: string;
  class_id: string;
  amount: number;
  date: string;
  status: string;
}

export default function PaiementsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [newPayment, setNewPayment] = useState({ student_id: "", class_id: "", amount: "", date: "", status: "" })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const loadPayments = useCallback(async () => {
    try {
      const response = await fetch(`/api/payments`)
      if (!response.ok) throw new Error('Erreur lors du chargement des paiements')
      const data: Payment[] = await response.json()
      console.log(data)
      setPayments(data)
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les paiements. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }, [])

  useEffect(() => {
    loadPayments()
  }, [loadPayments])

  const handleAddPayment = async () => {
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...newPayment, amount: Number(newPayment.amount)}),
      })
      if (!response.ok) throw new Error('Erreur lors de l\'ajout du paiement')
      const addedPayment: Payment = await response.json()
      setPayments([addedPayment, ...payments])
      setNewPayment({ student_id: "", class_id: "", amount: "", date: "", status: "" })
      setIsDialogOpen(false)
      toast({
        title: "Paiement enregistré",
        // TODO: Mettre le nom de l'élève au lieu de l'id
        description: `Le paiement pour ${newPayment.student_id} a été enregistré avec succès.`,
      })
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: "Erreur",
        description: "L'ajout du paiement a échoué. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  return (
    <motion.div
      className="container mx-auto p-4"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Gestion des Paiements</CardTitle>
          <CardDescription>Suivez et enregistrez les paiements des élèves</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Liste des Paiements</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>Enregistrer un Paiement</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Enregistrer un Nouveau Paiement</DialogTitle>
                  <DialogDescription>Remplissez les informations pour enregistrer un nouveau paiement.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    {/* TODO: Logic à remplacer  avec une recherche en temps réel avec l'input */}
                    <Label htmlFor="student_id" className="text-right">Élève</Label>        
                    <Select 
                    name="student_id"
                    id="student_id"
                    onValueChange={(value) => setNewPayment({ ...newPayment, student_id: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Sélectionnez un élève" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Elève 1</SelectItem>
                        <SelectItem value="2">Élève 2</SelectItem>
                        <SelectItem value="3">Élève 3</SelectItem>
                        <SelectItem value="4">Élève 4</SelectItem>
                        <SelectItem value="5">Élève 5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    {/* TODO: Remplacer cette logique en cherchant la liste via l'api  */}
                    <Label htmlFor="class_id" className="text-right">Classe</Label>
                    <Select 
                    name="class_id"
                    id="class_id"
                    value={newPayment.class_id}
                    onValueChange={(value) => setNewPayment({ ...newPayment, class_id: value })}>
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
                    <Label htmlFor="amount" className="text-right">Montant</Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      value={newPayment.montant}
                      onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    {/* TODO: à revoir car inutile  */}
                    <Label htmlFor="date" className="text-right">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newPayment.date}
                      onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    {/* TODO: à revoir car inutile  */}
                    <Label htmlFor="status" className="text-right">Statut</Label>
                    <Select 
                    name="status"
                    id="status"
                    onValueChange={(value) => setNewPayment({ ...newPayment, status: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Sélectionnez un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Payé">Payé</SelectItem>
                        <SelectItem value="En attente">En attente</SelectItem>
                        <SelectItem value="En retard">En retard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddPayment}>Enregistrer le Paiement</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          {payments.length === 0 ? (
            <NoData message="Aucun paiement n'a été enregistré pour le moment." onRetry={loadPayments} />
          ) : (
            <Table>
              <TableHeader>
                <AnimatedTableRow>
                  <TableHead>Élève</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                </AnimatedTableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment, index) => (
                  <AnimatedTableRow key={payment.id} delay={index * 0.05}>
                    <TableCell className="font-medium">{payment.student_id}</TableCell>
                    <TableCell>{payment.class_id}</TableCell>
                    <TableCell>{payment.amount} €</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>
                      <span className={
                        payment.status === "Payé" ? "text-green-600" :
                        payment.status === "En attente" ? "text-yellow-600" :
                        "text-red-600"
                      }>
                        {payment.status}
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

