import { Link, NavLink } from "react-router";
import IconButton from "../IconButton/IconButton";
import { useEffect, useState } from "react";

export default function Navbar() {

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

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
                <li><button>Products</button></li>
                {[
                    { to: "/about", label: "About" },
                    { to: "/contact", label: "Contact" },
                ].map((link) => (
                    <li key={link.to}>
                        <NavLink
                            to={link.to}
                            className={({ isActive }) => `
  px-3.5 py-2
  transition-colors
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
                <IconButton ariaLabel="Toggle Theme">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <circle cx="9" cy="9" r="4" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.05 3.05l1.41 1.41M13.54 13.54l1.41 1.41M3.05 14.95l1.41-1.41M13.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </IconButton>
                <IconButton ariaLabel="Wishlist">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M9 15s-7-4.5-7-9a4 4 0 0 1 7-2.65A4 4 0 0 1 16 6c0 4.5-7 9-7 9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </IconButton>
                <IconButton ariaLabel="Cart">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M1 1h2.5l1.8 9h9.4l1.5-6H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="7" cy="15" r="1.2" stroke="currentColor" strokeWidth="1.2" />
                        <circle cx="13" cy="15" r="1.2" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                </IconButton>
                <IconButton ariaLabel="Account">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M2.5 17c0-3.5 2.9-6 6.5-6s6.5 2.5 6.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </IconButton>
                <button>                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg></button>

            </div>
        </nav>
    );
}