import { Edit2, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../shared/ui/Table"
import { Button } from "../../../shared/ui/Button"
import { highlightText } from "../../../shared/lib/highlight"
import { PostTagBadge } from "../../../entities/post/ui/PostTagBadge"
import { UserAvatar } from "../../../entities/user/ui/UserAvatar"
import { usePostStore } from "../store/usePostStore"
import { useUserStore } from "../../user/store/useUserStore"
import type { Author } from "../../../entities/post/model/types"

export const PostTable = () => {
  const {
    posts,
    searchQuery,
    selectedTag,
    setSelectedTag,
    setSelectedPost,
    setShowEditDialog,
    setShowPostDetailDialog,
    deletePost,
  } = usePostStore()

  const { openUserModal } = useUserStore()

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
                <div>{highlightText(post.title, searchQuery)}</div>
                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag) => (
                    <PostTagBadge
                      key={tag}
                      tag={tag}
                      isSelected={selectedTag === tag}
                      onClick={(t) => setSelectedTag(t)}
                    />
                  ))}
                </div>
              </div>
            </TableCell>
            <TableCell>
              {post.author && (
                <UserAvatar
                  author={post.author as Author}
                  onClick={openUserModal}
                />
              )}
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
                <Button variant="ghost" size="sm" onClick={() => {
                  setSelectedPost(post)
                  setShowPostDetailDialog(true)
                }}>
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedPost(post)
                    setShowEditDialog(true)
                  }}
                >
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
