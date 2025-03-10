import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  GraduationCap,
  Users,
  Clock,
  CreditCard,
  Calendar,
  UserPlus,
  FileText,
  CheckCircle2,
  Bell,
  BookMarked,
  CalendarDays,
} from "lucide-react"
import { RecentStudents } from "@/components/dashboard/recent-students"
import { UpcomingClasses } from "@/components/dashboard/upcoming-classes"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <h1 className="font-semibold text-lg md:text-2xl">Dashboard</h1>
          <div className="ml-auto flex flex-wrap gap-2">
            <Link href="/attendance">
              <Button>
                <Clock className="mr-2 h-4 w-4" />
                Mark Attendance
              </Button>
            </Link>
            <Link href="/students/new">
              <Button variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                Register Student
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <Link href="/students/new">
                    <Card className="h-full cursor-pointer hover:bg-accent/50 transition-colors">
                      <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <UserPlus className="h-8 w-8 mb-2 text-primary" />
                        <p className="text-sm font-medium">Register Student</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/attendance">
                    <Card className="h-full cursor-pointer hover:bg-accent/50 transition-colors">
                      <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <CheckCircle2 className="h-8 w-8 mb-2 text-primary" />
                        <p className="text-sm font-medium">Mark Attendance</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/payments/new">
                    <Card className="h-full cursor-pointer hover:bg-accent/50 transition-colors">
                      <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <CreditCard className="h-8 w-8 mb-2 text-primary" />
                        <p className="text-sm font-medium">Record Payment</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/classes/new">
                    <Card className="h-full cursor-pointer hover:bg-accent/50 transition-colors">
                      <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <GraduationCap className="h-8 w-8 mb-2 text-primary" />
                        <p className="text-sm font-medium">Add Class</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/subjects/new">
                    <Card className="h-full cursor-pointer hover:bg-accent/50 transition-colors">
                      <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <BookMarked className="h-8 w-8 mb-2 text-primary" />
                        <p className="text-sm font-medium">Add Subject</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/schedule/new">
                    <Card className="h-full cursor-pointer hover:bg-accent/50 transition-colors">
                      <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <CalendarDays className="h-8 w-8 mb-2 text-primary" />
                        <p className="text-sm font-medium">Add Schedule</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Key Statistics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">245</div>
                  <div className="flex gap-1 mt-1">
                    <Badge variant="outline" className="text-xs">
                      Active: 230
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Inactive: 15
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Classes This Week</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15</div>
                  <div className="flex gap-1 mt-1">
                    <Badge variant="outline" className="text-xs">
                      Wed: 4
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Sat: 6
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Sun: 5
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92%</div>
                  <p className="text-xs text-muted-foreground">Last 4 weeks average</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <div className="flex gap-1 mt-1">
                    <Badge variant="outline" className="text-xs">
                      $3,450 total
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Registration Status */}
            <Card>
              <CardHeader>
                <CardTitle>Registration Status</CardTitle>
                <CardDescription>Current registration period: Spring 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Beginners Level</span>
                      <Badge variant="outline">75% Full</Badge>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: "75%" }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>45/60 students</span>
                      <span>15 spots left</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Intermediate Level</span>
                      <Badge variant="outline">90% Full</Badge>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: "90%" }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>54/60 students</span>
                      <span>6 spots left</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Advanced Level</span>
                      <Badge variant="outline">65% Full</Badge>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: "65%" }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>39/60 students</span>
                      <span>21 spots left</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex justify-between items-center w-full">
                  <div className="text-sm text-muted-foreground">
                    Registration closes: <span className="font-medium">April 15, 2025</span>
                  </div>
                  <Link href="/students/new">
                    <Button size="sm">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Register New Student
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Upcoming Classes */}
              <Card>
                <CardHeader>
                  <CardTitle>Today's Classes</CardTitle>
                  <CardDescription>Classes scheduled for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <UpcomingClasses />
                </CardContent>
                <CardFooter>
                  <Link href="/schedule" className="w-full">
                    <Button variant="outline" className="w-full">
                      <Calendar className="mr-2 h-4 w-4" />
                      View Full Schedule
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Recent Students */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Students</CardTitle>
                  <CardDescription>Recently registered students</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentStudents />
                </CardContent>
                <CardFooter>
                  <Link href="/students" className="w-full">
                    <Button variant="outline" className="w-full">
                      <Users className="mr-2 h-4 w-4" />
                      View All Students
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3 items-start pb-3 border-b">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <UserPlus className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">5 new student registrations</p>
                      <p className="text-sm text-muted-foreground">New students registered in the last 24 hours</p>
                    </div>
                    <Badge className="ml-auto">New</Badge>
                  </div>

                  <div className="flex gap-3 items-start pb-3 border-b">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <CreditCard className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">3 payments due this week</p>
                      <p className="text-sm text-muted-foreground">Reminder to collect payments</p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">End of month reports ready</p>
                      <p className="text-sm text-muted-foreground">March 2025 reports are available</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full">
                  View All Notifications
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Students Management</CardTitle>
                <CardDescription>View and manage all students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                  Students table will be displayed here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Classes Management</CardTitle>
                <CardDescription>View and manage all classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                  Classes table will be displayed here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payments Management</CardTitle>
                <CardDescription>View and manage all payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                  Payments table will be displayed here
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

