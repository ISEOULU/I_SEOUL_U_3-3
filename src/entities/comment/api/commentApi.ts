import { Comment, NewComment } from "../model/types"

export const fetchCommentsFromApi = async (postId: number) => {
  const response = await fetch(`/api/comments/post/${postId}`)
  return response.json()
}

export const addCommentToApi = async (newComment: NewComment) => {
  const response = await fetch("/api/comments/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newComment),
  })
  return response.json()
}

export const updateCommentToApi = async (comment: Comment) => {
  const response = await fetch(`/api/comments/${comment.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body: comment.body }),
  })
  return response.json()
}

export const deleteCommentFromApi = async (id: number) => {
  const response = await fetch(`/api/comments/${id}`, { method: "DELETE" })
  return response.json()
}

export const likeCommentToApi = async (id: number, currentLikes: number) => {
  const response = await fetch(`/api/comments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ likes: currentLikes + 1 }),
  })
  return response.json()
}
