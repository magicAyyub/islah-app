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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Plus, Search } from "lucide-react"

const students = [
  {
    id: "STD001",
    name: "Ahmed Ali",
    class: "Grade 5",
    guardian: "Mohammed Ali",
    phone: "+123456789",
    status: "Active",
  },
  {
    id: "STD002",
    name: "Fatima Hassan",
    class: "Grade 3",
    guardian: "Hassan Ibrahim",
    phone: "+123456789",
    status: "Active",
  },
  {
    id: "STD003",
    name: "Omar Khalid",
    class: "Grade 4",
    guardian: "Khalid Omar",
    phone: "+123456789",
    status: "Active",
  },
  {
    id: "STD004",
    name: "Aisha Mohammed",
    class: "Grade 2",
    guardian: "Mohammed Yusuf",
    phone: "+123456789",
    status: "Active",
  },
  {
    id: "STD005",
    name: "Yusuf Ibrahim",
    class: "Grade 6",
    guardian: "Ibrahim Ahmed",
    phone: "+123456789",
    status: "Active",
  },
  {
    id: "STD006",
    name: "Khadija Ali",
    class: "Grade 1",
    guardian: "Ali Hassan",
    phone: "+123456789",
    status: "Inactive",
  },
  {
    id: "STD007",
    name: "Bilal Mohammed",
    class: "Grade 5",
    guardian: "Mohammed Bilal",
    phone: "+123456789",
    status: "Active",
  },
  {
    id: "STD008",
    name: "Zainab Yusuf",
    class: "Grade 3",
    guardian: "Yusuf Ibrahim",
    phone: "+123456789",
    status: "Active",
  },
  {
    id: "STD009",
    name: "Hamza Khalid",
    class: "Grade 4",
    guardian: "Khalid Hamza",
    phone: "+123456789",
    status: "Active",
  },
  {
    id: "STD010",
    name: "Layla Ahmed",
    class: "Grade 2",
    guardian: "Ahmed Mohammed",
    phone: "+123456789",
    status: "Inactive",
  },
]

export default function StudentsPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <h1 className="font-semibold text-lg md:text-2xl">Students</h1>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search students..." className="w-[200px] md:w-[300px] pl-8" />
          </div>
          <Link href="/students/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </Link>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
          <CardDescription>Manage your students, view details, and update information.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Guardian</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt={student.name} />
                        <AvatarFallback>
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">{student.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.guardian}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>
                    <Badge variant={student.status === "Active" ? "default" : "secondary"}>{student.status}</Badge>
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
                        <DropdownMenuItem>Edit student</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View attendance</DropdownMenuItem>
                        <DropdownMenuItem>View payments</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete student</DropdownMenuItem>
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

