import { useState, type FormEvent } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useCategories } from "@/cases/categories/hooks/use-categories"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { getApiErrorMessage } from "@/lib/api-error"
import { useCreateProduct, useUpdateProduct } from "../hooks/use-products"
import type { ProductDTO } from "../dtos/product.dto"
import type { CreateProductDTO } from "../dtos/create-product.dto"
import { ProductImage } from "./product-image"

const NO_CATEGORY = "none"

interface ProductFormDialogProps {
  product: ProductDTO | null
  onClose: () => void
}

type FormErrors = Partial<Record<"name" | "price" | "picture" | "categoryId", string>>

export function ProductFormDialog({ product, onClose }: ProductFormDialogProps) {
  const [name, setName] = useState(product?.name ?? "")
  const [description, setDescription] = useState(product?.description ?? "")
  const [price, setPrice] = useState(product ? String(product.price).replace(".", ",") : "")
  const [picture, setPicture] = useState(product?.picture ?? "")
  const [categoryId, setCategoryId] = useState(product?.category?.id ?? NO_CATEGORY)
  const [active, setActive] = useState(product?.active ?? true)
  const [isVegetarian, setIsVegetarian] = useState(product?.isVegetarian ?? false)
  const [isNew, setIsNew] = useState(product?.isNew ?? false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [requestError, setRequestError] = useState<string | null>(null)

  const categoriesQuery = useCategories()
  const categories = categoriesQuery.data ?? []
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const isPending = createProduct.isPending || updateProduct.isPending
  const categoriesUnavailable = categoriesQuery.isPending || categoriesQuery.isError
  const categoryItems = [
    { value: NO_CATEGORY, label: "Sem categoria", disabled: false },
    ...categories
      .filter((category) => category.active || category.id === product?.category?.id)
      .map((category) => ({
        value: category.id,
        label: `${category.name}${category.active ? "" : " (inativa)"}`,
        disabled: !category.active,
      })),
  ]

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isPending || categoriesUnavailable) return

    const nextErrors: FormErrors = {}
    const cleanName = name.trim()
    const cleanPicture = picture.trim()
    const cleanPrice = price.trim().replace(",", ".")
    const priceNumber = Number(cleanPrice)
    const nextCategoryId = categoryId === NO_CATEGORY ? null : categoryId

    if (!cleanName) nextErrors.name = "Informe o nome do produto."
    else if (cleanName.length > 60) nextErrors.name = "Use no máximo 60 caracteres."

    if (!/^\d+(\.\d{1,2})?$/.test(cleanPrice) || !Number.isFinite(priceNumber) || priceNumber <= 0) {
      nextErrors.price = "Informe um preço maior que zero, com até duas casas decimais."
    } else if (priceNumber > 99999999.99) {
      nextErrors.price = "O preço deve ser de no máximo R$ 99.999.999,99."
    }

    if (cleanPicture) {
      try {
        const url = new URL(cleanPicture)
        if (!["http:", "https:"].includes(url.protocol)) throw new Error("Invalid protocol")
      } catch {
        nextErrors.picture = "Informe uma URL completa iniciada por http:// ou https://."
      }
    }

    if (nextCategoryId && nextCategoryId !== product?.category?.id &&
      !categories.some((category) => category.id === nextCategoryId && category.active)) {
      nextErrors.categoryId = "Escolha uma categoria ativa disponível."
    }

    setErrors(nextErrors)
    setRequestError(null)
    if (Object.keys(nextErrors).length) return

    const data: CreateProductDTO = {
      name: cleanName,
      description: description.trim() || null,
      price: priceNumber,
      picture: cleanPicture || null,
      categoryId: nextCategoryId,
      active,
      isVegetarian,
      isNew,
    }

    try {
      if (product) {
        await updateProduct.mutateAsync({
          id: product.id,
          data: {
            ...data,
            categoryId: nextCategoryId === (product.category?.id ?? null) ? undefined : nextCategoryId,
          },
        })
      } else {
        await createProduct.mutateAsync(data)
      }
      toast.success(product ? "Produto atualizado com sucesso." : "Produto cadastrado com sucesso.")
      onClose()
    } catch (error) {
      const message = getApiErrorMessage(error, "Não foi possível salvar o produto. Tente novamente.")
      setRequestError(message)
      toast.error(message)
    }
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open && !isPending) onClose() }}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl" showCloseButton={!isPending}>
        <DialogHeader>
          <DialogTitle>{product ? "Editar produto" : "Novo produto"}</DialogTitle>
          <DialogDescription>Preencha as informações do produto. Nome e preço são obrigatórios.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <fieldset disabled={isPending} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="product-name">Nome *</Label>
              <Input id="product-name" name="name" value={name} onChange={(event) => setName(event.target.value)}
                required maxLength={60} autoComplete="off" autoFocus aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "product-name-error" : undefined} />
              {errors.name && <p id="product-name-error" role="alert" className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-description">Descrição</Label>
              <Textarea id="product-description" name="description" value={description}
                onChange={(event) => setDescription(event.target.value)} rows={3} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="product-price">Preço (R$) *</Label>
                <Input id="product-price" name="price" inputMode="decimal" placeholder="0,00" required
                  value={price} onChange={(event) => setPrice(event.target.value)}
                  aria-invalid={!!errors.price} aria-describedby={errors.price ? "product-price-error" : undefined} />
                {errors.price && <p id="product-price-error" role="alert" className="text-sm text-destructive">{errors.price}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-category">Categoria</Label>
                <Select value={categoryId} items={categoryItems} disabled={isPending || categoriesUnavailable}
                  onValueChange={(value) => setCategoryId(value ?? NO_CATEGORY)}>
                  <SelectTrigger id="product-category" className="w-full" aria-invalid={!!errors.categoryId}
                    aria-describedby={errors.categoryId ? "product-category-error" : undefined}>
                    <SelectValue placeholder="Sem categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryItems.map((item) => (
                      <SelectItem key={item.value} value={item.value} disabled={item.disabled}>{item.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && <p id="product-category-error" role="alert" className="text-sm text-destructive">{errors.categoryId}</p>}
              </div>
            </div>

            {categoriesQuery.isPending && <p role="status" className="text-sm text-muted-foreground">Carregando categorias...</p>}
            {categoriesQuery.isError && (
              <Alert variant="destructive">
                <AlertDescription className="space-y-3">
                  <p>{getApiErrorMessage(categoriesQuery.error, "Não foi possível carregar as categorias.")}</p>
                  <Button type="button" variant="outline" size="sm" disabled={categoriesQuery.isFetching}
                    onClick={() => void categoriesQuery.refetch()}>
                    {categoriesQuery.isFetching ? "Carregando..." : "Tentar novamente"}
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            {!categoriesUnavailable && !categories.some((category) => category.active) && (
              <p className="text-sm text-muted-foreground">Não há categorias ativas disponíveis. Você pode salvar sem categoria ou cadastrar uma na área de Categorias.</p>
            )}
            {product?.category && !product.category.active && (
              <p className="text-sm text-muted-foreground">A categoria atual está inativa. Você pode manter o vínculo, remover ou escolher outra categoria ativa.</p>
            )}

            <div className="space-y-2">
              <Label htmlFor="product-picture">URL da imagem</Label>
              <Input id="product-picture" name="picture" type="url" value={picture}
                onChange={(event) => setPicture(event.target.value)} placeholder="https://..."
                aria-invalid={!!errors.picture} aria-describedby={errors.picture ? "product-picture-error" : "product-picture-help"} />
              {errors.picture ? (
                <p id="product-picture-error" role="alert" className="text-sm text-destructive">{errors.picture}</p>
              ) : (
                <p id="product-picture-help" className="text-sm text-muted-foreground">Opcional. Deixe vazio para remover a imagem.</p>
              )}
              {picture.trim() && !errors.picture && <ProductImage key={picture.trim()} src={picture.trim()} alt="Prévia da imagem do produto" />}
            </div>

            <div className="space-y-4 rounded-lg border p-4">
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="product-active">Produto ativo</Label>
                <Switch id="product-active" name="active" checked={active} onCheckedChange={setActive} />
              </div>
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="product-vegetarian">Vegetariano</Label>
                <Switch id="product-vegetarian" name="isVegetarian" checked={isVegetarian} onCheckedChange={setIsVegetarian} />
              </div>
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="product-new">Novidade</Label>
                <Switch id="product-new" name="isNew" checked={isNew} onCheckedChange={setIsNew} />
              </div>
            </div>
          </fieldset>

          {requestError && <Alert variant="destructive"><AlertDescription>{requestError}</AlertDescription></Alert>}

          <DialogFooter>
            <Button type="button" variant="outline" disabled={isPending} onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isPending || categoriesUnavailable}>
              {isPending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              {isPending ? "Salvando..." : "Salvar produto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
