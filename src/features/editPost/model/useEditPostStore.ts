import { create } from "zustand"
import { updatePostApi } from "../../../entities/post/api/postApi"
import { Post } from "../../../entities/post/model/types"
import { usePostStore } from "../../../entities/post/model/usePostStore"

interface EditPostState {
  showEditDialog: boolean
  selectedPost: Post | null
  loading: boolean
  setShowEditDialog: (show: boolean) => void
  setSelectedPost: (post: Post | null) => void
  updatePost: () => Promise<void>
}

export const useEditPostStore = create<EditPostState>((set, get) => ({
  showEditDialog: false,
  selectedPost: null,
  loading: false,
  setShowEditDialog: (showEditDialog) => set({ showEditDialog }),
  setSelectedPost: (selectedPost) => set({ selectedPost }),
  updatePost: async () => {
    const { selectedPost } = get()
    if (!selectedPost) return
    set({ loading: true })
    try {
      const data = await updatePostApi(selectedPost)
      
      const { posts, setPosts } = usePostStore.getState()
      setPosts(posts.map((post) => (post.id === data.id ? data : post)))

      set({ showEditDialog: false, selectedPost: null })
    } catch (error) {
      console.error("게시물 수정 오류:", error)
    } finally {
      set({ loading: false })
    }
  },
}))
