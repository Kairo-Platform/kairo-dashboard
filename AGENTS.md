# Kairo agent instructions

These instructions apply throughout this monorepo, regardless of editor or agent.

Before changing code, read [.agents/rules/engineering.md](.agents/rules/engineering.md) and inspect the target files and the closest existing implementation. For architecture and ownership, consult [FRONTEND_SOP.md](FRONTEND_SOP.md) and [README.md](README.md); use the current code and package scripts to verify details.

For Figma implementation, also read [.agents/skills/kairo-figma-to-code/SKILL.md](.agents/skills/kairo-figma-to-code/SKILL.md). Other changes do not require that skill.

`.agents/` is the canonical, version-controlled source of project rules and skills. All agents must start with `AGENTS.md` and follow the applicable guidance in `.agents/`.

## Git commits

- Do not add Co-authored-by trailers or AI attribution to commit messages.
- Do not change the configured Git author or committer.
- Use conventional commit messages when appropriate.
- Keep unrelated working-tree changes out of commits.
