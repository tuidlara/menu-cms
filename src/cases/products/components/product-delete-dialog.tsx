import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { getApiErrorMessage } from "@/lib/api-error"
import type { ProductDTO } from "../dtos/product.dto"
import { useDeleteProduct } from "../hooks/use-products"

interface ProductDeleteDialogProps {
  product: ProductDTO
  onClose: () => void
}

export function ProductDeleteDialog({ product, onClose }: ProductDeleteDialogProps) {
  const deleteProduct = useDeleteProduct()
  const [requestError, setRequestError] = useState<string | null>(null)

  async function handleDelete() {
    if (deleteProduct.isPending) return
    setRequestError(null)

    try {
      await deleteProduct.mutateAsync(product.id)
      toast.success("Produto excluído com sucesso.")
      onClose()
    } catch (error) {
      const message = getApiErrorMessage(error, "Não foi possível excluir o produto. Verifique se ele está vinculado a pedidos.")
      setRequestError(message)
      toast.error(message)
    }
  }

  return (
    <AlertDialog open onOpenChange={(open) => { if (!open && !deleteProduct.isPending) onClose() }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
          <AlertDialogDescription>
            O produto “{product.name}” será removido permanentemente. Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {requestError && <Alert variant="destructive"><AlertDescription>{requestError}</AlertDescription></Alert>}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteProduct.isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={deleteProduct.isPending} onClick={() => void handleDelete()}>
            {deleteProduct.isPending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            {deleteProduct.isPending ? "Excluindo..." : "Excluir produto"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
