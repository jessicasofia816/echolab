import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react"

import type { ReactNode } from "react"
import type { Product } from "../types/Product"

type CartItem = {
    productId: string
    quantity: number
    product: Product
}

type CartContextType = {
    cart: CartItem[]

    addToCart: (
        productId: string,
        quantity: number
    ) => Promise<void>

    updateQuantity: (
        productId: string,
        quantity: number
    ) => Promise<void>

    removeFromCart: (
        productId: string
    ) => Promise<void>

    clearCart: () => Promise<void>
}

const CartContext =
    createContext<CartContextType | undefined>(undefined)

type CartProviderProps = {
    children: ReactNode
}

export const CartProvider = ({
    children,
}: CartProviderProps) => {
    const API_URL = import.meta.env.VITE_API_URL

    const [cart, setCart] = useState<CartItem[]>([])

    async function getCart() {
        try {
            const response = await fetch(
                `${API_URL}/api/cart`,
                {
                    credentials: "include",
                }
            )

            if (!response.ok) {
                throw new Error(
                    `HTTP error: ${response.status}`
                )
            }

            const data: CartItem[] =
                await response.json()

            setCart(data)
        } catch (error) {
            console.error(
                "Failed to fetch cart:",
                error
            )
        }
    }

    useEffect(() => {
        getCart()
    }, [])

    async function addToCart(
        productId: string,
        quantity: number
    ) {
        const response = await fetch(
            `${API_URL}/api/cart`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    productId,
                    quantity,
                }),
            }
        )

        if (!response.ok) {
            throw new Error(
                `HTTP error: ${response.status}`
            )
        }

        await getCart()
    }

    async function updateQuantity(
        productId: string,
        quantity: number
    ) {
        const response = await fetch(
            `${API_URL}/api/cart/${productId}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    quantity,
                }),
            }
        )

        if (!response.ok) {
            throw new Error(
                `HTTP error: ${response.status}`
            )
        }

        await getCart()
    }

    async function removeFromCart(
        productId: string
    ) {
        const response = await fetch(
            `${API_URL}/api/cart/${productId}`,
            {
                method: "DELETE",
                credentials: "include",
            }
        )

        if (!response.ok) {
            throw new Error(
                `HTTP error: ${response.status}`
            )
        }

        await getCart()
    }

    async function clearCart() {
        const response = await fetch(
            `${API_URL}/api/cart`,
            {
                method: "DELETE",
                credentials: "include",
            }
        )

        if (!response.ok) {
            throw new Error(
                `HTTP error: ${response.status}`
            )
        }

        setCart([])
    }

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)

    if (!context) {
        throw new Error(
            "useCart must be used inside CartProvider"
        )
    }

    return context
}