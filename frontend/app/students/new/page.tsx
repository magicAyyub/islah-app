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
import { ArrowLeft, Loader2, UserPlus, Users, Calendar, CheckCircle, Search } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"

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
  {
    id: "CLS003",
    name: "Beginners Level",
    day: "Saturday",
    timeSlot: "09:00 - 11:00",
    location: "Room 102",
    capacity: 20,
    enrolled: 18,
    subjects: ["Quran Studies", "Arabic Basics", "Islamic Ethics"],
    mainTeacher: "Ustadh Hassan",
    ageGroup: "7-10 years",
  },
  {
    id: "CLS004",
    name: "Intermediate Level",
    day: "Saturday",
    timeSlot: "11:30 - 13:30",
    location: "Room 102",
    capacity: 20,
    enrolled: 15,
    subjects: ["Quran Memorization", "Arabic Grammar", "Islamic History"],
    mainTeacher: "Ustadh Hassan",
    ageGroup: "11-14 years",
  },
  {
    id: "CLS005",
    name: "Advanced Level",
    day: "Saturday",
    timeSlot: "15:00 - 17:00",
    location: "Room 103",
    capacity: 25,
    enrolled: 20,
    subjects: ["Quran Tafsir", "Advanced Arabic", "Fiqh Basics"],
    mainTeacher: "Ustadha Fatima",
    ageGroup: "14-16 years",
  },
  {
    id: "CLS006",
    name: "Beginners Level",
    day: "Sunday",
    timeSlot: "09:00 - 11:00",
    location: "Room 103",
    capacity: 25,
    enrolled: 15,
    subjects: ["Quran Studies", "Arabic Basics", "Islamic Ethics"],
    mainTeacher: "Ustadh Mohammed",
    ageGroup: "7-10 years",
  },
  {
    id: "CLS007",
    name: "Intermediate Level",
    day: "Sunday",
    timeSlot: "11:30 - 13:30",
    location: "Room 101",
    capacity: 20,
    enrolled: 12,
    subjects: ["Quran Memorization", "Arabic Grammar", "Islamic History"],
    mainTeacher: "Sheikh Khalid",
    ageGroup: "11-14 years",
  },
  {
    id: "CLS008",
    name: "Advanced Level",
    day: "Sunday",
    timeSlot: "15:00 - 17:00",
    location: "Room 102",
    capacity: 15,
    enrolled: 10,
    subjects: ["Quran Tafsir", "Advanced Arabic", "Fiqh Basics"],
    mainTeacher: "Sheikh Abdullah",
    ageGroup: "14-16 years",
  },
]

// Sample guardian data
const existingGuardians = [
  {
    id: "GRD001",
    name: "Mohammed Ali",
    phone: "+123456789",
    email: "mohammed.ali@example.com",
    children: ["Ahmed Ali"],
  },
  {
    id: "GRD002",
    name: "Hassan Ibrahim",
    phone: "+123456790",
    email: "hassan.ibrahim@example.com",
    children: ["Fatima Hassan"],
  },
  {
    id: "GRD003",
    name: "Khalid Omar",
    phone: "+123456791",
    email: "khalid.omar@example.com",
    children: ["Omar Khalid"],
  },
]

// Group classes by day for the schedule view
const classesByDay = {
  Wednesday: classData.filter((cls) => cls.day === "Wednesday"),
  Saturday: classData.filter((cls) => cls.day === "Saturday"),
  Sunday: classData.filter((cls) => cls.day === "Sunday"),
}

export default function NewStudentPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedClass, setSelectedClass] = useState("")
  const [guardianOption, setGuardianOption] = useState("existing")
  const [selectedGuardian, setSelectedGuardian] = useState("")
  const [guardianSearchTerm, setGuardianSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("class-selection")
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("all")
  const [formProgress, setFormProgress] = useState(33)

  const filteredGuardians = guardianSearchTerm
    ? existingGuardians.filter(
        (g) =>
          g.name.toLowerCase().includes(guardianSearchTerm.toLowerCase()) ||
          g.phone.includes(guardianSearchTerm) ||
          g.email.toLowerCase().includes(guardianSearchTerm.toLowerCase()),
      )
    : existingGuardians

  const handleClassToggle = (classId) => {
    setSelectedClass(classId === selectedClass ? "" : classId)
  }

  const handleTabChange = (value) => {
    setActiveTab(value)
    if (value === "class-selection") setFormProgress(33)
    if (value === "student-info") setFormProgress(66)
    if (value === "guardian-info") setFormProgress(100)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast.success("Student registered successfully!")
      router.push("/students")
    }, 1500)
  }

  // Get the selected class data
  const selectedClassData = classData.find((cls) => cls.id === selectedClass)

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Link href="/students">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="font-semibold text-lg md:text-2xl">Register New Student</h1>
      </div>

      <div className="mb-6">
        <Progress value={formProgress} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span className={activeTab === "class-selection" ? "font-medium text-primary" : ""}>Class Selection</span>
          <span className={activeTab === "student-info" ? "font-medium text-primary" : ""}>Student Information</span>
          <span className={activeTab === "guardian-info" ? "font-medium text-primary" : ""}>Guardian Information</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="class-selection" className="relative">
            <span className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">
                1
              </span>
              <span className="hidden sm:inline">Class</span>
            </span>
          </TabsTrigger>
          <TabsTrigger value="student-info" className="relative" disabled={!selectedClass}>
            <span className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">
                2
              </span>
              <span className="hidden sm:inline">Student</span>
            </span>
          </TabsTrigger>
          <TabsTrigger value="guardian-info" className="relative" disabled={activeTab === "class-selection"}>
            <span className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">
                3
              </span>
              <span className="hidden sm:inline">Guardian</span>
            </span>
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <TabsContent value="class-selection">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Choose a Class</CardTitle>
                    <CardDescription>Select a class from our weekly schedule</CardDescription>
                  </div>
                  <div className="w-full md:w-auto">
                    <Select value={selectedAgeGroup} onValueChange={setSelectedAgeGroup}>
                      <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filter by age" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Age Groups</SelectItem>
                        <SelectItem value="7-10 years">7-10 years (Beginners)</SelectItem>
                        <SelectItem value="11-14 years">11-14 years (Intermediate)</SelectItem>
                        <SelectItem value="14-16 years">14-16 years (Advanced)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(classesByDay).map(([day, classes]) => {
                    // Filter classes by selected age group
                    const filteredClasses =
                      selectedAgeGroup === "all" ? classes : classes.filter((cls) => cls.ageGroup === selectedAgeGroup)

                    if (filteredClasses.length === 0) return null

                    return (
                      <div key={day} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-primary" />
                          <h3 className="font-medium text-lg">{day}</h3>
                        </div>

                        <div className="relative overflow-hidden rounded-lg border">
                          <div className="grid grid-cols-12 bg-muted/50 text-xs font-medium text-muted-foreground">
                            <div className="col-span-2 p-2 border-r">Time</div>
                            <div className="col-span-10 p-2">
                              <div className="grid grid-cols-12 gap-1">
                                {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((hour) => (
                                  <div key={hour} className="text-center">
                                    {hour}:00
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {filteredClasses.map((cls) => {
                            const isAvailable = cls.enrolled < cls.capacity
                            const isSelected = selectedClass === cls.id

                            // Parse time slot
                            const timeRange = cls.timeSlot.split(" - ")
                            const startTime = timeRange[0].split(":")
                            const endTime = timeRange[1].split(":")

                            const startHour = Number.parseInt(startTime[0])
                            const startMinute = Number.parseInt(startTime[1])
                            const endHour = Number.parseInt(endTime[0])
                            const endMinute = Number.parseInt(endTime[1])

                            // Calculate position (8:00 is 0%, 20:00 is 100%)
                            const timelineStart = 8 // 8 AM
                            const timelineHours = 12 // 12 hours displayed (8 AM to 8 PM)

                            const startPosition = (startHour - timelineStart + startMinute / 60) / timelineHours
                            const endPosition = (endHour - timelineStart + endMinute / 60) / timelineHours
                            const duration = endPosition - startPosition

                            // Calculate availability percentage
                            const availabilityPercentage = (cls.enrolled / cls.capacity) * 100

                            return (
                              <div key={cls.id} className="grid grid-cols-12 border-t">
                                <div className="col-span-2 p-2 border-r flex flex-col justify-center">
                                  <div className="font-medium">{cls.name}</div>
                                  <div className="text-xs text-muted-foreground">{cls.ageGroup}</div>
                                </div>
                                <div className="col-span-10 p-2 relative">
                                  <div
                                    className={`absolute top-2 bottom-2 rounded-md border transition-all ${
                                      isSelected
                                        ? "ring-2 ring-primary border-primary"
                                        : isAvailable
                                          ? "border-green-200 bg-green-50 hover:bg-green-100 dark:border-green-900 dark:bg-green-950/30 dark:hover:bg-green-950/50"
                                          : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30 opacity-60"
                                    }`}
                                    style={{
                                      left: `${startPosition * 100}%`,
                                      width: `${duration * 100}%`,
                                      cursor: isAvailable ? "pointer" : "not-allowed",
                                    }}
                                    onClick={() => isAvailable && handleClassToggle(cls.id)}
                                  >
                                    <div className="h-full p-2 flex flex-col justify-between">
                                      <div className="flex justify-between items-start">
                                        <div className="text-xs font-medium">{cls.timeSlot}</div>
                                        {isSelected && <CheckCircle className="h-4 w-4 text-primary" />}
                                      </div>

                                      <div className="mt-auto">
                                        <div className="w-full bg-background/50 rounded-full h-1.5 mb-1">
                                          <div
                                            className={`h-1.5 rounded-full ${
                                              availabilityPercentage >= 100
                                                ? "bg-red-500"
                                                : availabilityPercentage >= 80
                                                  ? "bg-yellow-500"
                                                  : "bg-green-500"
                                            }`}
                                            style={{ width: `${Math.min(availabilityPercentage, 100)}%` }}
                                          ></div>
                                        </div>
                                        <div className="text-xs">
                                          {cls.enrolled}/{cls.capacity} students
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {Object.values(classesByDay).every((classes) =>
                  selectedAgeGroup === "all"
                    ? classes.length === 0
                    : classes.filter((cls) => cls.ageGroup === selectedAgeGroup).length === 0,
                ) && (
                  <div className="text-center p-8 border rounded-md">
                    <p className="text-muted-foreground">
                      No classes match your filter criteria. Try a different age group.
                    </p>
                  </div>
                )}

                {selectedClass && (
                  <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <h3 className="font-medium flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Selected Class
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium">{selectedClassData.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedClassData.ageGroup}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {selectedClassData.day}, {selectedClassData.timeSlot}
                        </p>
                        <p className="text-sm text-muted-foreground">{selectedClassData.location}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Availability</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedClassData.capacity - selectedClassData.enrolled} spots left
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" asChild>
                  <Link href="/students">Cancel</Link>
                </Button>
                <Button type="button" onClick={() => handleTabChange("student-info")} disabled={!selectedClass}>
                  Continue to Student Information
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="student-info">
            <Card>
              <CardHeader>
                <CardTitle>Student Information</CardTitle>
                <CardDescription>Enter the student's personal information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="First name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Last name" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select>
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" placeholder="Enter full address" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicalNotes">Medical Notes (Optional)</Label>
                  <Textarea id="medicalNotes" placeholder="Any medical conditions or allergies" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => handleTabChange("class-selection")}>
                  Back to Class Selection
                </Button>
                <Button type="button" onClick={() => handleTabChange("guardian-info")}>
                  Continue to Guardian Information
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="guardian-info">
            <Card>
              <CardHeader>
                <CardTitle>Guardian Information</CardTitle>
                <CardDescription>Select an existing guardian or add a new one.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <RadioGroup
                    value={guardianOption}
                    onValueChange={setGuardianOption}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="existing" id="existing" />
                      <Label htmlFor="existing" className="cursor-pointer">
                        Use Existing Guardian
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="new" id="new" />
                      <Label htmlFor="new" className="cursor-pointer">
                        Add New Guardian
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {guardianOption === "existing" ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="guardianSearch">Search Guardian</Label>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="guardianSearch"
                          placeholder="Search by name, phone, or email..."
                          className="pl-8"
                          value={guardianSearchTerm}
                          onChange={(e) => setGuardianSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="border rounded-md overflow-hidden">
                      <div className="grid grid-cols-1 divide-y">
                        {filteredGuardians.length > 0 ? (
                          filteredGuardians.map((guardian) => (
                            <div
                              key={guardian.id}
                              className={`p-3 cursor-pointer hover:bg-accent transition-colors ${
                                selectedGuardian === guardian.id ? "bg-accent" : ""
                              }`}
                              onClick={() => setSelectedGuardian(guardian.id)}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{guardian.name}</p>
                                  <p className="text-sm text-muted-foreground">{guardian.phone}</p>
                                  <p className="text-sm text-muted-foreground">{guardian.email}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {selectedGuardian === guardian.id && (
                                    <div className="bg-primary text-primary-foreground rounded-full p-1">
                                      <CheckCircle className="h-4 w-4" />
                                    </div>
                                  )}
                                  {guardian.children.length > 0 && (
                                    <Badge variant="outline" className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      {guardian.children.length} {guardian.children.length === 1 ? "child" : "children"}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              {guardian.children.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs text-muted-foreground">
                                    Children: {guardian.children.join(", ")}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center">
                            <p className="text-muted-foreground">
                              No guardians found. Try a different search or add a new guardian.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="guardianName">Guardian Name</Label>
                        <Input id="guardianName" placeholder="Full name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="relationship">Relationship</Label>
                        <Select>
                          <SelectTrigger id="relationship">
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="father">Father</SelectItem>
                            <SelectItem value="mother">Mother</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" placeholder="Phone number" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Email address" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="guardianAddress">Address</Label>
                      <Textarea id="guardianAddress" placeholder="Enter full address" />
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => handleTabChange("student-info")}>
                  Back to Student Information
                </Button>
                <Button type="submit" disabled={isLoading || (guardianOption === "existing" && !selectedGuardian)}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Complete Registration
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  )
}

