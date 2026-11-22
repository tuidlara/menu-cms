export interface CreateProductDTO {
  name: string
  description: string | null
  price: number
  picture: string | null
  categoryId: string | null
  active: boolean
  isVegetarian: boolean
  isNew: boolean
}
