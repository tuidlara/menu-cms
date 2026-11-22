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
import { useCreateCategory, useUpdateCategory } from "../hooks/use-categories"
import type { CategoryDTO } from "../dtos/category.dto"
import { CategoryIcon } from "./category-icon"

interface CategoryFormDialogProps {
  category: CategoryDTO | null
  onClose: () => void
}

type FormErrors = Partial<Record<"name" | "icon" | "displayOrder", string>>

export function CategoryFormDialog({ category, onClose }: CategoryFormDialogProps) {
  const [name, setName] = useState(category?.name ?? "")
  const [icon, setIcon] = useState(category?.icon ?? "")
  const [displayOrder, setDisplayOrder] = useState(String(category?.displayOrder ?? 0))
  const [active, setActive] = useState(category?.active ?? true)
  const [errors, setErrors] = useState<FormErrors>({})
  const [requestError, setRequestError] = useState<string | null>(null)

  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const isPending = createCategory.isPending || updateCategory.isPending

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isPending) return

    const nextErrors: FormErrors = {}
    const cleanName = name.trim()
    const cleanIcon = icon.trim()
    const order = Number(displayOrder)

    if (!cleanName) nextErrors.name = "Informe o nome da categoria."
    else if (cleanName.length > 60) nextErrors.name = "Use no máximo 60 caracteres."

    if (cleanIcon) {
      try {
        const url = new URL(cleanIcon)
        if (!["http:", "https:"].includes(url.protocol)) throw new Error("Invalid protocol")
      } catch {
        nextErrors.icon = "Informe uma URL completa iniciada por http:// ou https://."
      }
    }

    if (!displayOrder.trim() || !Number.isInteger(order) || order < 0 || order > 2147483647) {
      nextErrors.displayOrder = "Informe um número inteiro entre 0 e 2147483647."
    }

    setErrors(nextErrors)
    setRequestError(null)
    if (Object.keys(nextErrors).length) return

    const data = { name: cleanName, icon: cleanIcon || null, displayOrder: order, active }

    try {
      if (category) {
        await updateCategory.mutateAsync({ id: category.id, data })
      } else {
        await createCategory.mutateAsync(data)
      }

      toast.success(category ? "Categoria atualizada com sucesso." : "Categoria cadastrada com sucesso.")
      onClose()
    } catch (error) {
      const message = getApiErrorMessage(error, "Não foi possível salvar a categoria. Tente novamente.")
      setRequestError(message)
      toast.error(message)
    }
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open && !isPending) onClose() }}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg" showCloseButton={!isPending}>
        <DialogHeader>
          <DialogTitle>{category ? "Editar categoria" : "Nova categoria"}</DialogTitle>
          <DialogDescription>
            Defina as informações da categoria. Nome e ordem de exibição são obrigatórios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <fieldset disabled={isPending} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="category-name">Nome *</Label>
              <Input id="category-name" name="name" value={name} onChange={(event) => setName(event.target.value)}
                required maxLength={60} autoComplete="off" autoFocus
                aria-invalid={!!errors.name} aria-describedby={errors.name ? "category-name-error" : undefined} />
              {errors.name && <p id="category-name-error" role="alert" className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-icon">URL do ícone</Label>
              <Input id="category-icon" name="icon" type="url" value={icon} onChange={(event) => setIcon(event.target.value)}
                placeholder="https://..." aria-invalid={!!errors.icon}
                aria-describedby={errors.icon ? "category-icon-error" : "category-icon-help"} />
              {errors.icon ? (
                <p id="category-icon-error" role="alert" className="text-sm text-destructive">{errors.icon}</p>
              ) : (
                <p id="category-icon-help" className="text-sm text-muted-foreground">Opcional. Deixe vazio para remover o ícone.</p>
              )}
              {icon.trim() && !errors.icon && <CategoryIcon key={icon.trim()} src={icon.trim()} />}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-order">Ordem de exibição *</Label>
              <Input id="category-order" name="displayOrder" type="number" min={0} max={2147483647} step={1} required
                value={displayOrder} onChange={(event) => setDisplayOrder(event.target.value)}
                aria-invalid={!!errors.displayOrder}
                aria-describedby={errors.displayOrder ? "category-order-error" : "category-order-help"} />
              {errors.displayOrder ? (
                <p id="category-order-error" role="alert" className="text-sm text-destructive">{errors.displayOrder}</p>
              ) : (
                <p id="category-order-help" className="text-sm text-muted-foreground">Valores menores aparecem primeiro. Em caso de empate, a API ordena pelo nome.</p>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
              <div className="space-y-1">
                <Label htmlFor="category-active">Categoria ativa</Label>
                <p className="text-sm text-muted-foreground">Define a situação da categoria no cardápio.</p>
              </div>
              <Switch id="category-active" name="active" checked={active} onCheckedChange={setActive} />
            </div>
          </fieldset>

          {requestError && <Alert variant="destructive"><AlertDescription>{requestError}</AlertDescription></Alert>}

          <DialogFooter>
            <Button type="button" variant="outline" disabled={isPending} onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              {isPending ? "Salvando..." : "Salvar categoria"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
