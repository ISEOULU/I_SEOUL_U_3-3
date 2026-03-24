export interface Post {
    id: number
    title: string
    body: string
    userId: number
    reactions?: {
      likes: number
      dislikes: number
    }
    tags?: string[]
    views?: number
  }

export interface CreatePostPayload {
  title: string
  body: string
  userId: number
}