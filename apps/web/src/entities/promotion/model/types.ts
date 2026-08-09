export type PromotionKind = 'discount' | 'promo' | 'event'

export interface PromotionBranch {
  id: number
  name: string
}

export interface Promotion {
  id: number
  kind: PromotionKind
  title: string
  description: string | null
  branch: PromotionBranch
}
