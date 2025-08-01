"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, CreditCard, BookOpen, UserCheck, GraduationCap, FileText } from "lucide-react"

interface QuickActionsProps {
  userRole?: string
}

export function QuickActions({ userRole }: QuickActionsProps) {
  const router = useRouter()

  const actions = [
    {
      title: "Nouvel élève",
      description: "Inscrire un nouvel élève",
      icon: UserPlus,
      color: "emerald",
      onClick: () => router.push("/students?action=new"),
      roles: ["admin", "teacher"],
    },
    {
      title: "Enregistrer paiement",
      description: "Nouveau paiement",
      icon: CreditCard,
      color: "blue",
      onClick: () => router.push("/payments?action=new"),
      roles: ["admin", "teacher"],
    },
    {
      title: "Saisir notes",
      description: "Ajouter des notes",
      icon: BookOpen,
      color: "amber",
      onClick: () => router.push("/academics?action=grades"),
      roles: ["admin", "teacher"],
    },
    {
      title: "Prendre présences",
      description: "Marquer les présences",
      icon: UserCheck,
      color: "green",
      onClick: () => router.push("/attendance?action=new"),
      roles: ["admin", "teacher"],
    },
    {
      title: "Nouvelle classe",
      description: "Créer une classe",
      icon: GraduationCap,
      color: "purple",
      onClick: () => router.push("/classes?action=new"),
      roles: ["admin"],
    },
    {
      title: "Générer rapport",
      description: "Créer un rapport",
      icon: FileText,
      color: "gray",
      onClick: () => router.push("/reports"),
      roles: ["admin", "teacher"],
    },
  ]

  const filteredActions = actions.filter((action) => !action.roles || action.roles.includes(userRole || ""))

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
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Actions rapides</CardTitle>
        <CardDescription>Accès rapide aux tâches courantes</CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
          {filteredActions.map((action, index) => (
            <motion.div
              key={action.title}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-auto p-4 hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-200 bg-transparent"
                onClick={action.onClick}
              >
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <action.icon className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">{action.title}</p>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  )
}
