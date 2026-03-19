import { httpClient } from "../../../shared/api/httpClient"
import type { Comment, CommentsResponse, NewComment } from "../model/types"

export const commentApi = {
  fetchByPost: async (postId: number): Promise<Comment[]> => {
    const data = await httpClient.get<CommentsResponse>(`/comments/post/${postId}`)
    return data.comments
  },

  addComment: (newComment: NewComment): Promise<Comment> =>
    httpClient.post<Comment>("/comments/add", newComment),

  updateComment: (id: number, body: string): Promise<Comment> =>
    httpClient.put<Comment>(`/comments/${id}`, { body }),

  deleteComment: (id: number): Promise<void> => httpClient.delete<void>(`/comments/${id}`),

  likeComment: (id: number, likes: number): Promise<Comment> =>
    httpClient.patch<Comment>(`/comments/${id}`, { likes }),
}
