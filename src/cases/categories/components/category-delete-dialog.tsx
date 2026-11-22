import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { getApiErrorMessage } from "@/lib/api-error"
import type { CategoryDTO } from "../dtos/category.dto"
import { useDeleteCategory } from "../hooks/use-categories"

interface CategoryDeleteDialogProps {
  category: CategoryDTO
  onClose: () => void
}

export function CategoryDeleteDialog({ category, onClose }: CategoryDeleteDialogProps) {
  const deleteCategory = useDeleteCategory()
  const [requestError, setRequestError] = useState<string | null>(null)

  async function handleDelete() {
    if (deleteCategory.isPending) return
    setRequestError(null)

    try {
      await deleteCategory.mutateAsync(category.id)
      toast.success("Categoria excluída com sucesso.")
      onClose()
    } catch (error) {
      const message = getApiErrorMessage(error, "Não foi possível excluir a categoria. Verifique se ela está vinculada a produtos.")
      setRequestError(message)
      toast.error(message)
    }
  }

  return (
    <AlertDialog open onOpenChange={(open) => { if (!open && !deleteCategory.isPending) onClose() }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
          <AlertDialogDescription>
            A categoria “{category.name}” será removida permanentemente. Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {requestError && <Alert variant="destructive"><AlertDescription>{requestError}</AlertDescription></Alert>}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteCategory.isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={deleteCategory.isPending} onClick={() => void handleDelete()}>
            {deleteCategory.isPending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            {deleteCategory.isPending ? "Excluindo..." : "Excluir categoria"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
