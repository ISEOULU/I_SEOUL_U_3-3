import { create } from "zustand"
import type { User } from "../../../entities/user/model/types"
import { userApi } from "../../../entities/user/api/userApi"
import type { Author } from "../../../entities/post/model/types"

interface UserStore {
  selectedUser: User | null
  showUserModal: boolean
  setShowUserModal: (v: boolean) => void
  openUserModal: (author: Author) => Promise<void>
}

export const useUserStore = create<UserStore>((set) => ({
  selectedUser: null,
  showUserModal: false,

  setShowUserModal: (showUserModal) => set({ showUserModal }),

  openUserModal: async (author: Author) => {
    try {
      const userData = await userApi.fetchById(author.id)
      set({ selectedUser: userData, showUserModal: true })
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  },
}))
