import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { getApiErrorMessage } from "@/lib/api-error"
import type { SpotDTO } from "../dtos/spot.dto"
import { useDeleteSpot } from "../hooks/use-spots"

interface SpotDeleteDialogProps {
  spot: SpotDTO
  onClose: () => void
}

export function SpotDeleteDialog({ spot, onClose }: SpotDeleteDialogProps) {
  const deleteSpot = useDeleteSpot()
  const [requestError, setRequestError] = useState<string | null>(null)

  async function handleDelete() {
    if (deleteSpot.isPending) return
    setRequestError(null)

    try {
      await deleteSpot.mutateAsync(spot.id)
      toast.success("Mesa excluída com sucesso.")
      onClose()
    } catch (error) {
      const message = getApiErrorMessage(error, "Não foi possível excluir a mesa. Verifique se ela possui comandas vinculadas.")
      setRequestError(message)
      toast.error(message)
    }
  }

  return (
    <AlertDialog open onOpenChange={(open) => { if (!open && !deleteSpot.isPending) onClose() }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir mesa?</AlertDialogTitle>
          <AlertDialogDescription>
            A mesa “{spot.name}” será removida permanentemente. Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {requestError && <Alert variant="destructive"><AlertDescription>{requestError}</AlertDescription></Alert>}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteSpot.isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={deleteSpot.isPending} onClick={() => void handleDelete()}>
            {deleteSpot.isPending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            {deleteSpot.isPending ? "Excluindo..." : "Excluir mesa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
