import type { SpotDTO } from "@/cases/spots/dtos/spot.dto"

export type GuestCheckStatus = "OPENED" | "CLOSED"

export interface GuestCheckOrderSummaryDTO {
  id: string
  createdAt: string
  total: number | string
}

export interface GuestCheckDTO {
  id: string
  createdAt: string
  status: GuestCheckStatus
  spot: SpotDTO
  orders: GuestCheckOrderSummaryDTO[]
  total: number | string
}
