import {
  useState,
  type FormEvent,
} from "react"

type Topic =
  | "support"
  | "press"
  | "dealers"
  | "general"

const contactCards: {
  icon: string
  label: string
  description: string
  email: string
  id: Topic
}[] = [
  {
    icon: "🛠",
    label: "Product Support",
    description:
      "Setup help, troubleshooting and warranties.",
    email: "support@echolab.io",
    id: "support",
  },
  {
    icon: "🤝",
    label: "Dealers & Distribution",
    description:
      "Become a stockist or reseller.",
    email: "dealers@echolab.io",
    id: "dealers",
  },
  {
    icon: "📰",
    label: "Press & Media",
    description:
      "Reviews, interviews and press enquiries.",
    email: "press@echolab.io",
    id: "press",
  },
  {
    icon: "💬",
    label: "General Enquiries",
    description:
      "Questions, feedback or just saying hello.",
    email: "hello@echolab.io",
    id: "general",
  },
]

export default function ContactPage() {
  const [topic, setTopic] =
    useState<Topic>("general")

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      subject: "",
      message: "",
    })

  const [sent, setSent] =
    useState(false)

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setSent(true)
  }

  return (
    <main className="min-h-screen bg-bg">
      {/* Hero */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-primary">
            Get in Touch
          </p>

          <h1 className="font-serif text-4xl leading-tight text-text sm:text-5xl lg:text-6xl">
            We're here to help.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-text-muted sm:text-lg">
            Whether you need product support,
            want to collaborate, or simply have
            a question about EchoLab, we'd love
            to hear from you.
          </p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="border-y border-border bg-surface px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contactCards.map((card) => {
            const active =
              topic === card.id

            return (
              <button
                key={card.id}
                type="button"
                onClick={() =>
                  setTopic(card.id)
                }
                className={`
                  rounded-2xl
                  border
                  p-5
                  text-left
                  transition-all
                  ${
                    active
                      ? "border-primary bg-bg/5"
                      : "border-border bg-bg hover:border-border-strong"
                  }
                `}
              >
                <div className="text-3xl">
                  {card.icon}
                </div>

                <h2 className="mt-4 text-sm font-bold text-text">
                  {card.label}
                </h2>

                <p className="mt-2 text-xs leading-5 text-text-muted">
                  {card.description}
                </p>

                <a
                  href={`mailto:${card.email}`}
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                  className="mt-3 inline-block font-mono text-xs text-primary no-underline hover:underline"
                >
                  {card.email}
                </a>
              </button>
            )
          })}
        </div>
      </section>

      {/* Form + sidebar */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* Form */}
          <div>
            <h2 className="font-serif text-3xl text-text">
              Send a message
            </h2>

            {sent ? (
              <div className="mt-8 rounded-2xl border border-green-500/20 bg-green-500/10 p-10 text-center">
                <div className="text-5xl text-green-500">
                  ✓
                </div>

                <h3 className="mt-4 text-xl font-bold text-green-500">
                  Message sent!
                </h3>

                <p className="mt-2 text-sm leading-6 text-text-muted">
                  Thanks for reaching out.
                  We'll get back to you as soon
                  as possible.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSent(false)

                    setForm({
                      name: "",
                      email: "",
                      subject: "",
                      message: "",
                    })
                  }}
                  className="mt-6 rounded-xl border border-border-strong bg-surface px-5 py-3 text-sm font-semibold text-text transition-colors hover:bg-surface-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <ContactField
                    label="Your name"
                    value={form.name}
                    placeholder="Lars Eriksson"
                    required
                    autoComplete="name"
                    onChange={(value) =>
                      setForm(
                        (current) => ({
                          ...current,
                          name: value,
                        })
                      )
                    }
                  />

                  <ContactField
                    label="Email address"
                    type="email"
                    value={form.email}
                    placeholder="lars@studio.se"
                    required
                    autoComplete="email"
                    onChange={(value) =>
                      setForm(
                        (current) => ({
                          ...current,
                          email: value,
                        })
                      )
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-text-muted">
                    Topic
                  </label>

                  <select
                    value={topic}
                    onChange={(event) =>
                      setTopic(
                        event.target
                          .value as Topic
                      )
                    }
                    className="
                      w-full
                      rounded-xl
                      border
                      border-border-strong
                      bg-surface
                      px-4
                      py-3
                      text-sm
                      text-text
                      outline-none
                      transition-colors
                      focus:border-primary
                    "
                  >
                    <option value="general">
                      General Enquiry
                    </option>

                    <option value="support">
                      Product Support
                    </option>

                    <option value="dealers">
                      Dealers & Distribution
                    </option>

                    <option value="press">
                      Press & Media
                    </option>
                  </select>
                </div>

                <ContactField
                  label="Subject"
                  value={form.subject}
                  placeholder="How can we help?"
                  required
                  onChange={(value) =>
                    setForm(
                      (current) => ({
                        ...current,
                        subject: value,
                      })
                    )
                  }
                />

                <div>
                  <label className="mb-2 block text-xs font-semibold text-text-muted">
                    Message
                  </label>

                  <textarea
                    value={form.message}
                    onChange={(event) =>
                      setForm(
                        (current) => ({
                          ...current,
                          message:
                            event.target
                              .value,
                        })
                      )
                    }
                    placeholder="Tell us more..."
                    required
                    rows={7}
                    className="
                      min-h-40
                      w-full
                      resize-y
                      rounded-xl
                      border
                      border-border-strong
                      bg-surface
                      px-4
                      py-3
                      text-sm
                      text-text
                      outline-none
                      transition-colors
                      placeholder:text-text-muted
                      focus:border-primary
                    "
                  />
                </div>

                <button
                  type="submit"
                  className="
                    rounded-xl
                    bg-primary
                    px-6
                    py-3.5
                    text-sm
                    font-bold
                    text-white
                    transition-opacity
                    hover:opacity-90
                  "
                >
                  Send Message →
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h3 className="text-sm font-bold text-text">
                Studio & Office
              </h3>

              <div className="mt-5 space-y-5">
                <InfoRow
                  label="Address"
                  value={
                    <>
                      Liljeholmstorget 7
                      <br />
                      117 61 Stockholm,
                      Sweden
                    </>
                  }
                />

                <InfoRow
                  label="Hours"
                  value={
                    <>
                      Mon – Fri:
                      09:00 – 17:00 CET
                      <br />
                      Sat:
                      10:00 – 14:00 CET
                    </>
                  }
                />

                <InfoRow
                  label="Phone"
                  value="+46 8 123 45 67"
                />

                <InfoRow
                  label="Response time"
                  value="We typically reply within one business day."
                />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6">
              <h3 className="text-sm font-bold text-text">
                Follow EchoLab
              </h3>

              <div className="mt-4 space-y-2">
                <SocialLink
                  platform="Instagram"
                  handle="@echolabstudio"
                />

                <SocialLink
                  platform="YouTube"
                  handle="EchoLab Official"
                />

                <SocialLink
                  platform="Spotify"
                  handle="EchoLab Playlists"
                />

                <SocialLink
                  platform="SoundCloud"
                  handle="/echolab"
                />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}

function ContactField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  autoComplete,
}: {
  label: string
  value: string
  onChange: (
    value: string
  ) => void
  type?: string
  placeholder?: string
  required?: boolean
  autoComplete?: string
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-text-muted">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={placeholder}
        required={required}
        autoComplete={
          autoComplete
        }
        className="
          w-full
          rounded-xl
          border
          border-border-strong
          bg-surface
          px-4
          py-3
          text-sm
          text-text
          outline-none
          transition-colors
          placeholder:text-text-muted
          focus:border-primary
        "
      />
    </div>
  )
}

function InfoRow({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted">
        {label}
      </p>

      <div className="mt-1 text-sm leading-6 text-text">
        {value}
      </div>
    </div>
  )
}

function SocialLink({
  platform,
  handle,
}: {
  platform: string
  handle: string
}) {
  return (
    <a
      href="#"
      className="
        flex
        items-center
        justify-between
        gap-4
        rounded-xl
        border
        border-transparent
        bg-surface
        px-4
        py-3
        text-sm
        no-underline
        transition-colors
        hover:border-border
      "
    >
      <span className="font-semibold text-text">
        {platform}
      </span>

      <span className="font-mono text-xs text-text-muted">
        {handle}
      </span>
    </a>
  )
}