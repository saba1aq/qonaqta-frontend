import { NotFoundError } from "../shared/errors"

export class BookingNotFoundError extends NotFoundError {
  override readonly code = "BOOKING_NOT_FOUND"
}
