import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { createServer } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const locales = ["pt", "en"];

const outputFor = (locale) =>
  resolve(projectRoot, "public", `kaique-albuquerque-curriculo-${locale}.pdf`);

const server = await createServer({
  root: projectRoot,
  logLevel: "warn",
  server: {
    host: "127.0.0.1",
    port: 4177,
    strictPort: false,
  },
});

let browser;

try {
  await mkdir(dirname(outputFor("pt")), { recursive: true });
  await server.listen();

  const address = server.httpServer?.address();
  if (!address || typeof address === "string") {
    throw new Error("Nao foi possivel determinar a URL local para gerar o PDF.");
  }

  const baseUrl = `http://127.0.0.1:${address.port}/`;
  browser = await chromium.launch();

  for (const locale of locales) {
    const page = await browser.newPage({
      viewport: { width: 1280, height: 1800 },
    });

    await page.emulateMedia({ media: "print" });
    await page.goto(`${baseUrl}?lang=${locale}`, { waitUntil: "networkidle" });
    await page.waitForFunction((expected) => {
      const lang = document.documentElement.lang.toLowerCase();
      return lang.startsWith(expected);
    }, locale);

    const outputPath = outputFor(locale);

    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
      margin: {
        top: "12mm",
        right: "10mm",
        bottom: "12mm",
        left: "10mm",
      },
    });

    await page.close();
    console.log(`PDF ${locale} gerado em ${outputPath}`);
  }
} catch (error) {
  console.error("Falha ao gerar PDF do curriculo.");
  console.error(error);
  process.exitCode = 1;
} finally {
  if (browser) {
    await browser.close();
  }

  await server.close();
}
