import { useMemo } from "react"
import { usePostStore } from "../../../entities/post/model/usePostStore"
import { useUserStore } from "../../../entities/user/model/useUserStore"
import { fetchPostsApi } from "../../../entities/post/api/postApi"
import { fetchUsersApi } from "../../../entities/user/api/userApi"
import { Post } from "../../../entities/post/model/types"
import { User } from "../../../entities/user/model/types"

export type PostWithAuthor = Post & {
  author?: User
}

export const usePostList = () => {
  const { posts, total, loading, setPosts, setTotal, setLoading } = usePostStore()
  const { users, setUsers } = useUserStore()

  const fetchPosts = async (limit: number, skip: number) => {
    setLoading(true)
    try {
      const postsData = await fetchPostsApi(limit, skip)
      setPosts(postsData.posts)
      setTotal(postsData.total)
      if (users.length === 0) {
        const usersData = await fetchUsersApi()
        setUsers(usersData.users)
      }
    } catch (error) {
      console.error("게시물/유저 가져오기 오류:", error)
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
  }
}
