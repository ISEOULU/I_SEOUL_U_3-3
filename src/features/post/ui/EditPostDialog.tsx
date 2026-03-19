import { Button } from "../../../shared/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../shared/ui/Dialog"
import { Input } from "../../../shared/ui/Input"
import { Textarea } from "../../../shared/ui/Input"
import { usePostStore } from "../store/usePostStore"

export const EditPostDialog = () => {
  const { showEditDialog, setShowEditDialog, selectedPost, setSelectedPost, updatePost } =
    usePostStore()

  return (
    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={selectedPost?.title || ""}
            onChange={(e) =>
              setSelectedPost(selectedPost ? { ...selectedPost, title: e.target.value } : null)
            }
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={selectedPost?.body || ""}
            onChange={(e) =>
              setSelectedPost(selectedPost ? { ...selectedPost, body: e.target.value } : null)
            }
          />
          <Button onClick={updatePost}>게시물 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
