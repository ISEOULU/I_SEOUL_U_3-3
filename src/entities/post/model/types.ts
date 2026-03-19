export interface Author {
  id: number
  username: string
  image: string
}

export interface Reactions {
  likes: number
  dislikes: number
}

export interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags: string[]
  reactions: Reactions
  author?: Author
}

export interface Tag {
  slug: string
  name: string
  url: string
}

export interface NewPost {
  title: string
  body: string
  userId: number
}

export interface PostsResponse {
  posts: Post[]
  total: number
  skip: number
  limit: number
}
