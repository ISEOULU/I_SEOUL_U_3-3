import type { Author } from "../../post/model/types"

interface UserAvatarProps {
  author: Author
  onClick: (author: Author) => void
}

export const UserAvatar = ({ author, onClick }: UserAvatarProps) => (
  <div
    className="flex items-center space-x-2 cursor-pointer"
    onClick={() => onClick(author)}
  >
    <img src={author.image} alt={author.username} className="w-8 h-8 rounded-full" />
    <span>{author.username}</span>
  </div>
)
