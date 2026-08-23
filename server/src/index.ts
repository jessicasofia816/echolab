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

// --- hämta produkter ---
app.get("/api/products", (_req, res) => {

  const category = _req.query.category

  if (category) {
    const products = db
      .prepare("SELECT * FROM products WHERE category_id = ?")
      .all(category)

    return res.json(products)
  }

  const products = db.prepare("SELECT * FROM products").all();
  res.json(products);
});

// --- hämta kategorier ---
app.get("/api/categories", (_req, res) => {
  const categories = db.prepare("SELECT * FROM categories").all();
  res.json(categories);
});
