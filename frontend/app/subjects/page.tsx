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
import { MoreHorizontal, Plus, Search, BookOpen, GraduationCap } from "lucide-react"

const subjects = [
  {
    id: "SUB001",
    name: "Quran Studies",
    type: "Religious",
    classes: 8,
    teachers: 3,
    hoursPerWeek: 5,
  },
  {
    id: "SUB002",
    name: "Arabic Language",
    type: "Language",
    classes: 6,
    teachers: 2,
    hoursPerWeek: 4,
  },
  {
    id: "SUB003",
    name: "Islamic History",
    type: "Religious",
    classes: 4,
    teachers: 1,
    hoursPerWeek: 2,
  },
  {
    id: "SUB004",
    name: "Mathematics",
    type: "Academic",
    classes: 6,
    teachers: 2,
    hoursPerWeek: 4,
  },
  {
    id: "SUB005",
    name: "Science",
    type: "Academic",
    classes: 6,
    teachers: 2,
    hoursPerWeek: 3,
  },
  {
    id: "SUB006",
    name: "English Language",
    type: "Language",
    classes: 6,
    teachers: 2,
    hoursPerWeek: 3,
  },
  {
    id: "SUB007",
    name: "Islamic Ethics",
    type: "Religious",
    classes: 6,
    teachers: 3,
    hoursPerWeek: 2,
  },
  {
    id: "SUB008",
    name: "Physical Education",
    type: "Other",
    classes: 6,
    teachers: 1,
    hoursPerWeek: 2,
  },
]

export default function SubjectsPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <h1 className="font-semibold text-lg md:text-2xl">Subjects</h1>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search subjects..." className="w-[200px] md:w-[300px] pl-8" />
          </div>
          <Link href="/subjects/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Subject
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <BookOpen className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Religious Subjects</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <BookOpen className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects.filter((sub) => sub.type === "Religious").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Academic Subjects</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <GraduationCap className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects.filter((sub) => sub.type === "Academic").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {/* This is a simplification - in reality we'd count unique teachers */}
              {subjects.reduce((acc, sub) => acc + sub.teachers, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Subjects</CardTitle>
          <CardDescription>Manage your subjects, view details, and update information.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-center">Classes</TableHead>
                <TableHead className="text-center hidden md:table-cell">Teachers</TableHead>
                <TableHead className="text-center hidden md:table-cell">Hours/Week</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell className="font-medium">{subject.id}</TableCell>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        subject.type === "Religious"
                          ? "default"
                          : subject.type === "Academic"
                            ? "secondary"
                            : subject.type === "Language"
                              ? "outline"
                              : "destructive"
                      }
                    >
                      {subject.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">{subject.classes}</TableCell>
                  <TableCell className="text-center hidden md:table-cell">{subject.teachers}</TableCell>
                  <TableCell className="text-center hidden md:table-cell">{subject.hoursPerWeek}</TableCell>
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
                        <DropdownMenuItem>Edit subject</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View classes</DropdownMenuItem>
                        <DropdownMenuItem>View teachers</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete subject</DropdownMenuItem>
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

import { Users } from "lucide-react"

