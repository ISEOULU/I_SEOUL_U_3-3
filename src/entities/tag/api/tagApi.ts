export const fetchTagsApi = () => fetch("/api/posts/tags").then((res) => res.json())
