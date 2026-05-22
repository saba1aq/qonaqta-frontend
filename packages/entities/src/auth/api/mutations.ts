import { useMutation, useQueryClient } from "@tanstack/react-query"
import { authKeys } from "./keys"
import { login, refresh } from "./services"
import type { LoginRequest, RefreshRequest } from "../schemas"

export const useLogin = () =>
  useMutation({
    mutationFn: (data: LoginRequest) => login(data),
  })

export const useRefresh = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: RefreshRequest) => refresh(data),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: authKeys.me() })
    },
  })
}
