import { useEffect } from "react"

import { Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui/Card"
import { Button } from "../../../shared/ui/Button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../shared/ui/Select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui/Dialog"
import { highlightText } from "../../../shared/lib/highlight"

import { usePostStore, usePostURLSync } from "../../../features/post/store/usePostStore"
import { useCommentStore } from "../../../features/comment/store/useCommentStore"

import { PostSearchBar } from "../../../features/post/ui/PostSearchBar"
import { PostFilterBar } from "../../../features/post/ui/PostFilterBar"
import { PostTable } from "../../../features/post/ui/PostTable"
import { AddPostDialog } from "../../../features/post/ui/AddPostDialog"
import { EditPostDialog } from "../../../features/post/ui/EditPostDialog"

import { CommentList } from "../../../features/comment/ui/CommentList"
import { AddCommentDialog } from "../../../features/comment/ui/AddCommentDialog"
import { EditCommentDialog } from "../../../features/comment/ui/EditCommentDialog"

import { UserModal } from "../../../features/user/ui/UserModal"

export const PostsManager = () => {
  const { updateURL, syncFromURL } = usePostURLSync()

  const {
    skip,
    limit,
    total,
    loading,
    selectedTag,
    searchQuery,
    sortBy,
    sortOrder,
    selectedPost,
    showPostDetailDialog,
    setSkip,
    setLimit,
    setShowAddDialog,
    setShowPostDetailDialog,
    fetchPosts,
    fetchPostsByTag,
    fetchTags,
    searchPosts,
  } = usePostStore()

  const { fetchComments } = useCommentStore()

  // URL → store 동기화
  useEffect(() => {
    syncFromURL()
  }, [syncFromURL])

  // 태그 최초 로드
  useEffect(() => {
    fetchTags()
  }, [fetchTags])

  // 필터/페이지 변경 시 데이터 재로드 + URL 업데이트
  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(selectedTag)
    } else {
      fetchPosts()
    }
    updateURL()
  }, [skip, limit, sortBy, sortOrder, selectedTag, fetchPostsByTag, fetchPosts, updateURL])

  // 게시물 상세 열기 시 댓글 로드
  useEffect(() => {
    if (showPostDetailDialog && selectedPost) {
      fetchComments(selectedPost.id)
    }
  }, [showPostDetailDialog, selectedPost, fetchComments])

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
          {/* 검색 및 필터 컨트롤 */}
          <div className="flex gap-4">
            <PostSearchBar onSearch={searchPosts} />
            <PostFilterBar onTagChange={(tag) => fetchPostsByTag(tag)} />
          </div>

          {/* 게시물 테이블 */}
          {loading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostTable />
          )}

          {/* 페이지네이션 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>표시</span>
              <Select value={limit.toString()} onValueChange={(value) => setLimit(Number(value))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                </SelectContent>
              </Select>
              <span>항목</span>
            </div>
            <div className="flex gap-2">
              <Button disabled={skip === 0} onClick={() => setSkip(Math.max(0, skip - limit))}>
                이전
              </Button>
              <Button disabled={skip + limit >= total} onClick={() => setSkip(skip + limit)}>
                다음
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      {/* 게시물 추가/수정 다이얼로그 */}
      <AddPostDialog />
      <EditPostDialog />

      {/* 댓글 다이얼로그 */}
      <AddCommentDialog />
      <EditCommentDialog />

      {/* 게시물 상세 보기 */}
      <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{highlightText(selectedPost?.title ?? "", searchQuery)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{highlightText(selectedPost?.body ?? "", searchQuery)}</p>
            {selectedPost && <CommentList postId={selectedPost.id} />}
          </div>
        </DialogContent>
      </Dialog>

      {/* 사용자 모달 */}
      <UserModal />
    </Card>
  )
}
