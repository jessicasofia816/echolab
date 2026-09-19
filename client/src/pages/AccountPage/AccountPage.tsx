import {
    Link,
    Navigate,
    useSearchParams,
} from "react-router"
import {
    useEffect,
    useState,
} from "react"
import { useAuth } from "../../context/AuthContext"
import { useWishlist } from "../../context/WishlistContext"
import ProductCard from "../../components/ProductCard"
import { useCart } from "../../context/CartContext"
import type { Order } from "../../types/Order"

type AccountTab =
    | "overview"
    | "orders"
    | "wishlist"
    | "settings"

export default function AccountPage() {
    const { user, loading } = useAuth()
    const { wishlist } = useWishlist()
    const { cart } = useCart()

    const API_URL = import.meta.env.VITE_API_URL

    const [orders, setOrders] =
        useState<Order[]>([])

    const [ordersLoading, setOrdersLoading] =
        useState(true)

    const [searchParams, setSearchParams] =
        useSearchParams()

    const activeTab =
        (searchParams.get("tab") as AccountTab) ||
        "overview"

    const cartCount = cart.reduce(
        (total, item) =>
            total + item.quantity,
        0
    )

    function setTab(tab: AccountTab) {
        setSearchParams({ tab })
    }

    useEffect(() => {
        if (!user) {
            setOrders([])
            setOrdersLoading(false)
            return
        }

        async function getOrders() {
            try {
                setOrdersLoading(true)

                const response = await fetch(
                    `${API_URL}/api/orders`,
                    {
                        credentials: "include",
                    }
                )

                if (!response.ok) {
                    throw new Error(
                        "Failed to fetch orders"
                    )
                }

                const data = await response.json()

                setOrders(data)
            } catch (error) {
                console.error(
                    "Failed to fetch orders:",
                    error
                )

                setOrders([])
            } finally {
                setOrdersLoading(false)
            }
        }

        getOrders()
    }, [API_URL, user])

    if (loading) {
        return (
            <main className="min-h-screen">
                <div className="container-wide py-20">
                    <p className="text-text-muted">
                        Loading account...
                    </p>
                </div>
            </main>
        )
    }

    if (!user) {
        return (
            <Navigate
                to="/auth"
                replace
            />
        )
    }

    const initials = user.email
        .slice(0, 2)
        .toUpperCase()

    const memberSince = user.created_at
        ? new Date(
            user.created_at
        ).getFullYear()
        : null

    const tabs: {
        id: AccountTab
        label: string
    }[] = [
            {
                id: "overview",
                label: "Overview",
            },
            {
                id: "orders",
                label: "Orders",
            },
            {
                id: "wishlist",
                label: `Wishlist (${wishlist.length})`,
            },
            {
                id: "settings",
                label: "Settings",
            },
        ]

    return (
        <main className="min-h-screen bg-background">
            {/* Account header */}
            <section className="border-b border-border bg-surface">
                <div className="container-wide pt-10">
                    {/* User */}
                    <div className="mb-8 flex items-center gap-4">
                        <div
                            className="
                flex
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                rounded-full
                border-2
                border-primary/25
                bg-primary/10
                font-mono
                text-lg
                font-bold
                text-primary
              "
                        >
                            {initials}
                        </div>

                        <div className="min-w-0">
                            <h1 className="text-xl font-bold tracking-tight text-text">
                                My Account
                            </h1>

                            <p className="mt-1 truncate text-sm text-text-muted">
                                {user.email}

                                {memberSince && (
                                    <>
                                        {" · "}
                                        Member since {memberSince}
                                    </>
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <nav className="flex gap-1 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setTab(tab.id)}
                                className={`
                  shrink-0
                  border-b-2
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  transition-colors
                  ${activeTab === tab.id
                                        ? "border-primary text-text"
                                        : "border-transparent text-text-muted hover:text-text"
                                    }
                `}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </section>

            {/* Content */}
            <div className="container-wide py-10">
                {/* OVERVIEW */}
                {activeTab === "overview" && (
                    <section>
                        <h2 className="mb-6 font-serif text-2xl text-text">
                            Overview
                        </h2>

                        {/* Stats */}
                        <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
                            <button
                                type="button"
                                onClick={() => setTab("orders")}
                                className="text-left"
                            >
                                <StatCard
                                    label="Orders"
                                    value={orders.length.toString()}
                                />
                            </button>

                            <button
                                type="button"
                                onClick={() => setTab("wishlist")}
                                className="text-left"
                            >
                                <StatCard
                                    label="Wishlist"
                                    value={wishlist.length.toString()}
                                />
                            </button>

                            <Link
                                to="/cart"
                                className="text-left no-underline"
                            >
                                <StatCard
                                    label="Cart"
                                    value={cartCount.toString()}
                                />
                            </Link>

                            <StatCard
                                label="Member Since"
                                value={
                                    memberSince
                                        ? memberSince.toString()
                                        : "—"
                                }
                            />
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            {/* Orders preview */}
                            <div className="overflow-hidden rounded-2xl border border-border bg-surface">
                                <div className="flex items-center justify-between border-b border-border px-6 py-5">
                                    <h3 className="font-semibold text-text">
                                        Recent Orders
                                    </h3>

                                    <button
                                        type="button"
                                        onClick={() => setTab("orders")}
                                        className="text-sm font-medium text-primary transition-opacity hover:opacity-80"
                                    >
                                        View all →
                                    </button>
                                </div>

                                <div className="px-6 py-12 text-center">
                                    <p className="text-sm text-text-muted">
                                        You haven't placed any orders yet.
                                    </p>

                                    <Link
                                        to="/products"
                                        className="mt-3 inline-block text-sm font-semibold text-primary no-underline hover:underline"
                                    >
                                        Browse products →
                                    </Link>
                                </div>
                            </div>

                            {/* Wishlist preview */}
                            <div className="overflow-hidden rounded-2xl border border-border bg-surface">
                                <div className="flex items-center justify-between border-b border-border px-6 py-5">
                                    <h3 className="font-semibold text-text">
                                        Wishlist
                                    </h3>

                                    <button
                                        type="button"
                                        onClick={() => setTab("wishlist")}
                                        className="text-sm font-medium text-primary transition-opacity hover:opacity-80"
                                    >
                                        View all →
                                    </button>
                                </div>

                                {wishlist.length === 0 ? (
                                    <div className="px-6 py-12 text-center">
                                        <div className="mb-3 text-3xl text-text-muted">
                                            ♡
                                        </div>

                                        <p className="text-sm text-text-muted">
                                            No saved items yet.
                                        </p>

                                        <Link
                                            to="/products"
                                            className="mt-3 inline-block text-sm font-semibold text-primary no-underline hover:underline"
                                        >
                                            Browse products →
                                        </Link>
                                    </div>
                                ) : (
                                    <div>
                                        {wishlist
                                            .slice(0, 2)
                                            .map((product) => (
                                                <Link
                                                    key={product.id}
                                                    to={`/products/${product.id}`}
                                                    className="
                            flex
                            items-center
                            gap-4
                            border-b
                            border-border
                            px-6
                            py-4
                            text-inherit
                            no-underline
                            transition-colors
                            last:border-b-0
                            hover:bg-surface-2
                          "
                                                >
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="
                              h-12
                              w-16
                              shrink-0
                              rounded-lg
                              bg-surface-2
                              object-cover
                            "
                                                    />

                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-semibold text-text">
                                                            {product.name}
                                                        </p>

                                                        <p className="mt-0.5 truncate text-xs text-text-muted">
                                                            {product.tagline}
                                                        </p>
                                                    </div>

                                                    <span className="shrink-0 font-mono text-sm font-bold text-primary">
                                                        €{product.price.toLocaleString()}
                                                    </span>
                                                </Link>
                                            ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* ORDERS */}
                {activeTab === "orders" && (
                    <section>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-text">
                                Orders
                            </h2>

                            <p className="mt-1 text-sm text-text-muted">
                                View your previous EchoLab orders.
                            </p>
                        </div>

                        {ordersLoading ? (
                            <div className="rounded-2xl border border-border bg-surface p-8">
                                <p className="text-sm text-text-muted">
                                    Loading orders...
                                </p>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="rounded-2xl border border-border bg-surface p-8 text-center">
                                <h3 className="font-semibold text-text">
                                    No orders yet
                                </h3>

                                <p className="mt-2 text-sm text-text-muted">
                                    When you place an order, it will appear here.
                                </p>

                                <Link
                                    to="/products"
                                    className="mt-5 inline-block rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white no-underline"
                                >
                                    Browse Products
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {orders.map((order) => (
                                    <article
                                        key={order.id}
                                        className="overflow-hidden rounded-2xl border border-border bg-surface"
                                    >
                                        {/* Order header */}
                                        <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <h3 className="font-bold text-text">
                                                        Order #{order.id}
                                                    </h3>

                                                    <span className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-semibold text-text-muted">
                                                        {order.status}
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-sm text-text-muted">
                                                    {new Date(order.created_at).toLocaleDateString(
                                                        "en-GB",
                                                        {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </p>
                                            </div>

                                            <div className="sm:text-right">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                                                    Total
                                                </p>

                                                <p className="mt-1 font-mono text-lg font-bold text-text">
                                                    €{order.total.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Products */}
                                        <div className="p-5">
                                            <h4 className="mb-4 text-sm font-bold text-text">
                                                Items
                                            </h4>

                                            <div className="space-y-3">
                                                {order.items.map((item) => (
                                                    <div
                                                        key={item.product_id}
                                                        className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface-2 p-4"
                                                    >
                                                        <div className="min-w-0">
                                                            <Link
                                                                to={`/products/${item.product_id}`}
                                                                className="font-semibold text-text no-underline hover:text-primary"
                                                            >
                                                                {item.product_name}
                                                            </Link>

                                                            <p className="mt-1 text-xs text-text-muted">
                                                                Quantity: {item.quantity}
                                                            </p>
                                                        </div>

                                                        <span className="shrink-0 font-mono text-sm font-semibold text-text">
                                                            €
                                                            {(item.price * item.quantity).toFixed(
                                                                2
                                                            )}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Shipping + contact */}
                                        <div className="grid gap-6 border-t border-border p-5 md:grid-cols-2">
                                            <div>
                                                <h4 className="text-sm font-bold text-text">
                                                    Contact
                                                </h4>

                                                <div className="mt-3 space-y-1 text-sm text-text-muted">
                                                    <p>
                                                        {order.contact.firstName}{" "}
                                                        {order.contact.lastName}
                                                    </p>

                                                    <p>
                                                        {order.contact.email}
                                                    </p>

                                                    {order.contact.phone && (
                                                        <p>
                                                            {order.contact.phone}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-bold text-text">
                                                    Shipping address
                                                </h4>

                                                <div className="mt-3 space-y-1 text-sm text-text-muted">
                                                    <p>
                                                        {order.shippingAddress.address}
                                                    </p>

                                                    <p>
                                                        {order.shippingAddress.postcode}{" "}
                                                        {order.shippingAddress.city}
                                                    </p>

                                                    <p>
                                                        {order.shippingAddress.country}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price breakdown */}
                                        <div className="border-t border-border bg-surface-2 p-5">
                                            <div className="ml-auto max-w-xs space-y-2 text-sm">
                                                <OrderPriceRow
                                                    label="Subtotal"
                                                    value={order.subtotal}
                                                />

                                                <OrderPriceRow
                                                    label="Shipping"
                                                    value={order.shipping}
                                                    free={order.shipping === 0}
                                                />

                                                <OrderPriceRow
                                                    label="VAT"
                                                    value={order.tax}
                                                />

                                                <div className="flex items-center justify-between border-t border-border pt-3">
                                                    <span className="font-bold text-text">
                                                        Total
                                                    </span>

                                                    <span className="font-mono font-bold text-text">
                                                        €{order.total.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                )}
                {/* WISHLIST */}
                {activeTab === "wishlist" && (
                    <section>
                        <div className="mb-6 flex items-end justify-between gap-4">
                            <div>
                                <h2 className="font-serif text-2xl text-text">
                                    Saved Items
                                </h2>

                                <p className="mt-1 text-sm text-text-muted">
                                    {wishlist.length === 1
                                        ? "1 saved product"
                                        : `${wishlist.length} saved products`}
                                </p>
                            </div>
                        </div>

                        {wishlist.length === 0 ? (
                            <div className="rounded-2xl border border-border bg-surface px-6 py-20 text-center">
                                <div className="mb-4 text-5xl text-text-muted">
                                    ♡
                                </div>

                                <h3 className="text-xl font-semibold text-text">
                                    Your wishlist is empty
                                </h3>

                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-muted">
                                    Save products you love to find them
                                    easily later.
                                </p>

                                <Link
                                    to="/products"
                                    className="
                    mt-6
                    inline-flex
                    rounded-xl
                    bg-primary
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    no-underline
                    transition-opacity
                    hover:opacity-90
                  "
                                >
                                    Browse Products
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {wishlist.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/* SETTINGS */}
                {activeTab === "settings" && (
                    <section className="max-w-xl">
                        <h2 className="mb-6 font-serif text-2xl text-text">
                            Account Settings
                        </h2>

                        <div className="rounded-2xl border border-border bg-surface p-6">
                            <h3 className="mb-5 font-semibold text-text">
                                Account Information
                            </h3>

                            <div>
                                <label
                                    htmlFor="account-email"
                                    className="mb-2 block text-sm font-medium text-text-muted"
                                >
                                    Email
                                </label>

                                <input
                                    id="account-email"
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="
                    w-full
                    rounded-xl
                    border
                    border-border-strong
                    bg-background
                    px-4
                    py-3
                    text-sm
                    text-text
                    outline-none
                    disabled:cursor-not-allowed
                    disabled:opacity-70
                  "
                                />
                            </div>

                            <p className="mt-4 text-xs leading-5 text-text-muted">
                                Editing account information will be
                                added later.
                            </p>
                        </div>
                    </section>
                )}
            </div>
        </main>
    )
}

function StatCard({
    label,
    value,
}: {
    label: string
    value: string
}) {
    return (
        <div
            className="
        h-full
        rounded-2xl
        border
        border-border
        bg-surface
        p-5
        transition-all
        hover:border-border-strong
        hover:bg-surface-2
      "
        >
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-text-muted">
                {label}
            </p>

            <p className="font-mono text-2xl font-bold tracking-tight text-text">
                {value}
            </p>
        </div>
    )
}
function OrderPriceRow({
    label,
    value,
    free = false,
}: {
    label: string
    value: number
    free?: boolean
}) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-text-muted">
                {label}
            </span>

            <span
                className={`font-mono ${free
                    ? "font-semibold text-green-500"
                    : "text-text"
                    }`}
            >
                {free
                    ? "Free"
                    : `€${value.toFixed(2)}`}
            </span>
        </div>
    )
}