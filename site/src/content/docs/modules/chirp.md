---
title: Chirp
description: Native Grasshopper components powered by language models.
sidebar:
  order: 3
---

**Chirp** components are native Grasshopper nodes that run AI reasoning as part of
your definition. They take data in, think it through, and pass structured results
on — so a definition can make judgement calls, not just calculations.

:::caution[Placeholder]
This page is a scaffold. Expand with example cascades and screenshots before
publishing.
:::

## What they're for

Some steps in a design aren't pure geometry — they're decisions. *Which option
fits the brief? How should this be described? Is this result any good?* Chirp lets
you place that kind of reasoning right on the canvas, where it belongs, instead of
breaking out to a separate tool.

You stay in control of the structure; Chirp handles the judgement inside the box
you give it.

## Categories

Each Chirp component plays a role you'd recognize from a design team:

| Category | Role |
|----------|------|
| **Planner** | Breaks a goal into steps |
| **Interpreter** | Turns loose input into structured data |
| **Critic** | Reviews a result and flags issues |
| **Narrator** | Describes what's happening in plain language |
| **Classifier** | Sorts inputs into categories |
| **Gate** | Decides whether to pass or stop |
| **Editor** | Revises content against a goal |

## Cascades

Chain several Chirp components and they can share reasoning context — a *cascade* —
so a multi-step design stays coherent from one decision to the next. Ask Rook to
set one up by describing the chain you want.

## How you make one

You don't configure Chirp by hand. Describe what the component should do:

> “Add a critic that checks each layout against the brief and flags the weak ones.”

Rook places and configures it.

:::tip[Try it — paste to your agent]
```text
Add a Chirp critic to my Grasshopper definition that reviews each layout option
against my brief and flags the weak ones.
```
:::

## Related

- [Rook in Grasshopper](/rook-release/modules/grasshopper/)
