import type { ProductDTO } from "@/cases/products/dtos/product.dto"
import type { SpotDTO } from "@/cases/spots/dtos/spot.dto"

export type OrderStatus = "NEW" | "PREPARING" | "READY" | "DELIVERED"

export interface OrderItemDTO {
  id: string
  product: ProductDTO
  quantity: number
  price: number | string
  subtotal: number | string
}

export interface OrderDTO {
  id: string
  createdAt: string
  total: number | string
  status: OrderStatus
  guestCheck: {
    id: string
    spot: SpotDTO
  }
  items: OrderItemDTO[]
}
