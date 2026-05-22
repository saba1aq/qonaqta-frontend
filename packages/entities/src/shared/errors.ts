export class ApiError extends Error {
  readonly code: string = "INTERNAL_ERROR"
  readonly statusCode: number = 500

  constructor(message?: string) {
    super(message ?? "Internal error")
    this.name = new.target.name
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class NotFoundError extends ApiError {
  override readonly code: string = "NOT_FOUND"
  override readonly statusCode: number = 404
}

export class ConflictError extends ApiError {
  override readonly code: string = "CONFLICT"
  override readonly statusCode: number = 409
}

export class AuthError extends ApiError {
  override readonly code: string = "AUTH_ERROR"
  override readonly statusCode: number = 401
}

export class ForbiddenError extends ApiError {
  override readonly code: string = "FORBIDDEN"
  override readonly statusCode: number = 403
}
