import { Post, NewPost } from "../model/types"

export const fetchPostsFromApi = async (limit: number, skip: number) => {
  const response = await fetch(`/api/posts?limit=${limit}&skip=${skip}`)
  return response.json()
}

export const fetchPostsBySearchFromApi = async (query: string) => {
  const response = await fetch(`/api/posts/search?q=${query}`)
  return response.json()
}

export const fetchPostsByTagFromApi = async (tag: string) => {
  const response = await fetch(`/api/posts/tag/${tag}`)
  return response.json()
}

export const addPostToApi = async (newPost: NewPost) => {
  const response = await fetch("/api/posts/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPost),
  })
  return response.json()
}

export const updatePostToApi = async (post: Post) => {
  const response = await fetch(`/api/posts/${post.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  })
  return response.json()
}

export const deletePostFromApi = async (id: number) => {
  const response = await fetch(`/api/posts/${id}`, { method: "DELETE" })
  return response.json()
}
