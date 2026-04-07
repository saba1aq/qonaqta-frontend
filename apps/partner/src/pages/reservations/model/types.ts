export type ReservationStatus = "confirmed" | "seated" | "pending" | "completed" | "no-show" | "blocked";

export interface Reservation {
  id: string;
  guestName: string;
  guestPhone: string;
  partySize: number;
  startTime: string;
  endTime: string;
  tableId: string;
  status: ReservationStatus;
  deposit?: number;
  depositPaid?: boolean;
  note?: string;
  seatedMinutes?: number;
}

export interface FloorTable {
  id: string;
  name: string;
  capacity: number;
  shape: "rect" | "circle";
  zone: string;
}

export interface Zone {
  id: string;
  name: string;
}
