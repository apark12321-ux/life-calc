import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { ALL_BLOG_POSTS } from "./src/data/postsData";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON request parser
  app.use(express.json());

  // 1. Posts API
  app.get("/api/posts", (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      let posts = ALL_BLOG_POSTS;
      if (category && category !== "all") {
        posts = posts.filter(p => p.category === category);
      }

      res.json({
        success: true,
        count: posts.length,
        data: posts
      });
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // 2. Single Post by ID API
  app.get("/api/posts/:id", (req, res) => {
    try {
      const postId = req.params.id;
      const found = ALL_BLOG_POSTS.find(p => p.id === postId);

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

  // 3. Dynamic Sitemap XML
  app.get("/sitemap.xml", (req, res) => {
    try {
      const todayStr = new Date().toISOString().split("T")[0];

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
      
      // Main category and portal hubs
      const baseUrls = [
        { loc: "https://www.life-calc.kr/", priority: "1.0", changefreq: "daily" },
        { loc: "https://www.life-calc.kr/?cat=insurance", priority: "0.9", changefreq: "weekly" },
        { loc: "https://www.life-calc.kr/?cat=wage", priority: "0.9", changefreq: "weekly" },
        { loc: "https://www.life-calc.kr/?cat=finance", priority: "0.9", changefreq: "weekly" },
        { loc: "https://www.life-calc.kr/?cat=property", priority: "0.9", changefreq: "weekly" },
        { loc: "https://www.life-calc.kr/?cat=life", priority: "0.9", changefreq: "weekly" },
        { loc: "https://www.life-calc.kr/?cat=calculators", priority: "0.85", changefreq: "weekly" },
        { loc: "https://www.life-calc.kr/?cat=about", priority: "0.8", changefreq: "monthly" }
      ];

      for (const u of baseUrls) {
        xml += `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${todayStr}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>\n`;
      }

      // Add all 32 blog posts
      for (const p of ALL_BLOG_POSTS) {
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

  // 4. RSS Feed for human blog
  app.get("/rss.xml", (req, res) => {
    try {
      const now = new Date();

      let xml = `<?xml version="1.0" encoding="UTF-8" ?>\n<rss version="2.0">\n<channel>\n`;
      xml += `  <title>생활금융 실전 가이드</title>\n`;
      xml += `  <link>https://www.life-calc.kr</link>\n`;
      xml += `  <description>2026년 4대보험, 급여·퇴직금, 연봉 실수령액, 부동산 세무 및 재테크 실전 정보 가이드</description>\n`;
      xml += `  <language>ko-KR</language>\n`;
      xml += `  <lastBuildDate>${now.toUTCString()}</lastBuildDate>\n`;

      for (const p of ALL_BLOG_POSTS) {
        xml += `  <item>\n`;
        xml += `    <title><![CDATA[${p.title}]]></title>\n`;
        xml += `    <link>https://www.life-calc.kr/?post=${p.id}</link>\n`;
        xml += `    <description><![CDATA[${p.summary}]]></description>\n`;
        xml += `    <category>${p.categoryName}</category>\n`;
        xml += `    <author>contact@life-calc.kr (${p.author})</author>\n`;
        xml += `    <pubDate>${new Date(p.date).toUTCString()}</pubDate>\n`;
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

  // 5. Robots.txt
  app.get("/robots.txt", (req, res) => {
    const robots = `User-agent: *
Allow: /
Sitemap: https://www.life-calc.kr/sitemap.xml
`;
    res.header("Content-Type", "text/plain; charset=utf-8");
    res.send(robots);
  });

  // Vite middleware for development vs Static serving for production
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
