import { ThumbsUp, Edit2, Trash2 } from "lucide-react"
import { usePostStore } from "../model/usePostStore"
import { usePostFilterStore } from "../../../features/post/model/usePostFilterStore"
import { useDialogStore } from "../../../shared/model/useDialogStore"
import { useCommentStore } from "../../comment/model/useCommentStore"
import { useCommentsQuery, useDeleteCommentMutation, useLikeCommentMutation } from "../../comment/api/queries"
import { HighlightText } from "../../../shared/ui/HighlightText"
import { Comment, NewComment } from "../../comment/model/types"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../shared/ui'

export const PostDetailDialog = () => {
  const { showPostDetailDialog, setShowPostDetailDialog, setShowAddCommentDialog, setShowEditCommentDialog } = useDialogStore()
  const { selectedPost } = usePostStore()
  const { searchQuery } = usePostFilterStore()
  const { setSelectedComment, setNewComment } = useCommentStore()

  const postId = selectedPost?.id || 0
  const { data: comments = [], isLoading } = useCommentsQuery(postId)
  const deleteMutation = useDeleteCommentMutation(postId)
  const likeMutation = useLikeCommentMutation(postId)

  const deleteComment = (id: number) => {
    deleteMutation.mutate(id)
  }

  const likeComment = (id: number, currentLikes: number) => {
    likeMutation.mutate({ id, currentLikes })
  }

  if (!selectedPost) return null

  return (
    <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            <HighlightText text={selectedPost.title} highlight={searchQuery} />
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            <HighlightText text={selectedPost.body} highlight={searchQuery} />
          </p>
          <div className="mt-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">댓글</h3>
              <Button
                size="sm"
                onClick={() => {
                  setNewComment((prev: NewComment) => ({ ...prev, postId }))
                  setShowAddCommentDialog(true)
                }}
              >
                댓글 추가
              </Button>
            </div>
            {isLoading ? (
              <div className="text-sm">댓글 로딩 중...</div>
            ) : (
              <div className="space-y-1">
                {comments.map((comment: Comment) => (
                  <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <span className="font-medium truncate">{comment.user?.username}:</span>
                      <span className="truncate">
                        <HighlightText text={comment.body} highlight={searchQuery} />
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => likeComment(comment.id, comment.likes)}>
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
                      <Button variant="ghost" size="sm" onClick={() => deleteComment(comment.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
