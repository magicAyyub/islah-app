"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
}

// Données fictives pour les paiements
const initialPayments = [
  { id: 1, eleve: "Sophie Martin", classe: "CP", montant: 150, date: "2023-09-01", statut: "Payé" },
  { id: 2, eleve: "Lucas Dubois", classe: "CE1", montant: 150, date: "2023-09-02", statut: "En attente" },
  { id: 3, eleve: "Emma Bernard", classe: "CE2", montant: 150, date: "2023-09-03", statut: "Payé" },
  { id: 4, eleve: "Noah Thomas", classe: "CM1", montant: 150, date: "2023-09-04", statut: "En retard" },
  { id: 5, eleve: "Chloé Robert", classe: "CM2", montant: 150, date: "2023-09-05", statut: "Payé" },
]

export default function PaiementsPage() {
  const [payments, setPayments] = useState(initialPayments)
  const [newPayment, setNewPayment] = useState({ eleve: "", classe: "", montant: "", date: "", statut: "" })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddPayment = () => {
    const newId = Math.max(...payments.map(p => p.id)) + 1
    setPayments([...payments, { ...newPayment, id: newId, montant: parseFloat(newPayment.montant) }])
    setNewPayment({ eleve: "", classe: "", montant: "", date: "", statut: "" })
    setIsDialogOpen(false)
    toast({
      title: "Paiement enregistré",
      description: `Le paiement pour ${newPayment.eleve} a été enregistré avec succès.`,
    })
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
                    <Label htmlFor="eleve" className="text-right">Élève</Label>
                    <Input
                      id="eleve"
                      value={newPayment.eleve}
                      onChange={(e) => setNewPayment({ ...newPayment, eleve: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="classe" className="text-right">Classe</Label>
                    <Select onValueChange={(value) => setNewPayment({ ...newPayment, classe: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Sélectionnez une classe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CP">CP</SelectItem>
                        <SelectItem value="CE1">CE1</SelectItem>
                        <SelectItem value="CE2">CE2</SelectItem>
                        <SelectItem value="CM1">CM1</SelectItem>
                        <SelectItem value="CM2">CM2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="montant" className="text-right">Montant</Label>
                    <Input
                      id="montant"
                      type="number"
                      value={newPayment.montant}
                      onChange={(e) => setNewPayment({ ...newPayment, montant: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
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
                    <Label htmlFor="statut" className="text-right">Statut</Label>
                    <Select onValueChange={(value) => setNewPayment({ ...newPayment, statut: value })}>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Élève</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.eleve}</TableCell>
                  <TableCell>{payment.classe}</TableCell>
                  <TableCell>{payment.montant} €</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>
                    <span className={
                      payment.statut === "Payé" ? "text-green-600" :
                      payment.statut === "En attente" ? "text-yellow-600" :
                      "text-red-600"
                    }>
                      {payment.statut}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  )
}
