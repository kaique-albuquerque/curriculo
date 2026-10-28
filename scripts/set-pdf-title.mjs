import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { PDFDocument } from "pdf-lib";

const PDF_PATH = "public/kaique-albuquerque-curriculo.pdf";
const TITLE = "Currículo Kaique";

const path = resolve(PDF_PATH);
const source = await readFile(path);
const doc = await PDFDocument.load(source, { updateMetadata: false });

doc.setTitle(TITLE);
doc.setAuthor("Kaique Albuquerque");
doc.setCreator("Kaique Albuquerque");
doc.setProducer("Kaique Albuquerque");

await writeFile(path, await doc.save({ useObjectStreams: false }));

console.log(`${PDF_PATH}: title="${TITLE}"`);
