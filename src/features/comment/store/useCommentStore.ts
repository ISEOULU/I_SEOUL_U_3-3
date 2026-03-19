import { create } from "zustand"
import type { Comment, NewComment } from "../../../entities/comment/model/types"
import { commentApi } from "../../../entities/comment/api/commentApi"

interface CommentState {
  // 데이터
  comments: Record<number, Comment[]>

  // UI 상태
  selectedComment: Comment | null
  newComment: NewComment
  showAddCommentDialog: boolean
  showEditCommentDialog: boolean

  // Setter
  setSelectedComment: (comment: Comment | null) => void
  setNewComment: (comment: NewComment) => void
  setShowAddCommentDialog: (v: boolean) => void
  setShowEditCommentDialog: (v: boolean) => void

  // 비동기 액션
  fetchComments: (postId: number) => Promise<void>
  addComment: () => Promise<void>
  updateComment: () => Promise<void>
  deleteComment: (id: number, postId: number) => Promise<void>
  likeComment: (id: number, postId: number) => Promise<void>
}

export const useCommentStore = create<CommentState>((set, get) => ({
  comments: {},
  selectedComment: null,
  newComment: { body: "", postId: null, userId: 1 },
  showAddCommentDialog: false,
  showEditCommentDialog: false,

  setSelectedComment: (selectedComment) => set({ selectedComment }),
  setNewComment: (newComment) => set({ newComment }),
  setShowAddCommentDialog: (showAddCommentDialog) => set({ showAddCommentDialog }),
  setShowEditCommentDialog: (showEditCommentDialog) => set({ showEditCommentDialog }),

  fetchComments: async (postId: number) => {
    const { comments } = get()
    if (comments[postId]) return // 이미 불러온 댓글은 재요청 안 함
    try {
      const data = await commentApi.fetchByPost(postId)
      set((state) => ({ comments: { ...state.comments, [postId]: data } }))
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
  },

  addComment: async () => {
    const { newComment } = get()
    try {
      const data = await commentApi.addComment(newComment)
      set((state) => ({
        comments: {
          ...state.comments,
          [data.postId]: [...(state.comments[data.postId] || []), data],
        },
        showAddCommentDialog: false,
        newComment: { body: "", postId: null, userId: 1 },
      }))
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  },

  updateComment: async () => {
    const { selectedComment } = get()
    if (!selectedComment) return
    try {
      const data = await commentApi.updateComment(selectedComment.id, selectedComment.body)
      set((state) => ({
        comments: {
          ...state.comments,
          [data.postId]: state.comments[data.postId].map((c) => (c.id === data.id ? data : c)),
        },
        showEditCommentDialog: false,
      }))
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  },

  deleteComment: async (id: number, postId: number) => {
    try {
      await commentApi.deleteComment(id)
      set((state) => ({
        comments: {
          ...state.comments,
          [postId]: state.comments[postId].filter((c) => c.id !== id),
        },
      }))
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  },

  likeComment: async (id: number, postId: number) => {
    const { comments } = get()
    const comment = comments[postId]?.find((c) => c.id === id)
    if (!comment) return
    try {
      await commentApi.likeComment(id, comment.likes + 1)
      set((state) => ({
        comments: {
          ...state.comments,
          [postId]: state.comments[postId].map((c) =>
            c.id === id ? { ...c, likes: c.likes + 1 } : c,
          ),
        },
      }))
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  },
}))
