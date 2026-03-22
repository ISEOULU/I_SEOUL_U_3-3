import { useQuery } from "@tanstack/react-query"
import { fetchUsersFromApi, fetchUserByIdFromApi } from "./userApi"

export const useUsersQuery = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsersFromApi,
  })
}

export const useUserQuery = (userId: number) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserByIdFromApi(userId),
    enabled: !!userId,
  })
}
