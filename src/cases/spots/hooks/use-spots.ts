import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { SpotService } from "../services/spot.service"
import type { UpdateSpotDTO } from "../dtos/update-spot.dto"

export function useSpots() {
  return useQuery({
    queryKey: ["spots"],
    queryFn: SpotService.listAll,
  })
}

export function useCreateSpot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: SpotService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["spots"] }),
  })
}

export function useUpdateSpot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSpotDTO }) =>
      SpotService.update(id, data),
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: ["spots"] }),
      queryClient.invalidateQueries({ queryKey: ["guest-checks"] }),
      queryClient.invalidateQueries({ queryKey: ["orders"] }),
    ]),
  })
}

export function useDeleteSpot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: SpotService.delete,
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: ["spots"] }),
      queryClient.invalidateQueries({ queryKey: ["guest-checks"] }),
      queryClient.invalidateQueries({ queryKey: ["orders"] }),
    ]),
  })
}
