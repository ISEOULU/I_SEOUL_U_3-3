
export const fetchCommentsApi = (postId: number) => {
  return fetch(`/api/comments/post/${postId}`).then((res) => res.json())
}

export const addCommentApi = (body: string, postId: number, userId: number) => {
  return fetch("/api/comments/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body, postId, userId }),
  }).then((res) => res.json())
}

export const updateCommentApi = (id: number, body: string) => {
  return fetch(`/api/comments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body }),
  }).then((res) => res.json())
}

export const deleteCommentApi = (id: number) => {
  return fetch(`/api/comments/${id}`, {
    method: "DELETE",
  }).then((res) => res.json())
}

export const likeCommentApi = (id: number, likes: number) => {
  return fetch(`/api/comments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ likes }),
  }).then((res) => res.json())
}
