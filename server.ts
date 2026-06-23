import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { DEFAULT_PAYMENT_SETTINGS } from "./src/lib/paymentSettings";
import { INITIAL_REVIEWS } from "./src/lib/reviews";
import { PRODUCTS } from "./src/data";

const DATA_DIR = path.join(process.cwd(), "data");
const SETTINGS_FILE = path.join(DATA_DIR, "paymentSettings.json");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");

function initializeDatabase() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_PAYMENT_SETTINGS, null, 2), "utf-8");
  }
  if (!fs.existsSync(PRODUCTS_FILE)) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(PRODUCTS, null, 2), "utf-8");
  }
  if (!fs.existsSync(REVIEWS_FILE)) {
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(INITIAL_REVIEWS, null, 2), "utf-8");
  }
}

async function startServer() {
  initializeDatabase();
  const app = express();
  const PORT = 3000;

  // Set up larger limits for base64 uploads (like custom QR codes, receipt proof images, product images)
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API Endpoints for Secure settings, products and reviews
  app.get("/api/settings", (req, res) => {
    try {
      const raw = fs.readFileSync(SETTINGS_FILE, "utf-8");
      res.json(JSON.parse(raw));
    } catch (e) {
      res.status(500).json({ error: "Failed to load payment settings" });
    }
  });

  app.post("/api/settings", (req, res) => {
    try {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(req.body, null, 2), "utf-8");
      res.json({ success: true, settings: req.body });
    } catch (e) {
      res.status(500).json({ error: "Failed to save payment settings" });
    }
  });

  app.get("/api/products", (req, res) => {
    try {
      const raw = fs.readFileSync(PRODUCTS_FILE, "utf-8");
      res.json(JSON.parse(raw));
    } catch (e) {
      res.status(500).json({ error: "Failed to load products" });
    }
  });

  app.post("/api/products", (req, res) => {
    try {
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(req.body, null, 2), "utf-8");
      res.json({ success: true, products: req.body });
    } catch (e) {
      res.status(500).json({ error: "Failed to save products" });
    }
  });

  app.get("/api/reviews", (req, res) => {
    try {
      const raw = fs.readFileSync(REVIEWS_FILE, "utf-8");
      res.json(JSON.parse(raw));
    } catch (e) {
      res.status(500).json({ error: "Failed to load reviews" });
    }
  });

  app.post("/api/reviews", (req, res) => {
    try {
      fs.writeFileSync(REVIEWS_FILE, JSON.stringify(req.body, null, 2), "utf-8");
      res.json({ success: true, reviews: req.body });
    } catch (e) {
      res.status(500).json({ error: "Failed to save reviews" });
    }
  });

  // Connect Vite Server Middleware (HMR disabled automatically in system config)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
