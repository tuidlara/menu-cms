import { api } from "@/lib/axios"
import type { OrderDTO, OrderStatus } from "../dtos/order.dto"

const ENDPOINT = "/orders"

export const OrderService = {
  async listAll(guestCheckId?: string): Promise<OrderDTO[]> {
    const response = await api.get<OrderDTO[]>(ENDPOINT, {
      params: { guestCheckId },
    })
    return response.data
  },

  async updateStatus(id: string, status: OrderStatus): Promise<OrderDTO> {
    const response = await api.patch<OrderDTO>(`${ENDPOINT}/${id}/status`, { status })
    return response.data
  },
}
