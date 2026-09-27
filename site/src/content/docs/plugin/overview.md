---
title: Plugin Overview
description: Rook's MCP tools and its skills — what each part does and how each app gets them.
sidebar:
  order: 1
---

Rook is two things working together:

1. **Rook's tools**: the nearly 400 MCP tools your assistant uses to operate Rhino
   and Grasshopper. The installer connects them to Claude and ChatGPT.
2. **Rook's skills**: nine guided workflows that turn those tools into coherent
   design sessions. This is the part that makes Rook feel like it knows how to
   design, not just how to click. See [Skills That Ship](/rook-release/plugin/skills/).

A client with only the tools can *do* things; a client with the skills also *knows
the workflows*.

## How each app gets them

| App | Tools | Skills |
|---|---|---|
| **Claude** (Chat, Cowork, Code tab) | The Rook installer | The Rook plugin: **Customize → Plugins → Add marketplace** → `bringfire/rook-release` |
| **ChatGPT desktop app** (Codex) | The Rook installer | The Rook installer |
| **Cursor, Windsurf, other MCP clients** | Manual MCP entry | Not available |

None of these need a terminal. [Install Rook](/rook-release/start/install/) has the
steps, and [Set Up & Verify](/rook-release/start/setup-verify/) has the prompts that
check them.

## What's in the plugin

The Claude plugin contains the nine skills and nothing else: no hooks and no
programs. It's published from the
[rook-release repository](https://github.com/bringfire/rook-release) through
`.claude-plugin/marketplace.json`.

:::note[Two different "agent" layers]
**Rook's built-in multi-agent fleet**, the planner / worker / conductor
orchestration that spawns background agents, lives in Rook's tools and works in any
MCP client (see [Multi-Agent](/rook-release/modules/multi-agent/)). The plugin ships
only user skills; Rook's internal development agents are **not** shipped.
:::
