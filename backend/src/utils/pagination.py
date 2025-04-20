# src/utils/pagination.py

from typing import Dict, Any, List, TypeVar, Generic
from pydantic import BaseModel

T = TypeVar('T')

def get_pagination_meta(total: int, skip: int, limit: int) -> Dict[str, Any]:
    """
    Calculate pagination metadata
    
    Args:
        total: Total number of items
        skip: Number of items to skip
        limit: Maximum number of items per page
        
    Returns:
        Dictionary with pagination metadata
    """
    page = skip // limit + 1 if limit > 0 else 1
    pages = (total + limit - 1) // limit if limit > 0 else 1
    
    return {
        "total": total,
        "page": page,
        "size": limit,
        "pages": pages
    }

def paginate_query(query, skip: int, limit: int):
    """
    Apply pagination to a SQLAlchemy query
    
    Args:
        query: SQLAlchemy query object
        skip: Number of items to skip
        limit: Maximum number of items per page
        
    Returns:
        Tuple of (items, pagination_meta)
    """
    # Get total count
    total = query.count()
    
    # Apply pagination
    items = query.offset(skip).limit(limit).all()
    
    # Calculate pagination metadata
    pagination_meta = get_pagination_meta(total, skip, limit)
    
    return items, pagination_meta
