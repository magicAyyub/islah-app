"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/app/lib/auth';
import { dashboardService } from '@/app/services/dashboard-service';
import { Stat, QuickAction, UserRole } from '@/app/types/dashboard';
import { Users, BookOpen, CreditCard, ClipboardList, Calendar } from "lucide-react";

const ICON_MAP = {
  Users: Users,
  BookOpen: BookOpen,
  CreditCard: CreditCard,
  ClipboardList: ClipboardList,
  Calendar: Calendar,
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState<Stat[]>([]);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const config = await dashboardService.getDashboardConfig();
        setStats(config.stats);
        setQuickActions(config.quickActions);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch dashboard configuration'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  const handleToggleVisibility = async (itemId: string, isActive: boolean) => {
    try {
      await dashboardService.toggleItemVisibility(itemId, isActive);
      // Refresh data
      const config = await dashboardService.getDashboardConfig();
      setStats(config.stats);
      setQuickActions(config.quickActions);
    } catch (err) {
      console.error('Failed to toggle visibility:', err);
    }
  };

  const handleUpdateItem = async (item: Stat | QuickAction) => {
    try {
      await dashboardService.updateDashboardItem(item);
      // Refresh data
      const config = await dashboardService.getDashboardConfig();
      setStats(config.stats);
      setQuickActions(config.quickActions);
    } catch (err) {
      console.error('Failed to update item:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
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
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Configuration du Tableau de Bord</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
          <TabsTrigger value="quickActions">Actions Rapides</TabsTrigger>
          <TabsTrigger value="roles">Rôles et Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="stats">
          <div className="grid gap-6">
            {stats.map((stat) => (
              <Card key={stat.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{stat.title}</CardTitle>
                  <div className="flex items-center space-x-4">
                    <Switch
                      checked={stat.isActive}
                      onCheckedChange={(checked) => handleToggleVisibility(stat.id, checked)}
                    />
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Valeur</Label>
                        <Input
                          value={stat.value}
                          onChange={(e) => handleUpdateItem({ ...stat, value: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Sous-titre</Label>
                        <Input
                          value={stat.subtitle}
                          onChange={(e) => handleUpdateItem({ ...stat, subtitle: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Rôles autorisés</Label>
                      <Select
                        value={stat.roles.join(',')}
                        onValueChange={(value) => handleUpdateItem({ ...stat, roles: value.split(',') as UserRole[] })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner les rôles" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN,STAFF">Admin & Staff</SelectItem>
                          <SelectItem value="ADMIN,TEACHER,STAFF">Admin, Teacher & Staff</SelectItem>
                          <SelectItem value="ADMIN,TEACHER">Admin & Teacher</SelectItem>
                          <SelectItem value="PARENT">Parent</SelectItem>
                          <SelectItem value="TEACHER">Teacher</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quickActions">
          <div className="grid gap-6">
            {quickActions.map((action) => (
              <Card key={action.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{action.title}</CardTitle>
                  <div className="flex items-center space-x-4">
                    <Switch
                      checked={action.isActive}
                      onCheckedChange={(checked) => handleToggleVisibility(action.id, checked)}
                    />
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={action.description}
                        onChange={(e) => handleUpdateItem({ ...action, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>URL</Label>
                      <Input
                        value={action.href}
                        onChange={(e) => handleUpdateItem({ ...action, href: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Rôles autorisés</Label>
                      <Select
                        value={action.roles.join(',')}
                        onValueChange={(value) => handleUpdateItem({ ...action, roles: value.split(',') as UserRole[] })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner les rôles" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN,STAFF">Admin & Staff</SelectItem>
                          <SelectItem value="ADMIN,TEACHER,STAFF">Admin, Teacher & Staff</SelectItem>
                          <SelectItem value="ADMIN,STAFF,PARENT">Admin, Staff & Parent</SelectItem>
                          <SelectItem value="PARENT">Parent</SelectItem>
                          <SelectItem value="TEACHER">Teacher</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Rôles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {(['ADMIN', 'TEACHER', 'STAFF', 'PARENT'] as UserRole[]).map((role) => (
                  <div key={role} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{role}</h3>
                      <p className="text-sm text-gray-500">Gérer les permissions pour ce rôle</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configurer
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 