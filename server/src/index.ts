import express from "express";
const app = express();
app.use(express.json());
import Database from "better-sqlite3";
import cors from "cors";
import session from "express-session"
import {
  hashPassword,
  verifyPassword,
} from "./utils/password.js";

declare module "express-session" {
  interface SessionData {
    userId?: number

    cart: {
      productId: string
      quantity: number
    }[]
  }
}

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },

  })
);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// --- DB ---
const db = new Database("./src/db/database.db", { verbose: console.log });
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

function formatProduct(product: any) {
  return {
    ...product,

    images: product.images
      ? JSON.parse(product.images)
      : [],

    features: product.features
      ? JSON.parse(product.features)
      : [],

    specs: product.specs
      ? JSON.parse(product.specs)
      : {},

    tags: product.tags
      ? JSON.parse(product.tags)
      : [],

    colors: product.colors
      ? JSON.parse(product.colors)
      : null,
  }
}

// --- hämta produkter ---
app.get("/api/products", (req, res) => {
  const category = req.query.category
  const sort = req.query.sort
  const inStock = req.query.inStock
  const badge = req.query.badge
  const maxPrice = req.query.maxPrice

  let sql = "SELECT * FROM products"

  const conditions: string[] = []
  const params: unknown[] = []

  // Category
  if (category) {
    conditions.push("category_id = ?")
    params.push(String(category))
  }

  // In stock
  if (inStock === "true") {
    conditions.push("in_stock = 1")
  }

  // Badge
  if (badge) {
    conditions.push("badge = ?")
    params.push(String(badge))
  }

  // Max Price
  if (maxPrice) {
    conditions.push("price <= ?")
    params.push(Number(maxPrice))
  }

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`
  }

  // Sorting
  switch (sort) {
    case "price-asc":
      sql += " ORDER BY price ASC"
      break

    case "price-desc":
      sql += " ORDER BY price DESC"
      break

    case "rating":
      sql += " ORDER BY rating DESC"
      break

    case "newest":
      sql += " ORDER BY is_new DESC"
      break

    case "featured":
    default:
      sql += " ORDER BY featured DESC"
      break
  }

  const products = db
    .prepare(sql)
    .all(...params)

  res.json(products.map(formatProduct))
})

// --- hämta kategorier ---
app.get("/api/categories", (_req, res) => {
  const categories = db.prepare("SELECT * FROM categories").all();
  res.json(categories);
});

// --- hämta produkt med id ---
app.get("/api/products/:id", (req, res) => {
  const productId = req.params.id;
  const product = db
    .prepare("SELECT * FROM products WHERE id = ?")
    .get(productId);

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(formatProduct(product));
});

// --- hämta varukorg ---
app.get("/api/cart", (req, res) => {
  if (!req.session.cart) {
    req.session.cart = []
  }

  const cartItems = req.session.cart
    .map((item) => {
      const product = db
        .prepare("SELECT * FROM products WHERE id = ?")
        .get(item.productId)

      if (!product) {
        return null
      }

      return {
        productId: item.productId,
        quantity: item.quantity,
        product: formatProduct(product),
      }
    })
    .filter((item) => item !== null)

  res.json(cartItems)
})

// --- lägg till i varukorg ---
app.post("/api/cart", (req, res) => {
  const { productId, quantity = 1 } = req.body

  if (!productId) {
    return res.status(400).json({
      message: "productId is required",
    })
  }

  if (!req.session.cart) {
    req.session.cart = []
  }

  const existingItem = req.session.cart.find(
    (item) => item.productId === productId
  )

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    req.session.cart.push({
      productId,
      quantity,
    })
  }

  res.status(201).json(req.session.cart)
})

// --- ta bort från varukorg ---
app.delete("/api/cart/:productId", (req, res) => {
  const { productId } = req.params

  if (!req.session.cart) {
    req.session.cart = []
  }

  req.session.cart = req.session.cart.filter(
    (item) => item.productId !== productId
  )

  res.json(req.session.cart)
})

// --- töm varukorg ---
app.delete("/api/cart", (req, res) => {
  req.session.cart = []
  res.json(req.session.cart)
})

// --- uppdatera kvantitet i varukorg ---
app.patch("/api/cart/:productId", (req, res) => {
  const { productId } = req.params
  const { quantity } = req.body

  if (!req.session.cart) {
    req.session.cart = []
  }

  if (
    typeof quantity !== "number" ||
    quantity < 1
  ) {
    return res.status(400).json({
      message: "quantity must be at least 1",
    })
  }

  const item = req.session.cart.find(
    (item) => item.productId === productId
  )

  if (!item) {
    return res.status(404).json({
      message: "Product not found in cart",
    })
  }

  item.quantity = quantity

  res.json(req.session.cart)
})

app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body

    // 1. Kontrollera att email och password finns
    if (
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Email and password are required",
      })
    }

    // 2. Rensa email
    const normalizedEmail =
      email.trim().toLowerCase()

    // 3. Enkel validering
    if (!normalizedEmail) {
      return res.status(400).json({
        message: "Email is required",
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters",
      })
    }

    // 4. Kontrollera om email redan finns
    const existingUser = db
      .prepare(
        "SELECT id FROM users WHERE email = ?"
      )
      .get(normalizedEmail)

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      })
    }

    // 5. Hasha lösenordet
    const passwordHash =
      await hashPassword(password)

    // 6. Spara användaren
    const result = db
      .prepare(`
        INSERT INTO users (
          email,
          password_hash
        )
        VALUES (?, ?)
      `)
      .run(
        normalizedEmail,
        passwordHash
      )

    // 7. Skicka tillbaka användaren
    res.status(201).json({
      user: {
        id: result.lastInsertRowid,
        email: normalizedEmail,
      },
    })
  } catch (error) {
    console.error(
      "Failed to register user:",
      error
    )

    res.status(500).json({
      message: "Failed to register user",
    })
  }
})

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    })
  }

  const user = db
    .prepare(`
      SELECT id, email, password_hash
      FROM users
      WHERE email = ?
    `)
    .get(email) as
    | {
      id: number
      email: string
      password_hash: string
    }
    | undefined

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
    })
  }

  const passwordIsCorrect =
    await verifyPassword(
      password,
      user.password_hash
    )

  if (!passwordIsCorrect) {
    return res.status(401).json({
      message: "Invalid email or password",
    })
  }

  req.session.userId = user.id

  res.json({
    user: {
      id: user.id,
      email: user.email,
    },
  })
})
app.get("/api/auth/me", (req, res) => {
  const userId = req.session.userId

  if (!userId) {
    return res.status(401).json({
      message: "Not authenticated",
    })
  }

  const user = db
    .prepare(`
      SELECT id, email, created_at
      FROM users
      WHERE id = ?
    `)
    .get(userId) as
    | {
        id: number
        email: string
        created_at: string
      }
    | undefined

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    })
  }

  res.json({
    user,
  })
})
app.post("/api/auth/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        message: "Could not log out",
      })
    }

    res.json({
      message: "Logged out",
    })
  })
})

app.post("/api/wishlist/:productId", (req, res) => {
  const userId = req.session.userId
  const { productId } = req.params

  if (!userId) {
    return res.status(401).json({
      message: "Not authenticated",
    })
  }

  const product = db
    .prepare(`
      SELECT id
      FROM products
      WHERE id = ?
    `)
    .get(productId)

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    })
  }

  db.prepare(`
    INSERT OR IGNORE INTO wishlist (
      user_id,
      product_id
    )
    VALUES (?, ?)
  `).run(userId, productId)

  res.status(201).json({
    message: "Product added to wishlist",
    productId,
  })
})
app.get("/api/wishlist", (req, res) => {
  const userId = req.session.userId

  if (!userId) {
    return res.status(401).json({
      message: "Not authenticated",
    })
  }

  const products = db
    .prepare(`
      SELECT products.*
      FROM wishlist
      JOIN products
        ON wishlist.product_id = products.id
      WHERE wishlist.user_id = ?
      ORDER BY wishlist.created_at DESC
    `)
    .all(userId)

  res.json(
    products.map((product) =>
      formatProduct(product)
    )
  )
})
app.delete("/api/wishlist/:productId", (req, res) => {
  const userId = req.session.userId
  const { productId } = req.params

  if (!userId) {
    return res.status(401).json({
      message: "Not authenticated",
    })
  }

  const result = db
    .prepare(`
      DELETE FROM wishlist
      WHERE user_id = ?
      AND product_id = ?
    `)
    .run(userId, productId)

  if (result.changes === 0) {
    return res.status(404).json({
      message: "Product not found in wishlist",
    })
  }

  res.json({
    message: "Product removed from wishlist",
    productId,
  })
})