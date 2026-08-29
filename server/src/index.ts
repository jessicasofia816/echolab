import express from "express";
const app = express();
app.use(express.json());
import Database from "better-sqlite3";
import cors from "cors";
import session from "express-session"

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