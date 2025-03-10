"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, Loader2, UserCheck } from "lucide-react"
import { format } from "date-fns"

const students = [
  {
    id: "STD001",
    name: "Ahmed Ali",
    class: "Grade 5",
    present: true,
  },
  {
    id: "STD002",
    name: "Fatima Hassan",
    class: "Grade 5",
    present: true,
  },
  {
    id: "STD003",
    name: "Omar Khalid",
    class: "Grade 5",
    present: false,
  },
  {
    id: "STD004",
    name: "Aisha Mohammed",
    class: "Grade 5",
    present: true,
  },
  {
    id: "STD005",
    name: "Yusuf Ibrahim",
    class: "Grade 5",
    present: true,
  },
  {
    id: "STD006",
    name: "Khadija Ali",
    class: "Grade 5",
    present: false,
  },
  {
    id: "STD007",
    name: "Bilal Mohammed",
    class: "Grade 5",
    present: true,
  },
]

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState("grade5")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [attendanceData, setAttendanceData] = useState(students)
  const [isLoading, setIsLoading] = useState(false)

  const handleAttendanceChange = (studentId, isPresent) => {
    setAttendanceData(
      attendanceData.map((student) => (student.id === studentId ? { ...student, present: isPresent } : student)),
    )
  }

  const handleSubmit = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast.success("Attendance saved successfully")
    }, 1500)
  }

  const markAllPresent = () => {
    setAttendanceData(attendanceData.map((student) => ({ ...student, present: true })))
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <h1 className="font-semibold text-lg md:text-2xl">Daily Attendance</h1>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4">
            <div>
              <CardTitle>Mark Attendance</CardTitle>
              <CardDescription className="mt-1">{format(selectedDate, "EEEE, MMMM d, yyyy")}</CardDescription>
            </div>

            <div className="flex flex-col xs:flex-row gap-3">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-full xs:w-[180px]">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grade1">Grade 1</SelectItem>
                  <SelectItem value="grade2">Grade 2</SelectItem>
                  <SelectItem value="grade3">Grade 3</SelectItem>
                  <SelectItem value="grade4">Grade 4</SelectItem>
                  <SelectItem value="grade5">Grade 5</SelectItem>
                  <SelectItem value="grade6">Grade 6</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                className="flex items-center justify-center gap-2 w-full xs:w-auto"
                onClick={() => markAllPresent()}
              >
                <UserCheck className="h-4 w-4" />
                <span>Mark All Present</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {attendanceData.map((student) => (
              <Card
                key={student.id}
                className={`overflow-hidden transition-all duration-200 relative ${
                  student.present ? "border-green-200 dark:border-green-900" : "border-red-200 dark:border-red-900"
                }`}
              >
                <div className={`h-2 w-full ${student.present ? "bg-green-500" : "bg-red-500"} absolute top-0`} />
                <CardContent className="p-4 pt-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={student.name} />
                      <AvatarFallback>
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.id}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button
                    variant={student.present ? "default" : "outline"}
                    size="sm"
                    className="flex-1 h-10"
                    onClick={() => handleAttendanceChange(student.id, true)}
                  >
                    Present
                  </Button>
                  <Button
                    variant={!student.present ? "destructive" : "outline"}
                    size="sm"
                    className="flex-1 h-10"
                    onClick={() => handleAttendanceChange(student.id, false)}
                  >
                    Absent
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col xs:flex-row gap-3 xs:justify-between border-t p-4 sm:p-6">
          <Button variant="outline" className="w-full xs:w-auto">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading} className="w-full xs:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Save Attendance
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

