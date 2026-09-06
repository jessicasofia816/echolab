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

  contact: {
    firstName: string | null
    lastName: string | null
    email: string | null
    phone: string | null
  }

  shippingAddress: {
    address: string | null
    city: string | null
    postcode: string | null
    country: string | null
  }

  items: OrderItem[]
}