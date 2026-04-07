import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/shared/api"

export type AdminUser = {
  id: string
  phone: string
  name: string
  is_superadmin: boolean
  created_at: string
}

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await apiClient.get("/admin/users")
      return data as AdminUser[]
    },
  })
}
