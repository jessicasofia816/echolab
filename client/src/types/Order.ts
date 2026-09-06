export type OrderItem = {
  product_id: string
  product_name: string
  price: number
  quantity: number
}

export type Order = {
  id: number
  status: string
  subtotal: number
  shipping: number
  tax: number
  total: number
  created_at: string
  items: OrderItem[]
}