import { create } from "zustand"
import { Comment, NewComment } from "./types"

interface CommentState {
  selectedComment: Comment | null
  newComment: NewComment
  setSelectedComment: (comment: Comment | null) => void
  setNewComment: (updater: NewComment | ((prev: NewComment) => NewComment)) => void
}

export const useCommentStore = create<CommentState>((set) => ({
  selectedComment: null,
  newComment: { body: "", postId: null, userId: 1 },
  setSelectedComment: (comment) => set({ selectedComment: comment }),
  setNewComment: (updater) =>
    set((state) => ({
      newComment: typeof updater === "function" ? updater(state.newComment) : updater,
    })),
}))
