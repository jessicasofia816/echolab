import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

import type { Product } from "../types/Product"
import { useAuth } from "./AuthContext"

type WishlistContextType = {
  wishlist: Product[]
  addToWishlist: (productId: string) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
}

const WishlistContext =
  createContext<WishlistContextType | undefined>(
    undefined
  )

const API_URL = import.meta.env.VITE_API_URL

export function WishlistProvider({
  children,
}: {
  children: ReactNode
}) {
  const { user, loading } = useAuth()

  const [wishlist, setWishlist] = useState<Product[]>([])

  async function getWishlist() {
    const response = await fetch(
      `${API_URL}/api/wishlist`,
      {
        credentials: "include",
      }
    )

    if (!response.ok) {
      setWishlist([])
      return
    }

    const data = await response.json()

    setWishlist(data)
  }

  async function addToWishlist(
    productId: string
  ) {
    const response = await fetch(
      `${API_URL}/api/wishlist/${productId}`,
      {
        method: "POST",
        credentials: "include",
      }
    )

    if (!response.ok) {
      throw new Error(
        "Failed to add product to wishlist"
      )
    }

    await getWishlist()
  }

  async function removeFromWishlist(
    productId: string
  ) {
    const response = await fetch(
      `${API_URL}/api/wishlist/${productId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    )

    if (!response.ok) {
      throw new Error(
        "Failed to remove product from wishlist"
      )
    }

    await getWishlist()
  }

  function isInWishlist(productId: string) {
    return wishlist.some(
      (product) => product.id === productId
    )
  }

  useEffect(() => {
    if (loading) {
      return
    }

    if (user) {
      getWishlist()
    } else {
      setWishlist([])
    }
  }, [user, loading])

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    )
  }

  return context
}