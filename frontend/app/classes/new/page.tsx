"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { ArrowLeft, Loader2, Plus, X, GraduationCap } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

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

export default function NewClassPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [className, setClassName] = useState("")
  const [day, setDay] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [location, setLocation] = useState("")
  const [capacity, setCapacity] = useState("")
  const [ageGroup, setAgeGroup] = useState("")
  const [mainTeacher, setMainTeacher] = useState("")
  const [selectedSubjects, setSelectedSubjects] = useState([])
  const [subjectToAdd, setSubjectToAdd] = useState("")

  const handleAddSubject = () => {
    if (!subjectToAdd) return

    const subject = availableSubjects.find((s) => s.id === subjectToAdd)
    if (subject && !selectedSubjects.some((s) => s.id === subject.id)) {
      setSelectedSubjects([...selectedSubjects, subject])
      setSubjectToAdd("")
    }
  }

  const handleRemoveSubject = (subjectId) => {
    setSelectedSubjects(selectedSubjects.filter((s) => s.id !== subjectId))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (selectedSubjects.length === 0) {
      toast.error("Please select at least one subject")
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast.success("Class created successfully!")
      router.push("/classes")
    }, 1500)
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Link href="/classes">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="font-semibold text-lg md:text-2xl">Add New Class</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Class Information</CardTitle>
            <CardDescription>Create a new class with time slot, level, and subjects.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="className">Class Name/Level</Label>
                <Input
                  id="className"
                  placeholder="e.g. Beginners Level, Intermediate Level"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="day">Day</Label>
                <Select value={day} onValueChange={setDay} required>
                  <SelectTrigger id="day">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Wednesday">Wednesday</SelectItem>
                    <SelectItem value="Saturday">Saturday</SelectItem>
                    <SelectItem value="Sunday">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g. Room 101"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  placeholder="Maximum number of students"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ageGroup">Age Group</Label>
                <Input
                  id="ageGroup"
                  placeholder="e.g. 7-10 years"
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mainTeacher">Main Teacher</Label>
                <Input
                  id="mainTeacher"
                  placeholder="Teacher's name"
                  value={mainTeacher}
                  onChange={(e) => setMainTeacher(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Subjects</Label>
              <div className="flex gap-2">
                <Select value={subjectToAdd} onValueChange={setSubjectToAdd}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select subject to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubjects.map((subject) => (
                      <SelectItem
                        key={subject.id}
                        value={subject.id}
                        disabled={selectedSubjects.some((s) => s.id === subject.id)}
                      >
                        {subject.name} ({subject.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" onClick={handleAddSubject} disabled={!subjectToAdd}>
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>

            {selectedSubjects.length > 0 && (
              <div className="border rounded-md p-3">
                <Label className="mb-2 block">Selected Subjects:</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedSubjects.map((subject) => (
                    <Badge key={subject.id} variant="secondary" className="flex items-center gap-1 py-1 px-2">
                      {subject.name}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 text-muted-foreground hover:text-foreground"
                        onClick={() => handleRemoveSubject(subject.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/classes">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isLoading || selectedSubjects.length === 0}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Create Class
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

