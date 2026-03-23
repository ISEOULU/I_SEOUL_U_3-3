import { create } from "zustand"
import { addCommentApi } from "../../../../entities/comment/api/commentApi"
import { useCommentStore } from "../../../../entities/comment/model/useCommentStore"

interface AddCommentState {
  showAddCommentDialog: boolean
  newComment: { body: string; postId: number | null; userId: number }
  loading: boolean
  setShowAddCommentDialog: (show: boolean) => void
  setNewComment: (comment: { body: string; postId: number | null; userId: number }) => void
  addComment: () => Promise<void>
}

export const useAddCommentStore = create<AddCommentState>((set, get) => ({
  showAddCommentDialog: false,
  newComment: { body: "", postId: null, userId: 1 },
  loading: false,
  setShowAddCommentDialog: (showAddCommentDialog) => set({ showAddCommentDialog }),
  setNewComment: (newComment) => set({ newComment }),
  addComment: async () => {
    const { newComment } = get()
    if (!newComment.postId) return
    set({ loading: true })
    try {
      const data = await addCommentApi(newComment.body, newComment.postId, newComment.userId)
      
      const { setComments } = useCommentStore.getState()
      setComments((prev) => ({
        ...prev,
        [data.postId]: [...(prev[data.postId] || []), data],
      }))

      set({ showAddCommentDialog: false, newComment: { body: "", postId: null, userId: 1 } })
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    } finally {
      set({ loading: false })
    }
  },
}))
