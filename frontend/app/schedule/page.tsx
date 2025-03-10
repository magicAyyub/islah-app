"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Plus, MapPin, Users, BookOpen } from "lucide-react"
import Link from "next/link"

// Sample schedule data
const scheduleData = {
  Wednesday: [
    {
      id: "CLS001",
      name: "Beginners Level",
      timeSlot: "15:00 - 17:00",
      location: "Room 101",
      mainTeacher: "Sheikh Abdullah",
      enrolled: "12/15",
      ageGroup: "7-10 years",
      subjects: ["Quran Studies", "Arabic Basics", "Islamic Ethics"],
      schedule: [
        { time: "15:00 - 15:45", subject: "Quran Studies" },
        { time: "15:45 - 16:30", subject: "Arabic Basics" },
        { time: "16:30 - 17:00", subject: "Islamic Ethics" },
      ],
    },
    {
      id: "CLS002",
      name: "Intermediate Level",
      timeSlot: "17:30 - 19:30",
      location: "Room 101",
      mainTeacher: "Sheikh Abdullah",
      enrolled: "10/15",
      ageGroup: "11-14 years",
      subjects: ["Quran Memorization", "Arabic Grammar", "Islamic History"],
      schedule: [
        { time: "17:30 - 18:15", subject: "Quran Memorization" },
        { time: "18:15 - 19:00", subject: "Arabic Grammar" },
        { time: "19:00 - 19:30", subject: "Islamic History" },
      ],
    },
  ],
  Saturday: [
    {
      id: "CLS003",
      name: "Beginners Level",
      timeSlot: "09:00 - 11:00",
      location: "Room 102",
      mainTeacher: "Ustadh Hassan",
      enrolled: "18/20",
      ageGroup: "7-10 years",
      subjects: ["Quran Studies", "Arabic Basics", "Islamic Ethics"],
      schedule: [
        { time: "09:00 - 09:45", subject: "Quran Studies" },
        { time: "09:45 - 10:30", subject: "Arabic Basics" },
        { time: "10:30 - 11:00", subject: "Islamic Ethics" },
      ],
    },
    {
      id: "CLS004",
      name: "Intermediate Level",
      timeSlot: "11:30 - 13:30",
      location: "Room 102",
      mainTeacher: "Ustadh Hassan",
      enrolled: "15/20",
      ageGroup: "11-14 years",
      subjects: ["Quran Memorization", "Arabic Grammar", "Islamic History"],
      schedule: [
        { time: "11:30 - 12:15", subject: "Quran Memorization" },
        { time: "12:15 - 13:00", subject: "Arabic Grammar" },
        { time: "13:00 - 13:30", subject: "Islamic History" },
      ],
    },
    {
      id: "CLS005",
      name: "Advanced Level",
      timeSlot: "15:00 - 17:00",
      location: "Room 103",
      mainTeacher: "Ustadha Fatima",
      enrolled: "20/25",
      ageGroup: "14-16 years",
      subjects: ["Quran Tafsir", "Advanced Arabic", "Fiqh Basics"],
      schedule: [
        { time: "15:00 - 15:45", subject: "Quran Tafsir" },
        { time: "15:45 - 16:30", subject: "Advanced Arabic" },
        { time: "16:30 - 17:00", subject: "Fiqh Basics" },
      ],
    },
  ],
  Sunday: [
    {
      id: "CLS006",
      name: "Beginners Level",
      timeSlot: "09:00 - 11:00",
      location: "Room 103",
      mainTeacher: "Ustadh Mohammed",
      enrolled: "15/25",
      ageGroup: "7-10 years",
      subjects: ["Quran Studies", "Arabic Basics", "Islamic Ethics"],
      schedule: [
        { time: "09:00 - 09:45", subject: "Quran Studies" },
        { time: "09:45 - 10:30", subject: "Arabic Basics" },
        { time: "10:30 - 11:00", subject: "Islamic Ethics" },
      ],
    },
    {
      id: "CLS007",
      name: "Intermediate Level",
      timeSlot: "11:30 - 13:30",
      location: "Room 101",
      mainTeacher: "Sheikh Khalid",
      enrolled: "12/20",
      ageGroup: "11-14 years",
      subjects: ["Quran Memorization", "Arabic Grammar", "Islamic History"],
      schedule: [
        { time: "11:30 - 12:15", subject: "Quran Memorization" },
        { time: "12:15 - 13:00", subject: "Arabic Grammar" },
        { time: "13:00 - 13:30", subject: "Islamic History" },
      ],
    },
    {
      id: "CLS008",
      name: "Advanced Level",
      timeSlot: "15:00 - 17:00",
      location: "Room 102",
      mainTeacher: "Sheikh Abdullah",
      enrolled: "10/15",
      ageGroup: "14-16 years",
      subjects: ["Quran Tafsir", "Advanced Arabic", "Fiqh Basics"],
      schedule: [
        { time: "15:00 - 15:45", subject: "Quran Tafsir" },
        { time: "15:45 - 16:30", subject: "Advanced Arabic" },
        { time: "16:30 - 17:00", subject: "Fiqh Basics" },
      ],
    },
  ],
}

const days = ["Wednesday", "Saturday", "Sunday"]

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState("Wednesday")
  const [viewMode, setViewMode] = useState("overview") // "overview" or "detailed"

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex flex-col xs:flex-row xs:items-center gap-4">
        <h1 className="font-semibold text-lg md:text-2xl">Class Schedule</h1>
        <div className="ml-auto flex flex-col xs:flex-row gap-2">
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="View mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="detailed">Detailed Schedule</SelectItem>
            </SelectContent>
          </Select>
          <Link href="/schedule/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Class Session
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription>View all classes scheduled for Wednesday, Saturday, and Sunday.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={selectedDay} onValueChange={setSelectedDay} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              {days.map((day) => (
                <TabsTrigger key={day} value={day}>
                  {day}
                </TabsTrigger>
              ))}
            </TabsList>

            {days.map((day) => (
              <TabsContent key={day} value={day} className="space-y-4">
                {viewMode === "overview" ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {scheduleData[day] && scheduleData[day].length > 0 ? (
                      scheduleData[day].map((session) => (
                        <Card key={session.id} className="overflow-hidden">
                          <div className="bg-primary h-2 w-full"></div>
                          <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-base">{session.name}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              {session.timeSlot}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-4 pt-0 space-y-2">
                            <div className="flex items-center text-sm">
                              <MapPin className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                              <span>{session.location}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Users className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                              <span>Age: {session.ageGroup}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {session.subjects.map((subject, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {subject}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-sm text-muted-foreground">{session.mainTeacher}</span>
                              <Badge
                                variant={
                                  session.enrolled.split("/")[0] === session.enrolled.split("/")[1]
                                    ? "destructive"
                                    : Number.parseInt(session.enrolled.split("/")[0]) /
                                          Number.parseInt(session.enrolled.split("/")[1]) >=
                                        0.8
                                      ? "secondary"
                                      : "default"
                                }
                              >
                                {session.enrolled} students
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                        <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
                        <h3 className="text-lg font-medium">No Classes Scheduled</h3>
                        <p className="text-sm text-muted-foreground mt-1">There are no classes scheduled for {day}.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {scheduleData[day] && scheduleData[day].length > 0 ? (
                      scheduleData[day].map((session) => (
                        <Card key={session.id}>
                          <CardHeader className="pb-2">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <div>
                                <CardTitle>{session.name}</CardTitle>
                                <CardDescription className="flex items-center mt-1">
                                  <Clock className="h-3.5 w-3.5 mr-1" />
                                  {session.timeSlot} | <MapPin className="h-3.5 w-3.5 mx-1" /> {session.location}
                                </CardDescription>
                              </div>
                              <div className="mt-2 md:mt-0 flex items-center gap-2">
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Users className="h-3.5 w-3.5" />
                                  {session.enrolled} students
                                </Badge>
                                <Badge variant="outline">{session.ageGroup}</Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="border rounded-md overflow-hidden">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Subject</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {session.schedule.map((item, index) => (
                                    <TableRow key={index}>
                                      <TableCell className="font-medium">{item.time}</TableCell>
                                      <TableCell>
                                        <div className="flex items-center">
                                          <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                                          {item.subject}
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                              <div className="text-sm text-muted-foreground">
                                Main Teacher: <span className="font-medium">{session.mainTeacher}</span>
                              </div>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 text-center">
                        <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
                        <h3 className="text-lg font-medium">No Classes Scheduled</h3>
                        <p className="text-sm text-muted-foreground mt-1">There are no classes scheduled for {day}.</p>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

