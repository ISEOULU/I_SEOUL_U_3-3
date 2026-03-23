import { create } from "zustand"
import { fetchCommentsApi } from "../api/commentApi"
import { Comment } from "./types"

interface CommentState {
  comments: Record<number, Comment[]>
  loading: boolean
  setComments: (
    updaterOrValue: Record<number, Comment[]> | ((prev: Record<number, Comment[]>) => Record<number, Comment[]>)
  ) => void
  setLoading: (loading: boolean) => void
  fetchComments: (postId: number) => Promise<void>
}

export const useCommentStore = create<CommentState>((set, get) => ({
  comments: {},
  loading: false,
  setComments: (updaterOrValue) =>
    set((state) => ({
      comments: typeof updaterOrValue === "function" ? updaterOrValue(state.comments) : updaterOrValue,
    })),
  setLoading: (loading) => set({ loading }),
  fetchComments: async (postId) => {
    // 이미 불러온 댓글(캐시)이 있으면 스킵
    if (get().comments[postId]) return
    
    set({ loading: true })
    try {
      const data = await fetchCommentsApi(postId)
      set((state) => ({
        comments: { ...state.comments, [postId]: data.comments },
      }))
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    } finally {
      set({ loading: false })
    }
  },
}))
