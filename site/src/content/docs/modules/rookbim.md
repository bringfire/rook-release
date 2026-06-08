---
title: RookBIM
description: Query and work with BIM elements, categories, and parameters.
sidebar:
  order: 5
---

**RookBIM** lets Rook work with the BIM side of a model — the elements,
categories, and parameters that carry information beyond raw geometry. It's built
for interrogating and organizing a model, not authoring it from scratch.

:::caution[Placeholder]
This page is a scaffold. Confirm exact capabilities and supported workflows before
publishing.
:::

## What it's for

BIM models are dense with structured data. Pulling answers out of them by hand is
slow. RookBIM lets you just ask:

> “What categories of elements are in this model?”
>
> “Select every element on level 2 and show me its parameters.”
>
> “How many of these are there, and what's the total?”

## What it helps with

- **Querying** — find elements by category, level, or property
- **Inspecting** — read the parameters attached to an element
- **Selecting** — pull together a set to act on
- **Coordination** — get a quick read on what a model contains

## A collaborator on the data

As with the rest of Rook, the point is to take the busywork off your hands —
gathering, counting, selecting — so you can make the decisions.

:::tip[Try it — paste to your agent]
```text
List the categories of elements in this model, then select everything on level 2
and show me a summary of their parameters.
```
:::

## Related

- [All Capabilities](/rook-release/modules/overview/)
