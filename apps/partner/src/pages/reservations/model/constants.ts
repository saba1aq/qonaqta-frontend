import type { Reservation, ReservationStatus } from "./types";

export const TIMELINE_START = 11;
export const TIMELINE_END = 23;
export const HOUR_WIDTH = 120;
export const ROW_HEIGHT = 52;

export const STATUS_STYLES: Record<ReservationStatus, {
  bg: string;
  border: string;
  text: string;
  dot: string;
  label: string;
}> = {
  confirmed: {
    bg: "bg-[#F9E7FF]",
    border: "border border-[#EEC0FF]",
    text: "text-[#232323] font-medium",
    dot: "bg-[#EEC0FF]",
    label: "Подтверждено",
  },
  seated: {
    bg: "bg-[#232323]",
    border: "",
    text: "text-white font-medium",
    dot: "bg-[#232323]",
    label: "За столом",
  },
  pending: {
    bg: "bg-[#FEFEFE]",
    border: "border-[1.5px] border-dashed border-[#1C1C1C]/20",
    text: "text-[#1C1C1C]/50 italic",
    dot: "bg-[#1C1C1C]/20",
    label: "Ожидание",
  },
  completed: {
    bg: "bg-[#1C1C1C]/[0.04]",
    border: "border border-[#1C1C1C]/[0.08]",
    text: "text-[#1C1C1C]/25 line-through",
    dot: "bg-[#1C1C1C]/10",
    label: "Завершено",
  },
  "no-show": {
    bg: "bg-transparent",
    border: "border-[1.5px] border-red-400/30",
    text: "text-red-400/60",
    dot: "bg-red-400/40",
    label: "Не пришёл",
  },
};

export const MOCK_RESERVATIONS: Reservation[] = [
  { id: "r1", guestName: "Айдана М.", guestPhone: "+7 707 111 2233", partySize: 3, startTime: "12:00", endTime: "14:00", tableLabel: "Стол 1", status: "completed", note: "Бизнес-ланч" },
  { id: "r2", guestName: "Бекзат К.", guestPhone: "+7 701 222 3344", partySize: 2, startTime: "12:30", endTime: "14:00", tableLabel: "Стол 2", status: "completed" },
  { id: "r3", guestName: "Гульнара С.", guestPhone: "+7 777 333 4455", partySize: 5, startTime: "13:00", endTime: "15:00", tableLabel: "Стол 3", status: "completed" },
  { id: "r7", guestName: "Даулет К.", guestPhone: "+7 700 888 9900", partySize: 4, startTime: "18:00", endTime: "20:30", tableLabel: "Стол 1", status: "seated", seatedMinutes: 27 },
  { id: "r8", guestName: "Мадина А.", guestPhone: "+7 707 999 0011", partySize: 6, startTime: "18:30", endTime: "21:00", tableLabel: "Стол 3", status: "seated", seatedMinutes: 12 },
  { id: "r11", guestName: "Асель Т.", guestPhone: "+7 707 123 4567", partySize: 3, startTime: "19:00", endTime: "21:00", tableLabel: "Стол 5", status: "confirmed", note: "День рождения" },
  { id: "r12", guestName: "Марат С.", guestPhone: "+7 702 234 5678", partySize: 2, startTime: "19:30", endTime: "21:30", tableLabel: "Стол 4", status: "pending" },
  { id: "r13", guestName: "Сауле Ж.", guestPhone: "+7 705 345 6789", partySize: 4, startTime: "19:00", endTime: "21:00", tableLabel: "Стол 8", status: "confirmed" },
  { id: "r15", guestName: "Жанна К.", guestPhone: "+7 700 567 8901", partySize: 4, startTime: "20:00", endTime: "22:00", tableLabel: "Стол 9", status: "confirmed" },
  { id: "r17", guestName: "Руслан М.", guestPhone: "+7 701 789 0123", partySize: 4, startTime: "20:00", endTime: "22:30", tableLabel: "Стол 10", status: "pending" },
  { id: "r20", guestName: "Лаура Т.", guestPhone: "+7 705 012 3456", partySize: 3, startTime: "21:00", endTime: "23:00", tableLabel: "Стол 15", status: "pending" },
];
