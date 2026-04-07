import type { FloorTable, Reservation, ReservationStatus, Zone } from "./types";

export const TIMELINE_START = 11;
export const TIMELINE_END = 23;
export const HOUR_WIDTH = 120;
export const ROW_HEIGHT = 52;
export const TABLE_COL_WIDTH = 160;

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
  blocked: {
    bg: "bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(28,28,28,0.04)_4px,rgba(28,28,28,0.04)_8px)]",
    border: "border border-[#1C1C1C]/[0.06]",
    text: "text-[#1C1C1C]/20",
    dot: "bg-[#1C1C1C]/8",
    label: "Заблокировано",
  },
};

export const ZONES: Zone[] = [
  { id: "main", name: "Основной зал" },
  { id: "terrace", name: "Терраса" },
  { id: "vip", name: "VIP" },
];

export const ZONE_COLORS: Record<string, string> = {
  main: "bg-blue-400",
  terrace: "bg-green-400",
  vip: "bg-amber-400",
};

export const TABLES: FloorTable[] = [
  { id: "t1", name: "Стол 1", capacity: 4, shape: "rect", zone: "main" },
  { id: "t2", name: "Стол 2", capacity: 2, shape: "rect", zone: "main" },
  { id: "t3", name: "Стол 3", capacity: 6, shape: "circle", zone: "main" },
  { id: "t4", name: "Стол 4", capacity: 4, shape: "rect", zone: "main" },
  { id: "t5", name: "Стол 5", capacity: 4, shape: "circle", zone: "main" },
  { id: "t6", name: "Стол 6", capacity: 8, shape: "rect", zone: "main" },
  { id: "t7", name: "Стол 7", capacity: 2, shape: "rect", zone: "main" },
  { id: "t8", name: "Стол 8", capacity: 4, shape: "rect", zone: "main" },
  { id: "t9", name: "Стол 9", capacity: 4, shape: "rect", zone: "terrace" },
  { id: "t10", name: "Стол 10", capacity: 6, shape: "circle", zone: "terrace" },
  { id: "t11", name: "Стол 11", capacity: 2, shape: "rect", zone: "terrace" },
  { id: "t12", name: "Стол 12", capacity: 4, shape: "rect", zone: "terrace" },
  { id: "t13", name: "Стол 13", capacity: 6, shape: "rect", zone: "vip" },
  { id: "t14", name: "Стол 14", capacity: 8, shape: "rect", zone: "vip" },
  { id: "t15", name: "Стол 15", capacity: 4, shape: "circle", zone: "vip" },
];

export const MOCK_RESERVATIONS: Reservation[] = [
  { id: "r1", guestName: "Айдана М.", guestPhone: "+7 707 111 2233", partySize: 3, startTime: "12:00", endTime: "14:00", tableId: "t1", status: "completed", note: "Бизнес-ланч" },
  { id: "r2", guestName: "Бекзат К.", guestPhone: "+7 701 222 3344", partySize: 2, startTime: "12:30", endTime: "14:00", tableId: "t2", status: "completed" },
  { id: "r3", guestName: "Гульнара С.", guestPhone: "+7 777 333 4455", partySize: 5, startTime: "13:00", endTime: "15:00", tableId: "t3", status: "completed" },
  { id: "r4", guestName: "Дамир Т.", guestPhone: "+7 702 444 5566", partySize: 2, startTime: "13:00", endTime: "14:30", tableId: "t7", status: "completed" },
  { id: "r5", guestName: "Ержан Б.", guestPhone: "+7 705 555 6677", partySize: 4, startTime: "12:00", endTime: "13:30", tableId: "t4", status: "completed" },
  { id: "r6", guestName: "Камила Н.", guestPhone: "+7 708 777 8899", partySize: 2, startTime: "15:00", endTime: "16:30", tableId: "t11", status: "no-show" },
  { id: "r7", guestName: "Даулет К.", guestPhone: "+7 700 888 9900", partySize: 4, startTime: "18:00", endTime: "20:30", tableId: "t1", status: "seated", seatedMinutes: 27 },
  { id: "r8", guestName: "Мадина А.", guestPhone: "+7 707 999 0011", partySize: 6, startTime: "18:30", endTime: "21:00", tableId: "t3", status: "seated", seatedMinutes: 12 },
  { id: "r9", guestName: "Нурлан О.", guestPhone: "+7 701 000 1122", partySize: 2, startTime: "17:30", endTime: "19:30", tableId: "t7", status: "seated", seatedMinutes: 45 },
  { id: "r10", guestName: "Тимур А.", guestPhone: "+7 777 111 2233", partySize: 2, startTime: "19:00", endTime: "21:00", tableId: "t2", status: "no-show" },
  { id: "r11", guestName: "Асель Т.", guestPhone: "+7 707 123 4567", partySize: 3, startTime: "19:00", endTime: "21:00", tableId: "t5", status: "confirmed", deposit: 5000, depositPaid: true, note: "День рождения" },
  { id: "r12", guestName: "Марат С.", guestPhone: "+7 702 234 5678", partySize: 2, startTime: "19:30", endTime: "21:30", tableId: "t4", status: "pending" },
  { id: "r13", guestName: "Сауле Ж.", guestPhone: "+7 705 345 6789", partySize: 4, startTime: "19:00", endTime: "21:00", tableId: "t8", status: "confirmed" },
  { id: "r14", guestName: "Алмас Р.", guestPhone: "+7 708 456 7890", partySize: 6, startTime: "19:30", endTime: "22:00", tableId: "t6", status: "confirmed", deposit: 10000, depositPaid: true },
  { id: "r15", guestName: "Жанна К.", guestPhone: "+7 700 567 8901", partySize: 4, startTime: "20:00", endTime: "22:00", tableId: "t9", status: "confirmed" },
  { id: "r16", guestName: "Олга П.", guestPhone: "+7 707 678 9012", partySize: 6, startTime: "14:00", endTime: "16:00", tableId: "t6", status: "completed" },
  { id: "r17", guestName: "Руслан М.", guestPhone: "+7 701 789 0123", partySize: 4, startTime: "20:00", endTime: "22:30", tableId: "t10", status: "pending" },
  { id: "r18", guestName: "Динара Е.", guestPhone: "+7 777 890 1234", partySize: 8, startTime: "19:00", endTime: "22:00", tableId: "t14", status: "confirmed", deposit: 20000, depositPaid: true, note: "Корпоратив" },
  { id: "r19", guestName: "Арман Б.", guestPhone: "+7 702 901 2345", partySize: 4, startTime: "20:30", endTime: "23:00", tableId: "t13", status: "confirmed" },
  { id: "r20", guestName: "Лаура Т.", guestPhone: "+7 705 012 3456", partySize: 3, startTime: "21:00", endTime: "23:00", tableId: "t15", status: "pending" },
  { id: "r21", guestName: "", guestPhone: "", partySize: 0, startTime: "16:00", endTime: "18:00", tableId: "t14", status: "blocked" },
  { id: "r22", guestName: "Бауыржан Қ.", guestPhone: "+7 708 123 7890", partySize: 2, startTime: "18:00", endTime: "19:30", tableId: "t12", status: "seated", seatedMinutes: 35 },
];
