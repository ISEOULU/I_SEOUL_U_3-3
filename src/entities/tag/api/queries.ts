import { useQuery } from "@tanstack/react-query"
import { fetchTagsFromApi } from "./tagApi"

export const useTagsQuery = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: fetchTagsFromApi,
    staleTime: Infinity,
  })
}
