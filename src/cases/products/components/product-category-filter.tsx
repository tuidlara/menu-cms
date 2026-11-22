import { useCategories } from "@/cases/categories/hooks/use-categories"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getApiErrorMessage } from "@/lib/api-error"

const ALL_CATEGORIES = "all"

interface ProductCategoryFilterProps {
  categoryId?: string
  onChange: (categoryId?: string) => void
}

export function ProductCategoryFilter({ categoryId, onChange }: ProductCategoryFilterProps) {
  const { data: categories = [], isPending, isError, isFetching, error, refetch } = useCategories()
  const unavailable = !!categoryId && !isPending && !isError && !categories.some((category) => category.id === categoryId)
  const items = [
    { value: ALL_CATEGORIES, label: "Todas as categorias" },
    ...categories.map((category) => ({
      value: category.id,
      label: `${category.name}${category.active ? "" : " (inativa)"}`,
    })),
    ...(unavailable ? [{ value: categoryId, label: "Categoria indisponível" }] : []),
  ]

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-full space-y-2 sm:w-72">
          <Label htmlFor="product-category-filter">Filtrar por categoria</Label>
          <Select value={categoryId ?? ALL_CATEGORIES} items={items} disabled={isPending || isError}
            onValueChange={(value) => onChange(!value || value === ALL_CATEGORIES ? undefined : value)}>
            <SelectTrigger id="product-category-filter" className="w-full">
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value} disabled={unavailable && item.value === categoryId}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {categoryId && <Button variant="outline" onClick={() => onChange(undefined)}>Limpar filtro</Button>}
      </div>

      {isPending && <p role="status" className="text-sm text-muted-foreground">Carregando categorias...</p>}
      {!isPending && !isError && categories.length === 0 && (
        <p className="text-sm text-muted-foreground">Nenhuma categoria cadastrada para filtrar.</p>
      )}
      {unavailable && <p role="alert" className="text-sm text-destructive">A categoria do filtro não está disponível. Limpe o filtro ou escolha outra categoria.</p>}
      {isError && (
        <Alert variant="destructive">
          <AlertDescription className="space-y-3">
            <p>{getApiErrorMessage(error, "Não foi possível carregar as categorias do filtro.")}</p>
            <Button variant="outline" size="sm" disabled={isFetching} onClick={() => void refetch()}>
              {isFetching ? "Carregando..." : "Tentar novamente"}
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
