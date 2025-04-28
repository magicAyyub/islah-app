from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from src.utils.error_handlers import APIError, ValidationError
from src.utils.response_models import APIResponse, ErrorDetail

def setup_exception_handlers(app):
    @app.exception_handler(APIError)
    async def api_error_handler(request: Request, exc: APIError):
        return JSONResponse(
            status_code=exc.status_code,
            content=APIResponse(
                success=False,
                error=ErrorDetail(
                    error_code=exc.error_code,
                    detail=exc.detail,
                    error_details=exc.error_details
                )
            ).dict()
        )

    @app.exception_handler(ValidationError)
    async def validation_error_handler(request: Request, exc: ValidationError):
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content=APIResponse(
                success=False,
                error=ErrorDetail(
                    error_code="VALIDATION_ERROR",
                    detail="Validation error",
                    error_details={"errors": exc.error_details.get("errors", [])}
                )
            ).dict()
        )

    @app.exception_handler(RequestValidationError)
    async def request_validation_exception_handler(request: Request, exc: RequestValidationError):
        errors = [
            {"loc": error["loc"], "msg": error["msg"], "type": error["type"]}
            for error in exc.errors()
        ]
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content=APIResponse(
                success=False,
                error=ErrorDetail(
                    error_code="VALIDATION_ERROR",
                    detail="Request validation error",
                    error_details={"errors": errors}
                )
            ).dict()
        )