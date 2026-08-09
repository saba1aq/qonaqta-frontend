export type PromotionKind = "discount" | "promo" | "event"

export interface PromotionBranch {
  id: number
  name: string
}

export interface Promotion {
  id: number
  branch_id: number
  kind: PromotionKind
  title: string
  description: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  branch: PromotionBranch | null
}

export interface PromotionFilters {
  branch_id?: number
  skip?: number
  limit?: number
}

export interface CreatePromotionPayload {
  branch_id: number
  kind: PromotionKind
  title: string
  description?: string | null
  sort_order?: number
}

export interface UpdatePromotionPayload {
  kind?: PromotionKind
  title?: string
  description?: string | null
  is_active?: boolean
  sort_order?: number
}

export const PROMOTION_KINDS: { value: PromotionKind; label: string; color: string }[] = [
  { value: "discount", label: "Скидка", color: "bg-green-50 text-green-700" },
  { value: "promo", label: "Акция", color: "bg-blue-50 text-blue-700" },
  { value: "event", label: "Событие", color: "bg-purple-50 text-purple-700" },
]
