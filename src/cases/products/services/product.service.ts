import { api } from "@/lib/axios"
import type { ProductDTO } from "../dtos/product.dto"
import type { CreateProductDTO } from "../dtos/create-product.dto"
import type { UpdateProductDTO } from "../dtos/update-product.dto"

const ENDPOINT = "/products"

export const ProductService = {
  async listAll(categoryId?: string): Promise<ProductDTO[]> {
    const response = await api.get<ProductDTO[]>(ENDPOINT, {
      params: { categoryId },
    })
    return response.data
  },

  async create(data: CreateProductDTO): Promise<ProductDTO> {
    const response = await api.post<ProductDTO>(ENDPOINT, data)
    return response.data
  },

  async update(id: string, data: UpdateProductDTO): Promise<ProductDTO> {
    const response = await api.patch<ProductDTO>(`${ENDPOINT}/${id}`, data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`${ENDPOINT}/${id}`)
  },
}
