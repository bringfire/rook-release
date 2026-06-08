---
title: The Ecosystem
description: One mind plans, many hands build — large workflows decomposed across whole Rhino files.
sidebar:
  order: 2
---

The Ecosystem is Rook's north star: **one mind plans, many hands build.** Where
[Multi-Agent](/rook-release/modules/multi-agent/) splits work inside a single file, the
Ecosystem splits it across *files* — the natural unit of a real project.

> One mind plans. Many hands build.

## Two tiers

- **One expensive brain** — a cloud coordinator (Claude Desktop / Codex) plans
  across files, options, and disciplines.
- **Many cheap hands** — local swarms work each file in parallel, ideally at near-
  zero cost per file:
  - one file doing in-file modelling
  - one mostly deterministic
  - one running retry loops
- **Fan-in** — the results recombine through native Rhino composition:
  worksessions, import, linked models, references, and blocks → a master model.

## The entity model

| Entity | What it is |
|--------|------------|
| **Session** | a live execution context — disposable |
| **Artifact** | a `.3dm` produced or consumed — durable |
| **Work Unit** | a role, its constraints, and the expected output |
| **Merge Contract** | how an artifact recombines — an edge, not a registry |

## The subsidy

The [knowledge graph](/rook-release/modules/knowledge-graph/) is what lets the cheap tier
stay competent: intent routing carries the skill, so the local model doesn't have
to. That's what makes "many cheap hands" actually work.

## Related

- [Multi-Agent](/rook-release/modules/multi-agent/) — the same idea within one file
- [Knowledge Graph](/rook-release/modules/knowledge-graph/)
