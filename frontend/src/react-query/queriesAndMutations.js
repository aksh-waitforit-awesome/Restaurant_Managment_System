import { getMyOrders, getOrderById, getMenu, getCategories } from "../services"
import queryKeys from "./queryKeys"
import { useQuery } from "@tanstack/react-query"
export const useGetMyOrders = () =>
  useQuery({
    queryKey: [queryKeys.getMyOrders],
    queryFn: getMyOrders,
  })
export const useGetOrderById = (id) =>
  useQuery({
    queryKey: [queryKeys.getOrderById, id],
    queryFn: () => getOrderById(id),
  })
export const useGetMenu = () => {
  return useQuery({
    queryKey: [queryKeys.getMenu],
    queryFn: getMenu,
  })
}
export const useGetCategories = () => {
  return useQuery({
    queryKey: [queryKeys.getCategories],
    queryFn: getCategories,
  })
}
