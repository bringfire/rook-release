---
title: The Design Cascade
description: Four skills, one river — explore, commit, build, remember — for larger Grasshopper work.
sidebar:
  order: 4
---

For anything bigger than a quick component, Rook works in **four phases** — a
cascade where each stage flows into the next. The design document is the thing
that carries through: it survives long sessions and makes the plan explicit
*before* anything touches the canvas.

## Four phases, one river

| Phase | Skill | What it does |
|-------|-------|--------------|
| **I · Design** | `/design-grasshopper` | **Explore.** Reads the knowledge store and your scene, asks clarifying questions, and produces a validated design document. |
| **II · Plan** | `/plan-grasshopper` | **Commit.** Turns the design into exact, ordered build steps — component lookups and canvas positions pinned. |
| **III · Execute** | `/execute-grasshopper` | **Build.** Runs the plan in small batches, checking status and errors every few components. |
| **IV · Consolidate** | `/consolidate` | **Remember.** Folds what was learned during the build back into the [knowledge graph](/rook-release/modules/knowledge-graph/). |

## Why phases

A big definition is easy to get wrong if you dive straight to the canvas. The
cascade keeps you in control: you shape the design document in conversation,
confirm the plan, and only then does Rook build — checking itself as it goes.

## When to use it

- A multi-part parametric definition, not a single component
- Work you'll want to revisit or hand off
- Anything where you'd like to agree the approach before committing

For quick, one-off canvas work, just ask directly — see
[Grasshopper](/rook-release/modules/grasshopper/).

:::tip[Try it — paste to your agent]
```text
Walk me through the design cascade for a parametric façade driven by attractor
points — start with /design-grasshopper and ask me questions before you plan.
```
:::
