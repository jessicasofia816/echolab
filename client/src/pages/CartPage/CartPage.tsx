import { Link } from "react-router"
import { useCart } from "../../context/CartContext"

export default function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart()

  // Totalt antal produkter
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  )

  // Subtotal
  const cartTotal = cart.reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0
  )

  // Shipping
  const shipping = cartTotal >= 150 ? 0 : 14.9

  // VAT
  const tax = cartTotal * 0.21

  // Total
  const total = cartTotal + shipping + tax

  // Empty cart
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
              className="
                mt-8
                inline-flex
                items-center
                justify-center
                rounded-xl
                bg-primary
                px-7
                py-3.5
                font-semibold
                text-white
                no-underline
                transition-opacity
                hover:opacity-90
              "
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

        {/* Header */}
        <div className="mb-10">
          <h1 className="font-serif text-[clamp(28px,4vw,42px)] font-normal tracking-tight text-text">
            Your Cart
          </h1>

          <div className="mt-2 flex items-center justify-between gap-4">
            <p className="text-sm text-text-muted">
              {cartCount} item
              {cartCount !== 1 ? "s" : ""}
            </p>

            <button
              type="button"
              onClick={clearCart}
              className="
                bg-transparent
                text-xs
                font-medium
                text-text-muted
                transition-colors
                hover:text-red-500
              "
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Cart layout */}
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_360px]">

          {/* LEFT */}
          <div>
            {/* Cart items */}
            <div className="overflow-hidden rounded-2xl border border-border bg-surface">
              {cart.map((item, index) => (
                <div
                  key={item.productId}
                  className={`
                    flex
                    items-center
                    gap-4
                    p-4
                    sm:gap-5
                    sm:p-5
                    ${
                      index < cart.length - 1
                        ? "border-b border-border"
                        : ""
                    }
                  `}
                >
                  {/* Product image */}
                  <Link
                    to={`/products/${item.product.id}`}
                    className="shrink-0"
                  >
                    <div className="h-17 w-[9w-22.5rflow-hidden rounded-lg bg-surface-2">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="block h-full w-full object-cover"
                      />
                    </div>
                  </Link>

                  {/* Product information */}
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/products/${item.product.id}`}
                      className="no-underline"
                    >
                      <h2 className="truncate text-[15px] font-bold text-text transition-colors hover:text-primary">
                        {item.product.name}
                      </h2>
                    </Link>

                    <p className="mt-1 text-xs capitalize text-text-muted">
                      {item.product.category_id.replace(
                        /-/g,
                        " "
                      )}
                    </p>

                    {/* Controls */}
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
                          aria-label={`Decrease quantity of ${item.product.name}`}
                          className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            bg-transparent
                            text-text
                            transition-colors
                            hover:bg-surface-2
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                          "
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
                          disabled={
                            item.product.stock_count !== null &&
                            item.quantity >=
                              item.product.stock_count
                          }
                          aria-label={`Increase quantity of ${item.product.name}`}
                          className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            bg-transparent
                            text-text
                            transition-colors
                            hover:bg-surface-2
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                          "
                        >
                          +
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(
                            item.productId
                          )
                        }
                        className="
                          bg-transparent
                          text-xs
                          text-text-muted
                          transition-colors
                          hover:text-red-500
                        "
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

            {/* Continue shopping */}
            <Link
              to="/products"
              className="
                mt-5
                inline-flex
                items-center
                text-sm
                font-medium
                text-text-muted
                no-underline
                transition-colors
                hover:text-primary
              "
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* RIGHT - Order Summary */}
          <aside className="rounded-2xl border border-border bg-surface p-7 lg:sticky lg:top-24">
            <h2 className="mb-6 text-lg font-bold text-text">
              Order Summary
            </h2>

            {/* Summary */}
            <div className="space-y-3">
              <SummaryRow
                label="Subtotal"
                value={`€${cartTotal.toLocaleString(
                  "en",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}`}
              />

              <SummaryRow
                label="Shipping"
                value={
                  shipping === 0
                    ? "Free"
                    : `€${shipping.toFixed(2)}`
                }
                highlight={shipping === 0}
              />

              <SummaryRow
                label="VAT (21%)"
                value={`€${tax.toLocaleString(
                  "en",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}`}
              />
            </div>

            {/* Total */}
            <div className="my-5 border-t border-border pt-4">
              <SummaryRow
                label="Total"
                value={`€${total.toLocaleString(
                  "en",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}`}
                large
              />
            </div>

            {/* Free shipping message */}
            {shipping > 0 && (
              <div className="mb-5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3.5 py-2.5 text-xs text-amber-500">
                Add €
                {(150 - cartTotal).toFixed(2)}{" "}
                more for free shipping
              </div>
            )}

            {/* Checkout */}
            <Link
              to="/checkout"
              className="
                flex
                w-full
                items-center
                justify-center
                rounded-xl
                bg-primary
                px-5
                py-4
                text-[15px]
                font-bold
                text-white
                no-underline
                transition-opacity
                hover:opacity-90
              "
            >
              Proceed to Checkout →
            </Link>

            {/* Payment methods */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {[
                "Visa",
                "MC",
                "AMEX",
                "PayPal",
              ].map((payment) => (
                <span
                  key={payment}
                  className="
                    rounded
                    border
                    border-border
                    bg-surface-2
                    px-2
                    py-1
                    text-[10px]
                    font-bold
                    text-text-muted
                  "
                >
                  {payment}
                </span>
              ))}
            </div>

            {/* Security */}
            <p className="mt-4 text-center text-[11px] text-text-muted">
              🔒 Secure checkout
            </p>
          </aside>
        </div>
      </div>
    </main>
  )
}

type SummaryRowProps = {
  label: string
  value: string
  large?: boolean
  highlight?: boolean
}

function SummaryRow({
  label,
  value,
  large = false,
  highlight = false,
}: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className={
          large
            ? "font-bold text-text"
            : "text-sm text-text-muted"
        }
      >
        {label}
      </span>

      <span
        className={`
          ${large ? "text-lg font-bold" : "text-sm"}
          ${
            highlight
              ? "text-primary"
              : "text-text"
          }
        `}
      >
        {value}
      </span>
    </div>
  )
}