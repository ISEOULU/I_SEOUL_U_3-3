import { httpClient } from "../../../shared/api/httpClient"
import type { User } from "../model/types"

export const userApi = {
  fetchById: (id: number): Promise<User> => httpClient.get<User>(`/users/${id}`),
}
