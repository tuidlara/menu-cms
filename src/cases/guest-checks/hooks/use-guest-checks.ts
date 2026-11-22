import { useQuery } from "@tanstack/react-query"
import { GuestCheckService } from "../services/guest-check.service"

export function useOpenedGuestChecks() {
  return useQuery({
    queryKey: ["guest-checks", "opened"],
    queryFn: GuestCheckService.listOpened,
  })
}

export function useGuestCheck(id: string) {
  return useQuery({
    queryKey: ["guest-checks", "detail", id],
    queryFn: () => GuestCheckService.findOne(id),
    enabled: !!id,
  })
}
