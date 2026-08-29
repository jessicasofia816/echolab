import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import type { Product } from "../../types/Product"
import { useCart } from "../../context/CartContext"

type ProductTab = "overview" | "specs" | "reviews"

export default function ProductDetailPage() {
    const API_URL = import.meta.env.VITE_API_URL
    const { id } = useParams()
    const { addToCart } = useCart()


    const [product, setProduct] = useState<Product | null>(null)
    const [activeImage, setActiveImage] = useState(0)
    const [qty, setQty] = useState(1)
    const [activeTab, setActiveTab] = useState<ProductTab>("overview")
    const [wishlisted, setWishlisted] = useState(false)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function getProduct() {
            try {
                setLoading(true)
                setError("")

                const response = await fetch(
                    `${API_URL}/api/products/${id}`
                )

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error("Product not found")
                    }

                    throw new Error(`HTTP error: ${response.status}`)
                }

                const data = await response.json()

                setProduct(data)

                // Reset när en ny produkt laddas
                setActiveImage(0)
                setQty(1)
                setActiveTab("overview")
                setWishlisted(false)
            } catch (error) {
                console.error("Failed to fetch product:", error)

                if (error instanceof Error) {
                    setError(error.message)
                } else {
                    setError("Something went wrong")
                }
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            getProduct()
        }
    }, [API_URL, id])

    // Loading
    if (loading) {
        return (
            <main>
                <div className="container-wide py-20">
                    <p className="text-text-muted">
                        Loading product...
                    </p>
                </div>
            </main>
        )
    }

    // Error
    if (error) {
        return (
            <main>
                <div className="container-wide py-20">
                    <h1 className="font-serif text-3xl text-text">
                        {error}
                    </h1>

                    <Link
                        to="/products"
                        className="mt-4 inline-block text-primary no-underline hover:underline"
                    >
                        Back to products
                    </Link>
                </div>
            </main>
        )
    }

    // Ingen produkt
    if (!product) {
        return null
    }

    // Huvudbild + extra produktbilder
    const galleryImages = [
        product.image,
        ...product.images,
    ]

    const discount =
        product.original_price &&
            product.original_price > product.price
            ? Math.round(
                ((product.original_price - product.price) /
                    product.original_price) *
                100
            )
            : null

    const totalPrice = product.price * qty

    const categoryName = product.category_id.replace(/-/g, " ")

    return (
        <main>
            {/* Breadcrumb */}
            <div className="border-b border-border bg-surface">
                <div className="container-wide py-4">
                    <nav className="flex flex-wrap items-center gap-3 text-[13px] text-text-muted sm:gap-6">
                        <Link
                            to="/"
                            className="text-text-muted no-underline transition-colors hover:text-text"
                        >
                            Home
                        </Link>

                        <span>/</span>

                        <Link
                            to="/products"
                            className="text-text-muted no-underline transition-colors hover:text-text"
                        >
                            Products
                        </Link>

                        <span>/</span>

                        <Link
                            to={`/products?category=${product.category_id}`}
                            className="capitalize text-text-muted no-underline transition-colors hover:text-text"
                        >
                            {categoryName}
                        </Link>

                        <span>/</span>

                        <span className="text-text">
                            {product.name}
                        </span>
                    </nav>
                </div>
            </div>

            {/* Product */}
            <div className="container-wide pb-20 pt-10 lg:pt-12">
                <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">

                    {/* LEFT - Images */}
                    <div className="lg:sticky lg:top-24">

                        {/* Main image */}
                        <div className="aspect-4/3 overflow-hidden rounded-2xl border border-border bg-surface">
                            <img
                                src={galleryImages[activeImage]}
                                alt={product.name}
                                className="block h-full w-full object-cover"
                            />
                        </div>

                        {/* Thumbnails */}
                        {galleryImages.length > 1 && (
                            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                                {galleryImages.map((img, i) => (
                                    <button
                                        key={img}
                                        type="button"
                                        onClick={() => setActiveImage(i)}
                                        aria-label={`Show image ${i + 1}`}
                                        className={`
                                        h-16
                                        w-20
                                        shrink-0
                                        overflow-hidden
                                        rounded-lg
                                        border-2
                                        bg-surface
                                        p-0
                                        transition-colors
                                        ${activeImage === i
                                                ? "border-primary"
                                                : "border-border hover:border-border-strong"
                                            }
                    `}
                                    >
                                        <img
                                            src={img}
                                            alt={`${product.name} image ${i + 1}`}
                                            className="block h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT - Product information */}
                    <div>

                        {/* Badges */}
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                            {product.badge && (
                                <span className="rounded-md bg-primary/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                                    {product.badge}
                                </span>
                            )}

                            {!product.in_stock && (
                                <span className="rounded-md bg-surface-2 px-2.5 py-1 text-[11px] font-semibold uppercase text-text-muted">
                                    Sold Out
                                </span>
                            )}

                            {product.in_stock &&
                                product.stock_count !== null &&
                                product.stock_count <= 5 && (
                                    <span className="rounded-md border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-500">
                                        Only {product.stock_count} left
                                    </span>
                                )}
                        </div>

                        {/* Category */}
                        <Link
                            to={`/products?category=${product.category_id}`}
                            className="text-sm font-medium uppercase tracking-wider text-text-muted no-underline transition-colors hover:text-primary mb-2"
                        >
                            {categoryName}
                        </Link>

                        {/* Name */}
                        <h1 className="mb-2 font-serif text-[clamp(28px,3.5vw,42px)] font-normal leading-tight tracking-[-0.02em] text-text">
                            {product.name}
                        </h1>

                        {/* Tagline */}
                        <p className="mb-4 text-lg italic text-text-muted">
                            {product.tagline}
                        </p>

                        {/* Rating */}
                        <div className="mb-6 flex items-center gap-2 border-b border-border pb-6">
                            <span className="text-amber-400">
                                ★
                            </span>

                            <span className="text-sm font-semibold text-text">
                                {product.rating}
                            </span>

                            <span className="text-sm text-text-muted">
                                ({product.review_count.toLocaleString()} reviews)
                            </span>
                        </div>

                        {/* Price */}
                        <div className="mb-7 flex flex-wrap items-center gap-3">
                            <span className="text-3xl font-bold tracking-tight text-text">
                                €{product.price.toLocaleString()}
                            </span>

                            {product.original_price && (
                                <>
                                    <span className="text-lg text-text-muted line-through">
                                        €{product.original_price.toLocaleString()}
                                    </span>

                                    {discount && (
                                        <span className="rounded-md bg-red-500 px-2 py-1 text-xs font-bold text-white">
                                            -{discount}%
                                        </span>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Stock */}
                        <div className="mt-4">
                            {product.in_stock ? (
                                <p className="text-sm font-medium text-primary">
                                    ● In stock
                                </p>
                            ) : (
                                <p className="text-sm font-medium text-text-muted">
                                    Out of stock
                                </p>
                            )}
                        </div>

                        {/* Quantity */}
                        {product.in_stock === 1 && (
                            <div className="mt-8 flex items-center gap-4">
                                <span className="text-sm font-medium text-text-muted">
                                    Qty
                                </span>

                                <div className="flex overflow-hidden rounded-xl border border-border-strong">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setQty((q) => Math.max(1, q - 1))
                                        }
                                        className="flex h-10 w-10 items-center justify-center bg-transparent text-lg text-text transition-colors hover:bg-surface-2"
                                    >
                                        −
                                    </button>

                                    <span className="flex h-10 w-11 items-center justify-center border-x border-border-strong text-sm font-semibold text-text">
                                        {qty}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setQty((q) =>
                                                product.stock_count !== null
                                                    ? Math.min(product.stock_count, q + 1)
                                                    : q + 1
                                            )
                                        }
                                        disabled={
                                            product.stock_count !== null &&
                                            qty >= product.stock_count
                                        }
                                        className="flex h-10 w-10 items-center justify-center bg-transparent text-lg text-text transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* CTA */}
                        <div className="mt-5 flex gap-3">
                            <button
                                type="button"
                                onClick={() => addToCart(product.id, qty)}
                                disabled={!product.in_stock}
                                className="
                                flex-1
                                rounded-xl
                                bg-primary
                                px-6
                                py-4
                                font-semibold
                                text-white
                                transition-opacity
                                hover:opacity-90
                                disabled:cursor-not-allowed
                                disabled:bg-surface-2
                                disabled:text-text-muted
                                disabled:opacity-100
                                "
                            >
                                {product.in_stock
                                    ? `Add to Cart — €${totalPrice.toLocaleString()}`
                                    : "Sold Out"
                                }
                            </button>

                            {/* Wishlist */}
                            <button
                                type="button"
                                onClick={() =>
                                    setWishlisted((current) => !current)
                                }
                                aria-label={
                                    wishlisted
                                        ? "Remove from wishlist"
                                        : "Add to wishlist"
                                }
                                className={`
                                flex
                                w-14
                                items-center
                                justify-center
                                rounded-xl
                                border
                                transition-colors
                                ${wishlisted
                                        ? "border-red-500/30 bg-red-500/10 text-red-500"
                                        : "border-border-strong bg-surface text-text-muted hover:text-text"
                                    }
                `}
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill={wishlisted ? "currentColor" : "none"}
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                            </button>
                        </div>

                        {/* Trust badges */}
                        <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl border border-border bg-surface p-4">
                            <div className="text-center">
                                <div className="mb-1 text-lg">
                                    🚚
                                </div>

                                <p className="text-[11px] font-semibold text-text sm:text-xs">
                                    Free Shipping
                                </p>

                                <p className="mt-1 hidden text-[10px] text-text-muted sm:block">
                                    Orders over €150
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="mb-1 text-lg">
                                    🔒
                                </div>

                                <p className="text-[11px] font-semibold text-text sm:text-xs">
                                    Secure Payment
                                </p>

                                <p className="mt-1 hidden text-[10px] text-text-muted sm:block">
                                    SSL encrypted
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="mb-1 text-lg">
                                    ↩️
                                </div>

                                <p className="text-[11px] font-semibold text-text sm:text-xs">
                                    30-Day Returns
                                </p>

                                <p className="mt-1 hidden text-[10px] text-text-muted sm:block">
                                    Easy returns
                                </p>
                            </div>
                        </div>

                        {/* Colors */}
                        {product.colors && product.colors.length > 0 && (
                            <div className="mt-6">
                                <p className="mb-3 text-sm text-text-muted">
                                    Available colours
                                </p>

                                <div className="flex gap-2">
                                    {product.colors.map((color, i) => (
                                        <button
                                            key={`${color}-${i}`}
                                            type="button"
                                            aria-label={`Colour ${i + 1}`}
                                            className={`
                                            h-7
                                            w-7
                                            rounded-full
                                            border-2
                                            ${i === 0
                                                    ? "border-primary"
                                                    : "border-border-strong"
                                                }
                      `}
                                            style={{
                                                backgroundColor: color,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <section className="mt-20">
                    <div className="flex gap-1 overflow-x-auto border-b border-border">
                        {(["overview", "specs", "reviews"] as ProductTab[]).map(
                            (tab) => (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setActiveTab(tab)}
                                    className={`
                                    shrink-0
                                    border-b-2
                                    px-5
                                    py-4
                                    text-sm
                                    font-semibold
                                    capitalize
                                    transition-colors
                                    ${activeTab === tab
                                            ? "border-primary text-text"
                                            : "border-transparent text-text-muted hover:text-text"
                                        }
                  `}
                                >
                                    {tab}

                                    {tab === "reviews" &&
                                        ` (${product.review_count.toLocaleString()})`}
                                </button>
                            )
                        )}
                    </div>

                    {/* Overview */}
                    {activeTab === "overview" && (
                        <div className="grid gap-12 py-10 md:grid-cols-2">

                            {/* Description */}
                            <div>
                                <h2 className="mb-4 font-serif text-2xl text-text">
                                    Overview
                                </h2>

                                <p className="leading-8 text-text-muted">
                                    {product.description}
                                </p>

                                {/* Tags */}
                                {product.tags.length > 0 && (
                                    <div className="mt-6 flex flex-wrap gap-2">
                                        {product.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-text-muted"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Features */}
                            <div>
                                <h2 className="mb-4 font-serif text-2xl text-text">
                                    Features
                                </h2>

                                {product.features.length > 0 ? (
                                    <ul className="space-y-3">
                                        {product.features.map((feature) => (
                                            <li
                                                key={feature}
                                                className="flex gap-3 leading-6 text-text-muted"
                                            >
                                                <span className="shrink-0 font-semibold text-primary">
                                                    ↗
                                                </span>

                                                <span>
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-text-muted">
                                        No features available.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Specs */}
                    {activeTab === "specs" && (
                        <div className="py-10">
                            <div className="max-w-3xl overflow-hidden rounded-xl border border-border">
                                {product.specs.length > 0 ? (
                                    <table className="w-full border-collapse">
                                        <tbody>
                                            {product.specs.map((spec, i) => (
                                                <tr
                                                    key={`${spec.label}-${i}`}
                                                    className="border-b border-border last:border-b-0"
                                                >
                                                    <td
                                                        className={`
                                                        w-[40%]
                                                        px-4
                                                        py-4
                                                        text-sm
                                                        font-semibold
                                                        text-text-muted
                                                        ${i % 2 === 0 ? "bg-surface" : ""}
                                                    `}
                                                    >
                                                        {spec.label}
                                                    </td>

                                                    <td
                                                        className={`
                                                        px-4
                                                        py-4
                                                        text-sm
                                                        text-text
                                                        ${i % 2 === 0 ? "bg-surface" : ""}
                                                    `}
                                                    >
                                                        {spec.value}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="p-6 text-text-muted">
                                        No specifications available.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Reviews */}
                    {activeTab === "reviews" && (
                        <div className="py-10">
                            <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
                                <div className="mb-4 text-4xl">
                                    ★
                                </div>

                                <h2 className="font-serif text-2xl text-text">
                                    {product.review_count.toLocaleString()} reviews
                                </h2>

                                <p className="mt-2 text-text-muted">
                                    Average rating {product.rating}/5
                                </p>

                                <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-text-muted">
                                    Individual customer reviews will be added here
                                    when the review system is connected.
                                </p>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}