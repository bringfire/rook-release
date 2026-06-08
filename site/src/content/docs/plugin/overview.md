---
title: Plugin Overview
description: Rook ships as a Claude Code plugin — skills and hooks — on top of its MCP server.
sidebar:
  order: 1
---

Rook is two things working together:

1. **An MCP server** — the nearly 400 MCP tools your assistant uses to operate Rhino and
   Grasshopper. Any MCP-capable client gets these.
2. **Skills and hooks** — guided workflows that turn those tools into coherent design
   sessions. This is the part that makes Rook feel like it knows how to design, not
   just how to click.

Understanding the split matters: a client with only the MCP server can *do* things;
a client with the skills also *knows the workflows*.

## What's in the plugin

| Part | What it is |
|------|------------|
| **Skills** | 11 guided workflows you invoke with `/` — see [Skills That Ship](/rook-release/plugin/skills/) |
| **Hooks** | A session-start hook that loads Rook context and skill awareness automatically |
| **MCP link** | The plugin points at the Rook MCP server, so tools and skills travel together |

The plugin is declared in `.claude-plugin/plugin.json` and published through
`.claude-plugin/marketplace.json` in the [Rook repository](https://github.com/bringfire/rook-release).

## How it gets installed

There are two distinct steps with different delivery channels:

**Step 1 — The installer** sets up the Rhino plug-ins and the local MCP server, and
registers it with your assistant. It also copies the curated skill set to `~/.codex/skills`
for Codex users. See [Install Rook](/rook-release/start/install/).

**Step 2 — The marketplace plugin (Claude Code only)** delivers the skills and the
session-start hook to Claude Code. Run these two commands in Claude Code after the installer:

:::tip[Paste this to your agent (Claude Code)]
```text
Add the Rook plugin marketplace and install the Rook plugin for me:

1. Run: /plugin marketplace add bringfire/rook-release
2. Then: /plugin install rook@rook
3. Confirm the Rook skills are now available (e.g. /design-grasshopper, /chirp).

If anything fails, tell me what happened and the likely fix.
```
:::

After installing, the session-start hook loads Rook's context automatically and the
skills appear under `/`.

## Which clients get what

| Client | MCP tools | Skills | Hooks / Plugins / Agents |
|--------|:---------:|:------:|:------------------------:|
| **Claude Code** (CLI / Desktop / VS Code) | ✅ | ✅ (marketplace plugin) | ✅ |
| **Codex CLI** | ✅ | ✅ (curated, 11; installer-delivered) | — |
| **Cursor / Windsurf** | ✅ | — | — |
| **Old Claude Desktop chat app** | ✅ | — | — |

See [Claude Code & Desktop](/rook-release/plugin/claude/) and
[Codex & Other Clients](/rook-release/plugin/codex/) for per-client setup.

## Verify it worked

Hand your agent the [Set Up & Verify](/rook-release/start/setup-verify/) page — it checks
the MCP connection, the live Rhino bridge, and whether the skills are present.
