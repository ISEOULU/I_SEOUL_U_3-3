export const fetchTagsFromApi = async () => {
  const response = await fetch("/api/posts/tags")
  return response.json()
}
