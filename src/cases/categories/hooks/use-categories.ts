import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CategoryService } from "../services/category.service"
import type { UpdateCategoryDTO } from "../dtos/update-category.dto"

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: CategoryService.listAll,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: CategoryService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDTO }) =>
      CategoryService.update(id, data),
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
      queryClient.invalidateQueries({ queryKey: ["products"] }),
    ]),
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: CategoryService.delete,
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
      queryClient.invalidateQueries({ queryKey: ["products"] }),
    ]),
  })
}
