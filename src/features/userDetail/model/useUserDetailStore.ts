import { create } from "zustand"
import { fetchUserApi } from "../../../entities/user/api/userApi"
import { User } from "../../../entities/user/model/types"

interface UserDetailState {
  showUserModal: boolean
  selectedUser: User | null
  loading: boolean
  setShowUserModal: (show: boolean) => void
  openUserModal: (user: User) => Promise<void>
}

export const useUserDetailStore = create<UserDetailState>((set) => ({
  showUserModal: false,
  selectedUser: null,
  loading: false,
  setShowUserModal: (show) => set({ showUserModal: show }),
  openUserModal: async (user) => {
    set({ loading: true, showUserModal: true })
    try {
      const userData = await fetchUserApi(user.id)
      set({ selectedUser: userData })
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    } finally {
      set({ loading: false })
    }
  }
}))
