import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router"

import ProductCard from "../../components/ProductCard"
import type { Product } from "../../types/Product"
import type { Category } from "../../types/Category"

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
        ${
          active
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
  const [categories, setCategories] = useState<Category[]>([])
  const [sortBy, setSortBy] = useState("featured")
  const [inStockOnly, setInStockOnly] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState("")
  const [maxPrice, setMaxPrice] = useState("5000")

  const [searchParams, setSearchParams] =
    useSearchParams()

  const selectedCategory =
    searchParams.get("category") || ""

  function changeCategory(categoryId: string) {
    const params =
      new URLSearchParams(searchParams)

    if (categoryId) {
      params.set(
        "category",
        categoryId
      )
    } else {
      params.delete("category")
    }

    setSearchParams(params)
  }

  function clearProductFilters() {
    const params =
      new URLSearchParams(searchParams)

    params.delete("category")

    setSearchParams(params)
    setSelectedBadge("")
  }

  useEffect(() => {
    async function getProducts() {
      try {
        const params =
          new URLSearchParams()

        if (selectedCategory) {
          params.set(
            "category",
            selectedCategory
          )
        }

        if (inStockOnly) {
          params.set(
            "inStock",
            "true"
          )
        }

        if (selectedBadge) {
          params.set(
            "badge",
            selectedBadge
          )
        }

        if (maxPrice) {
          params.set(
            "maxPrice",
            maxPrice
          )
        }

        if (sortBy) {
          params.set(
            "sort",
            sortBy
          )
        }

        const response = await fetch(
          `${API_URL}/api/products?${params.toString()}`
        )

        if (!response.ok) {
          throw new Error(
            `HTTP error: ${response.status}`
          )
        }

        const data =
          await response.json()

        setProducts(data)
      } catch (error) {
        console.error(
          "Failed to fetch products:",
          error
        )
      }
    }

    getProducts()
  }, [
    API_URL,
    selectedCategory,
    sortBy,
    inStockOnly,
    selectedBadge,
    maxPrice,
  ])

  useEffect(() => {
    async function getCategories() {
      try {
        const response = await fetch(
          `${API_URL}/api/categories`
        )

        if (!response.ok) {
          throw new Error(
            `HTTP error: ${response.status}`
          )
        }

        const data =
          await response.json()

        setCategories(data)
      } catch (error) {
        console.error(
          "Failed to fetch categories:",
          error
        )
      }
    }

    getCategories()
  }, [API_URL])

  const activeCategoryData =
    categories.find(
      (category) =>
        category.id ===
        selectedCategory
    )

  return (
    <div className="min-h-screen bg-bg">
      {/* Page header */}
      <div className="border-b border-border bg-surface px-0 pb-8 pt-12">
        <div className="container-wide">
          <nav className="mb-4 flex items-center gap-2 text-[13px] text-text-muted">
            <Link
              to="/"
              className="text-text-muted no-underline hover:text-text"
            >
              Home
            </Link>

            <span>/</span>

            {(selectedCategory ||
              selectedBadge) && (
              <>
                <button
                  type="button"
                  onClick={
                    clearProductFilters
                  }
                  className="text-text-muted hover:text-text"
                >
                  All Products
                </button>

                <span>/</span>
              </>
            )}

            <span className="text-text">
              {activeCategoryData?.name ||
                (selectedBadge
                  ? `${selectedBadge} Products`
                  : "All Products")}
            </span>
          </nav>

          <h1
            className="
              mb-2
              font-serif
              text-[clamp(28px,4vw,48px)]
              font-normal
              tracking-[-0.02em]
              text-text
            "
          >
            {activeCategoryData?.name ||
              (selectedBadge
                ? `${selectedBadge} Products`
                : "All Products")}
          </h1>

          {activeCategoryData && (
            <p className="text-text-muted">
              {
                activeCategoryData.description
              }
            </p>
          )}

          <p className="mt-1 text-[14px] text-text-muted">
            {products.length} product
            {products.length !== 1
              ? "s"
              : ""}
          </p>
        </div>
      </div>

      <div className="container-wide pb-20 pt-10">
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[220px_1fr]">
          {/* Sidebar filter */}
          <aside>
            <div className="mb-8">
              {/* Categories */}
              <div className="mb-8">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted">
                  Categories
                </p>

                <div className="flex flex-col gap-0.5">
                  <FilterItem
                    label="All Products"
                    active={
                      selectedCategory ===
                      ""
                    }
                    onClick={() =>
                      changeCategory("")
                    }
                  />

                  {categories.map(
                    (category) => (
                      <FilterItem
                        key={
                          category.id
                        }
                        label={
                          category.name
                        }
                        active={
                          selectedCategory ===
                          category.id
                        }
                        onClick={() =>
                          changeCategory(
                            category.id
                          )
                        }
                      />
                    )
                  )}
                </div>
              </div>

              {/* Special */}
              <div className="mb-8">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted">
                  Special
                </p>

                <div className="flex flex-col gap-0.5">
                  <FilterItem
                    label="All"
                    active={
                      selectedBadge ===
                      ""
                    }
                    onClick={() =>
                      setSelectedBadge(
                        ""
                      )
                    }
                  />

                  <FilterItem
                    label="New"
                    active={
                      selectedBadge ===
                      "New"
                    }
                    onClick={() =>
                      setSelectedBadge(
                        "New"
                      )
                    }
                  />

                  <FilterItem
                    label="Sale"
                    active={
                      selectedBadge ===
                      "Sale"
                    }
                    onClick={() =>
                      setSelectedBadge(
                        "Sale"
                      )
                    }
                  />

                  <FilterItem
                    label="Best Seller"
                    active={
                      selectedBadge ===
                      "Best Seller"
                    }
                    onClick={() =>
                      setSelectedBadge(
                        "Best Seller"
                      )
                    }
                  />

                  <FilterItem
                    label="Limited"
                    active={
                      selectedBadge ===
                      "Limited"
                    }
                    onClick={() =>
                      setSelectedBadge(
                        "Limited"
                      )
                    }
                  />

                  <FilterItem
                    label="Staff Pick"
                    active={
                      selectedBadge ===
                      "Staff Pick"
                    }
                    onClick={() =>
                      setSelectedBadge(
                        "Staff Pick"
                      )
                    }
                  />
                </div>
              </div>

              {/* Max price */}
              <div className="mb-8">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted">
                    Max Price
                  </p>

                  <span className="text-sm font-medium text-text">
                    {maxPrice} €
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) =>
                    setMaxPrice(
                      e.target.value
                    )
                  }
                  className="w-full cursor-pointer accent-primary"
                />
              </div>

              {/* Availability */}
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted">
                Availability
              </p>

              <label className="flex items-center gap-2 text-sm text-text-muted">
                <input
                  type="checkbox"
                  checked={
                    inStockOnly
                  }
                  onChange={(e) =>
                    setInStockOnly(
                      e.target.checked
                    )
                  }
                />

                In Stock Only
              </label>
            </div>
          </aside>

          {/* Products */}
          <div className="flex flex-col gap-5">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-text-muted">
                  Showing{" "}
                  <strong className="text-text">
                    {products.length}
                  </strong>{" "}
                  results
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-text-muted">
                  Sort:
                </span>

                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value
                    )
                  }
                  className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
                >
                  <option value="featured">
                    Featured
                  </option>

                  <option value="newest">
                    Newest
                  </option>

                  <option value="price-asc">
                    Price: Low to High
                  </option>

                  <option value="price-desc">
                    Price: High to Low
                  </option>

                  <option value="rating">
                    Top Rated
                  </option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {products.map(
                (product) => (
                  <ProductCard
                    key={
                      product.id
                    }
                    product={
                      product
                    }
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}