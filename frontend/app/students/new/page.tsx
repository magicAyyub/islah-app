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
import {
  ArrowLeft,
  Loader2,
  Search,
  UserPlus,
  Users,
  CheckCircle2,
  Clock,
  Calendar,
  BookOpen,
  CheckCircle,
} from "lucide-react"
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

export default function NewStudentPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedClass, setSelectedClass] = useState("")
  const [guardianOption, setGuardianOption] = useState("existing")
  const [selectedGuardian, setSelectedGuardian] = useState("")
  const [guardianSearchTerm, setGuardianSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("class-selection")
  const [filterDay, setFilterDay] = useState("all")
  const [filterLevel, setFilterLevel] = useState("all")
  const [formProgress, setFormProgress] = useState(33)

  const filteredGuardians = guardianSearchTerm
    ? existingGuardians.filter(
        (g) =>
          g.name.toLowerCase().includes(guardianSearchTerm.toLowerCase()) ||
          g.phone.includes(guardianSearchTerm) ||
          g.email.toLowerCase().includes(guardianSearchTerm.toLowerCase()),
      )
    : existingGuardians

  const filteredClasses = classData.filter((cls) => {
    if (filterDay !== "all" && cls.day !== filterDay) return false
    if (filterLevel !== "all" && !cls.name.toLowerCase().includes(filterLevel.toLowerCase())) return false
    return true
  })

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
      toast.success("Student registered successfully")
      router.push("/students")
    }, 1500)
  }

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
                <CardTitle>Class Availability</CardTitle>
                <CardDescription>Check available spaces in classes before registration.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <Label htmlFor="filterDay">Filter by Day</Label>
                    <Select value={filterDay} onValueChange={setFilterDay}>
                      <SelectTrigger id="filterDay" className="mt-1">
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Days</SelectItem>
                        <SelectItem value="Wednesday">Wednesday</SelectItem>
                        <SelectItem value="Saturday">Saturday</SelectItem>
                        <SelectItem value="Sunday">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="filterLevel">Filter by Level</Label>
                    <Select value={filterLevel} onValueChange={setFilterLevel}>
                      <SelectTrigger id="filterLevel" className="mt-1">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="beginners">Beginners</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredClasses.map((cls) => {
                    const isAvailable = cls.enrolled < cls.capacity
                    const isSelected = selectedClass === cls.id
                    const availabilityPercentage = (cls.enrolled / cls.capacity) * 100

                    return (
                      <Card
                        key={cls.id}
                        className={`overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                          selectedClass === cls.id ? "ring-2 ring-primary" : !isAvailable ? "opacity-60" : ""
                        }`}
                        onClick={() => isAvailable && handleClassToggle(cls.id)}
                      >
                        <div className="relative h-2 w-full bg-gray-200">
                          <div
                            className={`absolute top-0 left-0 h-full ${
                              availabilityPercentage >= 100
                                ? "bg-red-500"
                                : availabilityPercentage >= 80
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}
                            style={{ width: `${Math.min(availabilityPercentage, 100)}%` }}
                          ></div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-sm">{cls.name}</h3>
                            {isSelected && (
                              <div className="bg-primary text-primary-foreground rounded-full p-1">
                                <CheckCircle className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                              <span>{cls.day}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                              <span>{cls.timeSlot}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                              <span>Age: {cls.ageGroup}</span>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1 flex items-center">
                                <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                                Subjects:
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {cls.subjects.map((subject, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {subject}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-muted-foreground">Availability:</span>
                              <Badge
                                variant={
                                  !isAvailable
                                    ? "destructive"
                                    : cls.enrolled >= cls.capacity * 0.8
                                      ? "secondary"
                                      : "default"
                                }
                              >
                                {cls.enrolled}/{cls.capacity}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {filteredClasses.length === 0 && (
                  <div className="text-center p-8 border rounded-md">
                    <p className="text-muted-foreground">
                      No classes match your filter criteria. Try different filters.
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" asChild>
                  <Link href="/students">Cancel</Link>
                </Button>
                <Button
                  type="button"
                  onClick={() => handleTabChange("student-info")}
                  disabled={!selectedClass}
                  className="gap-2"
                >
                  Next
                  {selectedClass && <CheckCircle2 className="h-4 w-4" />}
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

                <div className="space-y-2">
                  <Label>Selected Class</Label>
                  <div className="border rounded-md p-3 bg-muted/30">
                    {selectedClass ? (
                      (() => {
                        const cls = classData.find((c) => c.id === selectedClass)
                        return (
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="bg-primary text-primary-foreground rounded-full p-1">
                                <CheckCircle className="h-4 w-4" />
                              </div>
                              <p className="font-medium">{cls.name}</p>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {cls.day}
                              </Badge>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {cls.timeSlot}
                              </Badge>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {cls.ageGroup}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {cls.subjects.map((subject, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {subject}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )
                      })()
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No class selected. Please go back and select a class.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => handleTabChange("class-selection")}>
                  Previous
                </Button>
                <Button type="button" onClick={() => handleTabChange("guardian-info")}>
                  Next
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
                  Previous
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || (guardianOption === "existing" && !selectedGuardian)}
                  className="gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Register Student
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

