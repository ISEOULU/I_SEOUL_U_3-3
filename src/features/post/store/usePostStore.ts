import { create } from "zustand"
import { useNavigate, useLocation } from "react-router-dom"
import { useCallback } from "react"
import type { Post, NewPost, Tag } from "../../../entities/post/model/types"
import { postApi } from "../../../entities/post/api/postApi"

interface PostState {
  // 데이터
  posts: Post[]
  total: number
  tags: Tag[]

  // 필터/페이지네이션
  skip: number
  limit: number
  searchQuery: string
  sortBy: string
  sortOrder: string
  selectedTag: string

  // UI 상태
  loading: boolean
  selectedPost: Post | null
  newPost: NewPost
  showAddDialog: boolean
  showEditDialog: boolean
  showPostDetailDialog: boolean

  // 액션
  setPosts: (posts: Post[]) => void
  setTotal: (total: number) => void
  setSkip: (skip: number) => void
  setLimit: (limit: number) => void
  setSearchQuery: (q: string) => void
  setSortBy: (sortBy: string) => void
  setSortOrder: (sortOrder: string) => void
  setSelectedTag: (tag: string) => void
  setSelectedPost: (post: Post | null) => void
  setNewPost: (post: NewPost) => void
  setShowAddDialog: (v: boolean) => void
  setShowEditDialog: (v: boolean) => void
  setShowPostDetailDialog: (v: boolean) => void

  // 비동기 액션
  fetchPosts: () => Promise<void>
  searchPosts: () => Promise<void>
  fetchPostsByTag: (tag: string) => Promise<void>
  fetchTags: () => Promise<void>
  addPost: () => Promise<void>
  updatePost: () => Promise<void>
  deletePost: (id: number) => Promise<void>
}

export const usePostStore = create<PostState>((set, get) => ({
  // 초기 상태
  posts: [],
  total: 0,
  tags: [],
  skip: 0,
  limit: 10,
  searchQuery: "",
  sortBy: "",
  sortOrder: "asc",
  selectedTag: "",
  loading: false,
  selectedPost: null,
  newPost: { title: "", body: "", userId: 1 },
  showAddDialog: false,
  showEditDialog: false,
  showPostDetailDialog: false,

  // 단순 setter
  setPosts: (posts) => set({ posts }),
  setTotal: (total) => set({ total }),
  setSkip: (skip) => set({ skip }),
  setLimit: (limit) => set({ limit }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  setSelectedTag: (selectedTag) => set({ selectedTag }),
  setSelectedPost: (selectedPost) => set({ selectedPost }),
  setNewPost: (newPost) => set({ newPost }),
  setShowAddDialog: (showAddDialog) => set({ showAddDialog }),
  setShowEditDialog: (showEditDialog) => set({ showEditDialog }),
  setShowPostDetailDialog: (showPostDetailDialog) => set({ showPostDetailDialog }),

  // 비동기 액션
  fetchPosts: async () => {
    const { limit, skip } = get()
    set({ loading: true })
    try {
      const { posts, total } = await postApi.fetchPosts(limit, skip)
      set({ posts, total })
    } catch (error) {
      console.error("게시물 가져오기 오류:", error)
    } finally {
      set({ loading: false })
    }
  },

  searchPosts: async () => {
    const { searchQuery, fetchPosts } = get()
    if (!searchQuery) {
      fetchPosts()
      return
    }
    set({ loading: true })
    try {
      const { posts, total } = await postApi.searchPosts(searchQuery)
      set({ posts, total })
    } catch (error) {
      console.error("게시물 검색 오류:", error)
    } finally {
      set({ loading: false })
    }
  },

  fetchPostsByTag: async (tag: string) => {
    if (!tag || tag === "all") {
      get().fetchPosts()
      return
    }
    set({ loading: true })
    try {
      const { posts, total } = await postApi.fetchPostsByTag(tag)
      set({ posts, total })
    } catch (error) {
      console.error("태그별 게시물 가져오기 오류:", error)
    } finally {
      set({ loading: false })
    }
  },

  fetchTags: async () => {
    try {
      const tags = await postApi.fetchTags()
      set({ tags })
    } catch (error) {
      console.error("태그 가져오기 오류:", error)
    }
  },

  addPost: async () => {
    const { newPost, posts } = get()
    try {
      const data = await postApi.addPost(newPost)
      set({ posts: [data, ...posts], showAddDialog: false, newPost: { title: "", body: "", userId: 1 } })
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  },

  updatePost: async () => {
    const { selectedPost, posts } = get()
    if (!selectedPost) return
    try {
      const data = await postApi.updatePost(selectedPost)
      set({ posts: posts.map((p) => (p.id === data.id ? data : p)), showEditDialog: false })
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  },

  deletePost: async (id: number) => {
    const { posts } = get()
    try {
      await postApi.deletePost(id)
      set({ posts: posts.filter((p) => p.id !== id) })
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  },
}))

// URL 동기화 훅 - store 외부에서 useNavigate/useLocation과 함께 사용
export const usePostURLSync = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const setSkip = usePostStore((s) => s.setSkip)
  const setLimit = usePostStore((s) => s.setLimit)
  const setSearchQuery = usePostStore((s) => s.setSearchQuery)
  const setSortBy = usePostStore((s) => s.setSortBy)
  const setSortOrder = usePostStore((s) => s.setSortOrder)
  const setSelectedTag = usePostStore((s) => s.setSelectedTag)

  const updateURL = useCallback(() => {
    const { skip, limit, searchQuery, sortBy, sortOrder, selectedTag } = usePostStore.getState()
    const currentParams = new URLSearchParams(window.location.search)

    if (
      currentParams.get("skip") === skip.toString() &&
      currentParams.get("limit") === limit.toString() &&
      (currentParams.get("search") || "") === searchQuery &&
      (currentParams.get("sortBy") || "") === sortBy &&
      (currentParams.get("sortOrder") || "asc") === sortOrder &&
      (currentParams.get("tag") || "") === selectedTag
    ) {
      return
    }

    const params = new URLSearchParams()
    if (skip) params.set("skip", skip.toString())
    if (limit) params.set("limit", limit.toString())
    if (searchQuery) params.set("search", searchQuery)
    if (sortBy) params.set("sortBy", sortBy)
    if (sortOrder) params.set("sortOrder", sortOrder)
    if (selectedTag) params.set("tag", selectedTag)
    navigate(`?${params.toString()}`, { replace: true })
  }, [navigate])

  const syncFromURL = useCallback(() => {
    const params = new URLSearchParams(location.search)
    const state = usePostStore.getState()

    const newSkip = parseInt(params.get("skip") || "0")
    const newLimit = parseInt(params.get("limit") || "10")
    const newSearch = params.get("search") || ""
    const newSortBy = params.get("sortBy") || ""
    const newSortOrder = params.get("sortOrder") || "asc"
    const newTag = params.get("tag") || ""

    if (
      state.skip === newSkip &&
      state.limit === newLimit &&
      state.searchQuery === newSearch &&
      state.sortBy === newSortBy &&
      state.sortOrder === newSortOrder &&
      state.selectedTag === newTag
    ) {
      return
    }

    setSkip(newSkip)
    setLimit(newLimit)
    setSearchQuery(newSearch)
    setSortBy(newSortBy)
    setSortOrder(newSortOrder)
    setSelectedTag(newTag)
  }, [location.search, setSkip, setLimit, setSearchQuery, setSortBy, setSortOrder, setSelectedTag])

  return { updateURL, syncFromURL }
}
