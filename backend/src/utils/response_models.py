# src/utils/response_models.py

from typing import Generic, TypeVar, Optional, List, Dict, Any, Union
from pydantic import BaseModel, Field, ConfigDict
from pydantic.generics import GenericModel

T = TypeVar('T')

class PaginationMeta(BaseModel):
    """Metadata for paginated responses"""
    total: int = Field(..., description="Total number of items")
    page: int = Field(..., description="Current page number")
    size: int = Field(..., description="Number of items per page")
    pages: int = Field(..., description="Total number of pages")
    
    model_config = ConfigDict(from_attributes=True)

class ErrorDetail(BaseModel):
    """Detailed error information"""
    error_code: str = Field(..., description="Error code")
    detail: str = Field(..., description="Error description")
    error_details: Optional[Dict[str, Any]] = Field(None, description="Additional error details")
    
    model_config = ConfigDict(from_attributes=True)

class APIResponse(GenericModel, Generic[T]):
    """Standard API response model"""
    success: bool = Field(..., description="Whether the request was successful")
    data: Optional[T] = Field(None, description="Response data")
    message: Optional[str] = Field(None, description="Response message")
    error: Optional[ErrorDetail] = Field(None, description="Error details if success is false")
    meta: Optional[Dict[str, Any]] = Field(None, description="Additional metadata")
    
    model_config = ConfigDict(from_attributes=True)

class PaginatedResponse(GenericModel, Generic[T]):
    """Paginated API response model"""
    success: bool = Field(..., description="Whether the request was successful")
    data: List[T] = Field(..., description="List of items")
    message: Optional[str] = Field(None, description="Response message")
    pagination: Dict[str, Any] = Field(..., description="Pagination metadata")
    error: Optional[ErrorDetail] = Field(None, description="Error details if success is false")
    
    model_config = ConfigDict(from_attributes=True)
