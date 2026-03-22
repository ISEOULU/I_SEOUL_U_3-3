import { useCallback, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { usePostFilterStore } from "./usePostFilterStore"

export const usePostActions = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { skip, limit, searchQuery, sortBy, sortOrder, selectedTag, setFilters } = usePostFilterStore()

  // 앱 로드시 URL을 읽어들여 필터 스토어에 동기화
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setFilters({
      skip: parseInt(params.get("skip") || "0"),
      limit: parseInt(params.get("limit") || "10"),
      searchQuery: params.get("search") || "",
      sortBy: params.get("sortBy") || "",
      sortOrder: params.get("sortOrder") || "asc",
      selectedTag: params.get("tag") || "",
    })
  }, [location.search, setFilters])

  // 현재 필터 상태를 URL에 기록
  const updateURL = useCallback(() => {
    const params = new URLSearchParams()
    if (skip) params.set("skip", skip.toString())
    if (limit) params.set("limit", limit.toString())
    if (searchQuery) params.set("search", searchQuery)
    if (sortBy) params.set("sortBy", sortBy)
    if (sortOrder) params.set("sortOrder", sortOrder)
    if (selectedTag) params.set("tag", selectedTag)
    navigate(`?${params.toString()}`)
  }, [navigate, skip, limit, searchQuery, sortBy, sortOrder, selectedTag])

  // 필터가 변결될 때마다 URL을 업데이트 (데이터 fetch는 React Query가 상태 변화에 따라 자동 수행)
  useEffect(() => {
    updateURL()
  }, [skip, limit, sortBy, sortOrder, selectedTag, updateURL])

  return { updateURL }
}
