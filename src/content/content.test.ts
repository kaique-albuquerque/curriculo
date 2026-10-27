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

describe.each(Object.entries(contents))("%s projetos com prova publica", (locale, content) => {
  test("app publicado linka App Store e Google Play", () => {
    const app = content.projects.find((project) =>
      project.links.some((link) => link.url.includes("apps.apple.com")),
    );

    expect(app).toBeDefined();
    expect(app?.links.some((link) => link.url.includes("play.google.com"))).toBe(true);
    expect(app?.context.toLowerCase()).toMatch(locale === "pt" ? /publicado/ : /published/);
  });

  test("site institucional linka o dominio da empresa", () => {
    const site = content.projects.find((project) =>
      project.links.some((link) => link.url.includes("plumagenetics.com")),
    );

    expect(site).toBeDefined();
  });

  test("dashboard interno linka o sistema e declara confidencialidade", () => {
    const dashboard = content.projects.find((project) => /dashboard/i.test(project.title));

    expect(dashboard).toBeDefined();
    expect(dashboard?.links).toHaveLength(1);
    expect(dashboard?.links[0].url).toBe("https://dashboard.plumagenetics.com/");
    expect(dashboard?.note?.toLowerCase()).toMatch(
      locale === "pt" ? /confidencial/ : /confidential/,
    );
  });
});

describe.each(Object.entries(contents))("%s idiomas", (locale, content) => {
  test("espanhol aparece como B1 com comprovante do SIELE", () => {
    const spanish = content.languages.find((language) =>
      locale === "pt" ? language.name === "Espanhol" : language.name === "Spanish",
    );

    expect(spanish).toBeDefined();
    expect(spanish?.level).toBe("B1");
    expect(spanish?.issuer).toBe("SIELE");
    expect(spanish?.url).toBe(
      "https://drive.google.com/file/d/19CObvEgNUtG2Nzq72OdcDkqfSzZxu8Og/view?usp=sharing",
    );
  });

  test("todo idioma com comprovante usa https", () => {
    for (const language of content.languages) {
      if (language.url) {
        expect(language.url.startsWith("https://")).toBe(true);
        expect(language.issuer?.trim()).toBeTruthy();
      }
    }
  });

  test("existe rotulo para o comprovante", () => {
    expect(content.labels.languageProof.trim()).not.toBe("");
  });
});
