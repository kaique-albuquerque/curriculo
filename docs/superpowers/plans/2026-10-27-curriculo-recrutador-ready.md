# Curriculo pronto para recrutador (PT + EN) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reestruturar o curriculo online para leitura de recrutador em 30 segundos, com conteudo PT e EN, PDF de 2 paginas por idioma e GitHub valido como prova tecnica.

**Architecture:** O conteudo sai de `src/data.ts` e vira um contrato tipado em `src/content/{types,pt,en,index}.ts`; um resolvedor de locale (`src/i18n/locale.ts`) escolhe o conteudo a partir de `?lang`, `localStorage` e `navigator.language`. `src/App.tsx` passa a renderizar a arvore a partir do `Content` ativo, com hero compacto, experiencia em largura total e projetos em grade propria. A impressao vira uma coluna e `scripts/generate-pdf.mjs` gera um PDF por locale, validado por `scripts/check-pdf.mjs` dentro do build.

**Tech Stack:** React 18, TypeScript, Vite 5, CSS puro, Playwright (PDF e OG), Vitest + jsdom + Testing Library (testes), pdfjs-dist (assercoes do PDF).

**Spec:** `docs/superpowers/specs/2026-10-27-curriculo-recrutador-ready-design.md`

## Global Constraints

- Toda copia de conteudo vem da spec; nenhuma metrica, data, empresa ou nivel nao confirmado pode ser inventado.
- Portugues com acentos corretos (UTF-8). A regra ASCII anterior esta revogada.
- Handle canonico do GitHub: `https://github.com/kaique-albuquerque`. A string `kaique-albquerque` nao pode existir no repositorio.
- Campos opcionais (`institution?`, `status?`, `languages`) nao renderizam nada quando ausentes; nunca imprimir `undefined`.
- Nomes de PDF: `kaique-albuquerque-curriculo-pt.pdf` e `kaique-albuquerque-curriculo-en.pdf`.
- Commits em Conventional Commits (`feat:`, `fix:`, `style:`, `docs:`, `test:`, `chore:`), um por task.
- `npm test`, `npx tsc -b` e `npm run build` verdes ao final de cada task que os toque.

## Review Focus

- `?lang=xx` (valor invalido) deve cair para `pt` sem quebrar a renderizacao — testado em Task 3.
- `localStorage["curriculo-locale"]` com valor arbitrario/antigo deve ser ignorado, nao usado como locale — testado em Task 3.
- Conteudo opcional ausente (idiomas vazio, `institution`/`status` vazios) nao deve renderizar secao vazia nem `undefined` — testado em Task 4.
- Curriculo que cresce (novo emprego, novo certificado) deve falhar de forma explicita quando o PDF passar de 2 paginas, em vez de gerar paginacao quebrada — testado em Task 6.
- Extracao de texto do PDF com acentos deve devolver URLs e telefone intactos, para ATS e para quem imprime — testado em Task 6.

---

### Task 1: Harness de testes e guardas de conteudo (red)

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`
- Create: `src/test/setup.ts`
- Test: `src/content/content.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces: `npm test` executando Vitest em jsdom com `window.matchMedia` stubado; contrato que `src/content/pt.ts` e `src/content/en.ts` devem exportar `pt: Content` e `en: Content`.

- [ ] **Step 1: Instalar as ferramentas de teste**

Run: `npm i -D vitest jsdom @testing-library/react @testing-library/user-event pdfjs-dist`

Expected: exit 0 e as cinco entradas em `devDependencies`.

- [ ] **Step 2: Adicionar os scripts de teste ao `package.json`**

O bloco `scripts` passa a conter `"test": "vitest run"` e `"test:watch": "vitest"`, mantendo `dev`, `generate:pdf`, `build` e `preview` como estao.

- [ ] **Step 3: Configurar o Vitest no `vite.config.ts`**

Substituir a primeira linha por `import { defineConfig } from "vitest/config";` e acrescentar ao objeto:

```ts
test: {
  environment: "jsdom",
  setupFiles: ["./src/test/setup.ts"],
  include: ["src/**/*.test.{ts,tsx}"],
},
```

- [ ] **Step 4: Criar `src/test/setup.ts`**

```ts
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});
```

- [ ] **Step 5: Escrever o teste de guarda de conteudo**

```ts
// src/content/content.test.ts
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
```

- [ ] **Step 6: Rodar e confirmar que falha pelo motivo certo**

Run: `npm test`
Expected: FAIL com `Failed to resolve import "./pt"`.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vite.config.ts src/test/setup.ts src/content/content.test.ts
git commit -m "test: add vitest harness and content invariants"
```

---

### Task 2: Contrato de conteudo e versao PT

**Files:**
- Create: `src/content/types.ts`
- Create: `src/content/pt.ts`
- Test: `src/content/content.test.ts` (existente)

**Interfaces:**
- Consumes: nada.
- Produces: `Locale`, `Content` e os tipos de secao em `src/content/types.ts`; `export const pt: Content` em `src/content/pt.ts`. `Content.profile` expoe `name, title, location, email, phone, linkedin, github, whatsapp, resumePdf, summary, focus, printContact`. `Content.labels` expoe `nav, downloadPdf, viewProjects, contact, summary, experience, experienceHeading, projects, projectsHeading, stack, stackHeading, education, educationHeading, certificates, certificatesHeading, languages, contactHeading, available`. `Experience` tem `role, company, period, summary, highlights` e `location?`; `Project` tem `title, context, description, stack, impact, links`; `Education` tem `title, institution?, period, details, status?`; `Certificate` tem `title, url`.

- [ ] **Step 1: Criar `src/content/types.ts`**

```ts
export type Locale = "pt" | "en";

export type Experience = {
  role: string;
  company: string;
  location?: string;
  period: string;
  summary: string;
  highlights: string[];
};

export type Education = {
  title: string;
  institution?: string;
  period: string;
  details: string;
  status?: string;
};

export type Certificate = {
  title: string;
  url: string;
};

export type Project = {
  title: string;
  context: string;
  description: string;
  stack: string[];
  impact: string;
  links: Array<{ label: string; url: string }>;
};

export type SkillGroup = {
  title: string;
  items: string[];
};

export type NavItem = {
  label: string;
  href: string;
};

export type Language = {
  name: string;
  level: string;
};

export type Profile = {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  whatsapp: string;
  resumePdf: string;
  summary: string;
  focus: string[];
  printContact: string;
};

export type Labels = {
  nav: {
    experience: string;
    projects: string;
    stack: string;
    education: string;
    contact: string;
  };
  downloadPdf: string;
  viewProjects: string;
  contact: string;
  summary: string;
  experience: string;
  experienceHeading: string;
  projects: string;
  projectsHeading: string;
  stack: string;
  stackHeading: string;
  education: string;
  educationHeading: string;
  certificates: string;
  certificatesHeading: string;
  languages: string;
  contactHeading: string;
  available: string;
};

export type Content = {
  locale: Locale;
  meta: { title: string; description: string };
  profile: Profile;
  labels: Labels;
  navItems: NavItem[];
  experiences: Experience[];
  projects: Project[];
  skillGroups: SkillGroup[];
  education: Education[];
  certificates: Certificate[];
  languages: Language[];
};
```

- [ ] **Step 2: Criar `src/content/pt.ts`**

`export const pt: Content`, com `locale: "pt"` e `profile.resumePdf: "/kaique-albuquerque-curriculo-pt.pdf"`, copiando verbatim:

- `profile.title` → spec PT-1
- `profile.summary` → spec PT-2
- `profile.phone: "+55 (18) 98810-3982"`
- `profile.printContact: "linkedin.com/in/kaique-dias · github.com/kaique-albuquerque · +55 18 98810-3982 · kaique.g.dias14@gmail.com"`
- `profile.focus: ["React + TypeScript", "APIs REST", "Power BI", "React Native"]`
- `meta.title: "Kaique Albuquerque — Currículo"` e `meta.description: "Currículo online de Kaique Albuquerque: desenvolvedor full-stack com 4 anos em TI, React, TypeScript, Node.js e dados."`
- `experiences` → spec PT-3 a PT-6, na ordem (Pluma Genetics 2024, Pluma Genetics 2023, Pluma Genetics 2023, Solinftec 2022)
- `projects` → spec PT-7
- `skillGroups` → spec PT-8
- `education` → spec PT-9, com `institution: ""` e `status: "Em andamento"` no item 1, `status: ""` e `period: "jan/2023"` no item 3
- `certificates` → spec PT-10 mantendo as URLs atuais de `src/data.ts`
- `labels` → spec PT-11
- `navItems: [{ label: "Experiência", href: "#experiencia" }, { label: "Projetos", href: "#projetos" }, { label: "Stack", href: "#stack" }, { label: "Formação", href: "#formacao" }, { label: "Contato", href: "#contato" }]`
- `languages: []`

- [ ] **Step 3: Rodar os testes de conteudo**

Run: `npx vitest run src/content/content.test.ts`
Expected: FAIL com `Failed to resolve import "./en"` — a ausencia de `src/content/en.ts` deve ser o unico motivo de falha.

- [ ] **Step 4: Commit**

```bash
git add src/content/types.ts src/content/pt.ts
git commit -m "feat: add typed content contract and portuguese content"
```

---

### Task 3: Conteudo EN e resolucao de idioma

**Files:**
- Create: `src/content/en.ts`
- Create: `src/i18n/locale.ts`
- Test: `src/i18n/locale.test.ts`

**Interfaces:**
- Consumes: `Content`, `Locale` de `src/content/types.ts`.
- Produces: `export const en: Content`; `SUPPORTED_LOCALES: Locale[]`, `LOCALE_STORAGE_KEY = "curriculo-locale"`, `resolveLocale(search: string, stored: string | null, browserLanguage: string): Locale` e `useLocale(): [Locale, (locale: Locale) => void]`.

- [ ] **Step 1: Escrever o teste do resolvedor**

```ts
// src/i18n/locale.test.ts
import { describe, expect, test } from "vitest";
import { resolveLocale } from "./locale";

describe("resolveLocale", () => {
  test("prioriza ?lang valido", () => {
    expect(resolveLocale("?lang=en", "pt", "pt-BR")).toBe("en");
  });

  test("ignora ?lang invalido e usa o armazenado", () => {
    expect(resolveLocale("?lang=xx", "en", "pt-BR")).toBe("en");
  });

  test("ignora valor arbitrario no armazenamento", () => {
    expect(resolveLocale("", "klingon", "pt-BR")).toBe("pt");
  });

  test("aceita variantes do armazenamento", () => {
    expect(resolveLocale("", "en_US", "pt-BR")).toBe("en");
  });

  test("usa o idioma do navegador sem preferencia salva", () => {
    expect(resolveLocale("", null, "en-US")).toBe("en");
    expect(resolveLocale("", null, "pt-BR")).toBe("pt");
  });

  test("cai para pt sem nenhuma informacao", () => {
    expect(resolveLocale("", null, "")).toBe("pt");
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npx vitest run src/i18n/locale.test.ts`
Expected: FAIL com `Failed to resolve import "./locale"`.

- [ ] **Step 3: Criar `src/i18n/locale.ts`**

`SUPPORTED_LOCALES` e `LOCALE_STORAGE_KEY` como declarados. `resolveLocale` normaliza cada candidato com `value.toLowerCase().split(/[-_;]/)[0]` e aceita apenas `"pt"`/`"en"`, na ordem query → storage → navegador → `"pt"`. `useLocale` inicia com `resolveLocale(window.location.search, localStorage.getItem(LOCALE_STORAGE_KEY), navigator.language)`, grava a escolha em `localStorage`, aplica `document.documentElement.lang`, `document.title` e a meta description do `Content` ativo em `useEffect` e devolve a tupla `[locale, setLocale]`.

- [ ] **Step 4: Criar `src/content/en.ts`**

`export const en: Content`, com `locale: "en"` e `profile.resumePdf: "/kaique-albuquerque-curriculo-en.pdf"`, copiando verbatim:

- `profile.title` → spec EN-1
- `profile.summary` → spec EN-2
- `experiences` → spec EN-3, mesma ordem de `pt`
- `projects` → spec EN-4
- `skillGroups` → spec EN-5
- `education` → spec EN-6
- `certificates` → spec EN-7, mesmas URLs
- `labels` → spec EN-8
- `meta.title: "Kaique Albuquerque — Resume"` e `meta.description: "Resume of Kaique Albuquerque: full-stack developer with 4 years in IT, working with React, TypeScript, Node.js and data."`
- `profile.printContact` e `profile.phone` identicos aos de `pt`
- `navItems` com os mesmos `href` de `pt` e labels traduzidos
- `languages: []`

- [ ] **Step 5: Rodar todos os testes**

Run: `npm test`
Expected: PASS em `src/content/content.test.ts` e em `src/i18n/locale.test.ts`.

- [ ] **Step 6: Commit**

```bash
git add src/content/en.ts src/i18n
git commit -m "feat: add english content and locale resolution"
```

---

### Task 4: App consumindo conteudo, seletor de idioma e remocao de secoes redundantes

**Files:**
- Create: `src/content/index.ts`
- Modify: `src/App.tsx`
- Delete: `src/data.ts`
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: `pt`, `en`, `useLocale`, `resolveLocale`.
- Produces: `getContent(locale: Locale): Content` em `src/content/index.ts`; `App` renderiza `<div className="page-shell" data-locale={locale}>` e um `button` por idioma com texto exato `PT` e `EN`.

- [ ] **Step 1: Escrever o teste do App**

```tsx
// src/App.test.tsx
import { beforeEach, describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

beforeEach(() => {
  window.localStorage.clear();
  window.history.replaceState({}, "", "/");
});

describe("App", () => {
  test("mostra a empresa em cada experiencia", () => {
    render(<App />);
    expect(screen.getAllByText(/Pluma Genetics/).length).toBeGreaterThanOrEqual(3);
    expect(screen.getAllByText(/Solinftec/).length).toBeGreaterThanOrEqual(1);
  });

  test("nao renderiza mais a secao Objetivo", () => {
    render(<App />);
    expect(screen.queryByRole("heading", { name: /^Objetivo$/i })).toBeNull();
  });

  test("nao renderiza secao de idiomas quando a lista esta vazia", () => {
    render(<App />);
    expect(screen.queryByRole("heading", { name: /Idiomas/ })).toBeNull();
  });

  test("troca para ingles e atualiza o documento", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "EN" }));
    expect(document.documentElement.lang).toBe("en");
    expect(screen.getByRole("heading", { name: /Selected projects/ })).not.toBeNull();
    expect(screen.queryByRole("heading", { name: /Projetos aplicados/ })).toBeNull();
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npx vitest run src/App.test.tsx`
Expected: FAIL — nenhuma das assercoes de empresa/idioma passa com o `App` atual.

- [ ] **Step 3: Criar `src/content/index.ts`**

```ts
import { en } from "./en";
import { pt } from "./pt";
import type { Content, Locale } from "./types";

export const getContent = (locale: Locale): Content => (locale === "en" ? en : pt);
export type { Content, Locale } from "./types";
```

- [ ] **Step 4: Reescrever `src/App.tsx`**

Manter `useState`/`useEffect` do tema e os componentes `SocialLinks` e `SocialIcon` como estao. Mudancas:

- `const [locale, setLocale] = useLocale();` e `const t = getContent(locale);`
- `data-locale={locale}` no `.page-shell`.
- Seletor de idioma ao lado do `theme-switcher`: `SUPPORTED_LOCALES.map(...)` com `button` `{l.toUpperCase()}`, `aria-pressed={l === locale}` e `onClick={() => setLocale(l)}`.
- Hero: `t.profile.title`, `t.profile.summary`, botao primario `t.labels.downloadPdf` com `href={t.profile.resumePdf}`, botao secundario GitHub com `href={t.profile.github}`; remover o botao "Ver projetos" e o "Entrar em contato" duplicado (o e-mail vira `mailto:` no `hero-meta`).
- Remover o `<span className="eyebrow">Curriculo Online</span>`; a `hero-topbar` fica apenas com os seletores de tema e idioma. O rotulo "Stack curta" do `hero-skills` passa a usar `t.labels.stack`.
- Remover `<section className="highlight-strip">` e `<section className="panel panel-highlight">` (Objetivo).
- Remover `<div className="work-grid">`; Experiencia e Projetos passam a ser dois `<section>` irmaos dentro de `<main className="content">`, na ordem experiencia → projetos.
- Cada `article` de experiencia renderiza `job.company` em `<p className="timeline-company">{job.company}</p>` antes do `summary`.
- `education`: renderizar `institution` e `status` apenas quando truthy.
- `certificates`: remover a classe `is-priority` e o `<span>` de badge; o card mostra apenas `certificate.title`.
- Secao de idiomas: `<section id="idiomas">` renderizada somente se `t.languages.length > 0`, com `t.labels.languages`.
- Linha de impressao: `<p className="print-contact">{t.profile.printContact}</p>` como primeiro filho de `.hero-copy`.
- Rodape usa `t.labels.available` e `t.labels.downloadPdf`.

- [ ] **Step 5: Remover `src/data.ts`**

Run: `git rm src/data.ts`

Expected: nenhum import restante aponta para `./data` (conferir com `grep -rn "from \"./data\"" src`).

- [ ] **Step 6: Rodar testes e typecheck**

Run: `npm test; npx tsc -b`
Expected: PASS em todos os testes, `tsc` sem erros.

- [ ] **Step 7: Commit**

```bash
git add -A src/App.tsx src/App.test.tsx src/content/index.ts src/data.ts
git commit -m "feat: render content by locale and drop redundant sections"
```

---

### Task 5: Layout web (hero compacto, experiencia em largura total)

**Files:**
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `data-locale` e as classes `timeline-company`, `print-contact`, `locale-switcher` produzidas na Task 4.
- Produces: classes `locale-switcher`/`locale-option` espelhando `theme-switcher`/`theme-option`, e `.project-grid` com 2 colunas no desktop.

- [ ] **Step 1: Compactar o hero**

Em `src/styles.css`: `.hero` (linha ~105) passa a `grid-template-columns: minmax(0, 1fr) minmax(260px, 0.42fr);`; `.hero-copy` com `gap: 1.25rem` e `padding: clamp(1.25rem, 3vw, 2rem)`; `.hero h1` (linha ~196) com `font-size: clamp(2.2rem, 4.2vw, 3.4rem);`; `.hero-text` com `font-size: 1rem` e `max-width: 58ch`; `.hero-main` com `gap: 0.75rem`.

- [ ] **Step 2: Remover a faixa de destaques e o painel Objetivo**

Apagar as regras `.highlight-strip` (linha ~363), `.highlight-item`, `.highlight-item strong`, `.highlight-item span` e `.panel-highlight` (linha ~400), e remover `.highlight-strip` das listas de seletores compartilhados (linhas ~98-118 e bloco de impressao).

- [ ] **Step 3: Colocar experiencia em largura total e projetos em grade propria**

Apagar as regras `.work-grid` (linha ~99 e linha ~413-414), ja que o wrapper nao existe mais. `.project-grid` (linha ~485) passa a `grid-template-columns: repeat(2, minmax(0, 1fr));`, com `@media (max-width: 980px)` caindo para `1fr`. `#experiencia` e `#projetos` ocupam a largura total de `.content` por serem filhos diretos do grid de uma coluna.

- [ ] **Step 4: Estilizar o seletor de idioma e a empresa na timeline**

Adicionar `.locale-switcher` e `.locale-option` reutilizando as mesmas declaracoes de `.theme-switcher`/`.theme-option` (mesmo grid de 2 colunas em `.locale-switcher`), e `.timeline-company { color: var(--page-accent); font-weight: 700; font-size: 0.9rem; }`. `.print-contact` fica `display: none` fora da impressao.

- [ ] **Step 5: Medir o resultado**

Run: `npm run dev` e abrir `http://localhost:5173/?lang=pt` em viewport 1280x900; no console do navegador:

```js
const hero = document.querySelector(".hero").getBoundingClientRect();
({
  heroHeight: Math.round(hero.height),
  experienceTop: Math.round(document.querySelector("#experiencia").getBoundingClientRect().top + scrollY),
  overflowX: document.documentElement.scrollWidth > innerWidth,
});
```

Expected: `heroHeight <= 520`, `experienceTop <= 800`, `overflowX: false`. Repetir em 375x812 e 768x1024 esperando `overflowX: false` e `.project-grid` em uma coluna.

- [ ] **Step 6: Commit**

```bash
git add src/styles.css
git commit -m "style: compact hero and give experience full width"
```

---

### Task 6: Impressao, dois PDFs e validacao automatica

**Files:**
- Modify: `src/styles.css` (bloco `@media print`)
- Modify: `scripts/generate-pdf.mjs`
- Create: `scripts/check-pdf.mjs`
- Modify: `package.json`
- Delete: `public/kaique-albuquerque-curriculo.pdf`

**Interfaces:**
- Consumes: `?lang` e `data-locale` da Task 4; `.print-contact` da Task 5.
- Produces: `npm run generate:pdf` gravando os dois PDFs; `npm run check:pdf` com exit code 1 em qualquer violacao; `npm run build` executando `generate:pdf`, `check:pdf`, `tsc -b` e `vite build` nessa ordem.

- [ ] **Step 1: Ajustar o bloco de impressao**

Em `@media print` (linha ~637): `body { font-size: 9pt; }`; `.hero, .dual-grid { grid-template-columns: 1fr; }`; `.project-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }`; remover a regra `break-before: page` remanescente de `.work-grid`; adicionar `break-inside: avoid;` em `.timeline-item, .project-card, .skill-card, .certificate-card, .stack-item`; ocultar `.hero-actions, .theme-switcher, .locale-switcher, .section-nav, .site-footer, .project-links`; `.print-contact { display: block; font-size: 7.5pt; color: #374151; white-space: nowrap; }`.

- [ ] **Step 2: Rodar e conferir a contagem de paginas**

Run: `npm run dev` em outro terminal, depois:

```bash
npx playwright screenshot --viewport-size=1280,1800 --wait-for-timeout=2000 "http://localhost:5173/?lang=pt" .superpowers/tmp-pt.png
```

Expected: layout em uma coluna, sem badges e sem botoes. Se o PDF gerado no Step 4 passar de 2 paginas, reduzir `body` para `8.5pt` e repetir; nenhuma outra mudanca de layout e permitida nesta task.

- [ ] **Step 3: Gerar um PDF por locale**

Em `scripts/generate-pdf.mjs`, trocar a constante unica por `const locales = ["pt", "en"];` e uma funcao `outputFor(locale)` que resolve `public/kaique-albuquerque-curriculo-<locale>.pdf`. Para cada locale: navegar para `<url>?lang=<locale>` com `waitUntil: "networkidle"`, aguardar `document.documentElement.lang === locale` com `page.waitForFunction`, gerar o PDF com `format: "A4"`, `printBackground: true` e as mesmas margens atuais, e imprimir o caminho gerado. O `finally` continua fechando browser e server.

- [ ] **Step 4: Criar `scripts/check-pdf.mjs`**

`getDocument` de `pdfjs-dist/legacy/build/pdf.mjs`; para cada arquivo extrair as paginas com `page.getTextContent()` e juntar `item.str`. Falhar quando: `pt` nao tiver exatamente 2 paginas; `en` tiver mais de 2; alguma pagina tiver menos de 300 caracteres; o texto sem espacos nao contiver `github.com/kaique-albuquerque` e `linkedin.com/in/kaique-dias`; o texto contiver `CURRICULO ONLINE`, `PRIORITARIO` ou `Objetivo`. Sucesso imprime uma linha por arquivo com `locale, pages, charsPerPage`. Falha imprime o motivo e seta `process.exitCode = 1`.

- [ ] **Step 5: Ligar no build**

`package.json`: `"generate:pdf": "node scripts/generate-pdf.mjs"`, `"check:pdf": "node scripts/check-pdf.mjs"`, `"build": "npm run generate:pdf && npm run check:pdf && tsc -b && vite build"`.

- [ ] **Step 6: Remover o PDF antigo**

Run: `git rm public/kaique-albuquerque-curriculo.pdf`

- [ ] **Step 7: Rodar o build completo**

Run: `npm run build`
Expected: as duas linhas de `PDF <locale> gerado`, a saida de `check:pdf` com `pt pages=2` e `en pages<=2`, e `vite build` concluindo sem erro.

- [ ] **Step 8: Commit**

```bash
git add src/styles.css scripts/generate-pdf.mjs scripts/check-pdf.mjs package.json package-lock.json public
git commit -m "feat: generate and validate print-ready resumes for both locales"
```

---

### Task 7: Metadados, favicon e preview de compartilhamento

**Files:**
- Modify: `index.html`
- Create: `scripts/generate-og.mjs`
- Modify: `package.json`
- Create: `public/og-image.png` (gerado)
- Create: `public/favicon.svg`

**Interfaces:**
- Consumes: servidor de dev do Vite.
- Produces: `npm run generate:og` gravando `public/og-image.png` em 1200x630.

- [ ] **Step 1: Criar o favicon**

`public/favicon.svg` com um quadrado arredondado `#0f172a` e as letras `KA` em `#72f2c9`, `viewBox="0 0 64 64"`.

- [ ] **Step 2: Criar o gerador de Open Graph**

`scripts/generate-og.mjs` no molde de `generate-pdf.mjs`: sobe o Vite em `127.0.0.1`, viewport `1280x800`, `page.goto("http://127.0.0.1:<port>/?lang=pt")`, `await page.waitForSelector(".hero-copy")`, `page.screenshot({ path: resolve(projectRoot, "public", "og-image.png"), clip: { x: 0, y: 0, width: 1200, height: 630 } })`, e fecha tudo no `finally`. Script `"generate:og": "node scripts/generate-og.mjs"`.

- [ ] **Step 3: Gerar a imagem**

Run: `npm run generate:og`
Expected: `public/og-image.png` com 1200x630 (conferir com `Get-Item`/`identify` ou abrindo o arquivo).

- [ ] **Step 4: Atualizar `index.html`**

Adicionar `link rel="icon" type="image/svg+xml" href="/favicon.svg"`, `link rel="canonical" href="https://ckaique.netlify.app/"`, `meta property="og:type" content="profile"`, `og:title`, `og:description` (mesmo texto da meta description), `og:url`, `og:image` apontando para `/og-image.png` com `og:image:width=1200` e `og:image:height=630`, `og:locale=pt_BR` e `og:locale:alternate=en_US`, `meta name="twitter:card" content="summary_large_image"` e um `<script type="application/ld+json">` com `{"@context":"https://schema.org","@type":"Person","name":"Kaique Albuquerque","jobTitle":"Desenvolvedor Full-stack","url":"https://ckaique.netlify.app/","sameAs":["https://github.com/kaique-albuquerque","https://www.linkedin.com/in/kaique-dias/"],"address":{"@type":"PostalAddress","addressLocality":"Birigui","addressRegion":"SP","addressCountry":"BR"}}`.

- [ ] **Step 5: Conferir**

Run: `npm run build` e abrir `dist/index.html`, verificando a presenca de `og:image`, `canonical`, `favicon.svg` e do JSON-LD.
Expected: todas as tags presentes e o build verde.

- [ ] **Step 6: Commit**

```bash
git add index.html scripts/generate-og.mjs package.json public/favicon.svg public/og-image.png
git commit -m "feat: add social metadata, favicon and structured data"
```

---

### Task 8: Documentacao do projeto

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: estrutura final de `src/content`, `src/i18n` e `scripts/`.
- Produces: README descrevendo os dois PDFs, o seletor de idioma e como atualizar conteudo.

- [ ] **Step 1: Atualizar as secoes afetadas**

Substituir a arvore de arquivos para incluir `src/content/` e `src/i18n/`, trocar as referencias a `public/kaique-albuquerque-curriculo.pdf` pelos dois arquivos novos, documentar `?lang=en` e `npm run check:pdf`, e remover a observacao "O projeto usa texto em ASCII", trocando por: "Textos em portugues usam acentuacao completa; nunca introduza versoes sem acento."

- [ ] **Step 2: Verificar**

Run: `npm run build`
Expected: build verde e nenhuma mencao ao PDF antigo (`grep -rn "albuquerque-curriculo.pdf" README.md` sem resultado).

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: describe bilingual content and pdf pipeline"
```

---

## Trabalho fora do repositorio (manual, sem agente)

Checklist para o dono da conta, na ordem de impacto:

1. Corrigir `kaique-albquerque` → `kaique-albuquerque` em qualquer bio, assinatura ou post antigo.
2. Privatizar ou deletar `parallels-desktop-crack`; nome e conteudo sinalizam risco etico a recrutador.
3. Criar o README de perfil em `kaique-albuquerque/kaique-albuquerque` com stack, foco atual, link do curriculo e 3 repositorios em destaque.
4. Fixar `streamgrab`, `rag_example`, `tensor_playground` e `curriculo`.
5. Adicionar descricao, topics (`react`, `typescript`, `nodejs`, `rag`, `powerbi`) e licenca em cada repositorio publico.
6. Renomear `music_recomended_ia` → `music-recommended-ai` e `query_project`/`prompt_injection` para kebab-case descritivo.
7. Adicionar README com screenshot/GIF no topo de `streamgrab` e `tensor_playground`.
8. Ativar "Include private contributions on my profile".
9. Confirmar os dados pendentes da spec (nivel de ingles, instituicao da pos, situacao do curso Power BI) e atualizar `src/content/pt.ts` e `en.ts`.
