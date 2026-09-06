import {
    useEffect,
    useState,
    type ReactNode,
} from "react"
import {
    Link,
    Navigate,
} from "react-router"

import { useAuth } from "../../context/AuthContext"
import { useCart } from "../../context/CartContext"

type Step =
    | "contact"
    | "shipping"
    | "payment"
    | "confirm"

const STEPS: {
    id: Step
    label: string
}[] = [
        {
            id: "contact",
            label: "Contact",
        },
        {
            id: "shipping",
            label: "Shipping",
        },
        {
            id: "payment",
            label: "Payment",
        },
        {
            id: "confirm",
            label: "Confirm",
        },
    ]

const API_URL =
    import.meta.env.VITE_API_URL

export default function CheckoutPage() {
    const {
        user,
        loading,
    } = useAuth()

    const {
        cart,
        clearCart,
    } = useCart()

    const [step, setStep] =
        useState<Step>("contact")

    const [
        placingOrder,
        setPlacingOrder,
    ] = useState(false)

    const [
        orderId,
        setOrderId,
    ] = useState<number | null>(
        null
    )

    const [error, setError] =
        useState("")

    const [
        contact,
        setContact,
    ] = useState({
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
    })

    const [
        shipping,
        setShipping,
    ] = useState({
        address: "",
        city: "",
        postcode: "",
        country: "Sweden",
    })

    const [
        payment,
        setPayment,
    ] = useState({
        cardNumber: "",
        expiry: "",
        cvv: "",
        name: "",
    })

    /*
      Auth kan fortfarande ladda när
      CheckoutPage först renderas.
  
      Därför fyller vi email här när
      användaren finns.
    */
    useEffect(() => {
        if (!user) {
            return
        }

        setContact((current) => {
            if (current.email) {
                return current
            }

            return {
                ...current,
                email: user.email,
            }
        })
    }, [user])

    /*
      Cart total
    */
    const subtotal =
        cart.reduce(
            (
                total,
                item
            ) =>
                total +
                item.product.price *
                item.quantity,
            0
        )

    const shippingCost =
        subtotal >= 150
            ? 0
            : 14.9

    const tax =
        subtotal * 0.21

    const total =
        subtotal +
        shippingCost +
        tax

    const stepIndex =
        STEPS.findIndex(
            (currentStep) =>
                currentStep.id === step
        )

    /*
      CONTACT VALIDATION
    */
    function continueToShipping() {
        const firstName =
            contact.firstName.trim()

        const lastName =
            contact.lastName.trim()

        const email =
            contact.email.trim()

        if (
            !firstName ||
            !lastName ||
            !email
        ) {
            setError(
                "Please enter your first name, last name and email address."
            )
            return
        }

        const emailIsValid =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                email
            )

        if (!emailIsValid) {
            setError(
                "Please enter a valid email address."
            )
            return
        }

        setError("")
        setStep("shipping")
    }

    /*
      SHIPPING VALIDATION
    */
    function continueToPayment() {
        if (
            !shipping.address.trim() ||
            !shipping.city.trim() ||
            !shipping.postcode.trim() ||
            !shipping.country.trim()
        ) {
            setError(
                "Please complete your shipping address."
            )
            return
        }

        setError("")
        setStep("payment")
    }

    /*
      PAYMENT VALIDATION
  
      Detta är fortfarande demo-payment.
      Vi gör bara grundläggande frontend-
      kontroll.
    */
    function continueToConfirm() {
        const cardNumber =
            payment.cardNumber.replace(
                /\s/g,
                ""
            )

        const expiry =
            payment.expiry.trim()

        const cvv =
            payment.cvv.trim()

        const name =
            payment.name.trim()

        if (
            !cardNumber ||
            !expiry ||
            !cvv ||
            !name
        ) {
            setError(
                "Please complete your payment details."
            )
            return
        }

        if (
            !/^\d{12,19}$/.test(
                cardNumber
            )
        ) {
            setError(
                "Please enter a valid card number."
            )
            return
        }

        if (
            !/^\d{2}\/\d{2}$/.test(
                expiry
            )
        ) {
            setError(
                "Please enter the expiry date as MM/YY."
            )
            return
        }

        if (
            !/^\d{3,4}$/.test(cvv)
        ) {
            setError(
                "Please enter a valid CVV."
            )
            return
        }

        setError("")
        setStep("confirm")
    }

    /*
      CREATE ORDER
    */
    async function handlePlaceOrder() {
        try {
            setPlacingOrder(true)
            setError("")

            const response = await fetch(
                `${API_URL}/api/orders`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        contact,
                        shipping,
                    }),
                }
            )

            const data =
                await response.json()

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to create order"
                )
            }

            setOrderId(
                data.order.id
            )

            /*
              Backend har redan tömt
              session cart.
      
              Detta synkar frontendens
              CartContext.
            */
            await clearCart()
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong"
            )
        } finally {
            setPlacingOrder(false)
        }
    }

    /*
      AUTH LOADING
    */
    if (loading) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center px-4">
                <p className="text-sm text-text-muted">
                    Loading checkout...
                </p>
            </main>
        )
    }

    /*
      USER MUST BE LOGGED IN
    */
    if (!user) {
        return (
            <Navigate
                to="/auth"
                replace
            />
        )
    }

    /*
      ORDER SUCCESS
    */
    if (orderId) {
        return (
            <main className="flex min-h-[75vh] items-center justify-center px-4 py-16">
                <div className="mx-auto max-w-xl text-center">
                    <div
                        className="
              mx-auto
              mb-6
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              border
              border-green-500/30
              bg-green-500/10
              text-3xl
              font-bold
              text-green-500
            "
                    >
                        ✓
                    </div>

                    <h1 className="font-serif text-4xl text-text">
                        Order placed!
                    </h1>

                    <p className="mt-4 leading-7 text-text-muted">
                        Thank you for your
                        order. We'll send a
                        confirmation to{" "}
                        <span className="font-semibold text-text">
                            {contact.email}
                        </span>
                        .
                    </p>

                    <p className="mt-2 text-sm text-text-muted">
                        Order #{orderId} ·
                        Expected delivery:
                        3–5 business days
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <Link
                            to="/account?tab=orders"
                            className="
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
                            View Order
                        </Link>

                        <Link
                            to="/products"
                            className="
                rounded-xl
                border
                border-border-strong
                bg-surface-2
                px-5
                py-3
                text-sm
                font-semibold
                text-text
                no-underline
                transition-colors
                hover:bg-surface
              "
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </main>
        )
    }

    /*
      EMPTY CART
    */
    if (
        cart.length === 0
    ) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center px-4">
                <div className="text-center">
                    <p className="text-text-muted">
                        Your cart is empty.
                    </p>

                    <Link
                        to="/products"
                        className="mt-4 inline-block font-semibold text-primary no-underline"
                    >
                        Browse products →
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 text-sm">
                        <Link
                            to="/"
                            className="font-semibold text-text no-underline transition-colors hover:text-primary"
                        >
                            EchoLab
                        </Link>

                        <span className="text-text-muted">
                            /
                        </span>

                        <span className="text-text-muted">
                            Checkout
                        </span>
                    </div>
                </div>

                {/* Progress */}
                <div className="mb-12 overflow-x-auto">
                    <div className="flex min-w-max items-center">
                        {STEPS.map(
                            (
                                currentStep,
                                index
                            ) => {
                                const completed =
                                    index <
                                    stepIndex

                                const active =
                                    index ===
                                    stepIndex

                                return (
                                    <div
                                        key={
                                            currentStep.id
                                        }
                                        className="flex items-center"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (
                                                    completed
                                                ) {
                                                    setError(
                                                        ""
                                                    )

                                                    setStep(
                                                        currentStep.id
                                                    )
                                                }
                                            }}
                                            disabled={
                                                !completed &&
                                                !active
                                            }
                                            className={`
                        flex
                        items-center
                        gap-2
                        rounded-lg
                        px-2
                        py-2
                        text-sm
                        ${completed
                                                    ? "cursor-pointer text-text"
                                                    : active
                                                        ? "text-text"
                                                        : "cursor-default text-text-muted"
                                                }
                      `}
                                        >
                                            <span
                                                className={`
                          flex
                          h-7
                          w-7
                          items-center
                          justify-center
                          rounded-full
                          border
                          text-xs
                          font-bold
                          ${completed
                                                        ? "border-green-500 bg-green-500 text-white"
                                                        : active
                                                            ? "border-primary bg-primary text-white"
                                                            : "border-border bg-surface-2 text-text-muted"
                                                    }
                        `}
                                            >
                                                {completed
                                                    ? "✓"
                                                    : index +
                                                    1}
                                            </span>

                                            <span
                                                className={
                                                    active
                                                        ? "font-bold"
                                                        : "font-medium"
                                                }
                                            >
                                                {
                                                    currentStep.label
                                                }
                                            </span>
                                        </button>

                                        {index <
                                            STEPS.length -
                                            1 && (
                                                <div className="mx-2 h-px w-8 bg-border sm:w-14" />
                                            )}
                                    </div>
                                )
                            }
                        )}
                    </div>
                </div>

                <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
                    {/* Checkout form */}
                    <section>
                        {/* CONTACT */}
                        {step ===
                            "contact" && (
                                <FormSection
                                    title="Contact Information"
                                    error={error}
                                >
                                    <InputRow>
                                        <Field
                                            label="First name"
                                            value={
                                                contact.firstName
                                            }
                                            autoComplete="given-name"
                                            onChange={(
                                                value
                                            ) => {
                                                setError(
                                                    ""
                                                )

                                                setContact(
                                                    (
                                                        current
                                                    ) => ({
                                                        ...current,
                                                        firstName:
                                                            value,
                                                    })
                                                )
                                            }}
                                        />

                                        <Field
                                            label="Last name"
                                            value={
                                                contact.lastName
                                            }
                                            autoComplete="family-name"
                                            onChange={(
                                                value
                                            ) => {
                                                setError(
                                                    ""
                                                )

                                                setContact(
                                                    (
                                                        current
                                                    ) => ({
                                                        ...current,
                                                        lastName:
                                                            value,
                                                    })
                                                )
                                            }}
                                        />
                                    </InputRow>

                                    <Field
                                        label="Email address"
                                        type="email"
                                        value={
                                            contact.email
                                        }
                                        autoComplete="email"
                                        onChange={(
                                            value
                                        ) => {
                                            setError("")

                                            setContact(
                                                (
                                                    current
                                                ) => ({
                                                    ...current,
                                                    email:
                                                        value,
                                                })
                                            )
                                        }}
                                    />

                                    <Field
                                        label="Phone (optional)"
                                        type="tel"
                                        value={
                                            contact.phone
                                        }
                                        autoComplete="tel"
                                        onChange={(
                                            value
                                        ) => {
                                            setContact(
                                                (
                                                    current
                                                ) => ({
                                                    ...current,
                                                    phone:
                                                        value,
                                                })
                                            )
                                        }}
                                    />

                                    <StepButton
                                        label="Continue to Shipping →"
                                        onClick={
                                            continueToShipping
                                        }
                                    />
                                </FormSection>
                            )}

                        {/* SHIPPING */}
                        {step ===
                            "shipping" && (
                                <FormSection
                                    title="Shipping Address"
                                    error={error}
                                >
                                    <Field
                                        label="Street address"
                                        value={
                                            shipping.address
                                        }
                                        autoComplete="street-address"
                                        onChange={(
                                            value
                                        ) => {
                                            setError("")

                                            setShipping(
                                                (
                                                    current
                                                ) => ({
                                                    ...current,
                                                    address:
                                                        value,
                                                })
                                            )
                                        }}
                                    />

                                    <InputRow>
                                        <Field
                                            label="City"
                                            value={
                                                shipping.city
                                            }
                                            autoComplete="address-level2"
                                            onChange={(
                                                value
                                            ) => {
                                                setError(
                                                    ""
                                                )

                                                setShipping(
                                                    (
                                                        current
                                                    ) => ({
                                                        ...current,
                                                        city: value,
                                                    })
                                                )
                                            }}
                                        />

                                        <Field
                                            label="Postcode"
                                            value={
                                                shipping.postcode
                                            }
                                            autoComplete="postal-code"
                                            onChange={(
                                                value
                                            ) => {
                                                setError(
                                                    ""
                                                )

                                                setShipping(
                                                    (
                                                        current
                                                    ) => ({
                                                        ...current,
                                                        postcode:
                                                            value,
                                                    })
                                                )
                                            }}
                                        />
                                    </InputRow>

                                    <Field
                                        label="Country"
                                        type="select"
                                        value={
                                            shipping.country
                                        }
                                        autoComplete="country-name"
                                        onChange={(
                                            value
                                        ) => {
                                            setError("")

                                            setShipping(
                                                (
                                                    current
                                                ) => ({
                                                    ...current,
                                                    country:
                                                        value,
                                                })
                                            )
                                        }}
                                        options={[
                                            "Sweden",
                                            "Germany",
                                            "United Kingdom",
                                            "France",
                                            "Netherlands",
                                            "Spain",
                                            "Italy",
                                            "Poland",
                                            "United States",
                                            "Other",
                                        ]}
                                    />

                                    {/* Shipping method */}
                                    <div className="mt-2">
                                        <p className="mb-3 text-sm font-semibold text-text">
                                            Shipping
                                            method
                                        </p>

                                        <div
                                            className="
                      flex
                      items-center
                      justify-between
                      gap-4
                      rounded-xl
                      border
                      border-primary
                      bg-primary/5
                      p-4
                    "
                                        >
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className="
                          flex
                          h-5
                          w-5
                          items-center
                          justify-center
                          rounded-full
                          border-2
                          border-primary
                        "
                                                >
                                                    <span className="h-2 w-2 rounded-full bg-primary" />
                                                </span>

                                                <div>
                                                    <p className="text-sm font-medium text-text">
                                                        Standard
                                                        Shipping
                                                    </p>

                                                    <p className="mt-0.5 text-xs text-text-muted">
                                                        3–5
                                                        business
                                                        days
                                                    </p>
                                                </div>
                                            </div>

                                            <span
                                                className={`
                        shrink-0
                        font-mono
                        text-sm
                        font-semibold
                        ${shippingCost ===
                                                        0
                                                        ? "text-green-500"
                                                        : "text-text"
                                                    }
                      `}
                                            >
                                                {shippingCost ===
                                                    0
                                                    ? "Free"
                                                    : `€${shippingCost.toFixed(
                                                        2
                                                    )}`}
                                            </span>
                                        </div>
                                    </div>

                                    <StepButton
                                        label="Continue to Payment →"
                                        onClick={
                                            continueToPayment
                                        }
                                    />
                                </FormSection>
                            )}

                        {/* PAYMENT */}
                        {step ===
                            "payment" && (
                                <FormSection
                                    title="Payment Details"
                                    error={error}
                                >
                                    <div
                                        className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-green-500/20
                    bg-green-500/10
                    px-4
                    py-3
                    text-sm
                    text-green-500
                  "
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="9"
                                            />

                                            <path d="M12 11v5" />
                                            <path d="M12 8h.01" />
                                        </svg>

                                        This is a demo —
                                        no real payment
                                        will be processed.
                                    </div>

                                    <Field
                                        label="Card number"
                                        value={
                                            payment.cardNumber
                                        }
                                        placeholder="4242 4242 4242 4242"
                                        inputMode="numeric"
                                        autoComplete="cc-number"
                                        onChange={(
                                            value
                                        ) => {
                                            setError("")

                                            setPayment(
                                                (
                                                    current
                                                ) => ({
                                                    ...current,
                                                    cardNumber:
                                                        value,
                                                })
                                            )
                                        }}
                                    />

                                    <InputRow>
                                        <Field
                                            label="Expiry date"
                                            value={
                                                payment.expiry
                                            }
                                            placeholder="MM/YY"
                                            inputMode="numeric"
                                            autoComplete="cc-exp"
                                            onChange={(
                                                value
                                            ) => {
                                                setError(
                                                    ""
                                                )

                                                setPayment(
                                                    (
                                                        current
                                                    ) => ({
                                                        ...current,
                                                        expiry:
                                                            value,
                                                    })
                                                )
                                            }}
                                        />

                                        <Field
                                            label="CVV"
                                            value={
                                                payment.cvv
                                            }
                                            placeholder="123"
                                            inputMode="numeric"
                                            autoComplete="cc-csc"
                                            onChange={(
                                                value
                                            ) => {
                                                setError(
                                                    ""
                                                )

                                                setPayment(
                                                    (
                                                        current
                                                    ) => ({
                                                        ...current,
                                                        cvv: value,
                                                    })
                                                )
                                            }}
                                        />
                                    </InputRow>

                                    <Field
                                        label="Name on card"
                                        value={
                                            payment.name
                                        }
                                        autoComplete="cc-name"
                                        onChange={(
                                            value
                                        ) => {
                                            setError("")

                                            setPayment(
                                                (
                                                    current
                                                ) => ({
                                                    ...current,
                                                    name: value,
                                                })
                                            )
                                        }}
                                    />

                                    <StepButton
                                        label="Review Order →"
                                        onClick={
                                            continueToConfirm
                                        }
                                    />
                                </FormSection>
                            )}

                        {/* CONFIRM */}
                        {step ===
                            "confirm" && (
                                <FormSection
                                    title="Review Your Order"
                                    error={error}
                                >
                                    <div className="mb-2 divide-y divide-border rounded-2xl border border-border bg-surface px-5">
                                        <ReviewRow
                                            label="Contact"
                                            value={`${contact.firstName} ${contact.lastName}`}
                                        />

                                        <ReviewRow
                                            label="Email"
                                            value={
                                                contact.email
                                            }
                                        />

                                        <ReviewRow
                                            label="Ship to"
                                            value={`${shipping.address}, ${shipping.postcode} ${shipping.city}, ${shipping.country}`}
                                        />

                                        <ReviewRow
                                            label="Shipping"
                                            value="Standard · 3–5 business days"
                                        />

                                        <ReviewRow
                                            label="Payment"
                                            value={`•••• •••• •••• ${payment.cardNumber
                                                .replace(
                                                    /\s/g,
                                                    ""
                                                )
                                                .slice(-4)}`}
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        disabled={
                                            placingOrder
                                        }
                                        onClick={
                                            handlePlaceOrder
                                        }
                                        className="
                    w-full
                    rounded-xl
                    bg-primary
                    px-6
                    py-4
                    text-base
                    font-bold
                    text-white
                    transition-opacity
                    hover:opacity-90
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                                    >
                                        {placingOrder
                                            ? "Placing Order..."
                                            : `Place Order — €${total.toFixed(
                                                2
                                            )}`}
                                    </button>

                                    <p className="text-center text-xs leading-5 text-text-muted">
                                        By placing your
                                        order, you agree
                                        to our Terms of
                                        Service and
                                        Privacy Policy.
                                    </p>
                                </FormSection>
                            )}
                    </section>

                    {/* ORDER SUMMARY */}
                    <aside
                        className="
              rounded-2xl
              border
              border-border
              bg-surface
              p-5
              lg:sticky
              lg:top-24
            "
                    >
                        <h2 className="text-base font-bold text-text">
                            Order Summary
                        </h2>

                        <div className="mt-5 max-h-72 space-y-4 overflow-y-auto">
                            {cart.map(
                                (item) => (
                                    <div
                                        key={
                                            item.productId
                                        }
                                        className="flex items-center gap-3"
                                    >
                                        <div className="relative shrink-0">
                                            <img
                                                src={
                                                    item
                                                        .product
                                                        .image
                                                }
                                                alt={
                                                    item
                                                        .product
                                                        .name
                                                }
                                                className="h-12 w-16 rounded-lg bg-surface-2 object-cover"
                                            />

                                            <span
                                                className="
                          absolute
                          -right-2
                          -top-2
                          flex
                          h-5
                          min-w-5
                          items-center
                          justify-center
                          rounded-full
                          bg-primary
                          px-1
                          text-[10px]
                          font-bold
                          text-white
                        "
                                            >
                                                {
                                                    item.quantity
                                                }
                                            </span>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-text">
                                                {
                                                    item
                                                        .product
                                                        .name
                                                }
                                            </p>
                                        </div>

                                        <span className="shrink-0 font-mono text-sm font-semibold text-text">
                                            €
                                            {(
                                                item
                                                    .product
                                                    .price *
                                                item.quantity
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                )
                            )}
                        </div>

                        <div className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
                            <SummaryRow
                                label="Subtotal"
                                value={`€${subtotal.toFixed(
                                    2
                                )}`}
                            />

                            <SummaryRow
                                label="Shipping"
                                value={
                                    shippingCost ===
                                        0
                                        ? "Free"
                                        : `€${shippingCost.toFixed(
                                            2
                                        )}`
                                }
                                success={
                                    shippingCost ===
                                    0
                                }
                            />

                            <SummaryRow
                                label="VAT (21%)"
                                value={`€${tax.toFixed(
                                    2
                                )}`}
                            />

                            <div className="flex items-center justify-between border-t border-border pt-4">
                                <span className="font-bold text-text">
                                    Total
                                </span>

                                <span className="font-mono text-lg font-bold text-text">
                                    €
                                    {total.toFixed(
                                        2
                                    )}
                                </span>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    )
}

function FormSection({
    title,
    children,
    error,
}: {
    title: string
    children: ReactNode
    error?: string
}) {
    return (
        <div>
            <h1 className="mb-6 font-serif text-2xl text-text">
                {title}
            </h1>

            <div className="space-y-4">
                {children}

                {error && (
                    <div
                        role="alert"
                        className="
              rounded-xl
              border
              border-red-500/20
              bg-red-500/10
              px-4
              py-3
              text-sm
              text-red-500
            "
                    >
                        {error}
                    </div>
                )}
            </div>
        </div>
    )
}

function InputRow({
    children,
}: {
    children: ReactNode
}) {
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {children}
        </div>
    )
}

function Field({
    label,
    value,
    onChange,
    type = "text",
    placeholder,
    options,
    autoComplete,
    inputMode,
}: {
    label: string
    value: string
    onChange: (
        value: string
    ) => void
    type?: string
    placeholder?: string
    options?: string[]
    autoComplete?: string
    inputMode?:
    | "text"
    | "numeric"
    | "decimal"
    | "email"
    | "tel"
    | "search"
    | "url"
    | "none"
}) {
    const className = `
    w-full
    rounded-xl
    border
    border-border-strong
    bg-surface
    px-4
    py-3
    text-sm
    text-text
    outline-none
    transition-colors
    placeholder:text-text-muted
    focus:border-primary
  `

    return (
        <div>
            <label className="mb-2 block text-xs font-semibold text-text-muted">
                {label}
            </label>

            {type === "select" ? (
                <select
                    value={value}
                    autoComplete={
                        autoComplete
                    }
                    onChange={(
                        event
                    ) =>
                        onChange(
                            event.target
                                .value
                        )
                    }
                    className={
                        className
                    }
                >
                    {options?.map(
                        (option) => (
                            <option
                                key={
                                    option
                                }
                                value={
                                    option
                                }
                            >
                                {
                                    option
                                }
                            </option>
                        )
                    )}
                </select>
            ) : (
                <input
                    type={type}
                    value={value}
                    placeholder={
                        placeholder
                    }
                    autoComplete={
                        autoComplete
                    }
                    inputMode={
                        inputMode
                    }
                    onChange={(
                        event
                    ) =>
                        onChange(
                            event.target
                                .value
                        )
                    }
                    className={
                        className
                    }
                />
            )}
        </div>
    )
}

function StepButton({
    label,
    onClick,
}: {
    label: string
    onClick: () => void
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="
        mt-2
        rounded-xl
        bg-primary
        px-6
        py-3.5
        text-sm
        font-bold
        text-white
        transition-opacity
        hover:opacity-90
      "
        >
            {label}
        </button>
    )
}

function ReviewRow({
    label,
    value,
}: {
    label: string
    value: string
}) {
    return (
        <div className="flex gap-6 py-4">
            <span className="w-24 shrink-0 text-xs font-semibold text-text-muted">
                {label}
            </span>

            <span className="ml-auto text-right text-sm text-text">
                {value}
            </span>
        </div>
    )
}

function SummaryRow({
    label,
    value,
    success = false,
}: {
    label: string
    value: string
    success?: boolean
}) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-text-muted">
                {label}
            </span>

            <span
                className={`font-mono ${success
                        ? "font-semibold text-green-500"
                        : "text-text"
                    }`}
            >
                {value}
            </span>
        </div>
    )
}