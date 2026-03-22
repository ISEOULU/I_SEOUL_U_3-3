import { useCommentStore } from "../../../entities/comment/model/useCommentStore"
import { usePostStore } from "../../../entities/post/model/usePostStore"
import { useDialogStore } from "../../../shared/model/useDialogStore"
import { useAddCommentMutation } from "../../../entities/comment/api/queries"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from '../../../shared/ui'

export const AddCommentDialog = () => {
  const { showAddCommentDialog, setShowAddCommentDialog } = useDialogStore()
  const { newComment, setNewComment } = useCommentStore()
  const { selectedPost } = usePostStore()

  const postId = selectedPost?.id || 0
  const addMutation = useAddCommentMutation(postId)

  const handleAddComment = () => {
    addMutation.mutate(newComment, {
      onSuccess: () => {
        setShowAddCommentDialog(false)
        setNewComment({ body: "", postId: null, userId: 1 })
      }
    })
  }

  return (
    <Dialog open={showAddCommentDialog} onOpenChange={setShowAddCommentDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea 
            placeholder="댓글 내용" 
            value={newComment.body} 
            onChange={(e) => setNewComment({ ...newComment, body: e.target.value })} 
          />
          <Button onClick={handleAddComment} disabled={addMutation.isPending}>
            {addMutation.isPending ? "추가 중..." : "댓글 추가"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
