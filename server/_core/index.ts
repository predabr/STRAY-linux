import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { desktopRouter } from "../desktop/router";
import { initializeDesktopStore } from "../desktop/localStore";
import { createContext } from "./context";
import { serveStatic } from "./static";
import { createTrpcRateLimitMiddleware } from "../lib/requestRateLimit";
import { refreshSourceHandler } from "../scheduled/sourceRefresh";
import { getOperationalStatus } from "../lib/operationalStatus";
import { registerPublicApi } from "../publicApi";
import { registerPublicDownloadRedirects } from "../publicDownloads";
import { serverBindingHost } from "../lib/serverBinding";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

export async function startServer(setupDevelopment?: (app: express.Express, server: ReturnType<typeof createServer>) => Promise<void>) {
  if (process.env.DESKTOP_MODE === "1") await initializeDesktopStore();
  const app = express();
  app.set("trust proxy", 1);
  const server = createServer(app);
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()");
    if (process.env.NODE_ENV === "production") res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    next();
  });
  app.use(express.json({ limit: "8mb" }));
  app.use(express.urlencoded({ limit: "8mb", extended: true }));
  app.get("/api/health", (_req, res) => res.json({ ok: true, mode: process.env.DESKTOP_MODE === "1" ? "desktop" : "web", timestamp: new Date().toISOString() }));
  app.get("/api/status", async (_req, res) => { const status = await getOperationalStatus(process.env.DESKTOP_MODE === "1"); res.status(status.status === "operational" ? 200 : 503).json(status); });
  if (process.env.DESKTOP_MODE !== "1") {
    registerPublicApi(app);
    registerPublicDownloadRedirects(app);
  }
  app.get("/robots.txt", (req, res) => {
    const origin = `${req.protocol}://${req.get("host")}`;
    res.type("text/plain").send(`User-agent: *\nAllow: /\nDisallow: /dashboard\nDisallow: /admin\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`);
  });
  app.get("/sitemap.xml", (req, res) => {
    const origin = `${req.protocol}://${req.get("host")}`;
    const paths = ["/", "/games", "/benchmark", "/compare", "/distros", "/wiki", "/setup", "/linuxfix", "/assistant", "/scanner", "/status"];
    const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${origin}${path}</loc></url>`).join("")}</urlset>`;
    res.type("application/xml").send(body);
  });
  if (process.env.DESKTOP_MODE !== "1") {
    registerStorageProxy(app);
    registerOAuthRoutes(app);
  }
  app.post("/api/scheduled/source-refresh", refreshSourceHandler);
  // tRPC API
  app.use("/api/trpc", createTrpcRateLimitMiddleware());
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: (process.env.DESKTOP_MODE === "1" ? desktopRouter : appRouter) as typeof appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    if (!setupDevelopment) throw new Error("O entrypoint de desenvolvimento não forneceu o middleware Vite.");
    await setupDevelopment(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, serverBindingHost(process.env.DESKTOP_MODE), () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

if (process.env.NODE_ENV !== "development") startServer().catch(console.error);
