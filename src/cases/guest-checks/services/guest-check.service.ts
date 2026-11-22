import { api } from "@/lib/axios"
import type { GuestCheckDTO } from "../dtos/guest-check.dto"

const ENDPOINT = "/guest-checks"

export const GuestCheckService = {
  async listOpened(): Promise<GuestCheckDTO[]> {
    const response = await api.get<GuestCheckDTO[]>(ENDPOINT, {
      params: { status: "OPENED" },
    })
    return response.data.filter((guestCheck) => guestCheck.status === "OPENED")
  },

  async findOne(id: string): Promise<GuestCheckDTO> {
    const response = await api.get<GuestCheckDTO>(`${ENDPOINT}/${id}`)
    return response.data
  },
}
