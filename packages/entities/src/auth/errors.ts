import { AuthError, ForbiddenError } from "../shared/errors"

export class TokenExpiredError extends AuthError {
  override readonly code = "TOKEN_EXPIRED"
  constructor(message: string = "Token has expired") {
    super(message)
  }
}

export class InvalidTokenError extends AuthError {
  override readonly code = "INVALID_TOKEN"
  constructor(message: string = "Invalid or missing token") {
    super(message)
  }
}

export class InvalidCredentialsError extends AuthError {
  override readonly code = "INVALID_CREDENTIALS"
  constructor(message: string = "Invalid phone or password") {
    super(message)
  }
}

export class PermissionDeniedError extends ForbiddenError {
  override readonly code = "PERMISSION_DENIED"
  constructor(message: string = "You don't have permission to perform this action") {
    super(message)
  }
}

export class PanelAuthError extends AuthError {
  override readonly code = "PANEL_AUTH_REQUIRED"
  constructor(message: string = "Panel authentication required") {
    super(message)
  }
}
