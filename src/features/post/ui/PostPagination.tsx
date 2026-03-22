import { usePostFilterStore } from "../model/usePostFilterStore"
import { usePostsQuery } from "../../../entities/post/api/queries"
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/ui'

export const PostPagination = () => {
  const { skip, limit, setFilters, selectedTag, searchQuery } = usePostFilterStore()
  
  // React Query를 통한 total count 획득
  const { data } = usePostsQuery(limit, skip, selectedTag, searchQuery)
  const total = data?.total || 0

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span>표시</span>
        <Select value={limit.toString()} onValueChange={(value) => setFilters({ limit: Number(value) })}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
          </SelectContent>
        </Select>
        <span>항목</span>
      </div>
      <div className="flex gap-2">
        <Button disabled={skip === 0} onClick={() => setFilters({ skip: Math.max(0, skip - limit) })}>
          이전
        </Button>
        <Button disabled={skip + limit >= total} onClick={() => setFilters({ skip: skip + limit })}>
          다음
        </Button>
      </div>
    </div>
  )
}
