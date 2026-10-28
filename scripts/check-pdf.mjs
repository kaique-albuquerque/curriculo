import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const PDF_PATH = "public/kaique-albuquerque-curriculo.pdf";

const MAX_PAGES = 2;
const MIN_CHARS_PER_PAGE = 300;

const ACCENT_SAMPLES = ["formação", "experiência", "currículo"];

const readPdf = async () => {
  const path = resolve(PDF_PATH);
  const data = new Uint8Array(await readFile(path));
  const doc = await getDocument({ data, useSystemFonts: true }).promise;
  const pages = [];

  for (let index = 1; index <= doc.numPages; index += 1) {
    const page = await doc.getPage(index);
    const content = await page.getTextContent();
    const text = content.items.map((item) => ("str" in item ? item.str : "")).join("");
    pages.push(text);
  }

  await doc.cleanup();

  return pages;
};

const failures = [];

let pages;

try {
  pages = await readPdf();
} catch (error) {
  console.error(`check-pdf falhou: nao foi possivel ler ${PDF_PATH} (${error.message})`);
  process.exit(1);
}

const fullText = pages.join("\n");
const flat = fullText.replace(/\s+/g, "");
const flatLower = flat.toLowerCase();
const digits = fullText.replace(/\D/g, "");

if (pages.length === 0) {
  failures.push("pdf sem paginas");
}

if (pages.length > MAX_PAGES) {
  failures.push(`esperado no maximo ${MAX_PAGES} paginas, encontrado ${pages.length}`);
}

pages.forEach((text, index) => {
  const chars = text.replace(/\s+/g, "").length;
  if (chars < MIN_CHARS_PER_PAGE) {
    failures.push(`pagina ${index + 1} tem apenas ${chars} caracteres`);
  }
});

if (!flat.includes("kaique.g.dias14@gmail.com")) {
  failures.push("e-mail truncado ou ausente no texto do PDF");
}

if (!digits.includes("5518988103982")) {
  failures.push("telefone ausente no texto do PDF");
}

if (!flat.includes("linkedin.com/in/kaique-albq")) {
  failures.push("URL do LinkedIn ausente no texto do PDF");
}

if (!flatLower.includes("github")) {
  failures.push("referencia ao GitHub ausente no texto do PDF");
}

const accentsFound = ACCENT_SAMPLES.filter((sample) => flatLower.includes(sample));
if (accentsFound.length === 0) {
  failures.push(
    `acentuacao perdida no texto do PDF (esperado ao menos uma de: ${ACCENT_SAMPLES.join(", ")})`,
  );
}

const perPage = pages.map((text) => text.replace(/\s+/g, "").length).join("/");

if (failures.length > 0) {
  console.error("check-pdf falhou:");
  for (const failure of failures) {
    console.error(` - ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log(`check-pdf ok (${PDF_PATH}: pages=${pages.length} charsPerPage=${perPage})`);
}
