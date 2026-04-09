export type ReservationStatus = "confirmed" | "seated" | "pending" | "completed" | "no-show";

export interface Reservation {
  id: string;
  guestName: string;
  guestPhone: string;
  partySize: number;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  note?: string;
}
