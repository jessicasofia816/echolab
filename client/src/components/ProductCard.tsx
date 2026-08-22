import { useState } from "react"
import { Link } from "react-router"
import type { Product } from "../types/Product"

interface ProductCardProps {
  product: Product
  variant?: "default" | "compact" | "featured"
  onAddToCart?: (product: Product) => void
}

const BADGE_CLASSES: Record<string, string> = {
  New: "bg-primary text-white",
  Sale: "bg-red-500 text-white",
  "Best Seller": "bg-amber-500 text-black",
  Limited: "bg-violet-500 text-white",
  "Staff Pick": "bg-green-500 text-black",
}

export default function ProductCard({
  product,
  variant = "default",
  onAddToCart,
}: ProductCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false)

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null

  return (
    <article
      className="
        group
        flex
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-border
        bg-surface
        transition-all
        duration-200
        hover:-translate-y-0.75
        hover:border-border-strong
        hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)]
      "
    >
      {/* Image */}
      <Link
        to={`/products/${product.id}`}
        className="relative block"
      >
        <div
          className={`
            relative
            overflow-hidden
            bg-surface-2
            ${variant === "compact" ? "aspect-4/3" : "aspect-3/2"}
          `}
        >
          {/* Skeleton */}
          {!imgLoaded && (
            <div className="absolute inset-0 animate-pulse bg-surface-2" />
          )}

          <img
            src={product.image}
            alt={product.name}
            onLoad={() => setImgLoaded(true)}
            className={`
              h-full
              w-full
              object-cover
              transition-transform
              duration-450
              group-hover:scale-[1.04]
              ${imgLoaded ? "block" : "hidden"}
            `}
          />

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1">
            {product.badge && (
              <span
                className={`
                  w-fit
                  rounded-md
                  px-2
                  py-1
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  ${BADGE_CLASSES[product.badge] ?? ""}
                `}
              >
                {product.badge}
              </span>
            )}

            {discount !== null && (
              <span
                className="
                  w-fit
                  rounded-md
                  bg-red-500
                  px-2
                  py-1
                  text-[10px]
                  font-bold
                  text-white
                "
              >
                -{discount}%
              </span>
            )}

            {!product.in_stock && (
              <span
                className="
                  w-fit
                  rounded-md
                  bg-black/70
                  px-2
                  py-1
                  text-[10px]
                  font-semibold
                  text-white
                  backdrop-blur-sm
                "
              >
                Sold Out
              </span>
            )}

            {product.stock_count !== null &&
              product.stock_count !== undefined &&
              product.stock_count <= 5 &&
              product.in_stock === 1 && (
                <span
                  className="
                    w-fit
                    rounded-md
                    border
                    border-amber-500/30
                    bg-amber-500/15
                    px-2
                    py-1
                    text-[10px]
                    font-semibold
                    text-amber-500
                  "
                >
                  Only {product.stock_count} left
                </span>
              )}
          </div>
        </div>
      </Link>

      {/* Info */}
      <div
        className={`
          flex
          flex-1
          flex-col
          gap-1.5
          ${variant === "compact" ? "p-3.5" : "p-4.5"}
        `}
      >
        {/* Category */}
        <p
          className="
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.08em]
            text-text-muted
          "
        >
          {product.category_id.replace(/-/g, " ")}
        </p>

        {/* Name */}
        <Link
          to={`/products/${product.id}`}
          className="group/title"
        >
          <h3
            className={`
              font-semibold
              leading-[1.3]
              tracking-[-0.01em]
              text-text
              transition-colors
              duration-150
              group-hover/title:text-primary
              ${variant === "compact" ? "text-sm" : "text-base"}
            `}
          >
            {product.name}
          </h3>
        </Link>

        {/* Tagline */}
        {variant !== "compact" && (
          <p className="text-[13px] leading-normal text-text-muted">
            {product.tagline}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <Stars rating={product.rating} />

          <span className="text-xs text-text-muted">
            {product.rating} ({product.review_count.toLocaleString()})
          </span>
        </div>

        {/* Price + button */}
        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <p
              className={`
                font-mono
                font-bold
                tracking-[-0.02em]
                text-text
                ${variant === "compact" ? "text-[15px]" : "text-[17px]"}
              `}
            >
              €{product.price.toLocaleString()}
            </p>

            {product.original_price && (
              <p className="font-mono text-xs text-text-muted line-through">
                €{product.original_price.toLocaleString()}
              </p>
            )}
          </div>

          <button
            type="button"
            disabled={!product.in_stock}
            onClick={() => onAddToCart?.(product)}
            className="
              rounded-lg
              px-3.5
              py-2
              text-[13px]
              font-semibold
              transition-all
              duration-150

              enabled:bg-primary
              enabled:text-white
              enabled:hover:bg-hover
              enabled:hover:scale-[1.04]

              disabled:cursor-not-allowed
              disabled:bg-surface-2
              disabled:text-text-muted
              disabled:opacity-60
            "
          >
            {product.in_stock ? "Add to Cart" : "Sold Out"}
          </button>
        </div>
      </div>
    </article>
  )
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="12"
          height="12"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M7 1l1.5 3.5 3.8.5-2.8 2.7.7 3.8L7 9.5l-3.2 2 .7-3.8-2.8-2.7 3.8-.5z"
            className={
              star <= Math.round(rating)
                ? "fill-amber-400 stroke-amber-400"
                : "fill-surface-2 stroke-surface-2"
            }
            strokeWidth="0.5"
          />
        </svg>
      ))}
    </div>
  )
}