import { usePostStore } from "../../../entities/post/model/usePostStore"
import { useDialogStore } from "../../../shared/model/useDialogStore"
import { useUpdatePostMutation } from "../../../entities/post/api/queries"
import { Post } from "../../../entities/post/model/types"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from '../../../shared/ui'

export const EditPostDialog = () => {
  const { showEditDialog, setShowEditDialog } = useDialogStore()
  const { selectedPost, setSelectedPost } = usePostStore()
  const updateMutation = useUpdatePostMutation()

  const handleUpdate = () => {
    if (!selectedPost) return
    updateMutation.mutate(selectedPost, {
      onSuccess: () => {
        setShowEditDialog(false)
      }
    })
  }

  return (
    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="제목" value={selectedPost?.title || ""} onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value } as Post)} />
          <Textarea rows={15} placeholder="내용" value={selectedPost?.body || ""} onChange={(e) => setSelectedPost({ ...selectedPost, body: e.target.value } as Post)} />
          <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "수정 중..." : "게시물 수정"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
