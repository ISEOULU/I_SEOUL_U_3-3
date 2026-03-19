import { Edit2, ThumbsUp, Trash2 } from "lucide-react"
 import { Button } from "../../../shared/ui/Button"
 import { useCommentStore } from "../store/useCommentStore"
 import { Plus } from "lucide-react"

interface CommentListProps {
  postId: number
}

export const CommentList = ({ postId }: CommentListProps) => {
  const {
    comments,
    setNewComment,
    setShowAddCommentDialog,
    setSelectedComment,
    setShowEditCommentDialog,
    deleteComment,
    likeComment,
  } = useCommentStore()

  // searchQuery는 postStore에서 가져오되 순환 의존 피하기 위해 props로 받음
  const postComments = comments[postId] || []

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button
          size="sm"
          onClick={() => {
            setNewComment({ body: "", postId, userId: 1 })
            setShowAddCommentDialog(true)
          }}
        >
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {postComments.map((comment) => (
          <div
            key={comment.id}
            className="flex items-center justify-between text-sm border-b pb-1"
          >
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user.username}:</span>
              <span className="truncate">{comment.body}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => likeComment(comment.id, postId)}>
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedComment(comment)
                  setShowEditCommentDialog(true)
                }}
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteComment(comment.id, postId)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
