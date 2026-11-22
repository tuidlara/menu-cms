import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ProductService } from "../services/product.service"
import type { UpdateProductDTO } from "../dtos/update-product.dto"

export function useProducts(categoryId?: string) {
  return useQuery({
    queryKey: ["products", categoryId],
    queryFn: () => ProductService.listAll(categoryId),
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ProductService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductDTO }) =>
      ProductService.update(id, data),
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: ["products"] }),
      queryClient.invalidateQueries({ queryKey: ["orders"] }),
      queryClient.invalidateQueries({ queryKey: ["guest-checks"] }),
    ]),
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ProductService.delete,
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: ["products"] }),
      queryClient.invalidateQueries({ queryKey: ["orders"] }),
      queryClient.invalidateQueries({ queryKey: ["guest-checks"] }),
    ]),
  })
}
