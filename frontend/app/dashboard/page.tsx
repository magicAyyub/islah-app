"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, CreditCard, Calendar, UserCheck } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"

interface DashboardStats {
  totalStudents: number
  totalClasses: number
  totalPayments: number
  attendanceRate: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalClasses: 0,
    totalPayments: 0,
    attendanceRate: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API calls - replace with actual API endpoints
        const [studentsRes, classesRes, paymentsRes] = await Promise.all([
          api.getStudents(1, 1), // Just to get total count
          api.getClasses(),
          api.getPayments(1, 1), // Just to get total count
        ])

        setStats({
          totalStudents: studentsRes.total || 0,
          totalClasses: classesRes.length || 0,
          totalPayments: paymentsRes.total || 0,
          attendanceRate: 94.5, // Mock data
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl"
        >
          <h1 className="text-4xl font-bold mb-3">Bienvenue, {user?.first_name || user?.username} !</h1>
          <p className="text-emerald-100 text-lg">Voici un aperçu de l'activité de l'école aujourd'hui</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <motion.div variants={itemVariants}>
            <StatsCard title="Élèves" value={stats.totalStudents} icon={Users} color="emerald" isLoading={isLoading} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatsCard
              title="Classes"
              value={stats.totalClasses}
              icon={GraduationCap}
              color="blue"
              isLoading={isLoading}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatsCard
              title="Paiements"
              value={stats.totalPayments}
              icon={CreditCard}
              color="amber"
              isLoading={isLoading}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatsCard
              title="Présence"
              value={`${stats.attendanceRate}%`}
              icon={UserCheck}
              color="green"
              isLoading={isLoading}
            />
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <QuickActions userRole={user?.role} />
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <RecentActivity />
          </motion.div>
        </div>

        {/* Today's Schedule */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Calendar className="w-6 h-6 text-emerald-600" />
                Programme d'aujourd'hui
              </CardTitle>
              <CardDescription className="text-base">Cours et activités prévus pour aujourd'hui</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="font-semibold text-lg text-gray-900">Coran - Niveau 1</p>
                      <p className="text-emerald-700 font-medium">10h00 - 11h20</p>
                    </div>
                  </div>
                  <span className="px-4 py-2 text-sm text-emerald-700 bg-emerald-200 rounded-full font-semibold">
                    En cours
                  </span>
                </div>
                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-lg text-gray-900">Arabe - Niveau 2</p>
                      <p className="text-gray-600 font-medium">12h00 - 13h00</p>
                    </div>
                  </div>
                  <span className="px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded-full font-semibold">
                    À venir
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
