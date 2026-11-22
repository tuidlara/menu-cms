import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { OrderService } from "../services/order.service"
import type { OrderStatus } from "../dtos/order.dto"

export function useOrders(guestCheckId?: string) {
  return useQuery({
    queryKey: ["orders", guestCheckId],
    queryFn: () => OrderService.listAll(guestCheckId),
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      OrderService.updateStatus(id, status),
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: ["orders"] }),
      queryClient.invalidateQueries({ queryKey: ["guest-checks"] }),
    ]),
  })
}
