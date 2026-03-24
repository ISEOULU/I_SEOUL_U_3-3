import { useMemo } from "react"
import { usePostStore } from "../../../entities/post/model/usePostStore"
import { useUserStore } from "../../../entities/user/model/useUserStore"
import { fetchPostsApi, searchPostsApi, fetchPostsByTagApi } from "../../../entities/post/api/postApi"
import { fetchUsersApi } from "../../../entities/user/api/userApi"
import { Post } from "../../../entities/post/model/types"
import { User } from "../../../entities/user/model/types"

export type PostWithAuthor = Post & {
  author?: User
}

export const usePostList = () => {
  const { posts, total, loading, setPosts, setTotal, setLoading } = usePostStore()
  const { users, setUsers } = useUserStore()

  const loadUsersIfNotExists = async () => {
    if (users.length === 0) {
      const usersData = await fetchUsersApi()
      setUsers(usersData.users)
    }
  }

  const resolvePostsWithUsers = async (postsPromise: Promise<{ posts: Post[]; total: number }>) => {
    const postsData = await postsPromise
    setPosts(postsData.posts)
    setTotal(postsData.total)
    await loadUsersIfNotExists()
  }

  const fetchPosts = async (limit: number, skip: number) => {
    setLoading(true)
    try {
      await resolvePostsWithUsers(fetchPostsApi(limit, skip))
    } catch (error) {
      console.error("게시물 가져오기 오류:", error)
    } finally {
      setLoading(false)
    }
  }

  const searchPosts = async (query: string) => {
    setLoading(true)
    try {
      await resolvePostsWithUsers(searchPostsApi(query))
    } catch (error) {
      console.error("게시물 검색 오류:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPostsByTag = async (tag: string) => {
    setLoading(true)
    try {
      await resolvePostsWithUsers(fetchPostsByTagApi(tag))
    } catch (error) {
      console.error("태그별 게시물 가져오기 오류:", error)
    } finally {
      setLoading(false)
    }
  }

  const postsWithUsers: PostWithAuthor[] = useMemo(() => {
    return posts.map((post: Post) => ({
      ...post,
      author: users.find((user: User) => user.id === post.userId),
    }))
  }, [posts, users])

  return {
    posts: postsWithUsers,
    setPosts, 
    total,
    setTotal,
    loading,
    setLoading,
    fetchPosts,
    searchPosts,
    fetchPostsByTag,
  }
}
