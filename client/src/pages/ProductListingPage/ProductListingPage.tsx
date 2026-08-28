import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import type { Product } from "../../types/Product";
import type { Category } from "../../types/Category";

interface FilterItemProps {
  label: string
  active: boolean
  onClick: () => void
}

function FilterItem({
  label,
  active,
  onClick,
}: FilterItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full
        rounded-lg
        px-2.5
        py-2
        text-left
        text-sm
        transition-colors
        ${active
          ? "bg-primary/10 font-semibold text-primary"
          : "text-text-muted hover:bg-surface-2 hover:text-text"
        }
      `}
    >
      {label}
    </button>
  )
}

export default function ProductListingPage() {

  const API_URL = import.meta.env.VITE_API_URL

  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [sortBy, setSortBy] = useState("featured")
  const [inStockOnly, setInStockOnly] = useState(false)


  useEffect(() => {
    async function getProducts() {
      try {
        const params = new URLSearchParams()

        if (selectedCategory) {
          params.set("category", selectedCategory)
        }

        if (sortBy) {
          params.set("sort", sortBy)
        }

        if (inStockOnly) {
          params.set("inStock", "true")
        }

        const response = await fetch(
          `${API_URL}/api/products?${params.toString()}`
        )

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
  }, [API_URL, selectedCategory, sortBy, inStockOnly])


  useEffect(() => {
    async function getCategories() {
      try {
        const response = await fetch(`${API_URL}/api/categories`)

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`)
        }

        const data = await response.json()

        setCategories(data)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }

    getCategories()
  }, [API_URL])

  return (
    <div>
      <aside>
        <div className="mb-8">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted">
            Categories
          </p>

          <div className="flex flex-col gap-0.5">
            <FilterItem
              label="All Products"
              active={selectedCategory === ""}
              onClick={() => setSelectedCategory("")}
            />

            {categories.map((category) => (
              <FilterItem
                key={category.id}
                label={category.name}
                active={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id)}
              />
            ))}
          </div>
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted">
            AVAILABILITY
          </p>
          <label className="flex items-center gap-2 text-sm text-text-muted">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
            />

            In Stock Only
          </label>
        </div>
      </aside>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
      >
        <option value="featured">Featured</option>
        <option value="newest">Newest</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating">Top Rated</option>
      </select>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
}