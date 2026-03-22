import { CreatePostPayload } from "../model/types";

export const fetchPostsApi = (limit: number, skip: number) => 
  fetch(`/api/posts?limit=${limit}&skip=${skip}`).then(res => res.json());

export const createPost = (payload: CreatePostPayload) => {
    return fetch("/api/posts/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((response) => response.json())
  }