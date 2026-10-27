# Design: curriculo pronto para leitura de recrutador (PT + EN)

## Contexto

Auditoria do curriculo atual (codigo, PDF gerado, site publicado em `https://ckaique.netlify.app` e perfil do GitHub) como um recrutador senior de TI leria. Achados verificados:

- Link do GitHub quebrado em `src/data.ts:55` e `src/data.ts:173` (`kaique-albquerque`, sem o `u`). O usuario real e `kaique-albuquerque`; ambos os links hoje retornam 404.
- Nenhuma das 4 experiencias cita empresa. Cargo sem empresa nao e verificavel.
- PDF com 4 paginas: pagina 1 termina em branco (~110 px), os bullets de "Suporte de Infraestrutura" vazam para o topo da pagina 3, um card de certificado quebra entre as paginas 3 e 4 e a pagina 4 esta 78% vazia. Causa: `page-break-before: always` em `src/styles.css:755` e ausencia de `break-inside: avoid`.
- Texto 100% sem acentos ("Curriculo", "Experiencia", "Tecnico"), o que parece descuido em portugues e prejudica busca em ATS.
- Nenhuma URL aparece no texto extraido do PDF: "LinkedIn", "GitHub" e "WhatsApp" existem apenas como rotulo de icone.
- Duplicacoes: DP-900 em Formacao e em Certificados; hero repetindo o cargo; faixa de 4 destaques repetindo a secao Stack; secao "Objetivo" sem informacao nova.
- Hero com 708 px de altura em 995 px de largura; a primeira experiencia comeca em y=1188. Experiencia e Projetos ficam lado a lado (483 px x 445 px), timeline em meia-largura.
- Site sem favicon, Open Graph, Twitter Card, canonical e JSON-LD `Person`.
- GitHub: 10 repositorios publicos, 6 sem descricao, zero com topics, um sem README (`parallels-desktop-crack`, nome que sinaliza risco etico/legal), `music_recomended_ia` com typo, nenhum repositorio fixado e sem perfil README.

## Objetivos

- Fazer o curriculo sobreviver a 30 segundos de leitura: cargo + empresa + resultado visiveis antes da primeira rolagem.
- Eliminar ambiguidade: toda frase de resultado aponta para um artefato concreto e verificavel.
- Entregar duas versoes: portugues (2 paginas A4) e ingles (ate 2 paginas A4), geradas do mesmo codigo.
- Passar por ATS: texto linear, uma coluna no PDF, contatos em texto puro.
- Corrigir o GitHub como prova tecnica: link valido no curriculo e checklist de higiene do perfil.

## Nao objetivos

- Nao criar backend, CMS ou banco de dados.
- Nao trocar React/Vite/CSS puro por framework de UI ou biblioteca de i18n.
- Nao implementar roteamento real (`/en`) nem build multi-pagina; a troca de idioma usa `?lang=en`.
- Nao inventar metricas, resultados ou datas. Onde o dado nao foi confirmado, a afirmacao e omitida.

## Dados confirmados

| Item | Valor |
| --- | --- |
| Suporte de Infraestrutura em TI | Solinftec |
| Assistente Administrativo | Pluma Genetics |
| Analista de Dados Gerenciais | Pluma Genetics |
| Supervisor Tecnico | Pluma Genetics |
| GitHub | `https://github.com/kaique-albuquerque` |
| LinkedIn | `https://www.linkedin.com/in/kaique-dias/` |
| Telefone (derivado do link do WhatsApp) | +55 (18) 98810-3982 |
| Localizacao | Birigui - SP |

## Dados pendentes (omitir enquanto ausentes)

| Item | Comportamento quando ausente | Secao afetada |
| --- | --- | --- |
| Nivel de ingles | `languages: []` e a secao nao e renderizada | Idiomas |
| Instituicao da pos-graduacao | `institution` omitido no card | Formacao |
| Status/data final do curso Power BI | `period: "jan/2023"`, sem `status` | Formacao |

O modelo de dados usa campos opcionais (`institution?`, `status?`) e a UI so renderiza o campo quando presente. Nenhum valor e inventado.

## Decisoes de conteudo (PT)

Fonte unica: `src/content/pt.ts`. Copia final, pronta para colar.

**PT-1 `profile.title`**

```text
Desenvolvedor Full-stack (React · TypeScript · Node.js)
```

**PT-2 `profile.summary`** (substitui `intro`, vira o texto do hero)

```text
Desenvolvedor full-stack com 4 anos em TI. Na Pluma Genetics evoluí de assistente administrativo a supervisor técnico, entregando site institucional, aplicativo interno e dashboards executivos.
```

**PT-3 Experiencia 1**

```text
role: Supervisor Técnico
company: Pluma Genetics
period: abr/2024 – atual
summary: Respondo pela frente digital da empresa: site institucional, aplicativo interno, dashboards executivos e suporte técnico.
highlights:
- Desenvolvo e mantenho o site institucional em React com TypeScript e consumo de APIs.
- Criei e mantive um aplicativo corporativo em React Native com Expo para rotinas internas da empresa.
- Estruturei dashboards em Power BI com rentabilidade, custos, metas e participação de mercado para a diretoria.
- Coordenei o suporte técnico e a evolução dos produtos internos.
```

**PT-4 Experiencia 2**

```text
role: Analista de Dados Gerenciais
company: Pluma Genetics
period: set/2023 – abr/2024
summary: Transformei dados operacionais em painéis e ferramentas usadas por gestores e representantes comerciais.
highlights:
- Construí dashboards interativos e visões executivas em Power BI.
- Automatizei rotinas internas para reduzir trabalho manual em relatórios.
- Desenvolvi e mantive o website da empresa.
- Criei ferramentas de apoio para representantes comerciais.
```

**PT-5 Experiencia 3**

```text
role: Assistente Administrativo
company: Pluma Genetics
period: jan/2023 – set/2023
summary: Atuei na logística com relatórios, automação em Excel/VBA e melhoria de processos.
highlights:
- Criei relatórios em Power BI para acompanhamento da operação.
- Desenvolvi e otimizei planilhas em VBA.
- Apoiei a eficiência da logística de entregas.
```

**PT-6 Experiencia 4**

```text
role: Suporte de Infraestrutura em TI
company: Solinftec
period: mar/2022 – dez/2022
summary: Suporte a redes, equipamentos e usuários em ambiente corporativo de tecnologia agrícola.
highlights:
- Auxiliei na manutenção da infraestrutura de redes.
- Gerenciei e organizei equipamentos de TI.
- Diagnostiquei e resolvi incidentes em notebooks corporativos.
```

**PT-7 Projetos**

```text
1. title: Dashboard corporativo em React e Node.js
   context: Pluma Genetics · uso interno
   description: Aplicação própria com interface React, API em Node.js e consulta mais rápida que as visões de indicadores anteriores.
   impact: Reuniu rentabilidade, custos, metas e participação de mercado em um único painel.
   stack: [React, TypeScript, Node.js, APIs]
   links: []

2. title: Aplicativo corporativo em React Native
   context: Pluma Genetics · app interno
   description: App em Expo que substituiu etapas manuais de rotinas internas, consumindo as APIs da empresa.
   impact: Padronizou operações internas que antes dependiam de planilhas e mensagens.
   stack: [React Native, Expo, APIs]
   links: []

3. title: Site institucional em React
   context: Pluma Genetics · produto web
   description: Manutenção e evolução do site institucional com foco em performance, clareza de conteúdo e integrações.
   impact: Centralizou a presença digital da empresa e simplificou a atualização de conteúdo.
   stack: [React, TypeScript, CSS, APIs]
   links: []

4. title: Projetos públicos no GitHub
   context: Open source · estudo aplicado
   description: Repositórios de estudo em React, TypeScript e IA aplicada: exemplo de RAG, playground de tensores e ferramenta de download de HLS.
   impact: Código aberto para avaliação técnica direta.
   stack: [React, TypeScript, Python, Node.js]
   links: [{ label: "Ver GitHub", url: "https://github.com/kaique-albuquerque" }]
```

**PT-8 Grupos de stack** (secoes, nesta ordem)

```text
Front-end: React, TypeScript, HTML semântico, CSS responsivo, Consumo de APIs
Back-end / APIs: Node.js, Integrações REST, Modelagem para dashboards
Mobile: React Native, Expo
Dados / BI: Power BI, Indicadores executivos, Análise gerencial, Excel/VBA
IA / Automação: RAG, Embeddings, LangChain
Ferramentas: Git, GitHub, Playwright
```

"Coordenacao tecnica", "Suporte tecnico" e "Redes" saem da stack por nao serem tecnologias; ficam nas experiencias.

**PT-9 Formacao** (nesta ordem)

```text
1. Pós-graduação em Engenharia de IA Aplicada | institution: "" | abr/2026 – abr/2027 | status: Em andamento
   details: Formação prática em IA aplicada: RAGs, embeddings, personalização de assistentes, memória de contexto, MCP, LangChain e Neo4j.
2. Tecnólogo em Análise e Desenvolvimento de Sistemas | Universidade Norte do Paraná | fev/2022 – dez/2023 | status: Concluído
   details: Formação concluída.
3. Especialização em Power BI | Ninja do Excel | jan/2023 | status: "" 
   details: Formação em dashboards e análise de dados.
4. Curso Básico de Python | SENAI | fev/2023 – mai/2023 | details: Fundamentos de programação em Python.
5. Azure Data Fundamentals (DP-900) | SENAI | mai/2023 – jun/2023 | details: Conceitos de dados e computação em nuvem.
6. `Programação Oracle - Java Foundations | SENAI | mai/2023 – jul/2023 | details: Base de programação com Java.`
```

**PT-10 Certificados** (ordem, sem campo `priority` e sem badge)

```text
1. Implantação e Análise de Dados em Nuvem - Microsoft DP-900
2. Programação em Python
3. Programação Oracle - Java Foundations
4. Estrutura de Redes
5. Aprendendo Estruturas de Dados e Algoritmos
6. Lógica de Programação Essencial
```

As URLs do Google Drive de cada certificado ficam inalteradas.

**PT-11 Rotulos de interface**

```text
nav: Experiência, Projetos, Stack, Formação, Contato
downloadPdf: Baixar PDF
viewProjects: Ver projetos
contact: Entrar em contato
summary: Resumo
experience: Experiência
experienceHeading: Trajetória em produto e dados
projects: Projetos
projectsHeading: Projetos aplicados
stack: Stack
stackHeading: Competências por área
education: Formação
educationHeading: Base acadêmica e evolução contínua
certificates: Certificados
certificatesHeading: Cursos com certificado
languages: Idiomas
contactHeading: Contato
available: Disponível para oportunidades em produto, dados e engenharia de software.
```

A copia de `PT-2` a `PT-7` nao contem metrica inventada; toda frase e derivavel do curriculo atual mais as empresas confirmadas.

## Decisoes de conteudo (EN)

Fonte unica: `src/content/en.ts`. Versao enxuta: mesma estrutura, texto orientado a acao, sem girias e com contexto de localizacao.

**EN-1 `profile.title`**: `Full-stack Developer (React · TypeScript · Node.js)`

**EN-2 `profile.summary`**

```text
Full-stack developer with 4 years in IT. At Pluma Genetics I moved from administrative assistant to technical supervisor, shipping the company website, an internal mobile app and executive dashboards.
```

**EN-3 Experiencias**

```text
1. Technical Supervisor | Pluma Genetics | Apr 2024 – Present
   summary: I own the company's digital front: website, internal app, executive dashboards and technical support.
   - Maintain the institutional website in React with TypeScript and API integration.
   - Built and maintained an internal corporate app in React Native with Expo.
   - Built Power BI dashboards covering profitability, costs, targets and market share for the board.
   - Coordinated technical support and the roadmap of internal products.

2. Management Data Analyst | Pluma Genetics | Sep 2023 – Apr 2024
   summary: Turned operational data into dashboards and tools used by managers and sales representatives.
   - Built interactive dashboards and executive views in Power BI.
   - Automated internal routines to cut manual work on reports.
   - Developed and maintained the company website.
   - Built support tools for sales representatives.

3. Administrative Assistant | Pluma Genetics | Jan 2023 – Sep 2023
   summary: Worked on logistics with reporting, Excel/VBA automation and process improvement.
   - Built Power BI reports to track operations.
   - Developed and optimised spreadsheet automation with VBA.
   - Supported delivery logistics efficiency.

4. IT Infrastructure Support | Solinftec | Mar 2022 – Dec 2022
   summary: Network, hardware and end-user support in a corporate agtech environment.
   - Assisted with network infrastructure maintenance.
   - Managed and organised IT equipment.
   - Diagnosed and resolved incidents on corporate laptops.
```

**EN-4 Projetos**

```text
1. Corporate dashboard in React and Node.js | Pluma Genetics · internal tool
   description: Custom application with a React interface, Node.js API and faster queries than the previous indicator views.
   impact: Consolidated profitability, cost, target and market-share metrics in a single panel.
   stack: [React, TypeScript, Node.js, APIs]

2. Corporate app in React Native | Pluma Genetics · internal app
   description: Expo app that replaced manual steps in internal routines, consuming company APIs.
   impact: Standardised operations previously handled through spreadsheets and chat.

3. Institutional website in React | Pluma Genetics · web product
   description: Maintenance and evolution of the company website, focused on performance, content clarity and integrations.
   impact: Centralised the company's digital presence and simplified content updates.

4. Public GitHub projects | Open source · applied study
   description: Study repositories in React, TypeScript and applied AI: a RAG example, a tensor playground and an HLS downloader.
   impact: Open code available for direct technical review.
   stack: [React, TypeScript, Python, Node.js]
   links: [{ label: "View GitHub", url: "https://github.com/kaique-albuquerque" }]
```

**EN-5 Stack**: `Front-end: React, TypeScript, Semantic HTML, Responsive CSS, API consumption` · `Back-end / APIs: Node.js, REST integrations, Dashboard data modelling` · `Mobile: React Native, Expo` · `Data / BI: Power BI, Executive metrics, Management analysis, Excel/VBA` · `AI / Automation: RAG, Embeddings, LangChain` · `Tooling: Git, GitHub, Playwright`

**EN-6 Formacao**: mesmos itens de PT-9 em ingles ("Postgraduate in Applied AI Engineering" / "In progress", "Associate Degree in Systems Analysis and Development" / "Completed", etc.), com `institution: ""` para a pos-graduacao.

**EN-7 Certificados**: mesmos 6 titulos de PT-10 em ingles.

**EN-8 Rotulos de interface**

```text
nav: Experience, Projects, Stack, Education, Contact
downloadPdf: Download PDF
viewProjects: View projects
contact: Get in touch
summary: Summary
experience: Experience
experienceHeading: Product and data track record
projects: Projects
projectsHeading: Selected projects
stack: Stack
stackHeading: Skills by area
education: Education
educationHeading: Academic background and continuous learning
certificates: Certificates
certificatesHeading: Certified courses
languages: Languages
contactHeading: Contact
available: Open to opportunities in product, data and software engineering.
```

## Decisoes de layout

**Web**

| Item | Antes | Depois |
| --- | --- | --- |
| Ordem das secoes | hero, nav, destaques, objetivo, experiencia+projetos lado a lado, stack, formacao | hero, nav, experiencia (largura total), projetos (grade 2 colunas), stack, formacao, contato |
| Faixa de destaques | 4 chips repetindo a stack | removida |
| Secao Objetivo | painel separado | removida; resumo entra no hero |
| Hero | 708 px, h1 5.4rem | alvo <= 520 px com h1 <= 3.4rem e resumo de 2 linhas |
| Timeline | 483 px de largura | largura total do container |
| CTA principal | 3 botoes + 3 redes | `Baixar PDF` (primario), `GitHub` (secundario) e as 3 redes |
| Seletor de idioma | nao existe | `PT` / `EN` junto ao seletor de tema |

**Impressao/PDF**

- Uma coluna (`grid-template-columns: 1fr`), fonte base 9pt.
- Remover `page-break-before: always` de `.work-grid`.
- `break-inside: avoid` em `.timeline-item`, `.project-card`, `.skill-card`, `.certificate-card`, `.stack-item`, `.highlight-strip`.
- Linha de contato em texto puro no topo: `linkedin.com/in/kaique-dias · github.com/kaique-albuquerque · +55 18 98810-3982 · kaique.g.dias14@gmail.com`. Fonte: campo `profile.printContact` de cada locale, renderizado em `<p className="print-contact">` visivel apenas em `@media print`.
- Ocultar: CTAs, seletor de tema, nav, badges.
- Meta: PT = exatamente 2 paginas A4; EN <= 2 paginas A4.

## Decisao de i18n

- `Locale = "pt" | "en"`; conteudo tipado em `src/content/{types,pt,en,index}.ts`; tipos atuais migram de `src/data.ts` para `src/content/types.ts` e `src/data.ts` e removido.
- Resolucao de idioma, em ordem: `?lang=` na URL, `localStorage["curriculo-locale"]`, `navigator.language`, padrao `pt`. Funcao pura `resolveLocale(search, stored, browserLanguage)` em `src/i18n/locale.ts`.
- O idioma ativo atualiza `document.documentElement.lang`, `<title>` e `meta[name=description]`.
- PDFs: `public/kaique-albuquerque-curriculo-pt.pdf` e `public/kaique-albuquerque-curriculo-en.pdf`; o arquivo antigo `public/kaique-albuquerque-curriculo.pdf` e removido.
- `scripts/generate-pdf.mjs` percorre `["pt", "en"]`, abre `/?lang=<locale>`, espera `[data-locale="<locale>"]` e escreve o arquivo do locale.
- `scripts/check-pdf.mjs` valida os dois PDFs e falha o build quando qualquer criterio abaixo nao e atendido.

## Criterios de aceite

1. `npm test` verde, incluindo ausencia do handle `kaique-albquerque` e presenca de empresa em toda experiencia.
2. `npm run build` verde e `scripts/check-pdf.mjs` aprovando:
   - PT com exatamente 2 paginas; EN com no maximo 2 paginas.
   - Nenhuma pagina com menos de 300 caracteres extraidos.
   - Texto completo contem `github.com/kaique-albuquerque` e `linkedin.com/in/kaique-dias`.
   - Texto completo nao contem `CURRICULO ONLINE`, `PRIORITARIO` nem `Objetivo`.
3. `?lang=en` renderiza o curriculo em ingles, `html[lang] === "en"` e o titulo do documento em ingles.
4. Hero com altura <= 520 px e topo da secao de experiencia <= 800 px em viewport 1280x900.
5. Nenhuma pagina do site com overflow horizontal em 375 px, 768 px e 1280 px.
6. `index.html` com favicon, `og:title`, `og:description`, `og:image`, `og:url`, `twitter:card`, `canonical` e JSON-LD `Person`.

## Riscos

- Sem metricas confirmadas, os bullets ficam corretos porem menos persuasivos; o ganho principal vem de empresa + artefato + acao.
- `?lang=en` nao serve HTML em ingles para crawlers sem JS; aceitavel porque o objetivo e recrutador humano e o PDF.
- Duas versoes de PDF dobram o custo de manutencao do conteudo; mitigado por `content/*.test.ts` que compara estrutura entre locales.
- Fontes do Google carregadas durante a geracao do PDF: se a rede falhar, o layout muda. `check-pdf.mjs` detecta quebra de paginacao.
