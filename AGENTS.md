# AGENTS.md — Superpowers

Este repositório carrega **Superpowers**: uma metodologia completa de desenvolvimento para agentes de IA, feita de skills compostas mais instruções iniciais que garantem que elas sejam usadas. As skills estão vendorizadas em [.github/skills/](.github/skills/) a partir de [obra/superpowers](https://github.com/obra/superpowers) v7.0.1 (licença MIT).

## Para agentes de IA

**Antes de responder qualquer coisa — inclusive perguntas de esclarecimento, exploração do código ou checagem de arquivos — leia [.github/skills/using-superpowers/SKILL.md](.github/skills/using-superpowers/SKILL.md) e siga as regras dela.**

Resumo operacional:

- Cada skill vive em `.github/skills/<nome>/SKILL.md`, com frontmatter `name`/`description`. Arquivos de apoio (`references/`, `prompts/`, `scripts/`, `templates/`) ficam dentro do diretório da própria skill.
- Se houver 1% de chance de uma skill se aplicar à tarefa, invoque-a. Anuncie `Using [skill] to [propósito]` e siga o checklist dela.
- Referências no texto original no formato `superpowers:<skill>` significam `.github/skills/<skill>/`.
- Skills de processo vêm antes de skills de implementação: "vamos construir X" → `brainstorming`; "corrija este bug" → `systematic-debugging`.
- Fluxo padrão: `brainstorming` → `writing-plans` → `subagent-driven-development` (ou `executing-plans`) → `requesting-code-review` → `verification-before-completion` → `finishing-a-development-branch`.
- Artefatos gerados: specs em [docs/superpowers/specs/](docs/superpowers/specs/), planos em [docs/superpowers/plans/](docs/superpowers/plans/) e estado de runtime em `.superpowers/` (não versionado).

## Atualizando as skills

1. Baixe a versão desejada de `obra/superpowers`.
2. Substitua o conteúdo de `.github/skills/` por `skills/` do upstream (mais o `LICENSE`).
3. Atualize versão e commit em [.github/skills/README.md](.github/skills/README.md).
