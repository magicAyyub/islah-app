# src/routes/configurations.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any

from src.utils.database import get_db
from src.utils.dependencies import get_current_user, check_admin_role
from src.models import Configuration
from src.schemas import ConfigurationCreate, ConfigurationUpdate, ConfigurationResponse

router = APIRouter(
    prefix="/configurations",
    tags=["Configurations"],
    dependencies=[Depends(get_current_user)],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[ConfigurationResponse])
async def read_configurations(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    query = db.query(Configuration)
    
    if category:
        query = query.filter(Configuration.category == category)
    
    configurations = query.offset(skip).limit(limit).all()
    return configurations

@router.get("/by-category", response_model=Dict[str, Dict[str, Any]])
async def get_configurations_by_category(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    configurations = db.query(Configuration).all()
    
    result = {}
    for config in configurations:
        if config.category not in result:
            result[config.category] = {}
        
        result[config.category][config.key] = config.value
    
    return result

@router.get("/{config_id}", response_model=ConfigurationResponse)
async def read_configuration(
    config_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    configuration = db.query(Configuration).filter(Configuration.id == config_id).first()
    if configuration is None:
        raise HTTPException(status_code=404, detail="Configuration not found")
    return configuration

@router.post("/", response_model=ConfigurationResponse, status_code=status.HTTP_201_CREATED)
async def create_configuration(
    configuration: ConfigurationCreate,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_role)
):
    # Check if configuration already exists
    existing = db.query(Configuration).filter(
        Configuration.category == configuration.category,
        Configuration.key == configuration.key
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Configuration with this category and key already exists"
        )
    
    db_configuration = Configuration(
        category=configuration.category,
        key=configuration.key,
        value=configuration.value,
        description=configuration.description
    )
    
    db.add(db_configuration)
    db.commit()
    db.refresh(db_configuration)
    
    return db_configuration

@router.put("/{config_id}", response_model=ConfigurationResponse)
async def update_configuration(
    config_id: int,
    configuration: ConfigurationUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_role)
):
    db_configuration = db.query(Configuration).filter(Configuration.id == config_id).first()
    if db_configuration is None:
        raise HTTPException(status_code=404, detail="Configuration not found")
    
    update_data = configuration.dict(exclude_unset=True)
    
    # Check for uniqueness if category or key is being updated
    if ("category" in update_data or "key" in update_data) and (
        update_data.get("category", db_configuration.category) != db_configuration.category or
        update_data.get("key", db_configuration.key) != db_configuration.key
    ):
        existing = db.query(Configuration).filter(
            Configuration.category == update_data.get("category", db_configuration.category),
            Configuration.key == update_data.get("key", db_configuration.key),
            Configuration.id != config_id
        ).first()
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Configuration with this category and key already exists"
            )
    
    for key, value in update_data.items():
        setattr(db_configuration, key, value)
    
    db.commit()
    db.refresh(db_configuration)
    
    return db_configuration

@router.delete("/{config_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_configuration(
    config_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(check_admin_role)
):
    db_configuration = db.query(Configuration).filter(Configuration.id == config_id).first()
    if db_configuration is None:
        raise HTTPException(status_code=404, detail="Configuration not found")
    
    db.delete(db_configuration)
    db.commit()
    
    return None