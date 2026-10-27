import { describe, expect, test } from "vitest";
import { pt } from "./pt";
import { en } from "./en";

const contents = { pt, en };

describe.each(Object.entries(contents))("%s", (locale, content) => {
  test("toda experiencia tem empresa", () => {
    for (const job of content.experiences) {
      expect(job.company.trim()).not.toBe("");
    }
  });

  test("github aponta para o usuario canonico", () => {
    expect(content.profile.github).toBe("https://github.com/kaique-albuquerque");
    for (const project of content.projects) {
      for (const link of project.links) {
        expect(link.url).not.toContain("kaique-albquerque");
      }
    }
  });

  test("nenhum texto contem o handle com typo", () => {
    expect(JSON.stringify(content)).not.toContain("kaique-albquerque");
  });

  test("pdf do locale usa o arquivo do locale", () => {
    expect(content.profile.resumePdf).toBe(`/kaique-albuquerque-curriculo-${locale}.pdf`);
  });

  test("ids de navegacao apontam para secoes existentes", () => {
    const hrefs = content.navItems.map((item) => item.href);
    expect(hrefs).toEqual(["#experiencia", "#projetos", "#stack", "#formacao", "#contato"]);
  });
});

test("pt nao usa palavras sem acento", () => {
  const blocklist = [
    "Curriculo",
    "Experiencia",
    "Tecnico",
    "Formacao",
    "Automacao",
    "Analise",
    "Logica",
    "Implantacao",
    "Programacao",
    "Pos-graduacao",
    "Integracao",
    "Visao",
    "Conclusao",
  ];
  const serialized = JSON.stringify(pt);
  for (const word of blocklist) {
    expect(serialized).not.toContain(word);
  }
});

test("locales tem a mesma estrutura", () => {
  expect(en.experiences.length).toBe(pt.experiences.length);
  expect(en.projects.length).toBe(pt.projects.length);
  expect(en.skillGroups.length).toBe(pt.skillGroups.length);
  expect(en.education.length).toBe(pt.education.length);
  expect(en.certificates.length).toBe(pt.certificates.length);
  expect(Object.keys(en.labels).sort()).toEqual(Object.keys(pt.labels).sort());
});
