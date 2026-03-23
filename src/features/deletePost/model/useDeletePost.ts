import { useState } from "react"
import { deletePostApi } from "../../../entities/post/api/postApi"
import { usePostStore } from "../../../entities/post/model/usePostStore"

export const useDeletePost = () => {
  const [loading, setLoading] = useState(false)

  const deletePost = async (id: number) => {
    setLoading(true)
    try {
    
      await deletePostApi(id)
      
      const { posts, setPosts } = usePostStore.getState()
      setPosts(posts.filter((post) => post.id !== id))
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    } finally {
      setLoading(false)
    }
  }

  return { deletePost, loading }
}
