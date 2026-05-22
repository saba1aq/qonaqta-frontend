import { ConflictError, NotFoundError } from "../shared/errors"

export class CuisineNotFoundError extends NotFoundError {
  override readonly code = "CUISINE_NOT_FOUND"
}

export class CuisineSlugExistsError extends ConflictError {
  override readonly code = "CUISINE_SLUG_EXISTS"
}
