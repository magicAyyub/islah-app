"use client"

import { useState, useEffect } from "react"
import { Users, BookOpen, CreditCard, ClipboardList, Calendar } from "lucide-react"
import { AdminAlert } from "@/components/dashboard/admin-alert"
import { StatCard } from "@/components/dashboard/stat-card"
import { QuickActionCard } from "@/components/dashboard/quick-action-card"
import { Header } from "@/components/dashboard/header"
import { DashboardSection } from "@/components/dashboard/dashboard-section"
import { useAuth } from './lib/auth'
import { useRouter } from 'next/navigation'

// Add this type definition
interface HeaderUser {
  name: string;
  role: string;
  avatar?: string;
  initials: string;
  avatarColor: string;
}

// Types pour les différents rôles d'utilisateurs
//type UserRole = "admin" | "teacher" | "parent" | "staff"

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Add a formatted user state for the header
  const [headerUser, setHeaderUser] = useState<HeaderUser | null>(null);

  // Update headerUser when auth user changes
  useEffect(() => {
    if (user) {
      const names = user.full_name.split(' ');
      const initials = names.map(n => n[0]).join('').toUpperCase();
      
      setHeaderUser({
        name: user.full_name,
        role: user.role,
        initials: initials,
        avatarColor: '#6c63ff', // You can make this dynamic based on role if needed
      });
    } else {
      setHeaderUser(null);
    }
  }, [user]);

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
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
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

  // Configuration des statistiques selon le rôle
  const getStats = () => {
    const stats = []
    const userRole = user?.role || '';

    if (["ADMIN", "STAFF"].includes(userRole)) {
      stats.push({
        title: "Élèves inscrits",
        value: 45,
        subtitle: "+3 ce mois-ci",
        icon: <Users className="h-5 w-5" />,
        iconBgColor: "bg-[#f0eeff]",
        iconColor: "text-[#6c63ff]",
      })
    }

    if (["ADMIN", "TEACHER", "STAFF"].includes(userRole)) {
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

    if (["ADMIN", "STAFF"].includes(userRole)) {
      stats.push({
        title: "Paiements reçus",
        value: "3 250€",
        subtitle: "5 paiements en attente",
        icon: <CreditCard className="h-5 w-5" />,
        iconBgColor: "bg-[#fef7e0]",
        iconColor: "text-[#fbbc05]",
      })
    }

    if (["ADMIN", "TEACHER"].includes(userRole)) {
      stats.push({
        title: "Bulletins générés",
        value: 42,
        subtitle: "Sur 45 élèves",
        icon: <BookOpen className="h-5 w-5" />,
        iconBgColor: "bg-[#e8f0fe]",
        iconColor: "text-[#4285f4]",
      })
    }

    if (userRole === "PARENT") {
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

    if (userRole === "TEACHER") {
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
    const userRole = user?.role || '';

    if (["ADMIN", "STAFF"].includes(userRole)) {
      actions.push({
        title: "Gestion des Élèves",
        description: "Inscriptions et suivi des dossiers",
        icon: <Users className="h-7 w-7 text-white" />,
        href: "/students",
        gradient: "bg-gradient-to-br from-[#6c63ff] to-[#5a52e0]",
        iconBgClass: "bg-white/20 backdrop-blur-sm",
      })
    }

    if (["ADMIN", "TEACHER", "STAFF"].includes(userRole)) {
      actions.push({
        title: "Emplois du Temps",
        description: "Organisation des cours",
        icon: <Calendar className="h-7 w-7 text-white" />,
        href: "/schedules",
        gradient: "bg-gradient-to-br from-[#4285f4] to-[#3b78e7]",
        iconBgClass: "bg-white/20 backdrop-blur-sm",
      })
    }

    if (["ADMIN", "STAFF", "PARENT"].includes(userRole)) {
      actions.push({
        title: "Paiements",
        description: "Gestion des frais et reçus",
        icon: <CreditCard className="h-7 w-7 text-white" />,
        href: "/payments",
        gradient: "bg-gradient-to-br from-[#34a853] to-[#2d9649]",
        iconBgClass: "bg-white/20 backdrop-blur-sm",
      })
    }

    if (["ADMIN", "TEACHER", "STAFF"].includes(userRole)) {
      actions.push({
        title: "Présence",
        description: "Suivi des présences quotidiennes",
        icon: <ClipboardList className="h-7 w-7 text-white" />,
        href: "/attendance",
        gradient: "bg-gradient-to-br from-[#fbbc05] to-[#f9ab00]",
        iconBgClass: "bg-white/20 backdrop-blur-sm",
      })
    }

    if (userRole === "PARENT") {
      actions.push({
        title: "Espace Parent",
        description: "Suivi de la scolarité",
        icon: <Users className="h-7 w-7 text-white" />,
        href: "/parent-portal",
        gradient: "bg-gradient-to-br from-[#6c63ff] to-[#5a52e0]",
        iconBgClass: "bg-white/20 backdrop-blur-sm",
      })
    }

    if (userRole === "TEACHER") { 
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
  const stats = getStats()
  const quickActions = getQuickActions()

  // Protect the route
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // Don't render anything until we have user data
  if (!headerUser) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header
        user={headerUser}
        notifications={notifications}
        menuItems={[]}
        onLogout={handleLogout}
        onNotificationClick={handleNotificationClick}
      />

      <div className="container mx-auto py-10 px-4">
        {/* Message d'alerte de l'administrateur */}
        {adminAlert.show && <AdminAlert message={adminAlert.message} onDismiss={dismissAlert} />}

        <DashboardSection>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Bonjour, {user?.full_name}</h2>
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

