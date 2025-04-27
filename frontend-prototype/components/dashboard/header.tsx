import type React from "react"
import { BookOpenCheck } from "lucide-react"
import { NotificationsMenu } from "./notifications-menu"
import { UserNav } from "./user-nav"

interface HeaderUser {
  name: string;
  role: string;
  avatar?: string;
  initials: string;
  avatarColor?: string;
}

interface Notification {
  id: string | number;
  title: string;
  time: string;
  read: boolean;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  color?: string;
}

interface HeaderProps {
  user: HeaderUser | null;
  notifications: Notification[];
  menuItems: MenuItem[];
  onLogout: () => void;
  onNotificationClick: (id: number | string) => void;
  onViewAllNotifications?: () => void;
}

export function Header({
  user,
  notifications,
  menuItems,
  onLogout,
  onNotificationClick,
  onViewAllNotifications,
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#6c63ff] flex items-center justify-center">
            <BookOpenCheck className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-[#2d2a54]">École Islah</h1>
        </div>

        <div className="flex items-center gap-4">
          <NotificationsMenu
            notifications={notifications}
            onNotificationClick={onNotificationClick}
            onViewAll={onViewAllNotifications}
          />
          <UserNav user={user} menuItems={menuItems} onLogout={onLogout} />
        </div>
      </div>
    </header>
  )
}

