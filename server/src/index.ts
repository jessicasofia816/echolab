import express from "express";
const app = express();
app.use(express.json());
import Database from "better-sqlite3";
import cors from "cors";

app.use(
  cors({
    origin: "http://localhost:5173",
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
