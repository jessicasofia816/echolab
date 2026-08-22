import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import type { Product } from "../../types/Product";


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
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}