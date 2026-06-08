---
title: Model-Agnostic
description: One plugin, any mind — Rook works with any MCP client and any model provider.
sidebar:
  order: 4
---

Rook isn't tied to one AI vendor. It speaks the **Model Context Protocol (MCP)**,
so any client that does will work — and its agent layer is routed through LiteLLM,
giving you a hundred-odd providers, local or cloud.

> One plugin, any mind.

## Clients that work

| Client | Support |
|--------|---------|
| **Claude Code** | Recommended · full feature set |
| **Claude Desktop** | Fully supported |
| **Codex Desktop** | Fully supported |
| **Cursor** | MCP tools |
| **Windsurf** | MCP tools |
| **Ollama** | Local · agent backend |
| **LM Studio** | Local · agent backend |
| **…and 100+ more** | via LiteLLM |

## Why it matters

- **Use what you already have.** No new account or vendor lock-in — point your
  current assistant at Rook.
- **Run local if you want.** Ollama and LM Studio keep everything on your machine.
- **Switch freely.** Change models without changing how you work.

You choose the mind; Rook provides the hands.

:::tip[Try it — paste to your agent]
```text
Which AI model are you using through Rook right now, and what would I change to
run a local model via Ollama instead?
```
:::

## Related

- [Many Providers](/rook-release/modules/multi-provider/) — the same openness for image, video, and 3D generation
- [Install Rook](/rook-release/start/install/) — connecting your client
