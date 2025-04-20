# src/utils/error_handlers.py

from fastapi import HTTPException, status
from typing import Optional, Dict, Any, List, Union
import logging

# Configure logging
logger = logging.getLogger(__name__)

class APIError(HTTPException):
    """
    Enhanced HTTP exception with additional context and logging capabilities.
    """
    def __init__(
        self, 
        status_code: int, 
        detail: str, 
        headers: Optional[Dict[str, str]] = None,
        error_code: Optional[str] = None,
        error_details: Optional[Dict[str, Any]] = None,
        log_level: int = logging.ERROR
    ):
        super().__init__(status_code=status_code, detail=detail, headers=headers)
        self.error_code = error_code or f"ERR_{status_code}"
        self.error_details = error_details or {}
        
        # Log the error
        log_message = f"API Error {self.error_code}: {detail}"
        if error_details:
            log_message += f" - Details: {error_details}"
        logger.log(log_level, log_message)

# Common API errors
class ResourceNotFoundError(APIError):
    def __init__(
        self, 
        resource_type: str, 
        resource_id: Union[int, str],
        additional_info: Optional[str] = None
    ):
        detail = f"{resource_type} with ID {resource_id} not found"
        if additional_info:
            detail += f". {additional_info}"
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail,
            error_code=f"NOT_FOUND_{resource_type.upper()}",
            error_details={"resource_type": resource_type, "resource_id": resource_id}
        )

class ResourceAlreadyExistsError(APIError):
    def __init__(
        self, 
        resource_type: str, 
        field: str, 
        value: Any
    ):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"{resource_type} with {field} '{value}' already exists",
            error_code=f"ALREADY_EXISTS_{resource_type.upper()}",
            error_details={"resource_type": resource_type, "field": field, "value": value}
        )

class ValidationError(APIError):
    def __init__(
        self, 
        errors: List[Dict[str, Any]]
    ):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Validation error",
            error_code="VALIDATION_ERROR",
            error_details={"errors": errors}
        )

class ForeignKeyViolationError(APIError):
    def __init__(
        self, 
        resource_type: str, 
        field: str, 
        value: Any,
        referenced_resource: str
    ):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{referenced_resource} with ID {value} does not exist",
            error_code=f"FOREIGN_KEY_VIOLATION",
            error_details={
                "resource_type": resource_type, 
                "field": field, 
                "value": value,
                "referenced_resource": referenced_resource
            }
        )

class UnauthorizedError(APIError):
    def __init__(
        self, 
        detail: str = "Not authorized to perform this action"
    ):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail,
            error_code="UNAUTHORIZED"
        )

class DatabaseError(APIError):
    def __init__(
        self, 
        detail: str = "Database error occurred",
        original_error: Optional[Exception] = None
    ):
        error_details = {}
        if original_error:
            error_details["original_error"] = str(original_error)
        
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail,
            error_code="DATABASE_ERROR",
            error_details=error_details
        )
