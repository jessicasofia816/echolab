import { Link, NavLink, useNavigate } from "react-router";
import IconButton from "../IconButton/IconButton";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
    const {
        theme,
        toggleTheme,
    } = useTheme()
    const { cart } = useCart()

    const cartCount = cart.reduce(
        (total, item) => total + item.quantity,
        0
    )
    const { user, logout } = useAuth()

    const [scrolled, setScrolled] = useState(false);
    const [megaOpen, setMegaOpen] = useState(false)
    const [accountOpen, setAccountOpen] = useState(false)

    const navigate = useNavigate()


    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        setMegaOpen(false)
    }, [location])

    return (

        <nav className={`
        sticky w-full top-0
        z-50
        h-20
        flex items-center justify-between
        px-6
        transition-all duration-300
        ${scrolled
                ? "bg-bg border-b border-border backdrop-blur-xl"
                : "bg-transparent border-b border-transparent"
            }
      `}>
            <Link
                to="/"
                className="flex items-center gap-2.5 no-underline"
            >
                <div
                    className="
      flex h-8 w-8
      items-center justify-center
      rounded-lg
      bg-primary
    "
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                    >
                        <circle cx="8" cy="8" r="3" fill="white" />
                        <path
                            d="M8 1 L8 4 M8 12 L8 15 M1 8 L4 8 M12 8 L15 8"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>

                <span
                    className="
      font-sans
      text-lg
      font-bold
      tracking-[-0.03em]
      text-text
    "
                >
                    EchoLab
                </span>
            </Link>
            <ul className="hidden md:flex items-center gap-1">
                <li
                    className="position-relative"
                    onMouseEnter={() => setMegaOpen(true)}
                    onMouseLeave={() => setMegaOpen(false)}
                >
                    <button
                        type="button"
                        className="flex items-center gap-1
  rounded-lg
  border-none
  bg-transparent
  px-3.5 py-2
  font-medium
  font-sans
  transition-colors
  duration-200
  hover:text-primary"
                    >
                        Products

                        <svg
                            className={`transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`}
                            width="10"
                            height="6"
                            viewBox="0 0 10 6"
                            fill="none"
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
      fixed
      inset-x-0
      top-20
      z-40
      bg-surface
      border-b
      border-border
      shadow-[0_20px_60px_rgba(0,0,0,0.5)]
    "
                        >
                            <div className="container-wide p-8">
                                <div className="grid grid-cols-5 gap-4">
                                    <Link to="/" className="
  px-4
  py-3.5
  rounded-[10px]
  border
  border-transparent
  transition-all
  duration-150
  cursor-pointer
">Synths</Link>
                                    <Link to="/" className="
  px-4
  py-3.5
  rounded-[10px]
  border
  border-transparent
  transition-all
  duration-150
  cursor-pointer
">Drum Machines</Link>
                                    <Link to="/" className="
  px-4
  py-3.5
  rounded-[10px]
  border
  border-transparent
  transition-all
  duration-150
  cursor-pointer
">Effects</Link>
                                    <Link to="/" className="
  px-4
  py-3.5
  rounded-[10px]
  border
  border-transparent
  transition-all
  duration-150
  cursor-pointer
">Controllers</Link>
                                    <Link to="/" className="
  px-4
  py-3.5
  rounded-[10px]
  border
  border-transparent
  transition-all
  duration-150
  cursor-pointer
">Studio</Link>
                                </div>
                            </div>
                        </div>
                    )}
                </li>

                {[
                    { to: "/about", label: "About" },
                    { to: "/contact", label: "Contact" },
                ].map((link) => (
                    <li key={link.to}>
                        <NavLink
                            to={link.to}
                            className={({ isActive }) => `
  rounded-lg
  px-3.5
  py-2
  font-medium
  font-sans
  transition-colors
  duration-200
          ${isActive
                                    ? "text-primary"
                                    : "text-text"
                                }
        `}
                        >
                            {link.label}
                        </NavLink>
                    </li>
                ))}
            </ul>

            <div className="flex items-center gap-3">
                <IconButton ariaLabel="Search">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M11.5 11.5L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </IconButton>
                <IconButton
                    ariaLabel={
                        theme === "dark"
                            ? "Switch to light mode"
                            : "Switch to dark mode"
                    }
                    onClick={toggleTheme}
                >
                    {theme === "dark" ? (
                        // Sun
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
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
                        // Moon
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
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
                <Link to="/account?tab=wishlist" className="no-underline">
                    <IconButton ariaLabel="Wishlist">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M9 15s-7-4.5-7-9a4 4 0 0 1 7-2.65A4 4 0 0 1 16 6c0 4.5-7 9-7 9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </IconButton>
                </Link>
                <Link to="/cart" className="no-underline">
                    <IconButton ariaLabel="Cart">
                        <div className="relative">
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
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
                                    {cartCount > 9 ? "9+" : cartCount}
                                </span>
                            )}
                        </div>
                    </IconButton>
                </Link>
                <div className="relative">
                    {user ? (
                        <>
                            <IconButton
                                ariaLabel="Account"
                                onClick={() =>
                                    setAccountOpen((open) => !open)
                                }
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 18 18"
                                    fill="none"
                                >
                                    {<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                                        <path d="M2.5 17c0-3.5 2.9-6 6.5-6s6.5 2.5 6.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>}
                                </svg>
                            </IconButton>

                            {accountOpen && (
                                <div className="absolute right-0 top-full z-50 mt-2 w-44 rounded-xl border border-border bg-surface-2 p-1.5 shadow-lg">
                                    <Link
                                        to="/account"
                                        onClick={() => setAccountOpen(false)}
                                        className="block rounded-lg px-3 py-2 text-sm font-medium text-text no-underline transition hover:bg-surface"
                                    >
                                        My Account
                                    </Link>

                                    <div className="my-1 border-t border-border" />

                                    <button
                                        type="button"
                                        onClick={async () => {
                                            await logout()
                                            setAccountOpen(false)
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
                        <Link to="/auth" className="no-underline">
                            <IconButton ariaLabel="Sign in">
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 18 18"
                                    fill="none"
                                >
                                    {<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                                        <path d="M2.5 17c0-3.5 2.9-6 6.5-6s6.5 2.5 6.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>}
                                </svg>
                            </IconButton>
                        </Link>
                    )}
                </div>
                <button>                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg></button>

            </div>
        </nav>
    );
}