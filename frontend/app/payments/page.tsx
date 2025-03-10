"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Plus, Search, CreditCard, DollarSign, AlertCircle, FileText, Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const payments = [
  {
    id: "PAY001",
    student: "Ahmed Ali",
    studentId: "STD001",
    class: "Grade 5",
    amount: 250,
    type: "Tuition Fee",
    date: "2025-03-01",
    status: "Paid",
    paymentMethod: "Cash",
    semester: "First Semester",
  },
  {
    id: "PAY002",
    student: "Fatima Hassan",
    studentId: "STD002",
    class: "Grade 3",
    amount: 250,
    type: "Tuition Fee",
    date: "2025-03-02",
    status: "Paid",
    paymentMethod: "Bank Transfer",
    semester: "First Semester",
  },
  {
    id: "PAY003",
    student: "Omar Khalid",
    studentId: "STD003",
    class: "Grade 4",
    amount: 100,
    type: "Books & Materials",
    date: "2025-03-05",
    status: "Paid",
    paymentMethod: "Cash",
    semester: "First Semester",
  },
  {
    id: "PAY004",
    student: "Aisha Mohammed",
    studentId: "STD004",
    class: "Grade 2",
    amount: 250,
    type: "Tuition Fee",
    date: "2025-03-10",
    status: "Pending",
    paymentMethod: "Pending",
    semester: "First Semester",
  },
  {
    id: "PAY005",
    student: "Yusuf Ibrahim",
    studentId: "STD005",
    class: "Grade 6",
    amount: 250,
    type: "Tuition Fee",
    date: "2025-03-15",
    status: "Overdue",
    paymentMethod: "Pending",
    semester: "First Semester",
  },
  {
    id: "PAY006",
    student: "Khadija Ali",
    studentId: "STD006",
    class: "Grade 1",
    amount: 100,
    type: "Books & Materials",
    date: "2025-03-08",
    status: "Paid",
    paymentMethod: "Cash",
    semester: "First Semester",
  },
  {
    id: "PAY007",
    student: "Bilal Mohammed",
    studentId: "STD007",
    class: "Grade 5",
    amount: 50,
    type: "Activity Fee",
    date: "2025-03-12",
    status: "Paid",
    paymentMethod: "Cash",
    semester: "First Semester",
  },
]

export default function PaymentsPage() {
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredPayments =
    filterStatus === "all"
      ? payments
      : payments.filter((payment) => payment.status.toLowerCase() === filterStatus.toLowerCase())

  const totalPaid = payments
    .filter((payment) => payment.status === "Paid")
    .reduce((sum, payment) => sum + payment.amount, 0)

  const totalPending = payments
    .filter((payment) => payment.status === "Pending")
    .reduce((sum, payment) => sum + payment.amount, 0)

  const totalOverdue = payments
    .filter((payment) => payment.status === "Overdue")
    .reduce((sum, payment) => sum + payment.amount, 0)

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <h1 className="font-semibold text-lg md:text-2xl">Payments</h1>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search payments..." className="w-[200px] md:w-[300px] pl-8" />
          </div>
          <Link href="/payments/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Record Payment
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPaid}</div>
            <p className="text-xs text-muted-foreground">For current semester</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <CreditCard className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPending}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalOverdue}</div>
            <p className="text-xs text-muted-foreground">Past due date</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <FileText className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
            <p className="text-xs text-muted-foreground">All payment records</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Payment Records</CardTitle>
              <CardDescription>View and manage all payment records.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Student</TableHead>
                <TableHead className="hidden md:table-cell">Class</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{payment.student}</div>
                      <div className="text-xs text-muted-foreground">{payment.studentId}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{payment.class}</TableCell>
                  <TableCell>${payment.amount}</TableCell>
                  <TableCell className="hidden md:table-cell">{payment.type}</TableCell>
                  <TableCell className="hidden md:table-cell">{payment.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        payment.status === "Paid" ? "default" : payment.status === "Pending" ? "outline" : "destructive"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        {payment.status !== "Paid" && <DropdownMenuItem>Mark as paid</DropdownMenuItem>}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Print receipt</DropdownMenuItem>
                        <DropdownMenuItem>Send reminder</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete record</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Calendar</CardTitle>
          <CardDescription>Upcoming and overdue payments for the current month.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <div className="flex flex-col items-center">
              <Calendar className="h-16 w-16 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">Payment Calendar</h3>
              <p className="text-sm text-muted-foreground text-center mt-1 max-w-md">
                The payment calendar view will show upcoming payment due dates and allow you to track payment schedules.
              </p>
              <Button className="mt-4">View Full Calendar</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

