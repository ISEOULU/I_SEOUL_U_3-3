import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from "../../../components"
import { useAddCommentStore } from "../model/useAddCommentStore"

export const AddCommentDialog = () => {
  const { showAddCommentDialog, setShowAddCommentDialog, newComment, setNewComment, addComment, loading } = useAddCommentStore()

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
          <Button disabled={loading} onClick={addComment}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
