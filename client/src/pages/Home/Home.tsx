import {
  useEffect,
  useMemo,
  useState,
  type SyntheticEvent,
  type ReactNode,
} from "react"
import { Link } from "react-router"

import ProductCard from "../../components/ProductCard"
import { useCart } from "../../context/CartContext"

import type { Product } from "../../types/Product"

const API_URL = import.meta.env.VITE_API_URL

type Category = {
  id: string
  name: string
}

export default function HomePage() {
  const { addToCart } = useCart()

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    async function loadHomePage() {
      try {
        const [productsResponse, categoriesResponse] =
          await Promise.all([
            fetch(`${API_URL}/api/products`),
            fetch(`${API_URL}/api/categories`),
          ])

        if (!productsResponse.ok) {
          throw new Error("Could not load products")
        }

        if (!categoriesResponse.ok) {
          throw new Error("Could not load categories")
        }

        const productsData =
          (await productsResponse.json()) as Product[]

        const categoriesData =
          (await categoriesResponse.json()) as Category[]

        setProducts(productsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadHomePage()
  }, [])

  const heroProduct = useMemo(() => {
    return (
      products.find(
        (product) => product.featured === 1
      ) ??
      products.find(
        (product) => product.is_new === 1
      ) ??
      products[0]
    )
  }, [products])

  const newArrivals = useMemo(
    () =>
      products
        .filter(
          (product) =>
            product.is_new === 1 ||
            product.badge === "New"
        )
        .slice(0, 3),
    [products]
  )

  const bestSellers = useMemo(
    () =>
      [...products]
        .filter(
          (product) =>
            product.badge === "Best Seller" ||
            product.review_count >= 100
        )
        .sort(
          (a, b) =>
            b.review_count - a.review_count
        )
        .slice(0, 4),
    [products]
  )

  function getCategoryProduct(
    categoryId: string
  ) {
    return products.find(
      (product) =>
        product.category_id === categoryId
    )
  }

  function getCategoryCount(
    categoryId: string
  ) {
    return products.filter(
      (product) =>
        product.category_id === categoryId
    ).length
  }

  function handleSubscribe(
    event: SyntheticEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (!email.trim()) {
      return
    }

    setSubscribed(true)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-bg">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">
          <p className="text-sm text-text-muted">
            Loading EchoLab...
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-bg">
      {/* Hero */}
      {heroProduct && (
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute right-[5%] top-[15%] h-125 w-125 rounded-full bg-primary/10 blur-[120px]" />

          <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
            {/* Hero text */}
            <div className="relative z-10">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />

                <span className="text-xs font-bold uppercase tracking-[0.08em] text-primary">
                  New — available now
                </span>
              </div>

              <h1 className="font-serif text-5xl leading-[0.98] tracking-tight text-text sm:text-6xl lg:text-7xl xl:text-8xl">
                Sound
                <br />

                <span className="italic text-primary">
                  without
                </span>

                <br />
                compromise.
              </h1>

              <p className="mt-7 max-w-lg text-base leading-7 text-text-muted sm:text-lg">
                Professional music production
                equipment for creators who care
                about every detail. Designed for
                studios, stages and everything
                in between.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() =>
                    addToCart(
                      heroProduct.id,
                      1
                    )
                  }
                  disabled={
                    heroProduct.in_stock !== 1
                  }
                  className="rounded-xl bg-primary px-6 py-4 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {heroProduct.in_stock === 1
                    ? `Add to Cart — €${heroProduct.price.toLocaleString()}`
                    : "Sold Out"}
                </button>

                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-xl border border-border-strong bg-surface px-6 py-4 text-sm font-bold text-text no-underline transition-colors hover:bg-surface-2"
                >
                  View All Products
                  <ArrowIcon />
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
                <HeroStat
                  value="4.9★"
                  label="Average rating"
                />

                <HeroStat
                  value="5yr"
                  label="Warranty"
                />

                <HeroStat
                  value="€150+"
                  label="Free shipping"
                />
              </div>
            </div>

            {/* Hero product */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-10 rounded-full bg-primary/10 blur-[80px]" />

              <Link
                to={`/products/${heroProduct.id}`}
                className="relative block overflow-hidden rounded-3xl border border-border bg-surface-2 no-underline shadow-2xl"
              >
                <div className="aspect-4/3 overflow-hidden">
                  <img
                    src={heroProduct.image}
                    alt={heroProduct.name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                  />
                </div>

                <div className="absolute bottom-5 left-5 rounded-xl border border-border-strong bg-surface/90 px-4 py-3 backdrop-blur-xl">
                  <p className="text-xs capitalize text-text-muted">
                    {heroProduct.category_id.replace(
                      /-/g,
                      " "
                    )}
                  </p>

                  <h2 className="mt-1 text-sm font-bold text-text">
                    {heroProduct.name}
                  </h2>

                  <p className="mt-1 font-mono text-sm font-bold text-primary">
                    €
                    {heroProduct.price.toLocaleString()}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Browse"
            title="Shop by Category"
            subtitle="Find the right tools for your studio."
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {categories.slice(0, 5).map(
              (category) => {
                const categoryProduct =
                  getCategoryProduct(
                    category.id
                  )

                const count =
                  getCategoryCount(
                    category.id
                  )

                return (
                  <Link
                    key={category.id}
                    to={`/products?category=${category.id}`}
                    className="group overflow-hidden rounded-2xl border border-border bg-surface no-underline transition-all hover:-translate-y-1 hover:border-border-strong"
                  >
                    <div className="aspect-video overflow-hidden bg-surface">
                      {categoryProduct ? (
                        <img
                          src={
                            categoryProduct.image
                          }
                          alt={category.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-text-muted">
                          EchoLab
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-sm font-bold text-text">
                        {category.name}
                      </h3>

                      <p className="mt-1 text-xs text-text-muted">
                        {count}{" "}
                        {count === 1
                          ? "product"
                          : "products"}
                      </p>
                    </div>
                  </Link>
                )
              }
            )}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Just Landed"
              title="New Arrivals"
              cta={{
                label: "See all new products",
                to: "/products?badge=New",
              }}
            />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {newArrivals.map(
                (product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="border-b border-border bg-surface px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Community Favourites"
              title="Best Sellers"
              cta={{
                label: "View best sellers",
                to: "/products?badge=Best%20Seller",
              }}
            />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {bestSellers.map(
                (product) => (
                  <div
                    key={product.id}
                    className="relative"
                  >
                    <ProductCard
                      product={product}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* Featured studio */}
      {heroProduct && (
        <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid overflow-hidden rounded-3xl border border-border bg-bg lg:grid-cols-2">
              <div className="min-h-85 overflow-hidden">
                <img
                  src={heroProduct.image}
                  alt="EchoLab studio setup"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">
                  Featured Setup
                </p>

                <h2 className="mt-4 font-serif text-3xl leading-tight text-text sm:text-4xl">
                  Build your
                  <br />
                  complete studio.
                </h2>

                <p className="mt-5 max-w-md text-sm leading-7 text-text-muted">
                  From monitoring to recording,
                  build a setup around equipment
                  designed for modern music
                  production.
                </p>

                <div className="mt-7 divide-y divide-border">
                  {products
                    .slice(0, 4)
                    .map((product) => (
                      <Link
                        key={product.id}
                        to={`/products/${product.id}`}
                        className="flex items-center justify-between gap-4 py-3 text-sm no-underline transition-opacity hover:opacity-70"
                      >
                        <span className="truncate text-text-muted">
                          {product.name}
                        </span>

                        <span className="shrink-0 font-mono font-semibold text-text">
                          €
                          {product.price.toLocaleString()}
                        </span>
                      </Link>
                    ))}
                </div>

                <Link
                  to="/products"
                  className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white no-underline transition-opacity hover:opacity-90"
                >
                  Shop the Setup
                  <ArrowIcon />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Why EchoLab */}
      <section className="border-b border-border bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Why EchoLab"
            title="Built for creators"
            subtitle="The details that matter before, during and after your purchase."
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon="✓"
              title="Built for Studio Work"
              text="Products selected for recording, mixing, production and performance."
            />

            <FeatureCard
              icon="5"
              title="5-Year Warranty"
              text="Extra peace of mind for the equipment at the centre of your setup."
            />

            <FeatureCard
              icon="→"
              title="Free Shipping"
              text="Orders over €150 qualify for free standard shipping."
            />

            <FeatureCard
              icon="?"
              title="Expert Support"
              text="Need help choosing or setting up your gear? EchoLab support is here to help."
            />

            <FeatureCard
              icon="♻"
              title="Thoughtful Packaging"
              text="Packaging designed to protect your equipment while reducing unnecessary waste."
            />

            <FeatureCard
              icon="★"
              title="Creator Focused"
              text="A catalogue built around musicians, producers, engineers and performers."
            />
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">
            Stay in the Loop
          </p>

          <h2 className="mt-4 font-serif text-3xl leading-tight text-text sm:text-4xl">
            New gear, studio inspiration
            and EchoLab updates.
          </h2>

          <p className="mt-4 text-sm leading-6 text-text-muted">
            Get the latest products and
            announcements delivered to your
            inbox.
          </p>

          {subscribed ? (
            <div className="mt-8 rounded-xl border border-green-500/20 bg-green-500/10 p-5 text-sm font-semibold text-green-500">
              ✓ You're on the list.
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="mx-auto mt-8 flex max-w-md flex-col gap-2 sm:flex-row"
            >
              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                placeholder="your@email.com"
                required
                className="min-w-0 flex-1 rounded-xl border border-border-strong bg-surface px-4 py-3.5 text-sm text-text outline-none placeholder:text-text-muted focus:border-primary"
              />

              <button
                type="submit"
                className="rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="mt-4 text-xs text-text-muted">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </main>
  )
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  cta,
}: {
  eyebrow: string
  title: string
  subtitle?: string
  cta?: {
    label: string
    to: string
  }
}) {
  return (
    <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">
          {eyebrow}
        </p>

        <h2 className="mt-2 font-serif text-3xl text-text sm:text-4xl">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-3 text-sm text-text-muted">
            {subtitle}
          </p>
        )}
      </div>

      {cta && (
        <Link
          to={cta.to}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary no-underline hover:opacity-70"
        >
          {cta.label}
          <ArrowIcon />
        </Link>
      )}
    </div>
  )
}

function HeroStat({
  value,
  label,
}: {
  value: string
  label: string
}) {
  return (
    <div>
      <p className="font-mono text-lg font-bold text-text">
        {value}
      </p>

      <p className="mt-1 text-xs text-text-muted">
        {label}
      </p>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: ReactNode
  title: string
  text: string
}) {
  return (
    <article className="rounded-2xl border border-border bg-bg p-6 transition-colors hover:border-border-strong">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 font-mono text-sm font-bold text-primary">
        {icon}
      </div>

      <h3 className="mt-5 text-sm font-bold text-text">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-text-muted">
        {text}
      </p>
    </article>
  )
}

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 7h10M7 2l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}