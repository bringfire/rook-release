---
title: RookBIM
description: Query and work with BIM elements, categories, and parameters.
sidebar:
  order: 5
---

**RookBIM** lets Rook work with the BIM side of a model — the elements,
categories, and parameters that carry information beyond raw geometry. It's built
for interrogating and organizing a model, not authoring it from scratch.

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

## Changing the Revit model

When Rhino runs inside Revit, an agent can also change the Revit model through a
supported route:

- **One named transaction** — the change runs as a Python script on Revit's API
  thread inside a single named transaction. The agent waits for the result and gets
  back the script's output, the transaction status, and the ids of the changed
  elements.
- **A receipt for every write** — each write leaves a receipt that can be read
  later, even while Revit is busy.
- **Document guard** — optionally, a write is refused if you have switched to
  another Revit document since the agent last read it.
- **Clear refusals** — if a dialog or command is active in Revit, RookBIM says that
  Revit is not idle instead of failing without a reason.

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
