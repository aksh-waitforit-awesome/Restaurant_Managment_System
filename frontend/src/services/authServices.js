import API from "../api/axios"
export const login = async (credentials) => {
  const response = await API.post("/auth/login", credentials)
  console.log("login", response.data)
  return response.data
}
export const register = async (data) => {
  const response = await API.post("/auth/register", data)
  return response.data
}
export const logout = async () => {
  await API.post("/auth/logout")
}
export const refresh = async () => {
  const response = await API.get("/auth/refresh")
  console.log("refresh", response.data)
  return response.data
}
