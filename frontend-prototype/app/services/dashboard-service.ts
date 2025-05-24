import { DashboardConfig, Stat, QuickAction, UserRole } from '../types/dashboard';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class DashboardService {
  private static instance: DashboardService;
  private configCache: Map<string, DashboardConfig> = new Map();
  private lastFetchTime: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

  private async fetchConfig(): Promise<DashboardConfig> {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/config`);
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard configuration');
    }
    return response.json();
  }

  private isCacheValid(): boolean {
    return Date.now() - this.lastFetchTime < this.CACHE_DURATION;
  }

  async getDashboardConfig(): Promise<DashboardConfig> {
    if (this.isCacheValid() && this.configCache.has('default')) {
      return this.configCache.get('default')!;
    }

    const config = await this.fetchConfig();
    this.configCache.set('default', config);
    this.lastFetchTime = Date.now();
    return config;
  }

  async getStatsForRole(role: UserRole): Promise<Stat[]> {
    const config = await this.getDashboardConfig();
    return config.stats.filter(stat => 
      stat.roles.includes(role) && stat.isActive
    );
  }

  async getQuickActionsForRole(role: UserRole): Promise<QuickAction[]> {
    const config = await this.getDashboardConfig();
    return config.quickActions.filter(action => 
      action.roles.includes(role) && action.isActive
    );
  }

  // Admin methods for managing dashboard configuration
  async updateDashboardItem(item: Stat | QuickAction): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/items/${item.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      throw new Error('Failed to update dashboard item');
    }
    
    // Invalidate cache
    this.configCache.clear();
  }

  async toggleItemVisibility(itemId: string, isActive: boolean): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/items/${itemId}/visibility`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isActive }),
    });

    if (!response.ok) {
      throw new Error('Failed to toggle item visibility');
    }
    
    // Invalidate cache
    this.configCache.clear();
  }

  async updateRolePermissions(role: UserRole, permissions: string[]): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/roles/${role}/permissions`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ permissions }),
    });

    if (!response.ok) {
      throw new Error('Failed to update role permissions');
    }
    
    // Invalidate cache
    this.configCache.clear();
  }
}

export const dashboardService = DashboardService.getInstance(); 