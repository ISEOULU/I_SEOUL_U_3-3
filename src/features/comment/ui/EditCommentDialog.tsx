import { useCommentStore } from "../../../entities/comment/model/useCommentStore"
import { usePostStore } from "../../../entities/post/model/usePostStore"
import { useDialogStore } from "../../../shared/model/useDialogStore"
import { useUpdateCommentMutation } from "../../../entities/comment/api/queries"
import { Comment } from "../../../entities/comment/model/types"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from '../../../shared/ui'

export const EditCommentDialog = () => {
  const { showEditCommentDialog, setShowEditCommentDialog } = useDialogStore()
  const { selectedComment, setSelectedComment } = useCommentStore()
  const { selectedPost } = usePostStore()

  const postId = selectedPost?.id || 0
  const updateMutation = useUpdateCommentMutation(postId)

  const handleUpdate = () => {
    if (!selectedComment) return
    updateMutation.mutate(selectedComment, {
      onSuccess: () => {
        setShowEditCommentDialog(false)
      }
    })
  }

  return (
    <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea 
            placeholder="댓글 내용" 
            value={selectedComment?.body || ""} 
            onChange={(e) => setSelectedComment({ ...selectedComment, body: e.target.value } as Comment)} 
          />
          <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "수정 중..." : "댓글 수정"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
