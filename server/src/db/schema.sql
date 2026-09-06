CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  category_id TEXT NOT NULL,
  price INTEGER NOT NULL,
  image TEXT NOT NULL,
  badge TEXT,
  in_stock INTEGER NOT NULL DEFAULT 1,
  stock_count INTEGER NOT NULL DEFAULT 0,
  featured INTEGER NOT NULL DEFAULT 0,
  is_new INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL,

  FOREIGN KEY (category_id)
    REFERENCES categories(id)
);

ALTER TABLE products
ADD COLUMN original_price INTEGER;

ALTER TABLE products
ADD COLUMN images TEXT NOT NULL DEFAULT '[]';

ALTER TABLE products
ADD COLUMN rating REAL NOT NULL DEFAULT 0;

ALTER TABLE products
ADD COLUMN review_count INTEGER NOT NULL DEFAULT 0;

ALTER TABLE products
ADD COLUMN features TEXT NOT NULL DEFAULT '[]';

ALTER TABLE products
ADD COLUMN specs TEXT NOT NULL DEFAULT '[]';

ALTER TABLE products
ADD COLUMN tags TEXT NOT NULL DEFAULT '[]';

ALTER TABLE products
ADD COLUMN colors TEXT;

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE IF NOT EXISTS wishlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
      REFERENCES users(id)
      ON DELETE CASCADE,

    FOREIGN KEY (product_id)
      REFERENCES products(id)
      ON DELETE CASCADE,

    UNIQUE(user_id, product_id)
  ); 

CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'Processing',
    subtotal REAL NOT NULL,
    shipping REAL NOT NULL,
    tax REAL NOT NULL,
    total REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
      REFERENCES users(id)
      ON DELETE CASCADE  
);
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL,

    FOREIGN KEY (order_id)
      REFERENCES orders(id)
      ON DELETE CASCADE,

    FOREIGN KEY (product_id)
      REFERENCES products(id)
);
ALTER TABLE orders
ADD COLUMN first_name TEXT;

ALTER TABLE orders
ADD COLUMN last_name TEXT;

ALTER TABLE orders
ADD COLUMN email TEXT;

ALTER TABLE orders
ADD COLUMN phone TEXT;

ALTER TABLE orders
ADD COLUMN address TEXT;

ALTER TABLE orders
ADD COLUMN city TEXT;

ALTER TABLE orders
ADD COLUMN postcode TEXT;

ALTER TABLE orders
ADD COLUMN country TEXT;
