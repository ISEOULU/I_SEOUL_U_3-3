export const fetchUsersFromApi = async () => {
  const response = await fetch("/api/users?limit=0&select=username,image")
  return response.json()
}

export const fetchUserByIdFromApi = async (id: number) => {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}
