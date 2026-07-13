import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON request parser
  app.use(express.json());

  // 1. Real-time Financial Indicators API (Returns stable reference indicators)
  app.get("/api/financial-indicators", (req, res) => {
    res.json({
      success: true,
      kospi: { closePrice: "2,696.63", compareToPreviousClosePrice: "25.03", fluctuationsRatio: "0.92", direction: "FALLING", directionText: "▼" },
      usdkrw: { closePrice: "1,380.00", compareToPreviousClosePrice: "1.50", fluctuationsRatio: "0.11", direction: "RISING", directionText: "▲" },
      cd91: { closePrice: "3.55", compareToPreviousClosePrice: "0.00", fluctuationsRatio: "0.00", direction: "UNCHANGED", directionText: "-" }
    });
  });

  // 1.5 Sitemap & RSS Feeds serving
  app.get("/sitemap.xml", (req, res) => {
    try {
      res.header("Content-Type", "application/xml");
      const filePath = process.env.NODE_ENV === "production" 
        ? path.join(process.cwd(), "dist", "sitemap.xml")
        : path.join(process.cwd(), "public", "sitemap.xml");
      res.sendFile(filePath);
    } catch (err) {
      console.error("Sitemap service error:", err);
      res.status(500).end();
    }
  });

  app.get("/rss.xml", (req, res) => {
    try {
      res.header("Content-Type", "application/xml");
      const filePath = process.env.NODE_ENV === "production" 
        ? path.join(process.cwd(), "dist", "rss.xml")
        : path.join(process.cwd(), "public", "rss.xml");
      res.sendFile(filePath);
    } catch (err) {
      console.error("RSS service error:", err);
      res.status(500).end();
    }
  });

  // Serve ads.txt dynamically supporting customization
  app.get("/ads.txt", (req, res) => {
    try {
      const pubId = process.env.VITE_ADSENSE_PUBLISHER_ID || "pub-9552509372228899";
      res.header("Content-Type", "text/plain; charset=utf-8");
      res.send(`google.com, ${pubId}, DIRECT, f08c47fec0942fa0`);
    } catch (err) {
      console.error("ads.txt service error:", err);
      res.status(500).end();
    }
  });

  // 2. Vite Middleware or Static Assets serving
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
    console.log(`[Server] Running at http://localhost:${PORT}`);
  });
}

startServer();
