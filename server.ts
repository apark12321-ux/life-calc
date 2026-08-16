import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { generateDailySchedule, getAllPostsWithSchedule } from "./src/utils/postScheduler";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON request parser
  app.use(express.json());

  // 1. Real-time Financial Indicators API
  app.get("/api/financial-indicators", (req, res) => {
    res.json({
      success: true,
      kospi: { closePrice: "2,696.63", compareToPreviousClosePrice: "25.03", fluctuationsRatio: "0.92", direction: "FALLING", directionText: "▼" },
      usdkrw: { closePrice: "1,380.00", compareToPreviousClosePrice: "1.50", fluctuationsRatio: "0.11", direction: "RISING", directionText: "▲" },
      cd91: { closePrice: "3.55", compareToPreviousClosePrice: "0.00", fluctuationsRatio: "0.00", direction: "UNCHANGED", directionText: "-" }
    });
  });

  // 2. Automated Daily Posting Scheduler API
  // Returns today's automated upload timeline, proving:
  // - Category 1 post per day
  // - Randomized upload times
  // - Minimum 4 hours interval between posts
  app.get("/api/posts/schedule", (req, res) => {
    try {
      const now = new Date();
      const todayStr = now.toISOString().split("T")[0];
      const schedule = generateDailySchedule(todayStr, now);
      res.json({
        success: true,
        data: schedule,
        serverTime: now.toISOString()
      });
    } catch (err) {
      console.error("Failed to generate schedule:", err);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // 3. Posts API (Auto-published & scheduled articles)
  app.get("/api/posts", (req, res) => {
    try {
      const now = new Date();
      const category = req.query.category as string | undefined;
      const includeScheduled = req.query.includeScheduled === "true";
      
      let posts = getAllPostsWithSchedule(now, { includeScheduled });
      if (category && category !== "all") {
        posts = posts.filter(p => p.category === category);
      }

      res.json({
        success: true,
        count: posts.length,
        data: posts,
        serverTime: now.toISOString()
      });
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // 4. Single Post by ID API
  app.get("/api/posts/:id", (req, res) => {
    try {
      const now = new Date();
      const postId = req.params.id;
      const allPosts = getAllPostsWithSchedule(now, { includeScheduled: true });
      const found = allPosts.find(p => p.id === postId);

      if (!found) {
        return res.status(404).json({ success: false, error: "Post not found" });
      }

      res.json({
        success: true,
        data: found
      });
    } catch (err) {
      console.error("Failed to fetch post:", err);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // 5. Dynamic Sitemap & RSS Feeds serving
  app.get("/sitemap.xml", (req, res) => {
    try {
      const now = new Date();
      const todayStr = now.toISOString().split("T")[0];
      const publishedPosts = getAllPostsWithSchedule(now, { includeScheduled: false });

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
      
      // Main hubs
      const baseUrls = [
        { loc: "https://www.life-calc.kr/", priority: "1.0", changefreq: "daily" },
        { loc: "https://www.life-calc.kr/?c=insurance", priority: "0.9", changefreq: "daily" },
        { loc: "https://www.life-calc.kr/?c=wage", priority: "0.9", changefreq: "daily" },
        { loc: "https://www.life-calc.kr/?c=finance", priority: "0.9", changefreq: "daily" },
        { loc: "https://www.life-calc.kr/?c=property", priority: "0.9", changefreq: "daily" },
        { loc: "https://www.life-calc.kr/?c=life", priority: "0.9", changefreq: "daily" },
        { loc: "https://www.life-calc.kr/?c=magazine", priority: "0.95", changefreq: "hourly" }
      ];

      for (const u of baseUrls) {
        xml += `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${todayStr}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>\n`;
      }

      // Add dynamic auto-published posts
      for (const p of publishedPosts) {
        xml += `  <url>\n    <loc>https://www.life-calc.kr/?post=${p.id}</loc>\n    <lastmod>${p.date}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
      }

      xml += `</urlset>`;

      res.header("Content-Type", "application/xml; charset=utf-8");
      res.send(xml);
    } catch (err) {
      console.error("Sitemap service error:", err);
      res.status(500).end();
    }
  });

  app.get("/rss.xml", (req, res) => {
    try {
      const now = new Date();
      const publishedPosts = getAllPostsWithSchedule(now, { includeScheduled: false });

      let xml = `<?xml version="1.0" encoding="UTF-8" ?>\n<rss version="2.0">\n<channel>\n`;
      xml += `  <title>생활계산기 천국 - 2026 자동 발행 매거진</title>\n`;
      xml += `  <link>https://www.life-calc.kr</link>\n`;
      xml += `  <description>대한민국 4대보험, 임금, 금융, 부동산, 생활 세무 자동 업데이트 지식 매거진</description>\n`;
      xml += `  <language>ko-KR</language>\n`;
      xml += `  <lastBuildDate>${now.toUTCString()}</lastBuildDate>\n`;

      for (const p of publishedPosts.slice(0, 15)) {
        xml += `  <item>\n`;
        xml += `    <title><![CDATA[${p.title}]]></title>\n`;
        xml += `    <link>https://www.life-calc.kr/?post=${p.id}</link>\n`;
        xml += `    <description><![CDATA[${p.summary}]]></description>\n`;
        xml += `    <category>${p.categoryName}</category>\n`;
        xml += `    <author>apark12321@gmail.com (${p.author})</author>\n`;
        xml += `    <pubDate>${p.publishedAt ? new Date(p.publishedAt).toUTCString() : now.toUTCString()}</pubDate>\n`;
        xml += `    <guid>https://www.life-calc.kr/?post=${p.id}</guid>\n`;
        xml += `  </item>\n`;
      }

      xml += `</channel>\n</rss>`;

      res.header("Content-Type", "application/xml; charset=utf-8");
      res.send(xml);
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

  // 6. Vite Middleware or Static Assets serving
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

