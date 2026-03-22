export const fetchPostsApi = (limit: number, skip: number) => 
  fetch(`/api/posts?limit=${limit}&skip=${skip}`).then(res => res.json());