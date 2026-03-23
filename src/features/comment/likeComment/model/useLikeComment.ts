import { useState } from "react"
import { likeCommentApi } from "../../../../entities/comment/api/commentApi"
import { useCommentStore } from "../../../../entities/comment/model/useCommentStore"

export const useLikeComment = () => {
  const [loading, setLoading] = useState(false)

  const likeComment = async (id: number, postId: number) => {
    setLoading(true)
    try {
      const { comments, setComments } = useCommentStore.getState()
      const existing = comments[postId]?.find((c) => c.id === id)
      if (!existing) return

      const data = await likeCommentApi(id, (existing.likes || 0) + 1)
      
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment) => (comment.id === data.id ? data : comment)),
      }))
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    } finally {
      setLoading(false)
    }
  }

  return { likeComment, loading }
}
