import { Edit2, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import { usePostStore } from "../model/usePostStore"
import { usePostFilterStore } from "../../../features/post/model/usePostFilterStore"
import { useDialogStore } from "../../../shared/model/useDialogStore"
import { HighlightText } from "../../../shared/ui/HighlightText"
import { usePostsQuery, useDeletePostMutation } from "../api/queries"
import { useUserStore } from "../../user/model/useUserStore"
import { Post } from "../model/types"
import { User } from "../../user/model/types"
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../shared/ui'

export const PostTable = () => {
  const { skip, limit, searchQuery, selectedTag, setSelectedTag } = usePostFilterStore()
  
  // React Query를 통한 서버 상태 스독
  const { data, isLoading } = usePostsQuery(limit, skip, selectedTag, searchQuery)
  const posts = data?.posts || []
  const deleteMutation = useDeletePostMutation()

  const { setSelectedPost } = usePostStore()
  const { setShowPostDetailDialog, setShowEditDialog, setShowUserModal } = useDialogStore()
  const { setSelectedUser } = useUserStore()

  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    setShowPostDetailDialog(true)
  }

  const deletePost = (id: number) => {
    deleteMutation.mutate(id)
  }

  const openUserModal = (user: User) => {
    setSelectedUser(user)
    setShowUserModal(true)
  }

  if (isLoading) {
    return <div className="flex justify-center p-4">게시물 로딩 중...</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">ID</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className="w-[150px]">작성자</TableHead>
          <TableHead className="w-[150px]">반응</TableHead>
          <TableHead className="w-[150px]">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>
              <div className="space-y-1">
                <div><HighlightText text={post.title} highlight={searchQuery} /></div>
                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag: string) => (
                    <span
                      key={tag}
                      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                        selectedTag === tag
                          ? "text-white bg-blue-500 hover:bg-blue-600"
                          : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                      }`}
                      onClick={() => {
                        setSelectedTag(tag)
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => post.author && openUserModal(post.author)}>
                <img src={post.author?.image} alt={post.author?.username} className="w-8 h-8 rounded-full" />
                <span>{post.author?.username}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                <span>{post.reactions?.likes || 0}</span>
                <ThumbsDown className="w-4 h-4" />
                <span>{post.reactions?.dislikes || 0}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => openPostDetail(post)}>
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => { setSelectedPost(post); setShowEditDialog(true); }}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deletePost(post.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
