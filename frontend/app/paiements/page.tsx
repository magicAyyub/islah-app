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
import { StudentSearch } from "@/components/StudentSearch"
import { CreditCard, Plus } from 'lucide-react'
import { Payment, Student } from "@/types/payments"
import { Badge } from "@/components/ui/badge"

export default function PaiementsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [newPayment, setNewPayment] = useState<Payment>({ student_id: 0, class_id: 0, amount: 0, date: new Date().toISOString().split('T')[0], status: 'pending' })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const loadPayments = useCallback(async () => {
    try {
      const response = await fetch(`/api/payments`)
      if (!response.ok) throw new Error('Error loading payments')
      const data: Payment[] = await response.json()
      setPayments(data)
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Unable to load payments. Please try again.",
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
        body: JSON.stringify(newPayment),
      })
      if (!response.ok) throw new Error('Error adding payment')
      const addedPayment: Payment = await response.json()
      setPayments([addedPayment, ...payments])
      setNewPayment({ student_id: 0, class_id: 0, amount: 0, date: new Date().toISOString().split('T')[0], status: 'pending' })
      setIsDialogOpen(false)
      toast({
        title: "Payment Recorded",
        description: `Payment for student ID ${addedPayment.student_id} has been successfully recorded.`,
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to add payment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleStudentSelect = (student: Student, classId: number) => {
    setNewPayment({
      ...newPayment,
      student_id: student.id,
      class_id: classId
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <motion.div
      className="container mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary text-white p-6">
          <CardTitle className="text-3xl font-bold">Payment Management</CardTitle>
          <CardDescription className="text-primary-foreground">Track and record student payments</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Payment List</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 flex items-center">
                  <Plus className="mr-2" size={20} />
                  New Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Record a New Payment</DialogTitle>
                  <DialogDescription>Search for a student and enter the payment amount.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <StudentSearch onSelect={handleStudentSelect} />
                  {newPayment.student_id !== 0 && (
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <Label className="font-semibold">Selected Student</Label>
                      <p className="text-gray-700">Student ID: {newPayment.student_id}</p>
                      <p className="text-gray-700">Class ID: {newPayment.class_id}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={newPayment.amount}
                      onChange={(e) => setNewPayment({ ...newPayment, amount: Number(e.target.value) })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddPayment} disabled={newPayment.student_id === 0 || newPayment.amount <= 0}>
                    Record Payment
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          {payments.length === 0 ? (
            <NoData message="No payments have been recorded yet." onRetry={loadPayments} />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Class ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment, index) => (
                    <AnimatedTableRow key={payment.id} delay={index * 0.05}>
                      <TableCell className="font-medium">{payment.student_id}</TableCell>
                      <TableCell>{payment.class_id}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          <CreditCard className="mr-1" size={16} />
                          {payment.amount} €
                        </span>
                      </TableCell>
                      <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                    </AnimatedTableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

