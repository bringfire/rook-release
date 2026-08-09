---
title: Skills That Ship
description: The guided workflows Rook adds to Claude Code — what each does and how to invoke it.
sidebar:
  order: 2
---

Skills are guided workflows you trigger with `/`. They orchestrate Rook's tools
into multi-step processes — designing a Grasshopper definition, creating Chirp
components, or organizing a file. Rook ships **9** of them.

:::note
Skills reach **Claude Code** via the marketplace plugin (`/plugin marketplace add bringfire/rook-release`
→ `/plugin install rook@rook`). **Codex CLI** gets the same curated 9 user skills
installed by the installer (`~/.codex/skills`). Other MCP clients get the tools but
not the skills. See [Plugin Overview](/rook-release/plugin/overview/).
:::

## Grasshopper — routed design, planning, and execution

Use execution directly for a clear, bounded request. Design is available when the
brief needs material decisions, and planning is optional for larger or higher-risk
work. See [The Design Cascade](/rook-release/modules/design-cascade/).

| Skill | What it does |
|-------|--------------|
| `/design-grasshopper` | Explore the idea, ask questions, produce a validated design document |
| `/plan-grasshopper` | Turn that design into an exact, ordered build plan |
| `/execute-grasshopper` | Build the plan in batches, checking errors as it goes |

:::tip[Paste this to your agent]
```text
Use /design-grasshopper to design a parametric façade driven by attractor points.
Ask me any clarifying questions first, then produce the design document.
```
:::

## Chirp — AI reasoning on the canvas

See [Chirp](/rook-release/modules/chirp/).

| Skill | What it does |
|-------|--------------|
| `/chirp` | Create a single Chirp component (planner, critic, gate, …) |
| `/chirp-cascade` | Build a multi-component reasoning cascade from a brief |

:::tip[Paste this to your agent]
```text
Use /chirp to add a critic component that reviews each layout option against my
brief and flags the weak ones.
```
:::

## Organizing & conventions

The everyday cleanup work. See [Everyday Tasks](/rook-release/working/everyday-tasks/).

| Skill | What it does |
|-------|--------------|
| `/project-setup` | Bootstrap a project directory with Rook instructions |
| `/capture-convention` | Extract layer/material/block conventions from a reference file into `.rook/conventions.yaml` |
| `/clean-layers` | Audit a file against your conventions and propose cleanup (never destructive without approval) |
| `/twisted-column` | Create a parametric twisted column by lofting rotated profiles |

:::tip[Paste this to your agent]
```text
Use /capture-convention on this reference file to save my layer and block
standards, then use /clean-layers to bring my working file into line with them.
```
:::

## How skills compose

The Grasshopper skills route by need rather than enforcing a ceremony: execute a
clear request directly, use design to resolve ambiguity, and add a durable plan when
risk or scope warrants it. You can also mix workflows freely: capture a convention,
clean a file to match, then design new geometry on the tidy base.
