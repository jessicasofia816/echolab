import { Link } from "react-router"

const productLinks = [
  {
    to: "/products?category=midi-keyboards",
    label: "MIDI Keyboards",
  },
  {
    to: "/products?category=audio-interfaces",
    label: "Audio Interfaces",
  },
  {
    to: "/products?category=studio-monitors",
    label: "Studio Monitors",
  },
  {
    to: "/products?category=headphones",
    label: "Headphones",
  },
  {
    to: "/products?category=synthesizers",
    label: "Synthesizers",
  },
  {
    to: "/products?badge=New",
    label: "New Arrivals",
  },
  {
    to: "/products?badge=Sale",
    label: "Sale",
  },
]

const companyLinks = [
  {
    to: "/about",
    label: "About EchoLab",
  },
  {
    to: "#",
    label: "Our Team",
  },
  {
    to: "#",
    label: "Sustainability",
  },
  {
    to: "/contact",
    label: "Contact Us",
  },
  {
    to: "#",
    label: "Press",
  },
  {
    to: "#",
    label: "Dealers",
  },
]

const supportLinks = [
  {
    to: "/contact",
    label: "Help & Support",
  },
  {
    to: "#",
    label: "Shipping & Returns",
  },
  {
    to: "#",
    label: "Warranty",
  },
  {
    to: "/account?tab=orders",
    label: "My Orders",
  },
  {
    to: "/account?tab=wishlist",
    label: "Wishlist",
  },
  {
    to: "/auth",
    label: "Sign In",
  },
]

const socialLinks = [
  {
    label: "Instagram",
    shortLabel: "IG",
    href: "#",
  },
  {
    label: "YouTube",
    shortLabel: "YT",
    href: "#",
  },
  {
    label: "Spotify",
    shortLabel: "SP",
    href: "#",
  },
  {
    label: "SoundCloud",
    shortLabel: "SC",
    href: "#",
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
        {/* Top */}
        <div className="grid gap-10 border-b border-border pb-14 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:gap-12">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-3 no-underline"
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
                    d="M8 1V4M8 12V15M1 8H4M12 8H15"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <span className="text-base font-bold tracking-tight text-text">
                EchoLab
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-7 text-text-muted">
              Professional music production
              equipment for creators who care
              about sound, performance and
              reliability.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {socialLinks.map(
                (social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    title={social.label}
                    aria-label={
                      social.label
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface font-mono text-[10px] font-bold text-text-muted no-underline transition-colors hover:border-primary hover:text-primary"
                  >
                    {
                      social.shortLabel
                    }
                  </a>
                )
              )}
            </div>
          </div>

          <FooterColumn
            title="Products"
            links={productLinks}
          />

          <FooterColumn
            title="Company"
            links={companyLinks}
          />

          <FooterColumn
            title="Support"
            links={supportLinks}
          />
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-5 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-text-muted sm:text-sm">
            © 2026 EchoLab. All rights
            reserved.
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a
              href="#"
              className="text-xs text-text-muted no-underline transition-colors hover:text-text sm:text-sm"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="text-xs text-text-muted no-underline transition-colors hover:text-text sm:text-sm"
            >
              Terms of Service
            </a>

            <a
              href="#"
              className="text-xs text-text-muted no-underline transition-colors hover:text-text sm:text-sm"
            >
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: {
    to: string
    label: string
  }[]
}) {
  return (
    <div>
      <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-text-muted">
        {title}
      </p>

      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="text-sm text-text-muted no-underline transition-colors hover:text-text"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}