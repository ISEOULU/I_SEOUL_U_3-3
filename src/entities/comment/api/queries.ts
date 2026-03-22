import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  fetchCommentsFromApi,
  addCommentToApi,
  updateCommentToApi,
  deleteCommentFromApi,
  likeCommentToApi,
} from "./commentApi"
import { Comment, NewComment } from "../model/types"

export const useCommentsQuery = (postId: number) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const data = await fetchCommentsFromApi(postId)
      return data.comments as Comment[]
    },
    enabled: !!postId,
  })
}

export const useAddCommentMutation = (postId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (newComment: NewComment) => addCommentToApi(newComment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
    },
  })
}

export const useUpdateCommentMutation = (postId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (comment: Comment) => updateCommentToApi(comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
    },
  })
}

export const useDeleteCommentMutation = (postId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteCommentFromApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
    },
  })
}

// 💡 좋아요(Like) 기능 전용 낙관적 업데이트(Optimistic Update)
export const useLikeCommentMutation = (postId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, currentLikes }: { id: number; currentLikes: number }) => likeCommentToApi(id, currentLikes),
    onMutate: async ({ id }) => {
      // 1. 진행 중인 리패칭 취소
      await queryClient.cancelQueries({ queryKey: ["comments", postId] })
      
      // 2. 현재 상태 스냅샷 저장(롤백용)
      const previousComments = queryClient.getQueryData<Comment[]>(["comments", postId])
      
      // 3. UI 즉시 예측 업데이트 (낙관적 변경)
      if (previousComments) {
        queryClient.setQueryData<Comment[]>(
          ["comments", postId],
          previousComments.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c))
        )
      }
      return { previousComments }
    },
    // 실패 시 롤백
    onError: (err, variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(["comments", postId], context.previousComments)
      }
    },
    // 성공/실패 무관하게 최종 동기화
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
    },
  })
}
