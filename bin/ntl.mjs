#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createInterface } from "node:readline/promises";
import { argv, exit, platform, stdin, stdout } from "node:process";
import { fileURLToPath } from "node:url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const isWindows = platform === "win32";
const useColor = stdout.isTTY && !process.env.NO_COLOR;

const paint = (code, text) => (useColor ? `\u001b[${code}m${text}\u001b[0m` : text);
const bold = (text) => paint("1", text);
const dim = (text) => paint("2", text);
const green = (text) => paint("32", text);
const yellow = (text) => paint("33", text);
const cyan = (text) => paint("36", text);
const red = (text) => paint("31", text);

const bin = (name) => {
  if (!isWindows) return name;
  if (name === "npm" || name === "npx" || name === "firebase") return `${name}.cmd`;
  return name;
};

// `.cmd` shims (npm, firebase) so precisam de shell no Windows; exe/bat diretos nao.
const needsShell = (name) => isWindows && name.endsWith(".cmd");

function run(command, args) {
  const target = bin(command);
  const result = spawnSync(target, args, {
    cwd: projectRoot,
    stdio: "inherit",
    shell: needsShell(target),
  });

  if (result.error) {
    console.log(red(`\nNao foi possivel executar "${command}".`));
    if (command === "firebase") {
      console.log(dim("Instale com: npm install -g firebase-tools"));
    }
    console.log(dim(result.error.message));
    return;
  }

  if (result.status !== 0) {
    console.log(yellow(`\nComando terminou com codigo ${result.status}.`));
  }
}

function capture(command, args) {
  const target = bin(command);
  const result = spawnSync(target, args, {
    cwd: projectRoot,
    encoding: "utf8",
    shell: needsShell(target),
  });

  if (result.error || result.status !== 0) return null;
  return `${result.stdout ?? ""}${result.stderr ?? ""}`;
}

function firebaseReady() {
  if (!capture("firebase", ["--version"])) {
    return { ok: false, reason: "CLI do Firebase nao encontrado" };
  }

  const login = capture("firebase", ["login:list"]);
  const email = login?.match(/Logged in as (\S+)/)?.[1];

  return email
    ? { ok: true, reason: email.trim() }
    : { ok: false, reason: "sem login no Firebase" };
}

function gitInfo() {
  const branch = capture("git", ["rev-parse", "--abbrev-ref", "HEAD"])?.trim();
  const status = capture("git", ["status", "--porcelain"])?.trim();
  const ahead = capture("git", ["rev-list", "--count", "@{u}..HEAD"])?.trim();

  return {
    branch: branch || "?",
    dirty: Boolean(status),
    ahead: ahead && ahead !== "0" ? ahead : null,
  };
}

function header() {
  const git = gitInfo();
  const firebase = firebaseReady();

  const gitLine = [
    `git ${bold(git.branch)}`,
    git.dirty ? yellow("com alteracoes") : green("limpo"),
    git.ahead ? yellow(`${git.ahead} commit(s) local(is)`) : null,
  ]
    .filter(Boolean)
    .join(dim("  ·  "));

  console.log("");
  console.log(bold(cyan("  Curriculo Kaique Albuquerque")) + dim("  ·  ntl"));
  console.log(dim("  " + "-".repeat(60)));
  console.log(`  ${gitLine}`);
  console.log(
    `  ${firebase.ok ? green(`firebase ${firebase.reason}`) : yellow(`firebase: ${firebase.reason}`)}`,
  );
  console.log(dim("  " + "-".repeat(60)));
}

const guide = {
  files: [
    ["Textos, empresas, projetos, stack, formacao, idiomas (PT)", "src/content/pt.ts"],
    ["As mesmas mudancas em ingles", "src/content/en.ts"],
    ["Tipos do conteudo (contrato das duas versoes)", "src/content/types.ts"],
    ["Cores, espacamento, layout e regras de impressao", "src/styles.css"],
    ["Titulo, descricao, Open Graph, favicon e JSON-LD", "index.html"],
    ["Foto do curriculo (mantenha o nome)", "public/profile.png"],
    ["Geracao dos PDFs por idioma", "scripts/generate-pdf.mjs"],
    ["Validacao dos PDFs (roda dentro do build)", "scripts/check-pdf.mjs"],
    ["Imagem de compartilhamento 1200x630", "scripts/generate-og.mjs"],
    ["Configuracao do Firebase Hosting", "firebase.json"],
  ],
  errors: [
    [
      "esperado exatamente 2 paginas, encontrado 3",
      "Conteudo novo estourou o limite A4. Reduza texto ou ajuste html { font-size: 10px } e paddings no bloco @media print de src/styles.css.",
    ],
    [
      "Falha ao gerar PDF / arquivo bloqueado",
      "Um PDF esta aberto no Acrobat ou Edge. Feche o visualizador e rode de novo.",
    ],
    [
      'Failed to resolve import "./en"',
      "Voce editou o PT sem o EN. Os dois arquivos precisam ter a mesma estrutura.",
    ],
    [
      "pt nao usa palavras sem acento",
      "Escreveu Experiencia em vez de Experiência. Corrija a acentuacao.",
    ],
    [
      "Teste vermelho",
      "Rode npm test e leia o campo apontado. Nao publique com teste vermelho.",
    ],
    [
      "Authentication Error no deploy",
      "Login expirou. Use a opcao 12 (firebase login --reauth).",
    ],
    [
      "Not in a Firebase project directory",
      "Voce esta em outra pasta. Entre em c:\\curriculo.",
    ],
    ["firebase: command not found", "Use a opcao 12 para instalar o CLI."],
  ],
  rollback: [
    "Nao existe firebase hosting:rollback neste CLI. Dois caminhos:",
    "",
    "1) Console (mais rapido): Hosting > historico de releases > escolha a anterior > Rollback",
    "   https://console.firebase.google.com/project/curriculo-kaique/hosting",
    "",
    "2) Git (mais controlado):",
    "   git log --oneline -5",
    "   git revert <commit-ruim>",
    "   npm run deploy",
  ],
  domain: [
    "Ao trocar o dominio publico, atualize em index.html:",
    "",
    '  - <link rel="canonical">',
    "  - og:url",
    "  - og:image",
    "  - twitter:image",
    '  - campo "url" do JSON-LD Person',
    "",
    "Depois: npm run build && npm run deploy",
    "E atualize o perfil do GitHub, o campo Website do repositorio e o LinkedIn.",
  ],
};

let rl;
let pipedLines = null;
let pipedIndex = 0;

const isInteractive = Boolean(stdin.isTTY);

function nextPipedLine() {
  if (pipedLines === null) {
    const raw = readFileSync(0, "utf8");
    pipedLines = raw.split(/\r?\n/);
  }

  const line = pipedLines[pipedIndex];
  pipedIndex += 1;
  return line ?? null;
}

function ask(question) {
  if (!isInteractive) {
    stdout.write(question);
    const line = nextPipedLine();
    if (line === null) {
      stdout.write("\n");
      return Promise.resolve("q");
    }
    stdout.write(`${line}\n`);
    return Promise.resolve(line);
  }

  rl ??= createInterface({ input: stdin, output: stdout });
  rl.on("close", () => {
    console.log(dim("\nAte mais.\n"));
    exit(0);
  });
  return rl.question(question);
}

async function pause() {
  console.log("");
  await ask(dim("Enter para voltar ao menu... "));
}

async function confirm(question) {
  const answer = await ask(`${question} ${dim("(s/N)")} `);
  return /^s(im)?$/i.test(answer.trim());
}

const actions = [
  {
    key: "1",
    label: "Ver o site localmente",
    hint: "npm run dev · http://localhost:5173 · Ctrl+C encerra",
    run: () => run("npm", ["run", "dev"]),
  },
  {
    key: "2",
    label: "Rodar os testes",
    hint: "npm test · precisa passar antes de publicar",
    run: () => run("npm", ["test"]),
  },
  {
    key: "3",
    label: "Gerar os PDFs (pt e en)",
    hint: "npm run generate:pdf · grava em public/",
    run: () => run("npm", ["run", "generate:pdf"]),
  },
  {
    key: "4",
    label: "Validar os PDFs",
    hint: "npm run check:pdf · paginas, URLs, telefone e acentos",
    run: () => run("npm", ["run", "check:pdf"]),
  },
  {
    key: "5",
    label: "Build completo",
    hint: "npm run build · PDFs + validacao + tipos + dist/",
    run: () => run("npm", ["run", "build"]),
  },
  {
    key: "6",
    label: "Publicar preview (sem afetar producao)",
    hint: "npm run deploy:preview · URL temporaria de 7 dias",
    run: async () => {
      const firebase = firebaseReady();
      if (!firebase.ok) {
        console.log(yellow(`\nFirebase indisponivel: ${firebase.reason}.`));
        console.log(dim("Use a opcao 12 para instalar ou entrar na conta."));
        return;
      }
      run("npm", ["run", "deploy:preview"]);
      console.log(
        dim("\nApagar depois: firebase hosting:channel:delete preview --force"),
      );
    },
  },
  {
    key: "7",
    label: "Publicar em producao",
    hint: "npm run deploy · atualiza https://curriculo-kaique.web.app",
    run: async () => {
      const firebase = firebaseReady();
      if (!firebase.ok) {
        console.log(yellow(`\nFirebase indisponivel: ${firebase.reason}.`));
        console.log(dim("Use a opcao 12 para instalar ou entrar na conta."));
        return;
      }

      const ok = await confirm(
        yellow("Publica no ar para todo mundo. Testou e o build passou?"),
      );
      if (!ok) {
        console.log(dim("Cancelado."));
        return;
      }

      run("npm", ["run", "deploy"]);
    },
  },
  {
    key: "8",
    label: "Status do hosting",
    hint: "firebase hosting:channel:list · canais e datas",
    run: () => run("firebase", ["hosting:channel:list"]),
  },
  {
    key: "9",
    label: "Abrir o site em producao",
    hint: "https://curriculo-kaique.web.app",
    run: () => {
      const url = "https://curriculo-kaique.web.app";
      spawnSync(
        isWindows ? "cmd" : "open",
        isWindows ? ["/c", "start", "", url] : [url],
        { stdio: "ignore" },
      );
      console.log(dim(`Abrindo ${url}`));
    },
  },
  {
    key: "10",
    label: "Abrir o console do Firebase",
    hint: "Hosting, releases e configuracoes",
    run: () => {
      const url =
        "https://console.firebase.google.com/project/curriculo-kaique/hosting";
      spawnSync(
        isWindows ? "cmd" : "open",
        isWindows ? ["/c", "start", "", url] : [url],
        { stdio: "ignore" },
      );
      console.log(dim(`Abrindo ${url}`));
    },
  },
  {
    key: "11",
    label: "Como voltar para a versao anterior",
    hint: "rollback pelo console ou por git revert",
    run: async () => {
      console.log("");
      for (const line of guide.rollback) console.log(`  ${line}`);
      await pause();
    },
  },
  {
    key: "12",
    label: "Entrar no Firebase / trocar de conta",
    hint: "firebase login --reauth · instala o CLI se faltar",
    run: async () => {
      if (!capture("firebase", ["--version"])) {
        console.log(yellow("\nCLI do Firebase nao encontrado. Instalando..."));
        run("npm", ["install", "-g", "firebase-tools"]);
      }
      run("firebase", ["login", "--reauth"]);
      run("firebase", ["login:list"]);
      await pause();
    },
  },
  {
    key: "13",
    label: "Onde editar cada coisa",
    hint: "mapa de arquivos por tipo de mudanca",
    run: async () => {
      console.log("");
      for (const [what, file] of guide.files) {
        console.log(`  ${what}`);
        console.log(`    ${cyan(file)}`);
      }
      console.log("");
      console.log(dim("  Regra: PT e EN sempre juntos; npm test avisa se divergirem."));
      await pause();
    },
  },
  {
    key: "14",
    label: "Erros comuns e o que fazer",
    hint: "mensagens do build e do deploy",
    run: async () => {
      console.log("");
      for (const [problem, fix] of guide.errors) {
        console.log(`  ${red(problem)}`);
        console.log(`    ${fix}`);
        console.log("");
      }
      await pause();
    },
  },
  {
    key: "15",
    label: "Trocar o dominio do site",
    hint: "checklist dos metadados em index.html",
    run: async () => {
      console.log("");
      for (const line of guide.domain) console.log(`  ${line}`);
      await pause();
    },
  },
  {
    key: "16",
    label: "Estado do git",
    hint: "branch, alteracoes e ultimos commits",
    run: async () => {
      console.log("");
      run("git", ["status", "--short", "--branch"]);
      console.log("");
      run("git", ["--no-pager", "log", "--oneline", "-8"]);
      await pause();
    },
  },
];

function menu() {
  console.log("");
  for (const action of actions) {
    console.log(`  ${bold(action.key.padStart(2))}  ${action.label}`);
    console.log(dim(`      ${action.hint}`));
  }
  console.log("");
  console.log(`  ${bold("q")}  Sair`);
  console.log(
    dim("      Atalhos: ntl dev | test | pdf | check:pdf | build | preview | deploy | status"),
  );
  console.log("");
}

const shortcuts = {
  dev: "1",
  test: "2",
  pdf: "3",
  "check:pdf": "4",
  build: "5",
  preview: "6",
  deploy: "7",
  status: "8",
  site: "9",
  console: "10",
  rollback: "11",
  login: "12",
  arquivos: "13",
  erros: "14",
  dominio: "15",
  git: "16",
};

async function main() {
  const arg = argv[2];

  if (arg === "--help" || arg === "-h") {
    header();
    menu();
    exit(0);
  }

  if (arg) {
    const key = shortcuts[arg] ?? (/^\d+$/.test(arg) ? arg : null);
    const action = actions.find((item) => item.key === key);

    if (!action) {
      console.log(red(`Opcao "${arg}" nao existe.`));
      console.log(dim(`Atalhos: ${Object.keys(shortcuts).join(", ")}`));
      exit(1);
    }

    await action.run();
    return;
  }

  while (true) {
    header();
    menu();

    const answer = (await ask(`  Opcao: `)).trim();

    if (/^q(uit)?$/i.test(answer)) {
      console.log(dim("\nAte mais.\n"));
      break;
    }

    if (answer === "") continue;

    const action = actions.find((item) => item.key === answer);
    if (!action) {
      console.log(red(`\n  "${answer}" nao e uma opcao valida.`));
      continue;
    }

    console.log("");
    console.log(bold(`  ${action.label}`));
    console.log(dim(`  ${action.hint}`));
    console.log("");

    await action.run();
  }

  rl?.close();
}

main().catch((error) => {
  console.error(red(`\nntl falhou: ${error.message}`));
  exit(1);
});
