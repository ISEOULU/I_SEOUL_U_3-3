import { useState } from "react"
import { deleteCommentApi } from "../../../entities/comment/api/commentApi"
import { useCommentStore } from "../../../entities/comment/model/useCommentStore"

export const useDeleteComment = () => {
  const [loading, setLoading] = useState(false)

  const deleteComment = async (id: number, postId: number) => {
    setLoading(true)
    try {
      await deleteCommentApi(id)
      
      const { setComments } = useCommentStore.getState()
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((comment) => comment.id !== id),
      }))
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    } finally {
      setLoading(false)
    }
  }

  return { deleteComment, loading }
}
