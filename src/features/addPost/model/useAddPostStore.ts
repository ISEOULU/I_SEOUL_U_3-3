import { create } from "zustand"
import { createPost } from "../../../entities/post/api/postApi"
import { CreatePostPayload } from "../../../entities/post/model/types"
import { usePostStore } from "../../../entities/post/model/usePostStore"

interface AddPostState {
  showAddDialog: boolean
  newPost: CreatePostPayload
  loading: boolean
  setShowAddDialog: (show: boolean) => void
  setNewPost: (post: CreatePostPayload) => void
  addPost: () => Promise<void>
}

export const useAddPostStore = create<AddPostState>((set, get) => ({
  showAddDialog: false,
  newPost: { title: "", body: "", userId: 1 },
  loading: false,
  setShowAddDialog: (showAddDialog) => set({ showAddDialog }),
  setNewPost: (newPost) => set({ newPost }),
  addPost: async () => {
    const { newPost } = get()
    set({ loading: true })
    try {
      const data = await createPost(newPost)
      
      const { posts, setPosts } = usePostStore.getState()
      setPosts([data, ...posts])

      set({ showAddDialog: false, newPost: { title: "", body: "", userId: 1 } })
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    } finally {
      set({ loading: false })
    }
  },
}))
