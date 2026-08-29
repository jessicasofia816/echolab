import { Link } from "react-router"
import { useCart } from "../../context/CartContext"

export default function CartPage() {
    const {
        cart,
        updateQuantity,
        removeFromCart,
    } = useCart()

    const cartCount = cart.reduce(
        (total, item) => total + item.quantity,
        0
    )

    if (cart.length === 0) {
        return (
            <main className="min-h-screen bg-background">
                <div className="container-wide py-20">
                    <div className="rounded-2xl border border-border bg-surface px-8 py-20 text-center">
                        <div className="mb-5 text-6xl">
                            🛒
                        </div>

                        <h1 className="font-serif text-4xl font-normal text-text">
                            Your cart is empty
                        </h1>

                        <p className="mt-3 text-text-muted">
                            Browse our products and add something
                            extraordinary to your setup.
                        </p>

                        <Link
                            to="/products"
                            className="mt-8 inline-flex rounded-xl bg-primary px-7 py-3.5 font-semibold text-white no-underline transition-opacity hover:opacity-90"
                        >
                            Explore Products →
                        </Link>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-background">
            <div className="container-wide py-12">
                <h1 className="font-serif text-[clamp(28px,4vw,42px)] font-normal tracking-tight text-text">
                    Your Cart
                </h1>

                <p className="mb-10 mt-2 text-sm text-text-muted">
                    {cartCount} item{cartCount !== 1 ? "s" : ""}
                </p>

                <div className="overflow-hidden rounded-2xl border border-border bg-surface">
                    {cart.map((item, index) => (
                        <div
                            key={item.productId}
                            className={`
                flex
                items-center
                gap-5
                p-5
                ${index < cart.length - 1
                                    ? "border-b border-border"
                                    : ""
                                }
              `}
                        >
                            {/* Image */}
                            <Link
                                to={`/products/${item.product.id}`}
                                className="shrink-0"
                            >
                                <div className="h-17 w-22.5 overflow-hidden rounded-lg bg-surface-2">
                                    <img
                                        src={item.product.image}
                                        alt={item.product.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </Link>

                            {/* Product info */}
                            <div className="min-w-0 flex-1">
                                <Link
                                    to={`/products/${item.product.id}`}
                                    className="no-underline"
                                >
                                    <h2 className="text-[15px] font-bold text-text transition-colors hover:text-primary">
                                        {item.product.name}
                                    </h2>
                                </Link>

                                <p className="mt-1 text-xs capitalize text-text-muted">
                                    {item.product.category_id.replace(
                                        /-/g,
                                        " "
                                    )}
                                </p>

                                <div className="mt-3 flex flex-wrap items-center gap-3">
                                    {/* Quantity */}
                                    <div className="flex overflow-hidden rounded-lg border border-border-strong">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateQuantity(
                                                    item.productId,
                                                    item.quantity - 1
                                                )
                                            }
                                            disabled={item.quantity <= 1}
                                            className="flex h-8 w-8 items-center justify-center bg-transparent text-text transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            −
                                        </button>

                                        <span className="flex h-8 w-8 items-center justify-center border-x border-border-strong text-sm font-semibold text-text">
                                            {item.quantity}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateQuantity(
                                                    item.productId,
                                                    item.quantity + 1
                                                )
                                            }
                                            className="flex h-8 w-8 items-center justify-center bg-transparent text-text transition-colors hover:bg-surface-2"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Remove */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeFromCart(item.productId)
                                        }
                                        className="bg-transparent text-xs text-text-muted transition-colors hover:text-red-500"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="shrink-0 text-right">
                                <p className="font-bold text-text">
                                    €
                                    {(
                                        item.product.price *
                                        item.quantity
                                    ).toLocaleString()}
                                </p>

                                {item.quantity > 1 && (
                                    <p className="mt-1 text-xs text-text-muted">
                                        €
                                        {item.product.price.toLocaleString()}{" "}
                                        each
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <Link
                    to="/products"
                    className="mt-5 inline-flex text-sm font-medium text-text-muted no-underline transition-colors hover:text-primary"
                >
                    ← Continue Shopping
                </Link>
            </div>
        </main>
    )
}