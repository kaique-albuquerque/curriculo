# Kaique Albuquerque | Curriculo Online

Curriculo online desenvolvido com React, TypeScript e Vite para apresentar experiencia profissional, projetos, stack tecnica, formacao, certificados e canais de contato em uma interface moderna, responsiva e com tema claro/escuro.

O projeto tambem gera automaticamente um PDF do curriculo com base no proprio site.

## Tecnologias

- React 18
- TypeScript
- Vite
- CSS puro
- Playwright para geracao do PDF

## Funcionalidades

- Layout responsivo para desktop, tablet e mobile.
- Tema claro, escuro e automatico.
- Hero com foco em Front-end / Full-stack.
- Secoes de experiencia, projetos, stack, formacao e certificados.
- Links para LinkedIn, GitHub, WhatsApp e email.
- PDF gerado automaticamente a partir da versao web.
- Estilos especificos de impressao com `@media print`.

## Estrutura

```text
src/
  App.tsx        Interface principal e secoes do curriculo
  data.ts       Conteudo do curriculo, projetos, links e certificados
  main.tsx      Bootstrap React
  styles.css    Estilos globais, temas e layout de impressao

scripts/
  generate-pdf.mjs  Gera o PDF a partir do site renderizado pelo Vite

public/
  profile.png
  kaique-albuquerque-curriculo.pdf

docs/superpowers/
  specs/        Especificacoes criadas no fluxo Superpowers
  plans/        Planos de implementacao criados no fluxo Superpowers

.github/skills/
  <skill>/       Skills de IA do Superpowers (SKILL.md + arquivos de apoio)

AGENTS.md       Instrucoes que carregam o Superpowers em agentes de IA
```

## Superpowers (skills de IA)

O repositorio carrega o [Superpowers](https://github.com/obra/superpowers) v7.0.1 (MIT) vendorizado em `.github/skills/`, com 15 skills que ensinam o agente a brainstormar, escrever planos, implementar com TDD, depurar sistematicamente, revisar e verificar antes de concluir. O `AGENTS.md` na raiz carrega o bootstrap `using-superpowers` em toda conversa de IA.

- Detalhes e como atualizar: `.github/skills/README.md`.
- Specs e planos gerados pelo fluxo ficam em `docs/superpowers/`.
- Estado de runtime (`.superpowers/`) nao e versionado.

## Como rodar localmente

Instale as dependencias:

```bash
npm install
```

Se for a primeira vez usando a geracao de PDF, instale o Chromium do Playwright:

```bash
npx playwright install chromium
```

Rode o servidor de desenvolvimento:

```bash
npm run dev
```

## Gerar PDF

Para gerar apenas o PDF:

```bash
npm run generate:pdf
```

O arquivo gerado fica em:

```text
public/kaique-albuquerque-curriculo.pdf
```

## Build de producao

O build sempre gera o PDF antes de compilar o site:

```bash
npm run build
```

Esse comando executa:

```bash
npm run generate:pdf
tsc -b
vite build
```

Resultado final:

- Site compilado em `dist/`.
- PDF atualizado em `public/kaique-albuquerque-curriculo.pdf`.

## Como atualizar o curriculo

Edite o conteudo principal em:

```text
src/data.ts
```

Depois rode:

```bash
npm run build
```

Isso atualiza o site e regenera o PDF com o conteudo novo.

## Personalizacao visual

Para ajustar layout, cores, responsividade ou impressao/PDF, edite:

```text
src/styles.css
```

Pontos importantes:

- Variaveis de tema ficam em `:root` e `:root[data-theme="light"]`.
- Estilos do PDF ficam no bloco `@media print`.
- O botao de PDF fica oculto no PDF para evitar um link redundante dentro do arquivo.
- O footer tambem fica oculto no PDF para evitar uma pagina extra quase vazia.

## Publicacao

O projeto pode ser publicado em servicos como:

- Netlify
- Vercel
- GitHub Pages

Antes de publicar, rode:

```bash
npm run build
```

## Observacoes

- O PDF e um artefato versionado em `public/`, porque o site e estatico e precisa servir o arquivo pronto.
- Se o PDF estiver aberto em outro programa, a geracao pode falhar no Windows com erro de arquivo bloqueado. Feche o visualizador e rode `npm run generate:pdf` novamente.
- O projeto usa texto em ASCII para evitar problemas de encoding em diferentes ambientes.

## Autor

Kaique Albuquerque
