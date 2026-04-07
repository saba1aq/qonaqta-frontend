export type Cuisine = {
  id: string
  name: string
  slug: string
}

export type CreateCuisinePayload = {
  name: string
  slug: string
}

export type UpdateCuisinePayload = {
  name?: string
  slug?: string
}
