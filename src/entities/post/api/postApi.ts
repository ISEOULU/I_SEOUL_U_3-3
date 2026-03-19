import { httpClient } from "../../../shared/api/httpClient"
import type { NewPost, Post, PostsResponse, Tag } from "../model/types"
import type { UsersResponse } from "../../user/model/types"

export const postApi = {
  fetchPosts: async (limit: number, skip: number): Promise<{ posts: Post[]; total: number }> => {
    const [postsData, usersData] = await Promise.all([
      httpClient.get<PostsResponse>(`/posts?limit=${limit}&skip=${skip}`),
      httpClient.get<UsersResponse>("/users?limit=0&select=username,image"),
    ])
    const posts = postsData.posts.map((post) => ({
      ...post,
      author: usersData.users.find((user) => user.id === post.userId),
    }))
    return { posts, total: postsData.total }
  },

  searchPosts: async (query: string): Promise<{ posts: Post[]; total: number }> => {
    const data = await httpClient.get<PostsResponse>(`/posts/search?q=${query}`)
    return { posts: data.posts, total: data.total }
  },

  fetchPostsByTag: async (tag: string): Promise<{ posts: Post[]; total: number }> => {
    const [postsData, usersData] = await Promise.all([
      httpClient.get<PostsResponse>(`/posts/tag/${tag}`),
      httpClient.get<UsersResponse>("/users?limit=0&select=username,image"),
    ])
    const posts = postsData.posts.map((post) => ({
      ...post,
      author: usersData.users.find((user) => user.id === post.userId),
    }))
    return { posts, total: postsData.total }
  },

  fetchTags: (): Promise<Tag[]> => httpClient.get<Tag[]>("/posts/tags"),

  addPost: (newPost: NewPost): Promise<Post> => httpClient.post<Post>("/posts/add", newPost),

  updatePost: (post: Post): Promise<Post> =>
    httpClient.put<Post>(`/posts/${post.id}`, post),

  deletePost: (id: number): Promise<void> => httpClient.delete<void>(`/posts/${id}`),
}
