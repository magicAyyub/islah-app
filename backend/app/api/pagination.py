from typing import Generic, TypeVar, List, Optional
from pydantic import BaseModel
from sqlalchemy.orm import Query
from sqlalchemy import func
from math import ceil

T = TypeVar('T')

class PaginationParams(BaseModel):
    page: int = 1
    size: int = 20
    
    def __post_init__(self):
        # Ensure page is at least 1
        if self.page < 1:
            self.page = 1
        # Limit page size to reasonable bounds
        if self.size < 1:
            self.size = 1
        elif self.size > 100:
            self.size = 100

class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    size: int
    pages: int
    has_next: bool
    has_previous: bool

def paginate_query(
    query: Query,
    page: int = 1,
    size: int = 20
) -> tuple[Query, dict]:
    """
    Apply pagination to a SQLAlchemy query and return pagination metadata.
    
    Args:
        query: SQLAlchemy query object
        page: Page number (1-based)
        size: Items per page
        
    Returns:
        Tuple of (paginated_query, pagination_metadata)
    """
    # Ensure valid pagination parameters
    page = max(1, page)
    size = max(1, min(100, size))
    
    # Get total count
    total = query.count()
    
    # Calculate pagination metadata
    pages = ceil(total / size) if total > 0 else 1
    has_next = page < pages
    has_previous = page > 1
    
    # Apply pagination to query
    offset = (page - 1) * size
    paginated_query = query.offset(offset).limit(size)
    
    pagination_metadata = {
        "total": total,
        "page": page,
        "size": size,
        "pages": pages,
        "has_next": has_next,
        "has_previous": has_previous
    }
    
    return paginated_query, pagination_metadata

def create_paginated_response(
    items: List[T],
    pagination_metadata: dict
) -> PaginatedResponse[T]:
    """Create a paginated response object."""
    return PaginatedResponse(
        items=items,
        **pagination_metadata
    )
