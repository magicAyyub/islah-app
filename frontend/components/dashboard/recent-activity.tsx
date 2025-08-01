"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, CreditCard, BookOpen, UserCheck, Clock } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "student",
    title: "Nouvel élève inscrit",
    description: "Ahmed Hassan a été inscrit en Niveau 1",
    time: "Il y a 2 heures",
    icon: UserPlus,
    color: "emerald",
  },
  {
    id: 2,
    type: "payment",
    title: "Paiement reçu",
    description: "Paiement trimestriel de Fatima Ali - 150€",
    time: "Il y a 4 heures",
    icon: CreditCard,
    color: "blue",
  },
  {
    id: 3,
    type: "grade",
    title: "Notes ajoutées",
    description: "Notes de Coran pour la classe Niveau 2",
    time: "Il y a 6 heures",
    icon: BookOpen,
    color: "amber",
  },
  {
    id: 4,
    type: "attendance",
    title: "Présences marquées",
    description: "Présences du matin pour toutes les classes",
    time: "Il y a 8 heures",
    icon: UserCheck,
    color: "green",
  },
]

export function RecentActivity() {
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
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Activité récente</CardTitle>
        <CardDescription>Dernières actions effectuées dans le système</CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              variants={itemVariants}
              whileHover={{ x: 4 }}
              className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className={`p-2 rounded-full bg-${activity.color}-100`}>
                <activity.icon className={`w-4 h-4 text-${activity.color}-600`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  )
}
