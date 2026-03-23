import { create } from "zustand"
import { fetchTagsApi } from "../api/tagApi"
import { Tag } from "./types"

interface TagState {
  tags: Tag[]
  loading: boolean
  setTags: (tags: Tag[]) => void
  setLoading: (loading: boolean) => void
  fetchTags: () => Promise<void>
}

export const useTagStore = create<TagState>((set) => ({
  tags: [],
  loading: false,
  setTags: (tags) => set({ tags }),
  setLoading: (loading) => set({ loading }),
  fetchTags: async () => {
    set({ loading: true })
    try {
      const data = await fetchTagsApi()
      set({ tags: data })
    } catch (error) {
      console.error("태그 가져오기 오류:", error)
    } finally {
      set({ loading: false })
    }
  },
}))
