import { usePostStore } from "../../../entities/post/model/usePostStore"
import { useDialogStore } from "../../../shared/model/useDialogStore"
import { useAddPostMutation } from "../../../entities/post/api/queries"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from '../../../shared/ui'

export const AddPostDialog = () => {
  const { showAddDialog, setShowAddDialog } = useDialogStore()
  const { newPost, setNewPost } = usePostStore()
  const addMutation = useAddPostMutation()

  const handleAddPost = () => {
    addMutation.mutate(newPost, {
      onSuccess: () => {
        setShowAddDialog(false)
        setNewPost({ title: "", body: "", userId: 1 })
      }
    })
  }

  return (
    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="제목" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} />
          <Textarea rows={30} placeholder="내용" value={newPost.body} onChange={(e) => setNewPost({ ...newPost, body: e.target.value })} />
          <Input type="number" placeholder="사용자 ID" value={newPost.userId} onChange={(e) => setNewPost({ ...newPost, userId: Number(e.target.value) })} />
          <Button onClick={handleAddPost} disabled={addMutation.isPending}>
            {addMutation.isPending ? "추가 중..." : "게시물 추가"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
