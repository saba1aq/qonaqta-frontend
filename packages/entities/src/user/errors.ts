import { ForbiddenError, NotFoundError } from "../shared/errors"

export class UserNotFoundError extends NotFoundError {
  override readonly code = "USER_NOT_FOUND"
  constructor(message: string = "User not found") {
    super(message)
  }
}

export class UserInactiveError extends ForbiddenError {
  override readonly code = "USER_INACTIVE"
  constructor(message: string = "User account is inactive") {
    super(message)
  }
}

export class NoAccessError extends ForbiddenError {
  override readonly code = "NO_ACCESS"
  constructor(message: string = "No access to this resource") {
    super(message)
  }
}
