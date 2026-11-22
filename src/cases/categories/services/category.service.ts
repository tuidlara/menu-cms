import { api } from "@/lib/axios"
import type { CategoryDTO } from "../dtos/category.dto"
import type { CreateCategoryDTO } from "../dtos/create-category.dto"
import type { UpdateCategoryDTO } from "../dtos/update-category.dto"

const ENDPOINT = "/categories"

export const CategoryService = {
  async listAll(): Promise<CategoryDTO[]> {
    const response = await api.get<CategoryDTO[]>(ENDPOINT)
    return response.data
  },

  async create(data: CreateCategoryDTO): Promise<CategoryDTO> {
    const response = await api.post<CategoryDTO>(ENDPOINT, data)
    return response.data
  },

  async update(id: string, data: UpdateCategoryDTO): Promise<CategoryDTO> {
    const response = await api.patch<CategoryDTO>(`${ENDPOINT}/${id}`, data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`${ENDPOINT}/${id}`)
  },
}
