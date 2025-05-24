from sqlalchemy import Column, String, Boolean, JSON, DateTime, ARRAY
from sqlalchemy.sql import func
from src.utils.database import Base

class DashboardStat(Base):
    __tablename__ = "dashboard_stats"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    value = Column(String, nullable=False)
    subtitle = Column(String, nullable=False)
    icon = Column(String, nullable=False)
    icon_bg_color = Column(String, nullable=False)
    icon_color = Column(String, nullable=False)
    trend = Column(JSON, nullable=True)
    roles = Column(ARRAY(String), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class DashboardQuickAction(Base):
    __tablename__ = "dashboard_quick_actions"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    icon = Column(String, nullable=False)
    href = Column(String, nullable=False)
    gradient = Column(String, nullable=False)
    icon_bg_class = Column(String, nullable=False)
    roles = Column(ARRAY(String), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class RolePermission(Base):
    __tablename__ = "role_permissions"

    id = Column(String, primary_key=True, index=True)
    role = Column(String, unique=True, nullable=False)
    permissions = Column(ARRAY(String), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now()) 