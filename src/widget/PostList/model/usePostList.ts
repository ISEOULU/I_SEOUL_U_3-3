import { create } from "zustand"
import { fetchPostsApi } from "../../../entities/post/api/postApi"
import { fetchUsersApi } from "../../../entities/user/api/userApi"
import { Post } from "../../../entities/post/model/types"
import { User } from "../../../entities/user/model/types"

interface PostListState {
  posts: Post[]
  total: number
  loading: boolean
  setPosts: (posts: Post[]) => void
  setTotal: (total: number) => void
  setLoading: (loading: boolean) => void
  fetchPosts: (limit: number, skip: number) => Promise<void>
}

export const usePostList = create<PostListState>((set) => ({
  posts: [],
  total: 0,
  loading: false,
  setPosts: (posts) => set({ posts }),
  setTotal: (total) => set({ total }),
  setLoading: (loading) => set({ loading }),
  fetchPosts: async (limit, skip) => {
    set({ loading: true })
    try {
      const postsData = await fetchPostsApi(limit, skip)
      const usersData = await fetchUsersApi()

      const postsWithUsers = postsData.posts.map((post: Post) => ({
        ...post,
        author: usersData.users.find((user: User) => user.id === post.userId),
      }))

      set({ posts: postsWithUsers, total: postsData.total })
    } catch (error) {
      console.error("게시물 가져오기 오류:", error)
    } finally {
      set({ loading: false })
    }
  },
}))
