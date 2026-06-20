import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON request parser
  app.use(express.json());

  // 1. Real-time Financial Indicators API
  app.get("/api/financial-indicators", async (req, res) => {
    const HEADERS = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "application/json, text/plain, */*",
      "Referer": "https://m.stock.naver.com/"
    };

    interface Indicator {
      closePrice: string;
      compareToPreviousClosePrice: string;
      fluctuationsRatio: string;
      direction: string;
      directionText: string;
    }

    // Tiered Fetch for KOSPI
    const fetchKOSPI = async (): Promise<Indicator> => {
      // 1. Polling API
      try {
        const r = await fetch("https://polling.finance.naver.com/api/realtime/domestic/index/KOSPI", { headers: HEADERS });
        const json = await r.json();
        const item = json?.result?.areas?.[0]?.datas?.[0];
        if (item) {
          const closePrice = Number(item.nv).toLocaleString("ko-KR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          const compare = Number(item.cv).toString();
          const pct = Number(item.cr).toFixed(2);
          const isRising = item.rf === "2" || item.rf === "4" || item.cv > 0;
          const isFalling = item.rf === "5" || item.rf === "1" || item.cv < 0;
          return {
            closePrice,
            compareToPreviousClosePrice: compare,
            fluctuationsRatio: pct,
            direction: isRising ? "RISING" : isFalling ? "FALLING" : "UNCHANGED",
            directionText: isRising ? "▲" : isFalling ? "▼" : "-"
          };
        }
      } catch (e) {
        console.error("fetchKOSPI Polling error:", e);
      }

      // 2. Mobile API
      try {
        const r = await fetch("https://api.stock.naver.com/index/KOSPI/basic", { headers: HEADERS });
        const val = await r.json();
        if (val && val.closePrice) {
          const isRising = val.compareToPreviousPrice?.code === "2" || Number(val.compareToPreviousClosePrice) > 0;
          const isFalling = val.compareToPreviousPrice?.code === "5" || Number(val.compareToPreviousClosePrice) < 0;
          return {
            closePrice: val.closePrice,
            compareToPreviousClosePrice: val.compareToPreviousClosePrice,
            fluctuationsRatio: val.fluctuationsRatio,
            direction: isRising ? "RISING" : isFalling ? "FALLING" : "UNCHANGED",
            directionText: isRising ? "▲" : isFalling ? "▼" : "-"
          };
        }
      } catch (e) {
        console.error("fetchKOSPI Mobile error:", e);
      }

      // 3. Yahoo Finance API
      try {
        const r = await fetch("https://query1.finance.yahoo.com/v8/finance/chart/^KS11");
        const json = await r.json();
        const meta = json?.chart?.result?.[0]?.meta;
        if (meta) {
          const current = meta.regularMarketPrice;
          const prev = meta.chartPreviousClose;
          const diff = current - prev;
          const pct = (diff / prev) * 100;
          const isRising = diff > 0;
          return {
            closePrice: current.toLocaleString("ko-KR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            compareToPreviousClosePrice: Math.abs(diff).toFixed(2),
            fluctuationsRatio: pct.toFixed(2),
            direction: isRising ? "RISING" : diff < 0 ? "FALLING" : "UNCHANGED",
            directionText: isRising ? "▲" : diff < 0 ? "▼" : "-"
          };
        }
      } catch (e) {
        console.error("fetchKOSPI Yahoo error:", e);
      }

      return { closePrice: "2,696.63", compareToPreviousClosePrice: "25.03", fluctuationsRatio: "0.92", direction: "FALLING", directionText: "▼" };
    };

    // Tiered Fetch for USD/KRW Exchange Rate
    const fetchUSDKRW = async (): Promise<Indicator> => {
      // 1. Polling API
      try {
        const r = await fetch("https://polling.finance.naver.com/api/realtime/world/exchange/FX_USDKRW", { headers: HEADERS });
        const json = await r.json();
        const item = json?.result?.areas?.[0]?.datas?.[0];
        if (item) {
          const closePrice = Number(item.nv).toLocaleString("ko-KR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          const compare = Number(item.cv).toString();
          const pct = Number(item.cr).toFixed(2);
          const isRising = item.rf === "2" || item.rf === "4" || item.cv > 0;
          const isFalling = item.rf === "5" || item.rf === "1" || item.cv < 0;
          return {
            closePrice,
            compareToPreviousClosePrice: compare,
            fluctuationsRatio: pct,
            direction: isRising ? "RISING" : isFalling ? "FALLING" : "UNCHANGED",
            directionText: isRising ? "▲" : isFalling ? "▼" : "-"
          };
        }
      } catch (e) {
        console.error("fetchUSDKRW Polling error:", e);
      }

      // 2. Mobile API
      try {
        const r = await fetch("https://api.stock.naver.com/marketindex/exchange/FX_USDKRW", { headers: HEADERS });
        const val = await r.json();
        if (val && val.closePrice) {
          const isRising = val.compareToPreviousPrice?.code === "2" || Number(val.compareToPreviousClosePrice) > 0;
          const isFalling = val.compareToPreviousPrice?.code === "5" || Number(val.compareToPreviousClosePrice) < 0;
          return {
            closePrice: val.closePrice,
            compareToPreviousClosePrice: val.compareToPreviousClosePrice,
            fluctuationsRatio: val.fluctuationsRatio,
            direction: isRising ? "RISING" : isFalling ? "FALLING" : "UNCHANGED",
            directionText: isRising ? "▲" : isFalling ? "▼" : "-"
          };
        }
      } catch (e) {
        console.error("fetchUSDKRW Mobile error:", e);
      }

      // 3. Yahoo Finance
      try {
        const r = await fetch("https://query1.finance.yahoo.com/v8/finance/chart/USDKRW=X");
        const json = await r.json();
        const meta = json?.chart?.result?.[0]?.meta;
        if (meta) {
          const current = meta.regularMarketPrice;
          const prev = meta.chartPreviousClose;
          const diff = current - prev;
          const pct = (diff / prev) * 100;
          const isRising = diff > 0;
          return {
            closePrice: current.toLocaleString("ko-KR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            compareToPreviousClosePrice: Math.abs(diff).toFixed(2),
            fluctuationsRatio: pct.toFixed(2),
            direction: isRising ? "RISING" : diff < 0 ? "FALLING" : "UNCHANGED",
            directionText: isRising ? "▲" : diff < 0 ? "▼" : "-"
          };
        }
      } catch (e) {
        console.error("fetchUSDKRW Yahoo error:", e);
      }

      return { closePrice: "1,380.00", compareToPreviousClosePrice: "1.50", fluctuationsRatio: "0.11", direction: "RISING", directionText: "▲" };
    };

    // Tiered Fetch for CD91 Interest Rate
    const fetchCD91 = async (): Promise<Indicator> => {
      try {
        const r = await fetch("https://api.stock.naver.com/marketindex/interest/IRR_CD91", { headers: HEADERS });
        const val = await r.json();
        if (val && val.closePrice) {
          const isRising = val.compareToPreviousPrice?.code === "2" || Number(val.compareToPreviousClosePrice) > 0;
          const isFalling = val.compareToPreviousPrice?.code === "5" || Number(val.compareToPreviousClosePrice) < 0;
          return {
            closePrice: val.closePrice,
            compareToPreviousClosePrice: val.compareToPreviousClosePrice,
            fluctuationsRatio: val.fluctuationsRatio || "0.00",
            direction: isRising ? "RISING" : isFalling ? "FALLING" : "UNCHANGED",
            directionText: isRising ? "▲" : isFalling ? "▼" : "-"
          };
        }
      } catch (e) {
        console.error("fetchCD91 Mobile error:", e);
      }

      return { closePrice: "3.55", compareToPreviousClosePrice: "0.00", fluctuationsRatio: "0.00", direction: "UNCHANGED", directionText: "-" };
    };

    try {
      const [kospi, usdkrw, cd91] = await Promise.all([
        fetchKOSPI(),
        fetchUSDKRW(),
        fetchCD91()
      ]);

      res.json({
        success: true,
        kospi,
        usdkrw,
        cd91
      });
    } catch (error) {
      console.error("Error fetching financial indicators:", error);
      res.status(500).json({ success: false, error: "Failed to fetch financial indicators" });
    }
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
      const pubId = process.env.VITE_ADSENSE_PUBLISHER_ID || "pub-8884323201509376";
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
