import { ApiError, NotFoundError } from "../shared/errors"

export class BranchNotFoundError extends NotFoundError {
  override readonly code = "BRANCH_NOT_FOUND"
}

export class InvalidImageTypeError extends ApiError {
  override readonly code = "INVALID_IMAGE_TYPE"
  override readonly statusCode = 422
}

export class FileTooLargeError extends ApiError {
  override readonly code = "FILE_TOO_LARGE"
  override readonly statusCode = 422
}
