"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { ArrowLeft, Loader2, Receipt, Search } from "lucide-react"
import Link from "next/link"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function NewPaymentPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState("")
  const [paymentType, setPaymentType] = useState("tuition")
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [amount, setAmount] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast.success("Payment recorded successfully")
      router.push("/payments")
    }, 1500)
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Link href="/payments">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="font-semibold text-lg md:text-2xl">Record New Payment</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
            <CardDescription>Select the student making the payment.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="studentSearch">Search Student</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="studentSearch" placeholder="Search by name or ID..." className="pl-8" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="student">Select Student</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger id="student">
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STD001">Ahmed Ali (Grade 5)</SelectItem>
                  <SelectItem value="STD002">Fatima Hassan (Grade 3)</SelectItem>
                  <SelectItem value="STD003">Omar Khalid (Grade 4)</SelectItem>
                  <SelectItem value="STD004">Aisha Mohammed (Grade 2)</SelectItem>
                  <SelectItem value="STD005">Yusuf Ibrahim (Grade 6)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedStudent && (
              <div className="rounded-md border p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Student ID:</span>
                    <span className="text-sm">{selectedStudent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Name:</span>
                    <span className="text-sm">
                      {selectedStudent === "STD001"
                        ? "Ahmed Ali"
                        : selectedStudent === "STD002"
                          ? "Fatima Hassan"
                          : selectedStudent === "STD003"
                            ? "Omar Khalid"
                            : selectedStudent === "STD004"
                              ? "Aisha Mohammed"
                              : "Yusuf Ibrahim"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Class:</span>
                    <span className="text-sm">
                      {selectedStudent === "STD001"
                        ? "Grade 5"
                        : selectedStudent === "STD002"
                          ? "Grade 3"
                          : selectedStudent === "STD003"
                            ? "Grade 4"
                            : selectedStudent === "STD004"
                              ? "Grade 2"
                              : "Grade 6"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Guardian:</span>
                    <span className="text-sm">
                      {selectedStudent === "STD001"
                        ? "Mohammed Ali"
                        : selectedStudent === "STD002"
                          ? "Hassan Ibrahim"
                          : selectedStudent === "STD003"
                            ? "Khalid Omar"
                            : selectedStudent === "STD004"
                              ? "Mohammed Yusuf"
                              : "Ibrahim Ahmed"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>Enter the payment information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paymentType">Payment Type</Label>
              <Select value={paymentType} onValueChange={setPaymentType}>
                <SelectTrigger id="paymentType">
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tuition">Tuition Fee</SelectItem>
                  <SelectItem value="books">Books & Materials</SelectItem>
                  <SelectItem value="activity">Activity Fee</SelectItem>
                  <SelectItem value="uniform">Uniform</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-2.5 top-2.5 text-muted-foreground">$</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-8"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentDate">Payment Date</Label>
              <Input id="paymentDate" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="cursor-pointer">
                    Cash
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank" className="cursor-pointer">
                    Bank Transfer
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="check" id="check" />
                  <Label htmlFor="check" className="cursor-pointer">
                    Check
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Any additional information..." />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/payments">Cancel</Link>
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading || !selectedStudent || !amount}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Receipt className="mr-2 h-4 w-4" />
                  Record Payment
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

