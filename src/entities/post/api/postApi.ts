import { CreatePostPayload, Post } from "../model/types"

export const fetchPostsApi = (limit: number, skip: number) => 
  fetch(`/api/posts?limit=${limit}&skip=${skip}`).then(res => res.json());

export const createPost = (payload: CreatePostPayload) => {
    return fetch("/api/posts/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((response) => response.json())
  }

export const updatePostApi = (post: Post) => {
  return fetch(`/api/posts/${post.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  }).then((response) => response.json())
}

export const deletePostApi = (id: number) => {
  return fetch(`/api/posts/${id}`, {
    method: "DELETE",
  })
}