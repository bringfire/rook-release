---
title: Knowledge Graph
description: A self-improving knowledge graph that remembers what works — and learns from corrections.
sidebar:
  order: 1
---

Rook is backed by a **knowledge graph that remembers**. It's why Rook can resolve
your intent to the right command or component so quickly — and why it gets better
over time.

## What's in it

- **197 Rhino commands** — with 543 logged observations of what works and what fails
- **945 Grasshopper components** — mapped to 1,533 intents

When you describe what you want, Rook consults this graph to find the right pieces
and how they fit together.

## It learns from corrections

The graph improves from *failure*, not routine success. When a mistake gets fixed,
correction detection records the learning — so the next agent, and the one after,
won't repeat it.

## Tiered retrieval

Rook pulls only as much knowledge as a task needs, keeping responses fast and
focused:

| Tier | Cost | When |
|------|------|------|
| **quick** | ~20 tokens | fast check |
| **context** | ~50 tokens | routine use |
| **errors** | ~30 tokens | on failure |
| **raw** | 500+ tokens | forensic / deep dive |

Pulling the right tier instead of everything is roughly a **97% token reduction**
versus reading raw patterns.

## Why it matters to you

You get the benefit of accumulated expertise — the patterns experienced users
rely on — without having to learn or maintain any of it yourself.

:::tip[Try it — paste to your agent]
```text
Before you build anything, query Rook's knowledge for how to create a cone and
tell me the gotchas it has on record.
```
:::

## Related

- [The Design Cascade](/rook-release/modules/design-cascade/) — its *Consolidate* phase feeds the graph
- [Multi-Agent](/rook-release/modules/multi-agent/) — how the graph keeps cheap agents competent
