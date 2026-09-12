import express from "express";
const app = express();
app.use(express.json());
import { db } from "./db/db.js";
import cors from "cors";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { hashPassword, verifyPassword, } from "./utils/password.js";
import "dotenv/config";
import { createTables } from "./db/schema.js";
import { seedDatabase } from "./db/seed.js";
const PgSession = connectPgSimple(session);
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(session({
    store: new PgSession({
        pool: db,
        tableName: "user_sessions",
        createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET ||
        "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
}));
app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
});
const port = Number(process.env.PORT) || 3000;
async function startServer() {
    try {
        await db.query("SELECT NOW()");
        console.log("PostgreSQL connected");
        await createTables();
        await seedDatabase();
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}
startServer();
// --- hämta produkter ---
app.get("/api/products", async (req, res) => {
    try {
        const category = req.query.category;
        const sort = req.query.sort;
        const inStock = req.query.inStock;
        const badge = req.query.badge;
        const maxPrice = req.query.maxPrice;
        const search = req.query.search;
        let sql = "SELECT * FROM products";
        const conditions = [];
        const params = [];
        if (category) {
            params.push(String(category));
            conditions.push(`category_id = $${params.length}`);
        }
        if (inStock === "true") {
            conditions.push("in_stock = 1");
        }
        if (badge) {
            params.push(String(badge));
            conditions.push(`badge = $${params.length}`);
        }
        if (maxPrice) {
            params.push(Number(maxPrice));
            conditions.push(`price <= $${params.length}`);
        }
        if (search) {
            const searchTerm = `%${String(search)}%`;
            params.push(searchTerm);
            const nameIndex = params.length;
            params.push(searchTerm);
            const taglineIndex = params.length;
            params.push(searchTerm);
            const descriptionIndex = params.length;
            conditions.push(`
        (
          name ILIKE $${nameIndex}
          OR tagline ILIKE $${taglineIndex}
          OR description ILIKE $${descriptionIndex}
        )
      `);
        }
        if (conditions.length > 0) {
            sql += ` WHERE ${conditions.join(" AND ")}`;
        }
        switch (sort) {
            case "price-asc":
                sql += " ORDER BY price ASC";
                break;
            case "price-desc":
                sql += " ORDER BY price DESC";
                break;
            case "rating":
                sql += " ORDER BY rating DESC";
                break;
            case "newest":
                sql += " ORDER BY is_new DESC";
                break;
            case "featured":
            default:
                sql += " ORDER BY featured DESC";
                break;
        }
        const result = await db.query(sql, params);
        res.json(result.rows);
    }
    catch (error) {
        console.error("Failed to fetch products:", error);
        res.status(500).json({
            message: "Failed to fetch products",
        });
    }
});
// --- hämta kategorier ---
app.get("/api/categories", async (_req, res) => {
    try {
        const result = await db.query("SELECT * FROM categories");
        res.json(result.rows);
    }
    catch (error) {
        console.error("Failed to fetch categories:", error);
        res.status(500).json({
            message: "Failed to fetch categories",
        });
    }
});
// --- hämta produkt med id ---
app.get("/api/products/:id", async (req, res) => {
    try {
        const productId = req.params.id;
        const result = await db.query("SELECT * FROM products WHERE id = $1", [productId]);
        const product = result.rows[0];
        if (!product) {
            return res.status(404).json({
                error: "Product not found",
            });
        }
        res.json(product);
    }
    catch (error) {
        console.error("Failed to fetch product:", error);
        res.status(500).json({
            message: "Failed to fetch product",
        });
    }
});
// --- lägg till i varukorg ---
app.post("/api/cart", (req, res) => {
    const { productId, quantity = 1 } = req.body;
    if (!productId) {
        return res.status(400).json({
            message: "productId is required",
        });
    }
    if (typeof quantity !== "number" ||
        quantity < 1) {
        return res.status(400).json({
            message: "quantity must be at least 1",
        });
    }
    if (!req.session.cart) {
        req.session.cart = [];
    }
    const existingItem = req.session.cart.find((item) => item.productId === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    }
    else {
        req.session.cart.push({
            productId,
            quantity,
        });
    }
    res.status(201).json(req.session.cart);
});
// --- hämta varukorg ---
app.get("/api/cart", async (req, res) => {
    try {
        if (!req.session.cart) {
            req.session.cart = [];
        }
        const cartItems = await Promise.all(req.session.cart.map(async (item) => {
            const result = await db.query("SELECT * FROM products WHERE id = $1", [item.productId]);
            const product = result.rows[0];
            if (!product) {
                return null;
            }
            return {
                productId: item.productId,
                quantity: item.quantity,
                product,
            };
        }));
        res.json(cartItems.filter((item) => item !== null));
    }
    catch (error) {
        console.error("Failed to fetch cart:", error);
        res.status(500).json({
            message: "Failed to fetch cart",
        });
    }
});
// --- ta bort från varukorg ---
app.delete("/api/cart/:productId", (req, res) => {
    const { productId } = req.params;
    if (!req.session.cart) {
        req.session.cart = [];
    }
    req.session.cart = req.session.cart.filter((item) => item.productId !== productId);
    res.json(req.session.cart);
});
// --- töm varukorg ---
app.delete("/api/cart", (req, res) => {
    req.session.cart = [];
    res.json(req.session.cart);
});
// --- uppdatera kvantitet i varukorg ---
app.patch("/api/cart/:productId", (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;
    if (!req.session.cart) {
        req.session.cart = [];
    }
    if (typeof quantity !== "number" ||
        quantity < 1) {
        return res.status(400).json({
            message: "quantity must be at least 1",
        });
    }
    const item = req.session.cart.find((item) => item.productId === productId);
    if (!item) {
        return res.status(404).json({
            message: "Product not found in cart",
        });
    }
    item.quantity = quantity;
    res.json(req.session.cart);
});
app.post("/api/auth/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (typeof email !== "string" ||
            typeof password !== "string") {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }
        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail) {
            return res.status(400).json({
                message: "Email is required",
            });
        }
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters",
            });
        }
        const existingUserResult = await db.query("SELECT id FROM users WHERE email = $1", [normalizedEmail]);
        if (existingUserResult.rows[0]) {
            return res.status(409).json({
                message: "Email already registered",
            });
        }
        const passwordHash = await hashPassword(password);
        const result = await db.query(`
        INSERT INTO users (
          email,
          password_hash
        )
        VALUES ($1, $2)
        RETURNING id, email
      `, [normalizedEmail, passwordHash]);
        const user = result.rows[0];
        res.status(201).json({
            user,
        });
    }
    catch (error) {
        console.error("Failed to register user:", error);
        res.status(500).json({
            message: "Failed to register user",
        });
    }
});
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }
        const normalizedEmail = String(email)
            .trim()
            .toLowerCase();
        const result = await db.query(`
        SELECT id, email, password_hash
        FROM users
        WHERE email = $1
      `, [normalizedEmail]);
        const user = result.rows[0];
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }
        const passwordIsCorrect = await verifyPassword(password, user.password_hash);
        if (!passwordIsCorrect) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }
        req.session.userId = user.id;
        res.json({
            user: {
                id: user.id,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error("Failed to log in:", error);
        res.status(500).json({
            message: "Failed to log in",
        });
    }
});
app.get("/api/auth/me", async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({
                message: "Not authenticated",
            });
        }
        const result = await db.query(`
        SELECT id, email, created_at
        FROM users
        WHERE id = $1
      `, [userId]);
        const user = result.rows[0];
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        res.json({
            user,
        });
    }
    catch (error) {
        console.error("Failed to fetch user:", error);
        res.status(500).json({
            message: "Failed to fetch user",
        });
    }
});
app.post("/api/wishlist/:productId", async (req, res) => {
    try {
        const userId = req.session.userId;
        const { productId } = req.params;
        if (!userId) {
            return res.status(401).json({
                message: "Not authenticated",
            });
        }
        const productResult = await db.query(`
        SELECT id
        FROM products
        WHERE id = $1
      `, [productId]);
        if (!productResult.rows[0]) {
            return res.status(404).json({
                message: "Product not found",
            });
        }
        await db.query(`
        INSERT INTO wishlist (
          user_id,
          product_id
        )
        VALUES ($1, $2)
        ON CONFLICT (user_id, product_id)
        DO NOTHING
      `, [userId, productId]);
        res.status(201).json({
            message: "Product added to wishlist",
            productId,
        });
    }
    catch (error) {
        console.error("Failed to add to wishlist:", error);
        res.status(500).json({
            message: "Failed to add to wishlist",
        });
    }
});
app.get("/api/wishlist", async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({
                message: "Not authenticated",
            });
        }
        const result = await db.query(`
        SELECT products.*
        FROM wishlist
        JOIN products
          ON wishlist.product_id = products.id
        WHERE wishlist.user_id = $1
        ORDER BY wishlist.created_at DESC
      `, [userId]);
        res.json(result.rows);
    }
    catch (error) {
        console.error("Failed to fetch wishlist:", error);
        res.status(500).json({
            message: "Failed to fetch wishlist",
        });
    }
});
app.delete("/api/wishlist/:productId", async (req, res) => {
    try {
        const userId = req.session.userId;
        const { productId } = req.params;
        if (!userId) {
            return res.status(401).json({
                message: "Not authenticated",
            });
        }
        const result = await db.query(`
        DELETE FROM wishlist
        WHERE user_id = $1
        AND product_id = $2
      `, [userId, productId]);
        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Product not found in wishlist",
            });
        }
        res.json({
            message: "Product removed from wishlist",
            productId,
        });
    }
    catch (error) {
        console.error("Failed to remove from wishlist:", error);
        res.status(500).json({
            message: "Failed to remove from wishlist",
        });
    }
});
app.post("/api/orders", async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(401).json({
            message: "Not authenticated",
        });
    }
    const { contact, shipping: shippingDetails, } = req.body;
    if (!contact?.firstName ||
        !contact?.lastName ||
        !contact?.email ||
        !shippingDetails?.address ||
        !shippingDetails?.city ||
        !shippingDetails?.postcode ||
        !shippingDetails?.country) {
        return res.status(400).json({
            message: "Missing checkout information",
        });
    }
    if (!req.session.cart ||
        req.session.cart.length === 0) {
        return res.status(400).json({
            message: "Cart is empty",
        });
    }
    const client = await db.connect();
    try {
        const cartItems = await Promise.all(req.session.cart.map(async (item) => {
            const result = await client.query(`
            SELECT
              id,
              name,
              price
            FROM products
            WHERE id = $1
          `, [item.productId]);
            const product = result.rows[0];
            if (!product) {
                return null;
            }
            return {
                product,
                quantity: item.quantity,
            };
        }));
        const validCartItems = cartItems.filter((item) => item !== null);
        if (validCartItems.length === 0) {
            return res.status(400).json({
                message: "No valid products in cart",
            });
        }
        const subtotal = validCartItems.reduce((total, item) => total +
            item.product.price * item.quantity, 0);
        const shippingCost = subtotal >= 150 ? 0 : 14.9;
        const tax = subtotal * 0.21;
        const total = subtotal +
            shippingCost +
            tax;
        await client.query("BEGIN");
        const orderResult = await client.query(`
        INSERT INTO orders (
          user_id,
          status,
          subtotal,
          shipping,
          tax,
          total,
          first_name,
          last_name,
          email,
          phone,
          address,
          city,
          postcode,
          country
        )
        VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10, $11, $12, $13, $14
        )
        RETURNING id
      `, [
            userId,
            "Processing",
            subtotal,
            shippingCost,
            tax,
            total,
            contact.firstName.trim(),
            contact.lastName.trim(),
            contact.email.trim(),
            contact.phone?.trim() || null,
            shippingDetails.address.trim(),
            shippingDetails.city.trim(),
            shippingDetails.postcode.trim(),
            shippingDetails.country.trim(),
        ]);
        const orderId = orderResult.rows[0].id;
        for (const item of validCartItems) {
            await client.query(`
          INSERT INTO order_items (
            order_id,
            product_id,
            product_name,
            price,
            quantity
          )
          VALUES ($1, $2, $3, $4, $5)
        `, [
                orderId,
                item.product.id,
                item.product.name,
                item.product.price,
                item.quantity,
            ]);
        }
        await client.query("COMMIT");
        req.session.cart = [];
        res.status(201).json({
            message: "Order created",
            order: {
                id: orderId,
                status: "Processing",
                contact: {
                    firstName: contact.firstName.trim(),
                    lastName: contact.lastName.trim(),
                    email: contact.email.trim(),
                    phone: contact.phone?.trim() || null,
                },
                shippingAddress: {
                    address: shippingDetails.address.trim(),
                    city: shippingDetails.city.trim(),
                    postcode: shippingDetails.postcode.trim(),
                    country: shippingDetails.country.trim(),
                },
                subtotal,
                shipping: shippingCost,
                tax,
                total,
            },
        });
    }
    catch (error) {
        await client.query("ROLLBACK");
        console.error("Failed to create order:", error);
        res.status(500).json({
            message: "Failed to create order",
        });
    }
    finally {
        client.release();
    }
});
app.get("/api/orders", async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({
                message: "Not authenticated",
            });
        }
        const ordersResult = await db.query(`
        SELECT
          id,
          status,
          subtotal,
          shipping,
          tax,
          total,

          first_name,
          last_name,
          email,
          phone,

          address,
          city,
          postcode,
          country,

          created_at
        FROM orders
        WHERE user_id = $1
        ORDER BY created_at DESC
      `, [userId]);
        const orders = ordersResult.rows;
        const result = await Promise.all(orders.map(async (order) => {
            const itemsResult = await db.query(`
            SELECT
              product_id,
              product_name,
              price,
              quantity
            FROM order_items
            WHERE order_id = $1
          `, [order.id]);
            return {
                id: order.id,
                status: order.status,
                subtotal: order.subtotal,
                shipping: order.shipping,
                tax: order.tax,
                total: order.total,
                contact: {
                    firstName: order.first_name,
                    lastName: order.last_name,
                    email: order.email,
                    phone: order.phone,
                },
                shippingAddress: {
                    address: order.address,
                    city: order.city,
                    postcode: order.postcode,
                    country: order.country,
                },
                created_at: order.created_at,
                items: itemsResult.rows,
            };
        }));
        res.json(result);
    }
    catch (error) {
        console.error("Failed to fetch orders:", error);
        res.status(500).json({
            message: "Failed to fetch orders",
        });
    }
});
//# sourceMappingURL=index.js.map