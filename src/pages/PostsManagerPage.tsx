import { Plus } from "lucide-react"
import { useDialogStore } from "../shared/model/useDialogStore"
import { usePostActions } from "../features/post/model/usePostActions"
import { Button, Card, CardContent, CardHeader, CardTitle } from '../shared/ui'
import { PostSearchFilter } from "../features/post/ui/PostSearchFilter"
import { PostTable } from "../entities/post/ui/PostTable"
import { PostPagination } from "../features/post/ui/PostPagination"
import { AddPostDialog } from "../features/post/ui/AddPostDialog"
import { EditPostDialog } from "../features/post/ui/EditPostDialog"
import { AddCommentDialog } from "../features/comment/ui/AddCommentDialog"
import { EditCommentDialog } from "../features/comment/ui/EditCommentDialog"
import { PostDetailDialog } from "../entities/post/ui/PostDetailDialog"
import { UserDetailModal } from "../entities/user/ui/UserDetailModal"

const PostsManagerPage = () => {
  const { setShowAddDialog } = useDialogStore()
  
  // URL 동기화 로직만 실행 (React Query로 인해 불필요한 effect 제거 완료)
  usePostActions()

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <PostSearchFilter />
          <PostTable />
          <PostPagination />
        </div>
      </CardContent>

      <AddPostDialog />
      <EditPostDialog />
      <AddCommentDialog />
      <EditCommentDialog />
      <PostDetailDialog />
      <UserDetailModal />
    </Card>
  )
}

export default PostsManagerPage
