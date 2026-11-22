import type { OrderStatus } from "./dtos/order.dto"

export const ORDER_STATUSES: OrderStatus[] = ["NEW", "PREPARING", "READY", "DELIVERED"]

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  NEW: "Novo",
  PREPARING: "Em preparo",
  READY: "Pronto",
  DELIVERED: "Entregue",
}

export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  NEW: "border-sky-200 bg-sky-100 text-sky-800",
  PREPARING: "border-amber-200 bg-amber-100 text-amber-800",
  READY: "border-emerald-200 bg-emerald-100 text-emerald-800",
  DELIVERED: "border-zinc-300 bg-zinc-100 text-zinc-800",
}
