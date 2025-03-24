"use client"

import { useState } from "react"
import { Users, BookOpen, CreditCard, ClipboardList, Calendar, Settings } from "lucide-react"
import { AdminAlert } from "@/components/dashboard/admin-alert"
import { StatCard } from "@/components/dashboard/stat-card"
import { QuickActionCard } from "@/components/dashboard/quick-action-card"
import { Header } from "@/components/dashboard/header"
import { DashboardSection } from "@/components/dashboard/dashboard-section"

// Types pour les différents rôles d'utilisateurs
type UserRole = "admin" | "teacher" | "parent" | "staff"

export default function Home() {
  // État pour simuler un utilisateur connecté
  const [user, setUser] = useState({
    name: "Ahmed Dubois",
    role: "Administrateur",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "AD",
    userRole: "admin" as UserRole,
  })

  // État pour simuler des notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Nouveau paiement reçu", time: "Il y a 2 heures", read: false },
    { id: 2, title: "Demande d'accès en attente", time: "Il y a 3 heures", read: false },
    { id: 3, title: "Rappel: Réunion demain", time: "Il y a 5 heures", read: true },
  ])

  // État pour simuler un message d'alerte de l'administrateur
  const [adminAlert, setAdminAlert] = useState({
    show: true,
    message: "Veuillez mettre à jour vos coordonnées avant le 30 octobre.",
  })

  // Fonction pour simuler la déconnexion
  const handleLogout = () => {
    // TODO: Implémenter la logique de déconnexion
    console.log("Déconnexion...")
    window.location.href = "/login"
  }

  // Fonction pour marquer une notification comme lue
  const handleNotificationClick = (id: string | number) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  // Fonction pour masquer l'alerte
  const dismissAlert = () => {
    setAdminAlert({ ...adminAlert, show: false })
  }

  // Fonction pour changer de rôle (pour démonstration)
  const changeRole = (role: UserRole) => {
    const roleMap: Record<UserRole, { name: string; role: string; initials: string }> = {
      admin: { name: "Ahmed Dubois", role: "Administrateur", initials: "AD" },
      teacher: { name: "Marie Leroy", role: "Enseignante", initials: "ML" },
      parent: { name: "Thomas Martin", role: "Parent", initials: "TM" },
      staff: { name: "Sarah Toumi", role: "Secrétaire", initials: "ST" },
    }

    const newUserInfo = roleMap[role]
    setUser({
      ...user,
      name: newUserInfo.name,
      role: newUserInfo.role,
      initials: newUserInfo.initials,
      userRole: role,
    })
  }

  // Configuration des éléments de menu selon le rôle
  const getMenuItems = () => {
    const baseItems = []

    if (user.userRole === "admin") {
      baseItems.push({
        icon: <Settings className="h-4 w-4" />,
        label: "Administration",
        href: "/admin",
      })
    }

    if (user.userRole === "parent") {
      baseItems.push({
        icon: <Users className="h-4 w-4" />,
        label: "Espace parent",
        href: "/parent-portal",
      })
    }

    return baseItems
  }

  // Configuration des statistiques selon le rôle
  const getStats = () => {
    const stats = []

    if (["admin", "staff"].includes(user.userRole)) {
      stats.push({
        title: "Élèves inscrits",
        value: 45,
        subtitle: "+3 ce mois-ci",
        icon: <Users className="h-5 w-5" />,
        iconBgColor: "bg-[#f0eeff]",
        iconColor: "text-[#6c63ff]",
      })
    }

    if (["admin", "teacher", "staff"].includes(user.userRole)) {
      stats.push({
        title: "Taux de présence",
        value: "92%",
        subtitle: "Cette semaine",
        icon: <ClipboardList className="h-5 w-5" />,
        iconBgColor: "bg-[#e6f4ea]",
        iconColor: "text-[#34a853]",
        trend: {
          value: "+2%",
          isPositive: true,
        },
      })
    }

    if (["admin", "staff"].includes(user.userRole)) {
      stats.push({
        title: "Paiements reçus",
        value: "3 250€",
        subtitle: "5 paiements en attente",
        icon: <CreditCard className="h-5 w-5" />,
        iconBgColor: "bg-[#fef7e0]",
        iconColor: "text-[#fbbc05]",
      })
    }

    if (["admin", "teacher"].includes(user.userRole)) {
      stats.push({
        title: "Bulletins générés",
        value: 42,
        subtitle: "Sur 45 élèves",
        icon: <BookOpen className="h-5 w-5" />,
        iconBgColor: "bg-[#e8f0fe]",
        iconColor: "text-[#4285f4]",
      })
    }

    if (user.userRole === "parent") {
      stats.push({
        title: "Prochain paiement",
        value: "150€",
        subtitle: "Échéance: 30/10/2023",
        icon: <CreditCard className="h-5 w-5" />,
        iconBgColor: "bg-[#fef7e0]",
        iconColor: "text-[#fbbc05]",
      })

      stats.push({
        title: "Présence",
        value: "85%",
        subtitle: "Ce mois-ci",
        icon: <ClipboardList className="h-5 w-5" />,
        iconBgColor: "bg-[#e6f4ea]",
        iconColor: "text-[#34a853]",
      })
    }

    if (user.userRole === "teacher") {
      stats.push({
        title: "Élèves dans ma classe",
        value: 18,
        subtitle: "Primaire 1",
        icon: <Users className="h-5 w-5" />,
        iconBgColor: "bg-[#f0eeff]",
        iconColor: "text-[#6c63ff]",
      })

      stats.push({
        title: "Prochaine classe",
        value: "Aujourd'hui",
        subtitle: "14h00 - 17h00",
        icon: <Calendar className="h-5 w-5" />,
        iconBgColor: "bg-[#fef7e0]",
        iconColor: "text-[#fbbc05]",
      })
    }

    return stats
  }

  // Configuration des actions rapides selon le rôle
  const getQuickActions = () => {
    const actions = []

    if (["admin", "staff"].includes(user.userRole)) {
      actions.push({
        title: "Gestion des Élèves",
        description: "Inscriptions et suivi des dossiers",
        icon: <Users className="h-7 w-7 text-white" />,
        href: "/students",
        gradient: "bg-gradient-to-br from-[#6c63ff] to-[#5a52e0]",
        iconBgClass: "bg-white/20 backdrop-blur-sm",
      })
    }

    if (["admin", "teacher", "staff"].includes(user.userRole)) {
      actions.push({
        title: "Emplois du Temps",
        description: "Organisation des cours",
        icon: <Calendar className="h-7 w-7 text-white" />,
        href: "/schedules",
        gradient: "bg-gradient-to-br from-[#4285f4] to-[#3b78e7]",
        iconBgClass: "bg-white/20 backdrop-blur-sm",
      })
    }

    if (["admin", "staff", "parent"].includes(user.userRole)) {
      actions.push({
        title: "Paiements",
        description: "Gestion des frais et reçus",
        icon: <CreditCard className="h-7 w-7 text-white" />,
        href: "/payments",
        gradient: "bg-gradient-to-br from-[#34a853] to-[#2d9649]",
        iconBgClass: "bg-white/20 backdrop-blur-sm",
      })
    }

    if (["admin", "teacher", "staff"].includes(user.userRole)) {
      actions.push({
        title: "Présence",
        description: "Suivi des présences quotidiennes",
        icon: <ClipboardList className="h-7 w-7 text-white" />,
        href: "/attendance",
        gradient: "bg-gradient-to-br from-[#fbbc05] to-[#f9ab00]",
        iconBgClass: "bg-white/20 backdrop-blur-sm",
      })
    }

    if (user.userRole === "parent") {
      actions.push({
        title: "Espace Parent",
        description: "Suivi de la scolarité",
        icon: <Users className="h-7 w-7 text-white" />,
        href: "/parent-portal",
        gradient: "bg-gradient-to-br from-[#6c63ff] to-[#5a52e0]",
        iconBgClass: "bg-white/20 backdrop-blur-sm",
      })
    }

    if (user.userRole === "teacher") {
      actions.push({
        title: "Mes Classes",
        description: "Gestion de mes élèves",
        icon: <Users className="h-7 w-7 text-white" />,
        href: "/classes",
        gradient: "bg-gradient-to-br from-[#9c27b0] to-[#7b1fa2]",
        iconBgClass: "bg-white/20 backdrop-blur-sm",
      })

      actions.push({
        title: "Bulletins",
        description: "Évaluation des élèves",
        icon: <BookOpen className="h-7 w-7 text-white" />,
        href: "/reports",
        gradient: "bg-gradient-to-br from-[#ff63c4] to-[#e5399f]",
        iconBgClass: "bg-white/20 backdrop-blur-sm",
      })
    }

    return actions
  }

  // Obtenir les données configurées selon le rôle
  const menuItems = getMenuItems()
  const stats = getStats()
  const quickActions = getQuickActions()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header
        user={user}
        notifications={notifications}
        menuItems={menuItems}
        onLogout={handleLogout}
        onNotificationClick={handleNotificationClick}
      />

      <div className="container mx-auto py-10 px-4">
        {/* Sélecteur de rôle pour démonstration */}
        <div className="mb-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Changer de rôle (pour démonstration)</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => changeRole("admin")}
              className={`px-3 py-1 rounded-full text-xs font-medium ${user.userRole === "admin" ? "bg-[#6c63ff] text-white" : "bg-gray-200 text-gray-700"}`}
            >
              Administrateur
            </button>
            <button
              onClick={() => changeRole("teacher")}
              className={`px-3 py-1 rounded-full text-xs font-medium ${user.userRole === "teacher" ? "bg-[#6c63ff] text-white" : "bg-gray-200 text-gray-700"}`}
            >
              Enseignant
            </button>
            <button
              onClick={() => changeRole("parent")}
              className={`px-3 py-1 rounded-full text-xs font-medium ${user.userRole === "parent" ? "bg-[#6c63ff] text-white" : "bg-gray-200 text-gray-700"}`}
            >
              Parent
            </button>
            <button
              onClick={() => changeRole("staff")}
              className={`px-3 py-1 rounded-full text-xs font-medium ${user.userRole === "staff" ? "bg-[#6c63ff] text-white" : "bg-gray-200 text-gray-700"}`}
            >
              Personnel administratif
            </button>
          </div>
        </div>

        {/* Message d'alerte de l'administrateur */}
        {adminAlert.show && <AdminAlert message={adminAlert.message} onDismiss={dismissAlert} />}

        <DashboardSection>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Bonjour, {user.name}</h2>
          <p className="text-gray-600">
            Bienvenue sur votre tableau de bord. Voici un aperçu de vos activités récentes.
          </p>
        </DashboardSection>

        {/* Statistiques rapides */}
        <DashboardSection title="Vue d'ensemble">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                subtitle={stat.subtitle}
                icon={stat.icon}
                iconBgColor={stat.iconBgColor}
                iconColor={stat.iconColor}
                trend={stat.trend}
              />
            ))}
          </div>
        </DashboardSection>

        <DashboardSection title="Accès rapide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {quickActions.map((action, index) => (
              <QuickActionCard
                key={index}
                title={action.title}
                description={action.description}
                icon={action.icon}
                href={action.href}
                gradient={action.gradient}
                iconBgClass={action.iconBgClass}
              />
            ))}
          </div>
        </DashboardSection>

        <footer className="mt-20 text-center text-gray-600">
          <p>© {new Date().getFullYear()} École Islah - Système de Gestion</p>
          <p className="text-sm mt-2">70 Rue des Sorins, 93100 Montreuil</p>
        </footer>
      </div>
    </div>
  )
}

