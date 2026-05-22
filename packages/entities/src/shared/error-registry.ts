import {
  InvalidCredentialsError,
  InvalidTokenError,
  PanelAuthError,
  PermissionDeniedError,
  TokenExpiredError,
} from "../auth/errors"
import { BookingNotFoundError } from "../booking/errors"
import { CuisineNotFoundError, CuisineSlugExistsError } from "../cuisine/errors"
import { FeatureNotFoundError, FeatureSlugExistsError } from "../feature/errors"
import {
  BranchNotFoundError,
  FileTooLargeError,
  InvalidImageTypeError,
} from "../restaurant/errors"
import { NoAccessError, UserInactiveError, UserNotFoundError } from "../user/errors"
import {
  ApiError,
  AuthError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "./errors"

export type ApiErrorConstructor = new (message?: string) => ApiError

export const ERROR_REGISTRY: Record<string, ApiErrorConstructor> = {
  INTERNAL_ERROR: ApiError,
  NOT_FOUND: NotFoundError,
  CONFLICT: ConflictError,
  AUTH_ERROR: AuthError,
  FORBIDDEN: ForbiddenError,

  TOKEN_EXPIRED: TokenExpiredError,
  INVALID_TOKEN: InvalidTokenError,
  INVALID_CREDENTIALS: InvalidCredentialsError,
  PERMISSION_DENIED: PermissionDeniedError,
  PANEL_AUTH_REQUIRED: PanelAuthError,

  BOOKING_NOT_FOUND: BookingNotFoundError,

  CUISINE_NOT_FOUND: CuisineNotFoundError,
  CUISINE_SLUG_EXISTS: CuisineSlugExistsError,

  FEATURE_NOT_FOUND: FeatureNotFoundError,
  FEATURE_SLUG_EXISTS: FeatureSlugExistsError,

  BRANCH_NOT_FOUND: BranchNotFoundError,
  INVALID_IMAGE_TYPE: InvalidImageTypeError,
  FILE_TOO_LARGE: FileTooLargeError,

  USER_NOT_FOUND: UserNotFoundError,
  USER_INACTIVE: UserInactiveError,
  NO_ACCESS: NoAccessError,
}
