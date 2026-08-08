import express from "express";
const app = express();
app.use(express.json());
app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});
const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
