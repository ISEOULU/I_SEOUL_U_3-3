import { User } from "../../user/model/types"

export interface Comment {
  id: number
  body: string
  postId: number
  userId: number
  user?: User
  likes?: number
}
