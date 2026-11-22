import { useState, type FormEvent } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { getApiErrorMessage } from "@/lib/api-error"
import type { SpotDTO } from "../dtos/spot.dto"
import { useCreateSpot, useUpdateSpot } from "../hooks/use-spots"

interface SpotFormDialogProps {
  spot: SpotDTO | null
  onClose: () => void
}

export function SpotFormDialog({ spot, onClose }: SpotFormDialogProps) {
  const [name, setName] = useState(spot?.name ?? "")
  const [active, setActive] = useState(spot?.active ?? true)
  const [nameError, setNameError] = useState<string | null>(null)
  const [requestError, setRequestError] = useState<string | null>(null)
  const createSpot = useCreateSpot()
  const updateSpot = useUpdateSpot()
  const isPending = createSpot.isPending || updateSpot.isPending

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isPending) return

    const cleanName = name.trim()
    setRequestError(null)

    if (!cleanName) {
      setNameError("Informe o nome da mesa.")
      return
    }
    if (cleanName.length > 60) {
      setNameError("Use no máximo 60 caracteres.")
      return
    }
    setNameError(null)

    try {
      const data = { name: cleanName, active }
      if (spot) await updateSpot.mutateAsync({ id: spot.id, data })
      else await createSpot.mutateAsync(data)

      toast.success(spot ? "Mesa atualizada com sucesso." : "Mesa cadastrada com sucesso.")
      onClose()
    } catch (error) {
      const message = getApiErrorMessage(error, "Não foi possível salvar a mesa. Tente novamente.")
      setRequestError(message)
      toast.error(message)
    }
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open && !isPending) onClose() }}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto" showCloseButton={!isPending}>
        <DialogHeader>
          <DialogTitle>{spot ? "Editar mesa" : "Nova mesa"}</DialogTitle>
          <DialogDescription>Informe o nome e a situação da mesa. O nome é obrigatório.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <fieldset disabled={isPending} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="spot-name">Nome *</Label>
              <Input id="spot-name" name="name" required maxLength={60} autoComplete="off" autoFocus
                value={name} onChange={(event) => setName(event.target.value)}
                aria-invalid={!!nameError} aria-describedby={nameError ? "spot-name-error" : undefined} />
              {nameError && <p id="spot-name-error" role="alert" className="text-sm text-destructive">{nameError}</p>}
            </div>
            <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
              <Label htmlFor="spot-active">Mesa ativa</Label>
              <Switch id="spot-active" name="active" checked={active} onCheckedChange={setActive} />
            </div>
          </fieldset>

          {requestError && <Alert variant="destructive"><AlertDescription>{requestError}</AlertDescription></Alert>}

          <DialogFooter>
            <Button type="button" variant="outline" disabled={isPending} onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              {isPending ? "Salvando..." : "Salvar mesa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
