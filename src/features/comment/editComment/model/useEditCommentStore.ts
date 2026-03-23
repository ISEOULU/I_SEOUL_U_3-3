import { create } from "zustand"
import { updateCommentApi } from "../../../../entities/comment/api/commentApi"
import { useCommentStore } from "../../../../entities/comment/model/useCommentStore"
import { Comment } from "../../../../entities/comment/model/types"

interface EditCommentState {
  showEditCommentDialog: boolean
  selectedComment: Comment | null
  loading: boolean
  setShowEditCommentDialog: (show: boolean) => void
  setSelectedComment: (comment: Comment | null) => void
  updateComment: () => Promise<void>
}

export const useEditCommentStore = create<EditCommentState>((set, get) => ({
  showEditCommentDialog: false,
  selectedComment: null,
  loading: false,
  setShowEditCommentDialog: (showEditCommentDialog) => set({ showEditCommentDialog }),
  setSelectedComment: (selectedComment) => set({ selectedComment }),
  updateComment: async () => {
    const { selectedComment } = get()
    if (!selectedComment) return
    set({ loading: true })
    try {
      const data = await updateCommentApi(selectedComment.id, selectedComment.body)
      
      const { setComments } = useCommentStore.getState()
      setComments((prev) => ({
        ...prev,
        [data.postId]: prev[data.postId].map((comment) => (comment.id === data.id ? data : comment)),
      }))

      set({ showEditCommentDialog: false, selectedComment: null })
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    } finally {
      set({ loading: false })
    }
  },
}))
