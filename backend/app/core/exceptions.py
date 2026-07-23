class PreflightError(Exception):
    """Base application exception."""

    def __init__(self, message: str, *, code: str = "SERVER_ERROR") -> None:
        self.message = message
        self.code = code
        super().__init__(message)


class NotFoundError(PreflightError):
    def __init__(self, message: str = "Resource not found") -> None:
        super().__init__(message, code="NOT_FOUND")


class ConflictError(PreflightError):
    def __init__(self, message: str = "Conflict") -> None:
        super().__init__(message, code="CONFLICT")


class AuthenticationError(PreflightError):
    def __init__(self, message: str = "Authentication failed") -> None:
        super().__init__(message, code="UNAUTHORIZED")


class ValidationError(PreflightError):
    def __init__(self, message: str = "Invalid request") -> None:
        super().__init__(message, code="INVALID_REQUEST")
