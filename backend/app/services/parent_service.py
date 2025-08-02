from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.database.models import Parent
from app.schemas.parent import ParentCreate, ParentUpdate

def create_parent(db: Session, parent: ParentCreate):
    """Create a new parent"""
    # Handle frontend field mapping
    parent_data = parent.model_dump()
    
    # Map emergency_contact to mobile for database storage
    if parent_data.get('emergency_contact'):
        parent_data['mobile'] = parent_data.pop('emergency_contact')
    
    db_parent = Parent(**parent_data)
    db.add(db_parent)
    db.commit()
    db.refresh(db_parent)
    return db_parent

def get_parent(db: Session, parent_id: int):
    """Get a parent by ID"""
    return db.query(Parent).filter(Parent.id == parent_id).first()

def get_parents(db: Session, skip: int = 0, limit: int = 100):
    """Get all parents with pagination"""
    return db.query(Parent).offset(skip).limit(limit).all()

def update_parent(db: Session, parent_id: int, parent_update: ParentUpdate):
    """Update an existing parent"""
    db_parent = db.query(Parent).filter(Parent.id == parent_id).first()
    if not db_parent:
        raise HTTPException(status_code=404, detail="Parent not found")
    
    # Update only the fields that are provided
    update_data = parent_update.model_dump(exclude_unset=True)
    
    # Handle frontend field mapping
    if 'emergency_contact' in update_data:
        update_data['mobile'] = update_data.pop('emergency_contact')
    
    for field, value in update_data.items():
        setattr(db_parent, field, value)
    
    db.commit()
    db.refresh(db_parent)
    return db_parent

def delete_parent(db: Session, parent_id: int):
    """Delete a parent"""
    db_parent = db.query(Parent).filter(Parent.id == parent_id).first()
    if not db_parent:
        raise HTTPException(status_code=404, detail="Parent not found")
    
    # Check if parent has any students
    if db_parent.students:
        raise HTTPException(
            status_code=400, 
            detail="Cannot delete parent with associated students"
        )
    
    db.delete(db_parent)
    db.commit()
    return {"message": "Parent deleted successfully"}
