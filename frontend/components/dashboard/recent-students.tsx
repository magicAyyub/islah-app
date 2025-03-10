import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const students = [
  {
    id: "STD001",
    name: "Ahmed Ali",
    email: "ahmed.ali@example.com",
    class: "Grade 5",
    date: "2 days ago",
    status: "active",
  },
  {
    id: "STD002",
    name: "Fatima Hassan",
    email: "fatima.h@example.com",
    class: "Grade 3",
    date: "3 days ago",
    status: "active",
  },
  {
    id: "STD003",
    name: "Omar Khalid",
    email: "omar.k@example.com",
    class: "Grade 4",
    date: "5 days ago",
    status: "active",
  },
  {
    id: "STD004",
    name: "Aisha Mohammed",
    email: "aisha.m@example.com",
    class: "Grade 2",
    date: "1 week ago",
    status: "active",
  },
  {
    id: "STD005",
    name: "Yusuf Ibrahim",
    email: "yusuf.i@example.com",
    class: "Grade 6",
    date: "1 week ago",
    status: "active",
  },
]

export function RecentStudents() {
  return (
    <div className="space-y-8">
      {students.map((student) => (
        <div key={student.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt={student.name} />
            <AvatarFallback>
              {student.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{student.name}</p>
            <p className="text-sm text-muted-foreground">{student.class}</p>
          </div>
          <div className="ml-auto font-medium text-sm text-muted-foreground">{student.date}</div>
        </div>
      ))}
    </div>
  )
}

