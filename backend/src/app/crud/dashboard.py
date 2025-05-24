from typing import List, Optional
from sqlalchemy.orm import Session

from src.app.models.dashboard import (
    DashboardStat,
    DashboardQuickAction,
    RolePermission
)
from src.app.schemas.dashboard import (
    DashboardStatCreate,
    DashboardStatUpdate,
    DashboardQuickActionCreate,
    DashboardQuickActionUpdate,
    RolePermissionCreate,
    RolePermissionUpdate,
)

def get_dashboard_stats(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    is_active: Optional[bool] = None,
    roles: Optional[List[str]] = None,
) -> List[DashboardStat]:
    query = db.query(DashboardStat)
    
    if is_active is not None:
        query = query.filter(DashboardStat.is_active == is_active)
    
    if roles:
        query = query.filter(DashboardStat.roles.overlap(roles))
    
    return query.offset(skip).limit(limit).all()

def get_dashboard_stat(db: Session, stat_id: str) -> Optional[DashboardStat]:
    return db.query(DashboardStat).filter(DashboardStat.id == stat_id).first()

def create_dashboard_stat(
    db: Session, stat: DashboardStatCreate
) -> DashboardStat:
    db_stat = DashboardStat(**stat.model_dump())
    db.add(db_stat)
    db.commit()
    db.refresh(db_stat)
    return db_stat

def update_dashboard_stat(
    db: Session, stat_id: str, stat: DashboardStatUpdate
) -> Optional[DashboardStat]:
    db_stat = get_dashboard_stat(db, stat_id)
    if db_stat:
        for key, value in stat.model_dump().items():
            setattr(db_stat, key, value)
        db.commit()
        db.refresh(db_stat)
    return db_stat

def delete_dashboard_stat(db: Session, stat_id: str) -> bool:
    db_stat = get_dashboard_stat(db, stat_id)
    if db_stat:
        db.delete(db_stat)
        db.commit()
        return True
    return False

def get_dashboard_quick_actions(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    is_active: Optional[bool] = None,
    roles: Optional[List[str]] = None,
) -> List[DashboardQuickAction]:
    query = db.query(DashboardQuickAction)
    
    if is_active is not None:
        query = query.filter(DashboardQuickAction.is_active == is_active)
    
    if roles:
        query = query.filter(DashboardQuickAction.roles.overlap(roles))
    
    return query.offset(skip).limit(limit).all()

def get_dashboard_quick_action(
    db: Session, action_id: str
) -> Optional[DashboardQuickAction]:
    return db.query(DashboardQuickAction).filter(DashboardQuickAction.id == action_id).first()

def create_dashboard_quick_action(
    db: Session, action: DashboardQuickActionCreate
) -> DashboardQuickAction:
    db_action = DashboardQuickAction(**action.model_dump())
    db.add(db_action)
    db.commit()
    db.refresh(db_action)
    return db_action

def update_dashboard_quick_action(
    db: Session, action_id: str, action: DashboardQuickActionUpdate
) -> Optional[DashboardQuickAction]:
    db_action = get_dashboard_quick_action(db, action_id)
    if db_action:
        for key, value in action.model_dump().items():
            setattr(db_action, key, value)
        db.commit()
        db.refresh(db_action)
    return db_action

def delete_dashboard_quick_action(db: Session, action_id: str) -> bool:
    db_action = get_dashboard_quick_action(db, action_id)
    if db_action:
        db.delete(db_action)
        db.commit()
        return True
    return False

def get_role_permissions(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    is_active: Optional[bool] = None,
    role: Optional[str] = None,
) -> List[RolePermission]:
    query = db.query(RolePermission)
    
    if is_active is not None:
        query = query.filter(RolePermission.is_active == is_active)
    
    if role:
        query = query.filter(RolePermission.role == role)
    
    return query.offset(skip).limit(limit).all()

def get_role_permission(
    db: Session, permission_id: str
) -> Optional[RolePermission]:
    return db.query(RolePermission).filter(RolePermission.id == permission_id).first()

def create_role_permission(
    db: Session, permission: RolePermissionCreate
) -> RolePermission:
    db_permission = RolePermission(**permission.model_dump())
    db.add(db_permission)
    db.commit()
    db.refresh(db_permission)
    return db_permission

def update_role_permission(
    db: Session, permission_id: str, permission: RolePermissionUpdate
) -> Optional[RolePermission]:
    db_permission = get_role_permission(db, permission_id)
    if db_permission:
        for key, value in permission.model_dump().items():
            setattr(db_permission, key, value)
        db.commit()
        db.refresh(db_permission)
    return db_permission

def delete_role_permission(db: Session, permission_id: str) -> bool:
    db_permission = get_role_permission(db, permission_id)
    if db_permission:
        db.delete(db_permission)
        db.commit()
        return True
    return False 