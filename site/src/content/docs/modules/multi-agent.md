---
title: Multi-Agent
description: A fleet of background agents that operate Rhino and Grasshopper in parallel.
sidebar:
  order: 3
---

For larger jobs, Rook can spawn **a fleet of background agents** that operate Rhino
and Grasshopper on their own. One plans, several build in parallel, and one keeps
watch.

> “Three chicks on the perch, each with its own task; Rook keeps the time.”

## The roles

| Role | Job |
|------|-----|
| **The Planner** | Decomposes a complex request into subtasks |
| **The Workers** | Execute subtasks in parallel on the canvas |
| **The Guardian** | Watches the workers, keeps them on task, and minds the budget |
| **The Conductor** | Coordinates the fleet and keeps the rhythm |

Each role is matched to an appropriately sized model — a stronger model plans, lean
models do the repetitive building, a small fast one supervises — which keeps a big
job both capable and economical.

## What it's for

Work that splits into independent pieces:

> “Lay out all forty units from these footprints.”
>
> “Generate variations of this façade across the whole elevation.”

The planner breaks it down, workers build the pieces at once, and the guardian
makes sure they stay on track and within budget.

## You stay in the loop

A fleet doesn't mean a black box — you can watch progress, answer questions the
agents raise, and stop the run at any time.

:::tip[Try it — paste to your agent]
```text
I have a set of unit footprints selected. Spin up a fleet to lay them all out in
parallel, and keep me posted on progress as it goes.
```
:::

## Related

- [Knowledge Graph](/rook-release/modules/knowledge-graph/) — keeps the lean worker agents competent
- [The Ecosystem](/rook-release/modules/ecosystem/) — the same idea, scaled across whole files
