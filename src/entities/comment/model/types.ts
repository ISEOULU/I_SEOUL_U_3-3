export interface CommentUser {
  id: number
  username: string
}

export interface Comment {
  id: number
  body: string
  postId: number
  likes: number
  user: CommentUser
}

export interface NewComment {
  body: string
  postId: number | null
  userId: number
}

export interface CommentsResponse {
  comments: Comment[]
  total: number
}
