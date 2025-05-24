from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime

class TrendBase(BaseModel):
    value: str
    is_positive: bool

class DashboardStatBase(BaseModel):
    title: str
    value: str
    subtitle: str
    icon: str
    icon_bg_color: str
    icon_color: str
    trend: Optional[Dict[str, Any]] = None
    roles: List[str]
    is_active: bool = True

class DashboardStatCreate(DashboardStatBase):
    pass

class DashboardStatUpdate(DashboardStatBase):
    pass

class DashboardStat(DashboardStatBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class DashboardQuickActionBase(BaseModel):
    title: str
    description: str
    icon: str
    href: str
    gradient: str
    icon_bg_class: str
    roles: List[str]
    is_active: bool = True

class DashboardQuickActionCreate(DashboardQuickActionBase):
    pass

class DashboardQuickActionUpdate(DashboardQuickActionBase):
    pass

class DashboardQuickAction(DashboardQuickActionBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class RolePermissionBase(BaseModel):
    role: str
    permissions: List[str]
    is_active: bool = True

class RolePermissionCreate(RolePermissionBase):
    pass

class RolePermissionUpdate(RolePermissionBase):
    pass

class RolePermission(RolePermissionBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class DashboardConfig(BaseModel):
    stats: List[DashboardStat]
    quick_actions: List[DashboardQuickAction] 