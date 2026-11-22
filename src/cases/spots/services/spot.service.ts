import { api } from "@/lib/axios"
import type { SpotDTO } from "../dtos/spot.dto"
import type { CreateSpotDTO } from "../dtos/create-spot.dto"
import type { UpdateSpotDTO } from "../dtos/update-spot.dto"

const ENDPOINT = "/spots"

export const SpotService = {
  async listAll(): Promise<SpotDTO[]> {
    const response = await api.get<SpotDTO[]>(ENDPOINT)
    return response.data
  },

  async create(data: CreateSpotDTO): Promise<SpotDTO> {
    const response = await api.post<SpotDTO>(ENDPOINT, data)
    return response.data
  },

  async update(id: string, data: UpdateSpotDTO): Promise<SpotDTO> {
    const response = await api.patch<SpotDTO>(`${ENDPOINT}/${id}`, data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`${ENDPOINT}/${id}`)
  },
}
