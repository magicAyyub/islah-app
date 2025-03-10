import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, MapPin } from "lucide-react"

const classes = [
  {
    id: "CLS001",
    name: "Beginners Level",
    time: "15:00 - 17:00",
    teacher: "Sheikh Abdullah",
    room: "Room 101",
    subjects: ["Quran Studies", "Arabic Basics", "Islamic Ethics"],
    status: "upcoming",
  },
  {
    id: "CLS002",
    name: "Intermediate Level",
    time: "17:30 - 19:30",
    teacher: "Sheikh Abdullah",
    room: "Room 101",
    subjects: ["Quran Memorization", "Arabic Grammar", "Islamic History"],
    status: "upcoming",
  },
  {
    id: "CLS003",
    name: "Advanced Level",
    time: "15:00 - 17:00",
    teacher: "Ustadha Fatima",
    room: "Room 103",
    subjects: ["Quran Tafsir", "Advanced Arabic", "Fiqh Basics"],
    status: "upcoming",
  },
]

export function UpcomingClasses() {
  return (
    <div className="space-y-4">
      {classes.map((cls) => (
        <div key={cls.id} className="border rounded-md p-3 hover:bg-accent/50 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-medium">{cls.name}</p>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <Clock className="h-3.5 w-3.5 mr-1" />
                {cls.time}
                <span className="mx-1">•</span>
                <MapPin className="h-3.5 w-3.5 mr-1" />
                {cls.room}
              </div>
            </div>
            <Badge>{cls.teacher}</Badge>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {cls.subjects.map((subject, index) => (
              <Badge key={index} variant="outline" className="flex items-center text-xs">
                <BookOpen className="h-3 w-3 mr-1" />
                {subject}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

