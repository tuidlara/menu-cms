import { useState } from "react"
import { AlertCircle, Loader2, Pencil, Plus, RefreshCw, Tags, Trash2 } from "lucide-react"
import { useCategories } from "@/cases/categories/hooks/use-categories"
import type { CategoryDTO } from "@/cases/categories/dtos/category.dto"
import { CategoryFormDialog } from "@/cases/categories/components/category-form-dialog"
import { CategoryDeleteDialog } from "@/cases/categories/components/category-delete-dialog"
import { CategoryIcon } from "@/cases/categories/components/category-icon"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getApiErrorMessage } from "@/lib/api-error"

export function CategoryPage() {
  const { data: categories, isPending, isError, isFetching, error, refetch } = useCategories()
  const [formOpen, setFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryDTO | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryDTO | null>(null)

  function openCreate() {
    setEditingCategory(null)
    setFormOpen(true)
  }

  function openEdit(category: CategoryDTO) {
    setEditingCategory(category)
    setFormOpen(true)
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Categorias</h1>
          <p className="text-muted-foreground">Organize as categorias do cardápio, sua ordem e situação.</p>
        </div>
        <Button onClick={openCreate}><Plus aria-hidden="true" />Nova categoria</Button>
      </div>

      {isError && (
        <Alert variant="destructive">
          <AlertCircle aria-hidden="true" />
          <AlertTitle>{categories ? "Não foi possível atualizar a lista" : "Não foi possível carregar as categorias"}</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>{getApiErrorMessage(error, "Ocorreu um erro ao buscar as categorias. Tente novamente.")}</p>
            {categories && <p>Os dados exibidos abaixo podem estar desatualizados.</p>}
            <Button variant="outline" size="sm" disabled={isFetching} onClick={() => void refetch()}>
              <RefreshCw className={isFetching ? "animate-spin" : ""} aria-hidden="true" />Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {isPending && (
        <Card aria-busy="true" aria-label="Carregando categorias">
          <CardContent className="space-y-4">
            <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />Carregando categorias...
            </p>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      )}

      {categories && categories.length === 0 && !isError && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
            <Tags className="size-9 text-muted-foreground" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Nenhuma categoria cadastrada</h2>
            <p className="max-w-md text-muted-foreground">Cadastre a primeira categoria para começar a organizar os produtos do restaurante.</p>
            <Button onClick={openCreate}><Plus aria-hidden="true" />Cadastrar categoria</Button>
          </CardContent>
        </Card>
      )}

      {categories && categories.length > 0 && (
        <Card className="gap-0 overflow-hidden py-0">
          <div className="flex items-center justify-between gap-3 border-b px-6 py-4">
            <p className="text-sm text-muted-foreground">
              {categories.length} {categories.length === 1 ? "categoria cadastrada" : "categorias cadastradas"}
            </p>
            {isFetching && <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" aria-hidden="true" />Atualizando...</p>}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20 pl-6">Ícone</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Ordem</TableHead>
                <TableHead>Situação</TableHead>
                <TableHead className="pr-6 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="pl-6"><CategoryIcon key={category.icon} src={category.icon} /></TableCell>
                  <TableCell className="max-w-64 whitespace-normal break-words font-medium">{category.name}</TableCell>
                  <TableCell>{category.displayOrder ?? "Indisponível na API"}</TableCell>
                  <TableCell>
                    <Badge variant={category.active ? "default" : "secondary"}
                      className={category.active ? "bg-emerald-100 text-emerald-800" : ""}>
                      {category.active ? "Ativa" : "Inativa"}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(category)}
                        aria-label={`Editar categoria ${category.name}`} title="Editar categoria">
                        <Pencil aria-hidden="true" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setCategoryToDelete(category)}
                        aria-label={`Excluir categoria ${category.name}`} title="Excluir categoria">
                        <Trash2 aria-hidden="true" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {formOpen && <CategoryFormDialog category={editingCategory} onClose={() => setFormOpen(false)} />}
      {categoryToDelete && <CategoryDeleteDialog category={categoryToDelete} onClose={() => setCategoryToDelete(null)} />}
    </section>
  )
}
