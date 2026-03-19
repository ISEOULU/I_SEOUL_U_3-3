import { Button } from "../../../shared/ui/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui/Dialog"
import { Textarea } from "../../../shared/ui/Input"
import { useCommentStore } from "../store/useCommentStore"

export const EditCommentDialog = () => {
  const {
    showEditCommentDialog,
    setShowEditCommentDialog,
    selectedComment,
    setSelectedComment,
    updateComment,
  } = useCommentStore()

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
            onChange={(e) =>
              setSelectedComment(
                selectedComment ? { ...selectedComment, body: e.target.value } : null,
              )
            }
          />
          <Button onClick={updateComment}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
