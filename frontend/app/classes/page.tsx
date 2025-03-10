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
import { MoreHorizontal, Plus, Search, Users, BookOpen, Calendar } from "lucide-react"

const classes = [
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

export default function ClassesPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <h1 className="font-semibold text-lg md:text-2xl">Classes</h1>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search classes..." className="w-[200px] md:w-[300px] pl-8" />
          </div>
          <Link href="/classes/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Class
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <BookOpen className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.reduce((acc, cls) => acc + cls.enrolled, 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Spots</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {classes.reduce((acc, cls) => acc + (cls.capacity - cls.enrolled), 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Days</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <Calendar className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(classes.map((cls) => cls.day)).size}</div>
            <p className="text-xs text-muted-foreground">Wed, Sat, Sun</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Classes</CardTitle>
          <CardDescription>Manage your classes, view availability, and update information.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Level</TableHead>
                <TableHead>Day & Time</TableHead>
                <TableHead className="hidden md:table-cell">Subjects</TableHead>
                <TableHead className="hidden md:table-cell">Teacher</TableHead>
                <TableHead className="hidden md:table-cell">Age Group</TableHead>
                <TableHead className="text-center">Availability</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((cls) => (
                <TableRow key={cls.id}>
                  <TableCell className="font-medium">{cls.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{cls.day}</span>
                      <span className="text-xs text-muted-foreground">{cls.timeSlot}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {cls.subjects.map((subject, index) => (
                        <Badge key={index} variant="outline" className="mr-1">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{cls.mainTeacher}</TableCell>
                  <TableCell className="hidden md:table-cell">{cls.ageGroup}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        cls.enrolled >= cls.capacity
                          ? "destructive"
                          : cls.enrolled >= cls.capacity * 0.8
                            ? "secondary"
                            : "default"
                      }
                    >
                      {cls.enrolled}/{cls.capacity}
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
                        <DropdownMenuItem>Edit class</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View students</DropdownMenuItem>
                        <DropdownMenuItem>Take attendance</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Cancel class</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

