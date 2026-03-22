import { create } from "zustand"
import { Post, NewPost } from "./types"

interface PostState {
  selectedPost: Post | null
  newPost: NewPost
  setSelectedPost: (post: Post | null) => void
  setNewPost: (updater: NewPost | ((prev: NewPost) => NewPost)) => void
}

export const usePostStore = create<PostState>((set) => ({
  selectedPost: null,
  newPost: { title: "", body: "", userId: 1 },
  setSelectedPost: (post) => set({ selectedPost: post }),
  setNewPost: (updater) =>
    set((state) => ({
      newPost: typeof updater === "function" ? updater(state.newPost) : updater,
    })),
}))
