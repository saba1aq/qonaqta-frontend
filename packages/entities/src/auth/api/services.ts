import { getApi } from "../../shared/client"
import { extractApiError } from "../../shared/error"
import {
  LoginResponseSchema,
  MeResponseSchema,
  TokenResponseSchema,
  type LoginRequest,
  type LoginResponse,
  type MeResponse,
  type RefreshRequest,
  type TokenResponse,
} from "../schemas"

/**
 * Login with phone and password
 * POST /auth/login
 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const res = await getApi().post("/auth/login", data)
    const parsed = LoginResponseSchema.safeParse(res.data)
    if (!parsed.success) throw new Error("Failed to parse login response")
    return parsed.data
  } catch (e: unknown) {
    throw extractApiError(e, "Failed to login")
  }
}

/**
 * Refresh access token
 * POST /auth/refresh
 */
export const refresh = async (data: RefreshRequest): Promise<TokenResponse> => {
  try {
    const res = await getApi().post("/auth/refresh", data)
    const parsed = TokenResponseSchema.safeParse(res.data)
    if (!parsed.success) throw new Error("Failed to parse refresh response")
    return parsed.data
  } catch (e: unknown) {
    throw extractApiError(e, "Failed to refresh token")
  }
}

/**
 * Get current user info
 * GET /auth/me
 */
export const getMe = async (): Promise<MeResponse> => {
  try {
    const res = await getApi().get("/auth/me")
    const parsed = MeResponseSchema.safeParse(res.data)
    if (!parsed.success) throw new Error("Failed to parse me response")
    return parsed.data
  } catch (e: unknown) {
    throw extractApiError(e, "Failed to fetch current user")
  }
}
