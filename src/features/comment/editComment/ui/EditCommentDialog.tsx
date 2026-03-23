import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from "../../../../components"
import { useEditCommentStore } from "../model/useEditCommentStore"

export const EditCommentDialog = () => {
  const { showEditCommentDialog, setShowEditCommentDialog, selectedComment, setSelectedComment, updateComment, loading } = useEditCommentStore()

  if (!selectedComment) return null

  return (
    <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={selectedComment.body || ""}
            onChange={(e) => setSelectedComment({ ...selectedComment, body: e.target.value })}
          />
          <Button disabled={loading} onClick={updateComment}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
