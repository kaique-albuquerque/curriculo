# Superpowers — skills de IA

Cópia vendorizada das skills do projeto [obra/superpowers](https://github.com/obra/superpowers), para que as capacidades de IA viajem junto com este repositório.

| Campo | Valor |
| --- | --- |
| Upstream | `obra/superpowers` |
| Versão | 7.0.1 |
| Commit | `2ce8aa15d05bd57213e6f746f953aafb7ded7a8b` (2026-10-21) |
| Licença | MIT — ver [LICENSE](./LICENSE) |
| Origem | diretório `skills/` do upstream, copiado sem alterações |

## Skills incluídas

| Skill | Quando usar |
| --- | --- |
| `brainstorming` | antes de qualquer trabalho criativo: features, componentes, mudanças de comportamento, planos |
| `writing-plans` | depois de ter spec/requisitos, antes de tocar no código |
| `subagent-driven-development` | executar planos com tarefas independentes na sessão atual |
| `executing-plans` | executar o plano inline, sem subagentes |
| `test-driven-development` | ao implementar qualquer feature ou correção |
| `systematic-debugging` | diante de bug, teste falhando ou comportamento inesperado |
| `verification-before-completion` | antes de afirmar que algo está pronto/corrigido/passando |
| `requesting-code-review` | antes de mergear ou concluir tarefas grandes |
| `receiving-code-review` | ao receber feedback de review |
| `finishing-a-development-branch` | ao integrar o trabalho concluído |
| `using-git-worktrees` | quando o trabalho precisa de isolamento do workspace |
| `dispatching-parallel-agents` | com 2+ tarefas independentes e sem estado compartilhado |
| `writing-skills` | ao criar, editar ou validar skills |
| `using-superpowers` | bootstrap: como encontrar e usar as skills |
| `diagnosing-superpowers` | diagnosticar uma sessão que deu errado |

## Como isso é usado

- **VS Code / GitHub Copilot:** as skills são descobertas em `.github/skills/<nome>/SKILL.md` e o [AGENTS.md](../../AGENTS.md) na raiz injeta o bootstrap (`using-superpowers`) em toda conversa.
- **Outros agentes:** qualquer harness que leia `AGENTS.md` e markdown frontmatter consegue usar, apontando para `.github/skills/`.

## Atualizando

```powershell
git clone --depth 1 https://github.com/obra/superpowers $env:TEMP\superpowers-src
Copy-Item "$env:TEMP\superpowers-src\skills\*" .github\skills -Recurse -Force
Copy-Item "$env:TEMP\superpowers-src\LICENSE" .github\skills\LICENSE -Force
git -C "$env:TEMP\superpowers-src" rev-parse HEAD
```

Depois atualize a tabela de versão/commit acima.
