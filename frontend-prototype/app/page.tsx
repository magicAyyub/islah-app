"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { AdminAlert } from "@/components/dashboard/admin-alert"
import { StatCard } from "@/components/dashboard/stat-card"
import { QuickActionCard } from "@/components/dashboard/quick-action-card"
import { Header } from "@/components/dashboard/header"
import { DashboardSection } from "@/components/dashboard/dashboard-section"
import { useAuth } from './lib/auth'
import { useNotifications } from './hooks/useNotifications'
import { useDashboard } from './hooks/useDashboard'
import { HeaderUser } from './types/dashboard'

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { notifications, adminAlert, handleNotificationClick, dismissAlert } = useNotifications();
  const { stats, quickActions, isLoading, error } = useDashboard(user?.role as any);

  const [headerUser, setHeaderUser] = useState<HeaderUser | null>(null);

  useEffect(() => {
    if (user) {
      const names = user.full_name.split(' ');
      const initials = names.map(n => n[0]).join('').toUpperCase();
      
      setHeaderUser({
        name: user.full_name,
        role: user.role,
        initials: initials,
        avatarColor: '#6c63ff',
      });
    } else {
      setHeaderUser(null);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Protect the route
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // Don't render anything until we have user data
  if (!headerUser) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Une erreur est survenue</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
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
        {adminAlert.show && <AdminAlert message={adminAlert.message} onDismiss={dismissAlert} />}

        <DashboardSection>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Bonjour, {user?.full_name}</h2>
          <p className="text-gray-600">
            Bienvenue sur votre tableau de bord. Voici un aperçu de vos activités récentes.
          </p>
        </DashboardSection>

        <DashboardSection title="Vue d'ensemble">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <StatCard
                  key={stat.id}
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
          )}
        </DashboardSection>

        <DashboardSection title="Accès rapide">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {quickActions.map((action) => (
                <QuickActionCard
                  key={action.id}
                  title={action.title}
                  description={action.description}
                  icon={action.icon}
                  href={action.href}
                  gradient={action.gradient}
                  iconBgClass={action.iconBgClass}
                />
              ))}
            </div>
          )}
        </DashboardSection>

        <footer className="mt-20 text-center text-gray-600">
          <p>© {new Date().getFullYear()} École Islah - Système de Gestion</p>
          <p className="text-sm mt-2">70 Rue des Sorins, 93100 Montreuil</p>
        </footer>
      </div>
    </div>
  )
}

