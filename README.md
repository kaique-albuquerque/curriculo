# Kaique Albuquerque | Currículo Online

Currículo online desenvolvido com React, TypeScript e Vite para apresentar experiência profissional, projetos, stack técnica, formação, certificados e canais de contato em uma interface moderna, responsiva e com tema claro/escuro.

O PDF do currículo é um arquivo único, em português, mantido manualmente em `public/kaique-albuquerque-curriculo.pdf` — não é mais gerado pelo build. O site continua bilíngue e as duas versões apontam para esse mesmo PDF.

## Tecnologias

- React 18
- TypeScript
- Vite
- CSS puro
- Playwright para geração da imagem de compartilhamento
- Vitest e Testing Library para testes

## Funcionalidades

- Layout responsivo para desktop, tablet e mobile.
- Tema claro, escuro e automático.
- Conteúdo em português e inglês, com seletor de idioma (`?lang=en`).
- Experiências com empresa, período e resultados verificáveis.
- Seções de experiência, projetos, stack, formação, certificados e idiomas.
- Links para LinkedIn, GitHub, WhatsApp, email e telefone.
- PDF único em português (`public/kaique-albuquerque-curriculo.pdf`), servido nos dois idiomas.
- Estilos específicos de impressão com `@media print`, em coluna única para leitura por ATS.
- Metadados Open Graph, favicon e JSON-LD `Person`.

## Estrutura

```text
src/
  App.tsx            Interface principal e seções do currículo
  content/
    types.ts         Contrato tipado de todo o conteúdo
    pt.ts            Conteúdo em português
    en.ts            Conteúdo em inglês
    index.ts         getContent(locale)
  i18n/
    locale.ts        Resolução de idioma (?lang, localStorage, navegador)
  main.tsx           Bootstrap React
  styles.css         Estilos globais, temas e layout de impressão

scripts/
  check-pdf.mjs      Valida páginas, contatos e acentos do PDF único
  generate-og.mjs    Gera public/og-image.png (1200x630)

bin/
  ntl.mjs            Menu interativo de comandos do projeto (comando `ntl`)

public/
  profile.png
  kaique-albuquerque-curriculo.pdf
  og-image.png
  favicon.svg

docs/superpowers/
  specs/        Especificações criadas no fluxo Superpowers
  plans/        Planos de implementação criados no fluxo Superpowers

.github/skills/
  <skill>/       Skills de IA do Superpowers (SKILL.md + arquivos de apoio)

AGENTS.md       Instruções que carregam o Superpowers em agentes de IA
```

## Conteúdo e idioma

Todo o texto do currículo vem de `src/content/pt.ts` e `src/content/en.ts`, ambos validados pelo tipo `Content` em `src/content/types.ts`. Os dois arquivos precisam manter a mesma estrutura (as especificações, empresas e datas espelham um do outro).

O idioma ativo é resolvido nesta ordem: parâmetro `?lang` da URL, `localStorage["curriculo-locale"]`, idioma do navegador e, por fim, português.

## Testes

```bash
npm test
```

Os testes cobrem as invariantes do conteúdo (empresa em toda experiência, link canônico do GitHub, ausência de textos sem acento) e a resolução de idioma.

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

Se for regenerar a imagem de compartilhamento, instale o Chromium do Playwright:

```bash
npx playwright install chromium
```

Rode o servidor de desenvolvimento:

```bash
npm run dev
```

## PDF do currículo

O currículo em PDF é um único arquivo, em português, mantido à mão:

```text
public/kaique-albuquerque-curriculo.pdf
```

Ele não é gerado pelo build: qualquer alteração de conteúdo do PDF precisa ser feita no arquivo original (por exemplo, no Canva ou no editor usado para montá-lo) e depois substituída nesse caminho, **mantendo o nome**. Os dois idiomas do site baixam esse mesmo arquivo, então o botão "Download PDF" aparece em inglês mas entrega o currículo em português.

Para validar o PDF (páginas, e-mail, telefone, LinkedIn, GitHub e acentos):

```bash
npm run check:pdf
```

A validação reprova arquivos em que o texto não é selecionável (exportados como imagem), porque nesse caso o ATS não consegue ler o conteúdo.

Para regenerar a imagem de compartilhamento:

```bash
npm run generate:og
```

## Build de produção

O build valida o PDF antes de compilar o site:

```bash
npm run build
```

Esse comando executa:

```bash
npm run check:pdf
tsc -b
vite build
```

Resultado final:

- Site compilado em `dist/`, com o PDF copiado de `public/`.
- Nenhum PDF é sobrescrito pelo build.

## Como atualizar o currículo

Edite o conteúdo em:

```text
src/content/pt.ts
src/content/en.ts
```

Depois rode:

```bash
npm test
npm run build
```

Isso valida o conteúdo e atualiza o site. Se a mudança também precisa aparecer no PDF, atualize `public/kaique-albuquerque-curriculo.pdf` a partir do arquivo original antes do build.

## Personalização visual

Para ajustar layout, cores, responsividade ou impressão/PDF, edite:

```text
src/styles.css
```

Pontos importantes:

- Variáveis de tema ficam em `:root` e `:root[data-theme="light"]`.
- Estilos do PDF ficam no bloco `@media print`, com coluna única e `break-inside: avoid` nos cartões.
- O bloco de impressão usa `html { font-size: 10px }` para caber em 2 páginas A4 na impressão direta do navegador.
- A linha `.print-contact` aparece apenas na impressão, com URLs e telefone em texto puro para ATS e impressão.
- Botões, seletor de tema/idioma, navegação e footer ficam ocultos na impressão.

## Menu rápido (`ntl`)

O projeto tem um menu interativo com os comandos do dia a dia. Na raiz do repositório:

```bash
ntl
```

Se `ntl` ainda não estiver no PATH da sua máquina, rode uma vez:

```bash
npm link
```

Ou use as alternativas, que sempre funcionam:

```bash
.\ntl          # PowerShell / cmd
npm run ntl
```

O menu mostra no topo o estado do git (branch, alterações pendentes, commits não enviados) e a conta logada no Firebase. As opções:

| Opção | Ação |
| --- | --- |
| 1 | Ver o site localmente (`npm run dev`) |
| 2 | Rodar os testes |
| 3 | Abrir o PDF do currículo |
| 4 | Validar o PDF |
| 5 | Build completo |
| 6 | Publicar preview (sem afetar produção) |
| 7 | Publicar em produção (pede confirmação) |
| 8 | Status do hosting |
| 9 | Abrir o site em produção |
| 10 | Abrir o console do Firebase |
| 11 | Como voltar para a versão anterior |
| 12 | Entrar no Firebase / trocar de conta |
| 13 | Onde editar cada coisa |
| 14 | Erros comuns e o que fazer |
| 15 | Trocar o domínio do site |
| 16 | Estado do git |

Também aceita atalho direto, sem menu:

```bash
ntl build
ntl deploy
ntl preview
ntl dev
ntl test
ntl status
```

## Publicação (Firebase Hosting)

O site é publicado no **Firebase Hosting**, projeto `curriculo-kaique`, com dois sites:

- Produção: <https://curriculokaique.web.app>
- Alternativo: <https://curriculokaique.firebaseapp.com>
- Antigo (redireciona com 301 para o novo): <https://curriculo-kaique.web.app>

O endereço `.web.app` vem do **site ID** do Hosting, que é único e imutável. Para trocar a URL sem perder nada, crie um site novo no mesmo projeto e aponte um deploy target para ele — não é necessário criar outro projeto.

Configuração no repositório:

- `firebase.json`: array de `hosting` com dois targets. `curriculo` (site `curriculokaique`) publica `dist/`, com SPA rewrite, cache longo para `/assets/**`, `Content-Disposition: inline` nos PDFs, headers de segurança e redirect 301 dos nomes antigos de PDF (`-pt`/`-en`) para `kaique-albuquerque-curriculo.pdf`; `antigo` (site `curriculo-kaique`) só redireciona com 301 para o novo.
- `.firebaserc`: fixa o projeto `curriculo-kaique` e mapeia os targets `curriculo` e `antigo`.

Trocar de site ID no futuro:

```bash
firebase hosting:sites:create <novo-site-id> --project curriculo-kaique
firebase target:apply hosting curriculo <novo-site-id>
```

Depois atualize as URLs em `index.html` (canonical, `og:url`, `og:image`, `twitter:image`, JSON-LD), o destino do redirect `antigo` em `firebase.json`, o `bin/ntl.mjs` e este README.

Primeira vez na máquina:

```bash
npm install -g firebase-tools
firebase login
```

Publicar uma nova versão (valida o PDF antes de subir):

```bash
npm run deploy
```

Publicar um preview temporário (não afeta produção):

```bash
npm run deploy:preview
```

### Checklist ao trocar de domínio

Ao mudar a URL pública, atualize estes pontos e rode `npm run build`:

1. `index.html`: `canonical`, `og:url`, `og:image` e `twitter:image`.
2. `index.html`: campo `url` do JSON-LD `Person`.
3. Configuração da conta: site do perfil do GitHub, campo "Website" do repositório e LinkedIn.

### Alternativas

O build em `dist/` é estático e também funciona em Netlify, Vercel ou GitHub Pages sem alteração de código.

## Observações

- O PDF é um artefato versionado em `public/`, porque o site é estático e precisa servir o arquivo pronto.
- O `og-image.png` continua sendo gerado por `npm run generate:og`; se a imagem estiver aberta em outro programa, a geração pode falhar no Windows com erro de arquivo bloqueado. Feche o visualizador e rode de novo.
- Textos em português usam acentuação completa. Nunca introduza versões sem acento: o teste `src/content/content.test.ts` bloqueia a maioria dos casos e a acentuação correta importa para busca em ATS.

## Autor

Kaique Albuquerque
