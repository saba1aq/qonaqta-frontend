import type { Branch } from "../model/types"

let idCounter = 100

export function nextBranchId(): number {
  return ++idCounter
}

export const mockBranches: Branch[] = [
  {
    id: 1,
    brand_id: 1,
    name: "Del Papa Достык",
    address: "пр. Достык, 123",
    city_id: 1,
    phone: "+7 727 111 22 33",
    cuisine_ids: [1, 2],
    is_active: true,
    created_at: "2026-03-01T10:00:00Z",
  },
  {
    id: 2,
    brand_id: 1,
    name: "Del Papa Мега",
    address: "ТРЦ Мега, Розыбакиева 247А",
    city_id: 1,
    phone: "+7 727 222 33 44",
    cuisine_ids: [1, 2],
    is_active: true,
    created_at: "2026-03-15T10:00:00Z",
  },
  {
    id: 3,
    brand_id: 1,
    name: "Del Papa Астана",
    address: "пр. Мангилик Ел, 17",
    city_id: 2,
    phone: "+7 717 333 44 55",
    cuisine_ids: [1],
    is_active: false,
    created_at: "2026-04-01T10:00:00Z",
  },
]
