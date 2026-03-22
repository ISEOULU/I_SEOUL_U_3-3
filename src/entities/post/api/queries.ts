import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  fetchPostsFromApi,
  fetchPostsByTagFromApi,
  fetchPostsBySearchFromApi,
  addPostToApi,
  updatePostToApi,
  deletePostFromApi,
} from "./postApi"
import { fetchUsersFromApi } from "../../user/api/userApi"
import { Post, NewPost } from "../model/types"
import { User } from "../../user/model/types"

export const usePostsQuery = (limit: number, skip: number, tag: string, searchQuery: string) => {
  return useQuery({
    queryKey: ["posts", { limit, skip, tag, searchQuery }],
    queryFn: async () => {
      let postsData
      if (searchQuery) {
        postsData = await fetchPostsBySearchFromApi(searchQuery)
      } else if (tag && tag !== "all") {
        postsData = await fetchPostsByTagFromApi(tag)
      } else {
        postsData = await fetchPostsFromApi(limit, skip)
      }

      const usersData = await fetchUsersFromApi()
      const postsWithUsers = postsData.posts.map((post: Post) => ({
        ...post,
        author: usersData.users.find((user: User) => user.id === post.userId),
      }))

      return { posts: postsWithUsers, total: postsData.total }
    },
  })
}

export const useAddPostMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (newPost: NewPost) => addPostToApi(newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })
}

export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (post: Post) => updatePostToApi(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })
}

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deletePostFromApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })
}
