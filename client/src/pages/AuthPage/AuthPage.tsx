import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router"
import { useAuth } from "../../context/AuthContext"

type Tab = "login" | "register"

const API_URL = import.meta.env.VITE_API_URL

export default function AuthPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [tab, setTab] = useState<Tab>("login")

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirm: "",
  })

  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setError("")

    if (!loginData.email || !loginData.password) {
      setError("Please fill in all fields.")
      return
    }

    try {
      setSubmitting(true)

      await login(
        loginData.email,
        loginData.password
      )

      navigate("/")
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Login failed"
      )
    } finally {
      setSubmitting(false)
    }
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault()
    setError("")

    if (
      !registerData.email ||
      !registerData.password ||
      !registerData.confirm
    ) {
      setError("Please fill in all fields.")
      return
    }

    if (
      registerData.password !==
      registerData.confirm
    ) {
      setError("Passwords do not match.")
      return
    }

    if (registerData.password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      )
      return
    }

    try {
      setSubmitting(true)

      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: registerData.email,
            password: registerData.password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed"
        )
      }

      await login(
        registerData.email,
        registerData.password
      )

      navigate("/")
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Registration failed"
      )
    } finally {
      setSubmitting(false)
    }
  }

  function changeTab(nextTab: Tab) {
    setTab(nextTab)
    setError("")
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-5 py-20 text-text">
      <div className="w-full max-w-105">
        <div className="mb-9 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 no-underline"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <svg
                width="18"
                height="18"
                viewBox="0 0 16 16"
                fill="none"
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

            <span className="text-xl font-bold tracking-[-0.03em] text-text">
              EchoLab
            </span>
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="grid grid-cols-2 border-b border-border">
            <button
              type="button"
              onClick={() => changeTab("login")}
              className={`border-b-2 px-4 py-4.5 text-sm font-bold transition ${
                tab === "login"
                  ? "border-primary bg-bg text-text"
                  : "border-transparent text-text-muted hover:text-text"
              }`}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() =>
                changeTab("register")
              }
              className={`border-b-2 px-4 py-4.5 text-sm font-bold transition ${
                tab === "register"
                  ? "border-primary bg-bg text-text"
                  : "border-transparent text-text-muted hover:text-text"
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-500">
                {error}
              </div>
            )}

            {tab === "login" ? (
              <form
                onSubmit={handleLogin}
                className="flex flex-col gap-4"
              >
                <AuthField
                  label="Email address"
                  type="email"
                  value={loginData.email}
                  onChange={(value) =>
                    setLoginData((previous) => ({
                      ...previous,
                      email: value,
                    }))
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                />

                <AuthField
                  label="Password"
                  type="password"
                  value={loginData.password}
                  onChange={(value) =>
                    setLoginData((previous) => ({
                      ...previous,
                      password: value,
                    }))
                  }
                  placeholder="••••••••"
                  autoComplete="current-password"
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-[13px] font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <SubmitButton
                  label="Sign In"
                  loadingLabel="Signing in..."
                  loading={submitting}
                />
              </form>
            ) : (
              <form
                onSubmit={handleRegister}
                className="flex flex-col gap-4"
              >
                <AuthField
                  label="Email address"
                  type="email"
                  value={registerData.email}
                  onChange={(value) =>
                    setRegisterData(
                      (previous) => ({
                        ...previous,
                        email: value,
                      })
                    )
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                />

                <AuthField
                  label="Password"
                  type="password"
                  value={registerData.password}
                  onChange={(value) =>
                    setRegisterData(
                      (previous) => ({
                        ...previous,
                        password: value,
                      })
                    )
                  }
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                />

                <AuthField
                  label="Confirm password"
                  type="password"
                  value={registerData.confirm}
                  onChange={(value) =>
                    setRegisterData(
                      (previous) => ({
                        ...previous,
                        confirm: value,
                      })
                    )
                  }
                  placeholder="••••••••"
                  autoComplete="new-password"
                />

                <SubmitButton
                  label="Create Account"
                  loadingLabel="Creating account..."
                  loading={submitting}
                />

                <p className="text-center text-xs leading-5 text-text-muted">
                  By registering, you agree to our{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                  >
                    Terms
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </button>
                  .
                </p>
              </form>
            )}
          </div>
        </div>

        <p className="mt-5 text-center text-sm text-text-muted">
          {tab === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() =>
                  changeTab("register")
                }
                className="font-semibold text-primary hover:underline"
              >
                Create one free
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() =>
                  changeTab("login")
                }
                className="font-semibold text-primary hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </main>
  )
}

type AuthFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
  autoComplete?: string
}

function AuthField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
}: AuthFieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-text-muted">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-border-strong bg-bg px-3.5 py-3 text-sm text-text outline-none transition placeholder:text-text-muted focus:border-primary"
      />
    </div>
  )
}

function SubmitButton({
  label,
  loadingLabel,
  loading,
}: {
  label: string
  loadingLabel: string
  loading: boolean
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-1 w-full rounded-xl bg-primary px-4 py-3.75 text-[15px] font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? loadingLabel : label}
    </button>
  )
}