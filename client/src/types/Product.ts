export interface Product {
  id: string
  name: string
  tagline: string
  category_id: string

  price: number
  original_price: number | null

  image: string
  images: string

  badge: 'New' | 'Sale' | 'Best Seller' | 'Limited' | 'Staff Pick' | null

  rating: number
  review_count: number

  in_stock: number
  stock_count: number | null

  featured: number
  is_new: number

  description: string

  features: string
  specs: string
  tags: string
  colors: string | null
}