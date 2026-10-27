import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const pdfFor = (locale) => `public/kaique-albuquerque-curriculo-${locale}.pdf`;

const MIN_CHARS_PER_PAGE = 300;

const SECTION_LABELS = new Set([
  "EXPERIÊNCIA",
  "EXPERIENCE",
  "PROJETOS",
  "PROJECTS",
  "STACK",
  "FORMAÇÃO",
  "EDUCATION",
  "CERTIFICADOS",
  "CERTIFICATES",
  "IDIOMAS",
  "LANGUAGES",
  "Competências por área",
  "Skills by area",
  "Projetos aplicados",
  "Selected projects",
  "Trajetória em produto e dados",
  "Product and data track record",
]);

const readPdf = async (locale) => {
  const path = resolve(pdfFor(locale));
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
const report = [];

for (const locale of ["pt", "en"]) {
  let pages;

  try {
    pages = await readPdf(locale);
  } catch (error) {
    failures.push(`${locale}: nao foi possivel ler ${pdfFor(locale)} (${error.message})`);
    continue;
  }

  const fullText = pages.join("\n");
  const flat = fullText.replace(/\s+/g, "");
  const digits = fullText.replace(/\D/g, "");

  if (locale === "pt" && pages.length !== 2) {
    failures.push(`pt: esperado exatamente 2 paginas, encontrado ${pages.length}`);
  }

  if (locale === "en" && pages.length > 2) {
    failures.push(`en: maximo de 2 paginas, encontrado ${pages.length}`);
  }

  pages.forEach((text, index) => {
    const chars = text.replace(/\s+/g, "").length;
    if (chars < MIN_CHARS_PER_PAGE) {
      failures.push(`${locale}: pagina ${index + 1} tem apenas ${chars} caracteres`);
    }
  });

  if (!flat.includes("github.com/kaique-albuquerque")) {
    failures.push(`${locale}: URL do GitHub ausente no texto do PDF`);
  }

  if (!flat.includes("linkedin.com/in/kaique-dias")) {
    failures.push(`${locale}: URL do LinkedIn ausente no texto do PDF`);
  }

  if (!digits.includes("5518988103982")) {
    failures.push(`${locale}: telefone ausente no texto do PDF`);
  }

  if (!flat.includes("kaique.g.dias14@gmail.com")) {
    failures.push(`${locale}: e-mail truncado ou ausente no texto do PDF`);
  }

  const accentSample = locale === "pt" ? "Formação" : "São Paulo";
  if (!fullText.includes(accentSample)) {
    failures.push(`${locale}: acentuacao perdida no texto do PDF (esperado "${accentSample}")`);
  }

  pages.slice(0, -1).forEach((text, index) => {
    const lastLine = text.trim().split("\n").pop() ?? "";
    if (SECTION_LABELS.has(lastLine.trim())) {
      failures.push(
        `${locale}: pagina ${index + 1} termina com o titulo de secao "${lastLine.trim()}"`,
      );
    }
  });

  for (const forbidden of ["CURRICULOONLINE", "PRIORITARIO", "Objetivo"]) {
    if (flat.includes(forbidden)) {
      failures.push(`${locale}: texto proibido encontrado "${forbidden}"`);
    }
  }

  const perPage = pages.map((text) => text.replace(/\s+/g, "").length).join("/");
  report.push(`${locale}: pages=${pages.length} chars=${perPage}`);
  console.log(`ok ${locale}: pages=${pages.length} charsPerPage=${perPage}`);
}

if (failures.length > 0) {
  console.error("check-pdf falhou:");
  for (const failure of failures) {
    console.error(` - ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log(`check-pdf ok (${report.join(", ")})`);
}
