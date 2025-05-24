from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

import src.utils.dependencies as deps
from src.app.crud import dashboard as crud
from src.app.schemas.dashboard import (
    DashboardStat,
    DashboardStatCreate,
    DashboardStatUpdate,
    DashboardQuickAction,
    DashboardQuickActionCreate,
    DashboardQuickActionUpdate,
    RolePermission,
    RolePermissionCreate,
    RolePermissionUpdate,
    DashboardConfig,
)


router = APIRouter()

@router.get("/config", response_model=DashboardConfig)
def get_dashboard_config(
    db: Session = Depends(deps.get_db),
    roles: Optional[List[str]] = Query(None),
    current_user = Depends(deps.get_current_user),
):
    """
    Get dashboard configuration for the current user's roles.
    """
    stats = crud.get_dashboard_stats(db, is_active=True, roles=roles or current_user.roles)
    quick_actions = crud.get_dashboard_quick_actions(db, is_active=True, roles=roles or current_user.roles)
    return DashboardConfig(stats=stats, quick_actions=quick_actions)

@router.get("/stats", response_model=List[DashboardStat])
def get_stats(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    is_active: Optional[bool] = None,
    roles: Optional[List[str]] = Query(None),
    current_user = Depends(deps.get_current_user),
):
    """
    Get dashboard statistics.
    """
    return crud.get_dashboard_stats(db, skip=skip, limit=limit, is_active=is_active, roles=roles)

@router.post("/stats", response_model=DashboardStat)
def create_stat(
    *,
    db: Session = Depends(deps.get_db),
    stat_in: DashboardStatCreate,
    current_user = Depends(deps.get_current_user),
):
    """
    Create new dashboard statistic.
    """
    return crud.create_dashboard_stat(db=db, stat=stat_in)

@router.put("/stats/{stat_id}", response_model=DashboardStat)
def update_stat(
    *,
    db: Session = Depends(deps.get_db),
    stat_id: str,
    stat_in: DashboardStatUpdate,
    current_user = Depends(deps.get_current_user),
):
    """
    Update dashboard statistic.
    """
    stat = crud.get_dashboard_stat(db=db, stat_id=stat_id)
    if not stat:
        raise HTTPException(status_code=404, detail="Statistic not found")
    return crud.update_dashboard_stat(db=db, stat_id=stat_id, stat=stat_in)

@router.delete("/stats/{stat_id}")
def delete_stat(
    *,
    db: Session = Depends(deps.get_db),
    stat_id: str,
    current_user = Depends(deps.get_current_user),
):
    """
    Delete dashboard statistic.
    """
    stat = crud.get_dashboard_stat(db=db, stat_id=stat_id)
    if not stat:
        raise HTTPException(status_code=404, detail="Statistic not found")
    if crud.delete_dashboard_stat(db=db, stat_id=stat_id):
        return {"status": "success"}
    raise HTTPException(status_code=400, detail="Failed to delete statistic")

@router.get("/quick-actions", response_model=List[DashboardQuickAction])
def get_quick_actions(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    is_active: Optional[bool] = None,
    roles: Optional[List[str]] = Query(None),
    current_user = Depends(deps.get_current_user),
):
    """
    Get dashboard quick actions.
    """
    return crud.get_dashboard_quick_actions(db, skip=skip, limit=limit, is_active=is_active, roles=roles)

@router.post("/quick-actions", response_model=DashboardQuickAction)
def create_quick_action(
    *,
    db: Session = Depends(deps.get_db),
    action_in: DashboardQuickActionCreate,
    current_user = Depends(deps.get_current_user),
):
    """
    Create new dashboard quick action.
    """
    return crud.create_dashboard_quick_action(db=db, action=action_in)

@router.put("/quick-actions/{action_id}", response_model=DashboardQuickAction)
def update_quick_action(
    *,
    db: Session = Depends(deps.get_db),
    action_id: str,
    action_in: DashboardQuickActionUpdate,
    current_user = Depends(deps.get_current_user),
):
    """
    Update dashboard quick action.
    """
    action = crud.get_dashboard_quick_action(db=db, action_id=action_id)
    if not action:
        raise HTTPException(status_code=404, detail="Quick action not found")
    return crud.update_dashboard_quick_action(db=db, action_id=action_id, action=action_in)

@router.delete("/quick-actions/{action_id}")
def delete_quick_action(
    *,
    db: Session = Depends(deps.get_db),
    action_id: str,
    current_user = Depends(deps.get_current_user),
):
    """
    Delete dashboard quick action.
    """
    action = crud.get_dashboard_quick_action(db=db, action_id=action_id)
    if not action:
        raise HTTPException(status_code=404, detail="Quick action not found")
    if crud.delete_dashboard_quick_action(db=db, action_id=action_id):
        return {"status": "success"}
    raise HTTPException(status_code=400, detail="Failed to delete quick action")

@router.get("/role-permissions", response_model=List[RolePermission])
def get_role_permissions(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    is_active: Optional[bool] = None,
    role: Optional[str] = None,
    current_user = Depends(deps.get_current_user),
):
    """
    Get role permissions.
    """
    return crud.get_role_permissions(db, skip=skip, limit=limit, is_active=is_active, role=role)

@router.post("/role-permissions", response_model=RolePermission)
def create_role_permission(
    *,
    db: Session = Depends(deps.get_db),
    permission_in: RolePermissionCreate,
    current_user = Depends(deps.get_current_user),
):
    """
    Create new role permission.
    """
    return crud.create_role_permission(db=db, permission=permission_in)

@router.put("/role-permissions/{permission_id}", response_model=RolePermission)
def update_role_permission(
    *,
    db: Session = Depends(deps.get_db),
    permission_id: str,
    permission_in: RolePermissionUpdate,
    current_user = Depends(deps.get_current_user),
):
    """
    Update role permission.
    """
    permission = crud.get_role_permission(db=db, permission_id=permission_id)
    if not permission:
        raise HTTPException(status_code=404, detail="Role permission not found")
    return crud.update_role_permission(db=db, permission_id=permission_id, permission=permission_in)

@router.delete("/role-permissions/{permission_id}")
def delete_role_permission(
    *,
    db: Session = Depends(deps.get_db),
    permission_id: str,
    current_user = Depends(deps.get_current_user),
):
    """
    Delete role permission.
    """
    permission = crud.get_role_permission(db=db, permission_id=permission_id)
    if not permission:
        raise HTTPException(status_code=404, detail="Role permission not found")
    if crud.delete_role_permission(db=db, permission_id=permission_id):
        return {"status": "success"}
    raise HTTPException(status_code=400, detail="Failed to delete role permission") 