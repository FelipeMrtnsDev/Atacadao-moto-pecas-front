export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  images: string[]
  rating: number
  reviewCount: number
  inStock: boolean
  specifications?: {
    size?: string[]
    height?: string[]
    weight?: string
    material?: string
    color?: string[]
    [key: string]: string | string[] | undefined
  }
}

export interface CartItem {
  product: Product
  quantity: number
  selectedSize?: string
  selectedHeight?: string
  selectedColor?: string
}

export interface Category {
  id: string
  name: string
  icon: string
  subcategories?: string[]
}
