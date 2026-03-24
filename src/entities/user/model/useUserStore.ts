import { create } from "zustand"
import { User } from "./types"

interface UserState {
  users: User[]
  loading: boolean
  setUsers: (users: User[]) => void
  setLoading: (loading: boolean) => void
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  loading: false,
  setUsers: (users) => set({ users }),
  setLoading: (loading) => set({ loading }),
}))
