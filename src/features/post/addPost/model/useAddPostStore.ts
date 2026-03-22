import { create } from "zustand"
import { createPost } from "../../../../entities/post/api/postApi"
import { CreatePostPayload } from "../../../../entities/post/model/types"

interface AddPostState {
  showAddDialog: boolean
  newPost: CreatePostPayload
  loading: boolean
  setShowAddDialog: (show: boolean) => void
  setNewPost: (post: CreatePostPayload) => void
  addPost: (onSuccess: (newPostData: any) => void) => Promise<void>
}

export const useAddPostStore = create<AddPostState>((set, get) => ({
  showAddDialog: false,
  newPost: { title: "", body: "", userId: 1 },
  loading: false,
  setShowAddDialog: (showAddDialog) => set({ showAddDialog }),
  setNewPost: (newPost) => set({ newPost }),
  addPost: async (onSuccess) => {
    const { newPost } = get()
    set({ loading: true })
    try {
      const data = await createPost(newPost)
      onSuccess(data)
      set({ showAddDialog: false, newPost: { title: "", body: "", userId: 1 } })
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    } finally {
      set({ loading: false })
    }
  },
}))
