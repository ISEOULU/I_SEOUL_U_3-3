interface PostTagBadgeProps {
  tag: string
  isSelected: boolean
  onClick: (tag: string) => void
}

export const PostTagBadge = ({ tag, isSelected, onClick }: PostTagBadgeProps) => (
  <span
    className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
      isSelected
        ? "text-white bg-blue-500 hover:bg-blue-600"
        : "text-blue-800 bg-blue-100 hover:bg-blue-200"
    }`}
    onClick={() => onClick(tag)}
  >
    {tag}
  </span>
)
