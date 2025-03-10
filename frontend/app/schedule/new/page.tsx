"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { ArrowLeft, Loader2, Plus, X, Calendar } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample class data
const classData = [
  {
    id: "CLS001",
    name: "Beginners Level",
    day: "Wednesday",
    timeSlot: "15:00 - 17:00",
    location: "Room 101",
    capacity: 15,
    enrolled: 12,
    subjects: ["Quran Studies", "Arabic Basics", "Islamic Ethics"],
    mainTeacher: "Sheikh Abdullah",
    ageGroup: "7-10 years",
  },
  {
    id: "CLS002",
    name: "Intermediate Level",
    day: "Wednesday",
    timeSlot: "17:30 - 19:30",
    location: "Room 101",
    capacity: 15,
    enrolled: 10,
    subjects: ["Quran Memorization", "Arabic Grammar", "Islamic History"],
    mainTeacher: "Sheikh Abdullah",
    ageGroup: "11-14 years",
  },
  // More classes...
]

// Sample subjects for selection
const availableSubjects = [
  { id: "SUB001", name: "Quran Studies", type: "Religious" },
  { id: "SUB002", name: "Arabic Basics", type: "Language" },
  { id: "SUB003", name: "Islamic Ethics", type: "Religious" },
  { id: "SUB004", name: "Quran Memorization", type: "Religious" },
  { id: "SUB005", name: "Arabic Grammar", type: "Language" },
  { id: "SUB006", name: "Islamic History", type: "Religious" },
  { id: "SUB007", name: "Quran Tafsir", type: "Religious" },
  { id: "SUB008", name: "Advanced Arabic", type: "Language" },
  { id: "SUB009", name: "Fiqh Basics", type: "Religious" },
]

export default function NewSchedulePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedClass, setSelectedClass] = useState("")
  const [scheduleItems, setScheduleItems] = useState([])
  const [newItemSubject, setNewItemSubject] = useState("")
  const [newItemStartTime, setNewItemStartTime] = useState("")
  const [newItemEndTime, setNewItemEndTime] = useState("")

  // When a class is selected, pre-fill the time slot
  const handleClassChange = (classId) => {
    setSelectedClass(classId)
    const selectedClassData = classData.find((c) => c.id === classId)

    if (selectedClassData) {
      // Clear existing schedule items
      setScheduleItems([])

      // Extract start and end times from the class time slot
      const [start, end] = selectedClassData.timeSlot.split(" - ")

      // If this is a new class with no schedule items yet, we could pre-populate with empty slots
      // based on the subjects assigned to the class
      if (selectedClassData.subjects && selectedClassData.subjects.length > 0) {
        // Calculate approximate time slots based on the number of subjects
        const totalMinutes = getMinutesBetween(start, end)
        const minutesPerSubject = Math.floor(totalMinutes / selectedClassData.subjects.length)

        let currentStartTime = start
        selectedClassData.subjects.forEach((subject, index) => {
          let subjectEndTime

          if (index === selectedClassData.subjects.length - 1) {
            // Last subject ends at the class end time
            subjectEndTime = end
          } else {
            // Calculate end time for this subject
            subjectEndTime = addMinutesToTime(currentStartTime, minutesPerSubject)
          }

          // Add this subject to the schedule
          const subjectData = availableSubjects.find((s) => s.name === subject)
          if (subjectData) {
            setScheduleItems((prev) => [
              ...prev,
              {
                id: `item-${Date.now()}-${index}`,
                subjectId: subjectData.id,
                subjectName: subject,
                startTime: currentStartTime,
                endTime: subjectEndTime,
              },
            ])
          }

          // Next subject starts when this one ends
          currentStartTime = subjectEndTime
        })
      }
    }
  }

  // Helper function to calculate minutes between two time strings (format: "HH:MM")
  const getMinutesBetween = (startTime, endTime) => {
    const [startHour, startMinute] = startTime.split(":").map(Number)
    const [endHour, endMinute] = endTime.split(":").map(Number)

    return endHour * 60 + endMinute - (startHour * 60 + startMinute)
  }

  // Helper function to add minutes to a time string (format: "HH:MM")
  const addMinutesToTime = (timeString, minutesToAdd) => {
    const [hours, minutes] = timeString.split(":").map(Number)

    const totalMinutes = hours * 60 + minutes + minutesToAdd
    const newHours = Math.floor(totalMinutes / 60)
    const newMinutes = totalMinutes % 60

    return `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`
  }

  const handleAddScheduleItem = () => {
    if (!newItemSubject || !newItemStartTime || !newItemEndTime) {
      toast.error("Please fill in all fields")
      return
    }

    const subject = availableSubjects.find((s) => s.id === newItemSubject)

    setScheduleItems([
      ...scheduleItems,
      {
        id: `item-${Date.now()}`,
        subjectId: newItemSubject,
        subjectName: subject.name,
        startTime: newItemStartTime,
        endTime: newItemEndTime,
      },
    ])

    // Reset form
    setNewItemSubject("")
    setNewItemStartTime("")
    setNewItemEndTime("")
  }

  const handleRemoveScheduleItem = (itemId) => {
    setScheduleItems(scheduleItems.filter((item) => item.id !== itemId))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (scheduleItems.length === 0) {
      toast.error("Please add at least one schedule item")
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast.success("Schedule created successfully")
      router.push("/schedule")
    }, 1500)
  }

  // Get the selected class data
  const classInfo = selectedClass ? classData.find((c) => c.id === selectedClass) : null

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Link href="/schedule">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="font-semibold text-lg md:text-2xl">Add Class Schedule</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Schedule Information</CardTitle>
            <CardDescription>Create a detailed schedule for a class session.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="class">Select Class</Label>
              <Select value={selectedClass} onValueChange={handleClassChange} required>
                <SelectTrigger id="class">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classData.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} - {cls.day} ({cls.timeSlot})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {classInfo && (
              <div className="border rounded-md p-4 bg-muted/30">
                <h3 className="font-medium mb-2">Class Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Level:</span> {classInfo.name}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Day:</span> {classInfo.day}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Time:</span> {classInfo.timeSlot}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Location:</span> {classInfo.location}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Teacher:</span> {classInfo.mainTeacher}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Age Group:</span> {classInfo.ageGroup}
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-muted-foreground text-sm">Subjects:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {classInfo.subjects.map((subject, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedClass && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Schedule Breakdown</Label>
                    <Badge variant="outline" className="font-normal">
                      {scheduleItems.length} items
                    </Badge>
                  </div>

                  {scheduleItems.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Time</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {scheduleItems
                            .sort((a, b) => a.startTime.localeCompare(b.startTime))
                            .map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                  {item.startTime} - {item.endTime}
                                </TableCell>
                                <TableCell>{item.subjectName}</TableCell>
                                <TableCell>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveScheduleItem(item.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="border rounded-md p-4 text-center text-muted-foreground">
                      No schedule items added yet. Add subjects to the schedule below.
                    </div>
                  )}
                </div>

                <div className="space-y-2 border-t pt-4">
                  <Label>Add Schedule Item</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="subject" className="text-xs">
                        Subject
                      </Label>
                      <Select value={newItemSubject} onValueChange={setNewItemSubject}>
                        <SelectTrigger id="subject">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSubjects.map((subject) => (
                            <SelectItem key={subject.id} value={subject.id}>
                              {subject.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="startTime" className="text-xs">
                        Start Time
                      </Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={newItemStartTime}
                        onChange={(e) => setNewItemStartTime(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime" className="text-xs">
                        End Time
                      </Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={newItemEndTime}
                        onChange={(e) => setNewItemEndTime(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddScheduleItem}
                    disabled={!newItemSubject || !newItemStartTime || !newItemEndTime}
                    className="w-full mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Schedule
                  </Button>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/schedule">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isLoading || !selectedClass || scheduleItems.length === 0}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  Create Schedule
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

