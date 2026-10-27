import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { createServer } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const outputPath = resolve(projectRoot, "public", "og-image.png");

const server = await createServer({
  root: projectRoot,
  logLevel: "warn",
  server: {
    host: "127.0.0.1",
    port: 4178,
    strictPort: false,
  },
});

let browser;

try {
  await mkdir(dirname(outputPath), { recursive: true });
  await server.listen();

  const address = server.httpServer?.address();
  if (!address || typeof address === "string") {
    throw new Error("Nao foi possivel determinar a URL local para gerar a imagem OG.");
  }

  browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  await page.goto(`http://127.0.0.1:${address.port}/?lang=pt`, {
    waitUntil: "networkidle",
  });
  await page.waitForSelector(".hero-copy");

  await page.screenshot({
    path: outputPath,
    clip: { x: 0, y: 0, width: 1200, height: 630 },
  });

  console.log(`Imagem OG gerada em ${outputPath}`);
} catch (error) {
  console.error("Falha ao gerar a imagem OG do curriculo.");
  console.error(error);
  process.exitCode = 1;
} finally {
  if (browser) {
    await browser.close();
  }

  await server.close();
}
