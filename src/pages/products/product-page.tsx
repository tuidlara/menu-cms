import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { AlertCircle, Loader2, Package, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react"
import { useProducts } from "@/cases/products/hooks/use-products"
import type { ProductDTO } from "@/cases/products/dtos/product.dto"
import { ProductFormDialog } from "@/cases/products/components/product-form-dialog"
import { ProductDeleteDialog } from "@/cases/products/components/product-delete-dialog"
import { ProductCategoryFilter } from "@/cases/products/components/product-category-filter"
import { ProductImage } from "@/cases/products/components/product-image"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getApiErrorMessage } from "@/lib/api-error"
import { formatCurrency } from "@/lib/format"

export function ProductPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryId = searchParams.get("categoryId") || undefined
  const { data: products, isPending, isError, isFetching, error, refetch } = useProducts(categoryId)
  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductDTO | null>(null)
  const [productToDelete, setProductToDelete] = useState<ProductDTO | null>(null)

  function changeCategory(nextId?: string) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      if (nextId) next.set("categoryId", nextId)
      else next.delete("categoryId")
      return next
    })
  }

  function openCreate() {
    setEditingProduct(null)
    setFormOpen(true)
  }

  function openEdit(product: ProductDTO) {
    setEditingProduct(product)
    setFormOpen(true)
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground">Administre os produtos, preços e informações do cardápio.</p>
        </div>
        <Button onClick={openCreate}><Plus aria-hidden="true" />Novo produto</Button>
      </div>

      <ProductCategoryFilter categoryId={categoryId} onChange={changeCategory} />

      {isError && (
        <Alert variant="destructive">
          <AlertCircle aria-hidden="true" />
          <AlertTitle>{products ? "Não foi possível atualizar a lista" : "Não foi possível carregar os produtos"}</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>{getApiErrorMessage(error, "Ocorreu um erro ao buscar os produtos. Tente novamente.")}</p>
            {products && <p>Os dados exibidos abaixo podem estar desatualizados.</p>}
            <Button variant="outline" size="sm" disabled={isFetching} onClick={() => void refetch()}>
              <RefreshCw className={isFetching ? "animate-spin" : ""} aria-hidden="true" />Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {isPending && (
        <Card aria-busy="true" aria-label="Carregando produtos">
          <CardContent className="space-y-4">
            <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />Carregando produtos...
            </p>
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      )}

      {products && products.length === 0 && !isError && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
            <Package className="size-9 text-muted-foreground" aria-hidden="true" />
            <h2 className="text-lg font-semibold">{categoryId ? "Nenhum produto nesta categoria" : "Nenhum produto cadastrado"}</h2>
            <p className="max-w-md text-muted-foreground">
              {categoryId ? "Escolha outra categoria, limpe o filtro ou cadastre um produto." : "Cadastre o primeiro produto para começar a montar o cardápio."}
            </p>
            <Button onClick={openCreate}><Plus aria-hidden="true" />Cadastrar produto</Button>
          </CardContent>
        </Card>
      )}

      {products && products.length > 0 && (
        <Card className="gap-0 overflow-hidden py-0">
          <div className="flex items-center justify-between gap-3 border-b px-6 py-4">
            <p className="text-sm text-muted-foreground">
              {products.length} {products.length === 1 ? "produto encontrado" : "produtos encontrados"}
            </p>
            {isFetching && <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" aria-hidden="true" />Atualizando...</p>}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24 pl-6">Imagem</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Vegetariano</TableHead>
                <TableHead>Novidade</TableHead>
                <TableHead>Situação</TableHead>
                <TableHead className="pr-6 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="pl-6"><ProductImage key={product.picture} src={product.picture} /></TableCell>
                  <TableCell className="max-w-60 whitespace-normal break-words font-medium">{product.name}</TableCell>
                  <TableCell className="max-w-44 whitespace-normal break-words">{product.category?.name ?? "Sem categoria"}</TableCell>
                  <TableCell className="tabular-nums">{formatCurrency(product.price)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={product.isVegetarian ? "border-emerald-200 bg-emerald-50 text-emerald-800" : ""}>
                      {product.isVegetarian ? "Sim" : "Não"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={product.isNew ? "border-amber-200 bg-amber-50 text-amber-900" : ""}>
                      {product.isNew ? "Sim" : "Não"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.active ? "default" : "secondary"}
                      className={product.active ? "bg-emerald-100 text-emerald-800" : ""}>
                      {product.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(product)}
                        aria-label={`Editar produto ${product.name}`} title="Editar produto">
                        <Pencil aria-hidden="true" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setProductToDelete(product)}
                        aria-label={`Excluir produto ${product.name}`} title="Excluir produto">
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

      {formOpen && <ProductFormDialog product={editingProduct} onClose={() => setFormOpen(false)} />}
      {productToDelete && <ProductDeleteDialog product={productToDelete} onClose={() => setProductToDelete(null)} />}
    </section>
  )
}
