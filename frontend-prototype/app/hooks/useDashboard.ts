import { useState, useEffect } from 'react';
import { Stat, QuickAction, UserRole } from '../types/dashboard';
import { dashboardService } from '../services/dashboard-service';

export const useDashboard = (role: UserRole) => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [fetchedStats, fetchedActions] = await Promise.all([
          dashboardService.getStatsForRole(role),
          dashboardService.getQuickActionsForRole(role)
        ]);
        
        setStats(fetchedStats);
        setQuickActions(fetchedActions);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch dashboard data'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [role]);

  return {
    stats,
    quickActions,
    isLoading,
    error,
    refresh: () => {
      setIsLoading(true);
      return Promise.all([
        dashboardService.getStatsForRole(role),
        dashboardService.getQuickActionsForRole(role)
      ]).then(([newStats, newActions]) => {
        setStats(newStats);
        setQuickActions(newActions);
        setError(null);
      }).catch(err => {
        setError(err instanceof Error ? err : new Error('Failed to refresh dashboard data'));
      }).finally(() => {
        setIsLoading(false);
      });
    }
  };
}; 