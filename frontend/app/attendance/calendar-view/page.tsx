"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { List } from "lucide-react"
import Link from "next/link"

export default function AttendanceCalendarPage() {
  const [selectedClass, setSelectedClass] = useState("grade5")
  const [date, setDate] = useState(new Date())

  // Example attendance data
  const attendanceData = {
    "2025-03-01": { present: 18, absent: 2 },
    "2025-03-02": { present: 17, absent: 3 },
    "2025-03-05": { present: 20, absent: 0 },
    "2025-03-08": { present: 16, absent: 4 },
    "2025-03-10": { present: 19, absent: 1 },
  }

  // Function to render day contents with attendance data
  const renderDay = (day) => {
    const dateString = day.toISOString().split("T")[0]
    const data = attendanceData[dateString]

    if (!data) return null

    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="text-xs mt-1">
          <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-[10px]">
            {data.present}
          </Badge>
          {data.absent > 0 && (
            <Badge variant="outline" className="bg-red-100 dark:bg-red-900 text-[10px] ml-1">
              {data.absent}
            </Badge>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
        <h1 className="font-semibold text-lg md:text-2xl">Attendance Calendar</h1>
        <Link href="/attendance" className="w-full xs:w-auto">
          <Button variant="outline" size="sm" className="flex items-center gap-2 w-full xs:w-auto">
            <List className="h-4 w-4" />
            <span>List View</span>
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div>
              <CardTitle>Attendance Overview</CardTitle>
              <CardDescription>View attendance records by date</CardDescription>
            </div>

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
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              components={{
                DayContent: (props) => (
                  <div className="relative h-9 w-9 p-0 flex items-center justify-center">
                    <div>{props.day.day}</div>
                    {renderDay(props.day.date)}
                  </div>
                ),
              }}
            />
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-sm">Present</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span className="text-sm">Absent</span>
            </div>
          </div>

          {date && (
            <Card className="mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  {date.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-sm font-medium">Total Students</p>
                    <p className="text-xl sm:text-2xl font-bold">20</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Present</p>
                    <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">18</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">Absent</p>
                    <p className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400">2</p>
                  </div>
                </div>

                <div className="mt-4">
                  <Link href="/attendance">
                    <Button className="w-full">View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

