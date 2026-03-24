export const fetchUsersApi = () => fetch("/api/users?limit=0&select=username,image").then(res => res.json());

export const fetchUserApi = (id: number) => {
  return fetch(`/api/users/${id}`).then((res) => res.json())
}