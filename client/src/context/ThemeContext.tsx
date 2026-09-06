import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

type Theme = "dark" | "light"

type ThemeContextType = {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext =
  createContext<ThemeContextType | undefined>(
    undefined
  )

export function ThemeProvider({
  children,
}: {
  children: ReactNode
}) {
  const [theme, setTheme] =
    useState<Theme>(() => {
      const savedTheme =
        localStorage.getItem("theme")

      if (
        savedTheme === "light" ||
        savedTheme === "dark"
      ) {
        return savedTheme
      }

      return "dark"
    })

  useEffect(() => {
    const root =
      document.documentElement

    root.classList.remove(
      "light",
      "dark"
    )

    root.classList.add(theme)

    localStorage.setItem(
      "theme",
      theme
    )
  }, [theme])

  function toggleTheme() {
    setTheme((current) =>
      current === "dark"
        ? "light"
        : "dark"
    )
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context =
    useContext(ThemeContext)

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    )
  }

  return context
}