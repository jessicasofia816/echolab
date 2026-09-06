import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

type User = {
  id: number
  email: string
  created_at?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
)

const API_URL = import.meta.env.VITE_API_URL

export function AuthProvider({
  children,
}: {
  children: ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Kontrollera om användaren redan är inloggad
  useEffect(() => {
    async function getCurrentUser() {
      try {
        const response = await fetch(
          `${API_URL}/api/auth/me`,
          {
            credentials: "include",
          }
        )

        if (!response.ok) {
          setUser(null)
          return
        }

        const data = await response.json()

        setUser(data.user)
      } catch (error) {
        console.error("Failed to get current user:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getCurrentUser()
  }, [])

  // Logga in
  async function login(
    email: string,
    password: string
  ) {
    const response = await fetch(
      `${API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.message || "Login failed"
      )
    }

    setUser(data.user)
  }

  // Logga ut
  async function logout() {
    const response = await fetch(
      `${API_URL}/api/auth/logout`,
      {
        method: "POST",
        credentials: "include",
      }
    )

    if (!response.ok) {
      throw new Error("Logout failed")
    }

    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    )
  }

  return context
}