import { Badge } from "@/components/ui/badge"
import type { OrderStatus } from "../dtos/order.dto"
import { ORDER_STATUS_COLOR, ORDER_STATUS_LABEL } from "../order-status"

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant="outline" className={ORDER_STATUS_COLOR[status]}>{ORDER_STATUS_LABEL[status]}</Badge>
}
