export interface HeaderUser {
  name: string;
  role: string;
  avatar?: string;
  initials: string;
  avatarColor: string;
}

export interface Notification {
  id: number;
  title: string;
  time: string;
  read: boolean;
}

export interface AdminAlert {
  show: boolean;
  message: string;
}

export interface Stat {
  id: string;
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  roles: UserRole[];
  isActive: boolean;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  gradient: string;
  iconBgClass: string;
  roles: UserRole[];
  isActive: boolean;
}

export type UserRole = "ADMIN" | "TEACHER" | "PARENT" | "STAFF";

export interface DashboardConfig {
  stats: Stat[];
  quickActions: QuickAction[];
}

export interface RolePermission {
  role: UserRole;
  permissions: string[];
  isActive: boolean;
}

export interface DashboardItem {
  id: string;
  type: 'stat' | 'quickAction';
  roles: UserRole[];
  isActive: boolean;
  config: Record<string, any>;
} 