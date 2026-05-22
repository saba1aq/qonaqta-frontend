import { z } from "zod"

export const AuthUserSchema = z.object({
  id: z.string().uuid(),
  phone: z.string(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  role: z.string(),
  is_active: z.boolean(),
  created_at: z.string(),
})
export type AuthUser = z.infer<typeof AuthUserSchema>

export const LoginRequestSchema = z.object({
  phone: z.string().min(1),
  password: z.string().min(1),
})
export type LoginRequest = z.infer<typeof LoginRequestSchema>

export const LoginResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  user: AuthUserSchema,
})
export type LoginResponse = z.infer<typeof LoginResponseSchema>

export const RefreshRequestSchema = z.object({
  refresh_token: z.string(),
})
export type RefreshRequest = z.infer<typeof RefreshRequestSchema>

export const TokenResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
})
export type TokenResponse = z.infer<typeof TokenResponseSchema>

export const MeResponseSchema = z.object({
  user: AuthUserSchema,
})
export type MeResponse = z.infer<typeof MeResponseSchema>
