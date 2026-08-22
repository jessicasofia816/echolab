import { useEffect, useState } from "react";

interface Product {
  id: string
  name: string
  tagline: string
  price: number
  image: string
}

export default function ProductListingPage() {

  const API_URL = import.meta.env.VITE_API_URL

  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    async function getProducts() {
      try {
        const response = await fetch(`${API_URL}/api/products`)

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`)
        }

        const data = await response.json()

        console.log("Products:", data)

        setProducts(data)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      }
    }

    getProducts()
  }, [])

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <img
            src={product.image}
            alt={product.name}
          />

          <h3>{product.name}</h3>

          <p>{product.tagline}</p>

          <p>€{product.price}</p>
        </div>
      ))}    </div>
  );
}