import { ConflictError, NotFoundError } from "../shared/errors"

export class FeatureNotFoundError extends NotFoundError {
  override readonly code = "FEATURE_NOT_FOUND"
}

export class FeatureSlugExistsError extends ConflictError {
  override readonly code = "FEATURE_SLUG_EXISTS"
}
