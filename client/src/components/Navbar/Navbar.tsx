import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router"

import {
  useEffect,
  useRef,
  useState,
} from "react"

import IconButton from "../IconButton/IconButton"

import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"

import type { Product } from "../../types/Product"
import type { Category } from "../../types/Category"

export default function Navbar() {
  const API_URL = import.meta.env.VITE_API_URL

  const { theme, toggleTheme } = useTheme()
  const { cart } = useCart()
  const { user, logout } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()

  const [categories, setCategories] =
    useState<Category[]>([])

  const [scrolled, setScrolled] =
    useState(false)

  const [megaOpen, setMegaOpen] =
    useState(false)

  const [mobileOpen, setMobileOpen] =
    useState(false)

  const [accountOpen, setAccountOpen] =
    useState(false)

  const [searchOpen, setSearchOpen] =
    useState(false)

  const [searchQuery, setSearchQuery] =
    useState("")

  const [searchResults, setSearchResults] =
    useState<Product[]>([])

  const [searchLoading, setSearchLoading] =
    useState(false)

  const searchRef =
    useRef<HTMLInputElement>(null)

  const megaCloseTimeout =
    useRef<number | null>(null)

  const cartCount = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  )

  /* ===========================
     Mega menu
  =========================== */

  function openMegaMenu() {
    if (megaCloseTimeout.current) {
      window.clearTimeout(
        megaCloseTimeout.current
      )

      megaCloseTimeout.current = null
    }

    setMegaOpen(true)
  }

  function closeMegaMenu() {
    megaCloseTimeout.current =
      window.setTimeout(() => {
        setMegaOpen(false)
        megaCloseTimeout.current = null
      }, 150)
  }

  /* ===========================
     Categories
  =========================== */

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(
          `${API_URL}/api/categories`
        )

        if (!response.ok) {
          throw new Error(
            "Could not fetch categories"
          )
        }

        const data =
          (await response.json()) as Category[]

        setCategories(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchCategories()
  }, [API_URL])

  /* ===========================
     Navbar scroll
  =========================== */

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20)
    }

    handleScroll()

    window.addEventListener(
      "scroll",
      handleScroll
    )

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      )
    }
  }, [])

  /* ===========================
     Clear mega menu timeout
  =========================== */

  useEffect(() => {
    return () => {
      if (megaCloseTimeout.current) {
        window.clearTimeout(
          megaCloseTimeout.current
        )
      }
    }
  }, [])

  /* ===========================
     Close menus on navigation
  =========================== */

  useEffect(() => {
    setMegaOpen(false)
    setAccountOpen(false)
    setSearchOpen(false)
    setMobileOpen(false)
  }, [
    location.pathname,
    location.search,
  ])

  /* ===========================
     Search open / close
  =========================== */

  useEffect(() => {
    if (searchOpen) {
      const focusTimeout =
        window.setTimeout(() => {
          searchRef.current?.focus()
        }, 50)

      document.body.style.overflow =
        "hidden"

      return () => {
        window.clearTimeout(
          focusTimeout
        )

        document.body.style.overflow =
          ""
      }
    }

    document.body.style.overflow = ""
    setSearchQuery("")
    setSearchResults([])
    setSearchLoading(false)

    return undefined
  }, [searchOpen])

  /* ===========================
     Escape closes menus
  =========================== */

  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key !== "Escape") {
        return
      }

      setSearchOpen(false)
      setMobileOpen(false)
      setAccountOpen(false)
      setMegaOpen(false)
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    )

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      )
    }
  }, [])

  /* ===========================
     Product search
  =========================== */

  useEffect(() => {
    const query = searchQuery.trim()

    if (query.length < 2) {
      setSearchResults([])
      setSearchLoading(false)
      return
    }

    const controller =
      new AbortController()

    const timeout =
      window.setTimeout(
        async () => {
          try {
            setSearchLoading(true)

            const params =
              new URLSearchParams({
                search: query,
              })

            const response =
              await fetch(
                `${API_URL}/api/products?${params.toString()}`,
                {
                  signal:
                    controller.signal,
                }
              )

            if (!response.ok) {
              throw new Error(
                "Could not search products"
              )
            }

            const data =
              (await response.json()) as Product[]

            setSearchResults(
              data.slice(0, 6)
            )
          } catch (error) {
            if (
              error instanceof DOMException &&
              error.name === "AbortError"
            ) {
              return
            }

            console.error(error)
            setSearchResults([])
          } finally {
            if (
              !controller.signal.aborted
            ) {
              setSearchLoading(false)
            }
          }
        },
        250
      )

    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [API_URL, searchQuery])

  return (
    <>
      <nav
        className={`
          sticky top-0 z-50
          flex h-20 w-full
          items-center justify-between
          px-6
          transition-all duration-300
          ${
            scrolled
              ? "border-b border-border bg-bg/90 backdrop-blur-xl"
              : "border-b border-transparent bg-transparent"
          }
        `}
      >
        {/* Logo */}

        <Link
          to="/"
          className="flex items-center gap-2.5 no-underline"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="8"
                cy="8"
                r="3"
                fill="white"
              />

              <path
                d="M8 1 L8 4 M8 12 L8 15 M1 8 L4 8 M12 8 L15 8"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <span className="font-sans text-lg font-bold tracking-[-0.03em] text-text">
            EchoLab
          </span>
        </Link>

        {/* Desktop navigation */}

        <ul className="hidden items-center gap-1 md:flex">
          <li
            className="relative"
            onMouseEnter={openMegaMenu}
            onMouseLeave={closeMegaMenu}
          >
            <button
              type="button"
              className={`
                flex items-center gap-1
                rounded-lg
                bg-transparent
                px-3.5 py-2
                font-sans text-sm font-medium
                transition-colors duration-200
                hover:text-primary
                ${
                  megaOpen
                    ? "text-primary"
                    : "text-text"
                }
              `}
            >
              Products

              <svg
                className={`
                  transition-transform
                  duration-200
                  ${
                    megaOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M1 1L5 5L9 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {megaOpen && (
              <div
                className="
                  fixed inset-x-0 top-20
                  z-40
                  border-b border-border
                  bg-surface
                  shadow-[0_20px_60px_rgba(0,0,0,0.35)]
                "
              >
                <div className="container-wide p-8">
                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                    {categories.map(
                      (category) => (
                        <MegaLink
                          key={category.id}
                          to={`/products?category=${category.id}`}
                          label={
                            category.name
                          }
                        />
                      )
                    )}
                  </div>

                  <div className="mt-6 flex gap-5 border-t border-border pt-5">
                    <Link
                      to="/products"
                      className="text-sm font-medium text-text-muted no-underline transition-colors hover:text-primary"
                    >
                      All Products →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </li>

          {[
            {
              to: "/about",
              label: "About",
            },
            {
              to: "/contact",
              label: "Contact",
            },
          ].map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({
                  isActive,
                }) => `
                  rounded-lg
                  px-3.5 py-2
                  font-sans text-sm font-medium
                  no-underline
                  transition-colors duration-200
                  ${
                    isActive
                      ? "text-primary"
                      : "text-text hover:text-primary"
                  }
                `}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right icons */}

        <div className="flex items-center gap-3">
          {/* Search */}

          <IconButton
            ariaLabel="Search"
            onClick={() => {
              setMobileOpen(false)
              setSearchOpen(true)
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="7.5"
                cy="7.5"
                r="5.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />

              <path
                d="M11.5 11.5L16 16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </IconButton>

          {/* Theme */}

          <IconButton
            ariaLabel={
              theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            onClick={toggleTheme}
          >
            {theme === "dark" ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="9"
                  cy="9"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />

                <path
                  d="M9 1v2M9 15v2M1 9h2M15 9h2M3.05 3.05l1.41 1.41M13.54 13.54l1.41 1.41M3.05 14.95l1.41-1.41M13.54 4.46l1.41-1.41"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M15 11.2A6.5 6.5 0 0 1 6.8 3a6.5 6.5 0 1 0 8.2 8.2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </IconButton>

          {/* Wishlist */}

          <Link
            to="/account?tab=wishlist"
            className="hidden no-underline sm:block"
          >
            <IconButton ariaLabel="Wishlist">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M9 15s-7-4.5-7-9a4 4 0 0 1 7-2.65A4 4 0 0 1 16 6c0 4.5-7 9-7 9z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </IconButton>
          </Link>

          {/* Cart */}

          <Link
            to="/cart"
            className="no-underline"
          >
            <IconButton ariaLabel="Cart">
              <div className="relative">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M1 1h2.5l1.8 9h9.4l1.5-6H5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <circle
                    cx="7"
                    cy="15"
                    r="1.2"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />

                  <circle
                    cx="13"
                    cy="15"
                    r="1.2"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                </svg>

                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold leading-none text-white">
                    {cartCount > 9
                      ? "9+"
                      : cartCount}
                  </span>
                )}
              </div>
            </IconButton>
          </Link>

          {/* Account */}

          <div className="relative hidden sm:block">
            {user ? (
              <>
                <IconButton
                  ariaLabel="Account"
                  onClick={() =>
                    setAccountOpen(
                      (open) => !open
                    )
                  }
                >
                  <AccountIcon />
                </IconButton>

                {accountOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-44 rounded-xl border border-border bg-surface-2 p-1.5 shadow-lg">
                    <Link
                      to="/account"
                      onClick={() =>
                        setAccountOpen(false)
                      }
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-text no-underline transition hover:bg-surface"
                    >
                      My Account
                    </Link>

                    <Link
                      to="/account?tab=wishlist"
                      onClick={() =>
                        setAccountOpen(false)
                      }
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-text no-underline transition hover:bg-surface"
                    >
                      Wishlist
                    </Link>

                    <Link
                      to="/account?tab=orders"
                      onClick={() =>
                        setAccountOpen(false)
                      }
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-text no-underline transition hover:bg-surface"
                    >
                      Orders
                    </Link>

                    <div className="my-1 border-t border-border" />

                    <button
                      type="button"
                      onClick={async () => {
                        await logout()

                        setAccountOpen(
                          false
                        )

                        navigate("/auth")
                      }}
                      className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-text-muted transition hover:bg-surface hover:text-text"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link
                to="/auth"
                className="no-underline"
              >
                <IconButton ariaLabel="Sign in">
                  <AccountIcon />
                </IconButton>
              </Link>
            )}
          </div>

          {/* Mobile menu */}

          <button
            type="button"
            aria-label={
              mobileOpen
                ? "Close menu"
                : "Open menu"
            }
            aria-expanded={mobileOpen}
            onClick={() => {
              setAccountOpen(false)

              setMobileOpen(
                (open) => !open
              )
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-text transition-colors hover:bg-surface-2 md:hidden"
          >
            {mobileOpen ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 4l10 10M14 4L4 14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 4h14M2 9h14M2 14h14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* ===========================
          Mobile menu
      =========================== */}

      {mobileOpen && (
        <div
          className="
            fixed inset-x-0 top-20 z-40
            max-h-[calc(100vh-5rem)]
            overflow-y-auto
            border-b border-border
            bg-surface
            px-6 py-5
            shadow-xl
            md:hidden
          "
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {/* Products */}

            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
              Products
            </p>

            <Link
              to="/products"
              className="
                rounded-lg
                px-3 py-2.5
                text-sm font-semibold
                text-primary
                no-underline
                transition
                hover:bg-surface-2
              "
            >
              All Products
            </Link>

            {categories.map(
              (category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="
                    rounded-lg
                    px-3 py-2.5
                    text-sm font-medium
                    text-text
                    no-underline
                    transition
                    hover:bg-surface-2
                    hover:text-primary
                  "
                >
                  {category.name}
                </Link>
              )
            )}

            {/* Pages */}

            <div className="my-3 border-t border-border" />

            <NavLink
              to="/about"
              className={({ isActive }) => `
                rounded-lg
                px-3 py-2.5
                text-sm font-medium
                no-underline
                transition
                hover:bg-surface-2
                hover:text-primary
                ${
                  isActive
                    ? "text-primary"
                    : "text-text"
                }
              `}
            >
              About
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) => `
                rounded-lg
                px-3 py-2.5
                text-sm font-medium
                no-underline
                transition
                hover:bg-surface-2
                hover:text-primary
                ${
                  isActive
                    ? "text-primary"
                    : "text-text"
                }
              `}
            >
              Contact
            </NavLink>

            {/* Account mobile */}

            <div className="my-3 border-t border-border" />

            {user ? (
              <>
                <Link
                  to="/account"
                  className="
                    rounded-lg
                    px-3 py-2.5
                    text-sm font-medium
                    text-text
                    no-underline
                    transition
                    hover:bg-surface-2
                    hover:text-primary
                  "
                >
                  My Account
                </Link>

                <Link
                  to="/account?tab=wishlist"
                  className="
                    rounded-lg
                    px-3 py-2.5
                    text-sm font-medium
                    text-text
                    no-underline
                    transition
                    hover:bg-surface-2
                    hover:text-primary
                  "
                >
                  Wishlist
                </Link>

                <Link
                  to="/account?tab=orders"
                  className="
                    rounded-lg
                    px-3 py-2.5
                    text-sm font-medium
                    text-text
                    no-underline
                    transition
                    hover:bg-surface-2
                    hover:text-primary
                  "
                >
                  Orders
                </Link>

                <button
                  type="button"
                  onClick={async () => {
                    await logout()
                    setMobileOpen(false)
                    navigate("/auth")
                  }}
                  className="
                    rounded-lg
                    px-3 py-2.5
                    text-left
                    text-sm font-medium
                    text-text-muted
                    transition
                    hover:bg-surface-2
                    hover:text-text
                  "
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="
                  rounded-lg
                  px-3 py-2.5
                  text-sm font-medium
                  text-text
                  no-underline
                  transition
                  hover:bg-surface-2
                  hover:text-primary
                "
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}

      {/* ===========================
          Search overlay
      =========================== */}

      {searchOpen && (
        <div
          className="
            fixed inset-0 z-2000
            flex flex-col items-center
            bg-black/80
            px-5 pt-30
            backdrop-blur-xl
          "
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setSearchOpen(false)
            }
          }}
        >
          <div className="w-full max-w-2xl">
            {/* Search input */}

            <div
              className="
                flex items-center gap-3.5
                rounded-2xl
                border border-border-strong
                bg-surface
                px-5
                shadow-[0_20px_60px_rgba(0,0,0,0.45)]
              "
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="shrink-0 text-text-muted"
                aria-hidden="true"
              >
                <circle
                  cx="8.5"
                  cy="8.5"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />

                <path
                  d="M13.5 13.5L18 18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>

              <input
                ref={searchRef}
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
                placeholder="Search products, categories..."
                className="
                  min-w-0 flex-1
                  bg-transparent
                  py-5
                  font-sans
                  text-base text-text
                  outline-none
                  focus-visible:outline-none
                  placeholder:text-text-muted
                "
              />

              <button
                type="button"
                onClick={() =>
                  setSearchOpen(false)
                }
                className="
                  rounded-md
                  bg-surface-2
                  px-2 py-1
                  font-mono text-[11px]
                  text-text-muted
                  transition-colors
                  hover:text-text
                "
              >
                ESC
              </button>
            </div>

            {/* Loading */}

            {searchQuery.trim().length >=
              2 &&
              searchLoading && (
                <div className="mt-2 rounded-xl border border-border bg-surface p-7 text-center text-sm text-text-muted shadow-xl">
                  Searching...
                </div>
              )}

            {/* Results */}

            {searchQuery.trim().length >=
              2 &&
              !searchLoading &&
              searchResults.length > 0 && (
                <div className="mt-2 overflow-hidden rounded-xl border border-border bg-surface shadow-xl">
                  {searchResults.map(
                    (
                      product,
                      index
                    ) => (
                      <Link
                        key={product.id}
                        to={`/products/${product.id}`}
                        onClick={() =>
                          setSearchOpen(
                            false
                          )
                        }
                        className={`
                          flex items-center gap-3.5
                          px-4.5 py-3.5
                          no-underline
                          transition-colors
                          hover:bg-surface-2
                          ${
                            index <
                            searchResults.length -
                              1
                              ? "border-b border-border"
                              : ""
                          }
                        `}
                      >
                        <img
                          src={
                            product.image
                          }
                          alt={
                            product.name
                          }
                          className="h-12 w-12 shrink-0 rounded-lg bg-surface-2 object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-text">
                            {
                              product.name
                            }
                          </p>

                          <p className="mt-1 truncate text-xs text-text-muted">
                            {
                              product.tagline
                            }
                          </p>
                        </div>

                        <p className="shrink-0 font-mono text-sm font-semibold text-primary">
                          €
                          {product.price.toLocaleString()}
                        </p>
                      </Link>
                    )
                  )}
                </div>
              )}

            {/* No results */}

            {searchQuery.trim().length >=
              2 &&
              !searchLoading &&
              searchResults.length ===
                0 && (
                <div className="mt-2 rounded-xl border border-border bg-surface p-7 text-center text-sm text-text-muted shadow-xl">
                  No results for{" "}
                  <span className="font-semibold text-text">
                    "
                    {
                      searchQuery.trim()
                    }
                    "
                  </span>
                </div>
              )}

            {/* Initial hint */}

            {searchQuery.length === 0 && (
              <p className="mt-4 text-center text-xs text-white/60">
                Start typing to search
                across all products
              </p>
            )}

            {/* Short query */}

            {searchQuery.length > 0 &&
              searchQuery.trim().length <
                2 && (
                <p className="mt-4 text-center text-xs text-white/60">
                  Type at least 2
                  characters to search
                </p>
              )}
          </div>
        </div>
      )}
    </>
  )
}

function MegaLink({
  to,
  label,
}: {
  to: string
  label: string
}) {
  return (
    <Link
      to={to}
      className="
        rounded-[10px]
        border border-transparent
        px-4 py-3.5
        text-sm font-medium
        text-text
        no-underline
        transition-all duration-150
        hover:border-border
        hover:bg-surface-2
        hover:text-primary
      "
    >
      {label}
    </Link>
  )
}

function AccountIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="9"
        cy="6"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <path
        d="M2.5 17c0-3.5 2.9-6 6.5-6s6.5 2.5 6.5 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}