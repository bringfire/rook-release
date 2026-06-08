---
title: Set Up & Verify
description: Hand this page to your AI agent — it will check that Rook is installed, connected, and working.
sidebar:
  order: 3
---

This page is written to be **handed to your AI agent**. After you've run the
installer and restarted Rhino, paste the block below into Claude Code (or your
MCP-capable assistant) and let it confirm everything is wired up — the start of
working with Rook agent-first.

:::tip[Paste this to your agent]
```text
You're helping me verify a fresh Rook installation (the Rhino + Grasshopper
plugin). Please run these checks in order and report what you find:

1. Connection — list your MCP servers and confirm "rook" is present. It should
   expose a large set of tools (250+). If it's missing, tell me — the MCP config
   may not be registered.

2. Live Rhino — make sure Rhino 8 is running, then call rhino_ping. You should get
   "pong". If it fails, remind me to start Rhino and that the RookNative plugin
   must be loaded (I can run ShowRookChat in Rhino to check).

3. Geometry round-trip — create a red sphere at the origin with radius 5, then
   confirm it exists by listing the objects in the document. This proves the whole
   chain works: you → MCP → Python → Rhino.

4. Skills (Claude Code only) — check whether the Rook skills are available (for
   example /design-grasshopper, /chirp, /design-road). If they aren't, the Rook
   plugin may not be installed as a Claude Code plugin yet — walk me through
   adding it.

Give me a short PASS/FAIL summary for each step, and for anything that failed,
the most likely cause and the fix.
```
:::

That's it — your agent will tell you whether Rook is healthy and walk you through
any gaps. The rest of this page explains what those checks mean.

## What each check confirms

### 1. The MCP connection
Rook reaches your assistant through an **MCP server** named `rook`. When you run
`/mcp` (or your agent lists its servers), `rook` should appear with 250+ tools. If
it's missing, the MCP configuration wasn't registered — re-run the installer, or
see [Claude Code & Desktop](/rook-release/plugin/claude/) for manual setup.

### 2. The live Rhino bridge
`rhino_ping` returns `pong` when the assistant can reach the **RookNative plugin**
running inside Rhino. This only works when:

- Rhino 8 is running
- The RookNative plugin is loaded (run `ShowRookChat` in Rhino to confirm)

The plugin binds to an OS-assigned port and writes a discovery file to
`%TEMP%\rook\`; the MCP server reads it to find Rhino.

### 3. The geometry round-trip
Creating a sphere and reading it back exercises the full stack:

```
your agent → MCP server (Python) → HTTP bridge → RookNative (C++) → Rhino
```

If the sphere appears, every layer is working.

### 4. The skills (Claude Code only)
Skills like `/design-grasshopper` and `/chirp` come from the **Rook Claude Code
plugin**, not the MCP server. If your agent has the tools but not the skills, the
plugin isn't installed as a plugin yet — see
[Plugin Overview](/rook-release/plugin/overview/) for how to add it.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| `rook` not in the MCP list | MCP config missing or wrong path | Re-run the installer, or add it manually ([Claude Code](/rook-release/plugin/claude/)) |
| `rhino_ping` errors | Rhino not running, or plugin not loaded | Start Rhino 8; run `ShowRookChat` to confirm the plugin |
| "Connection refused" | Plugin port not discovered | Check `%TEMP%\rook\` for discovery JSON files |
| Tools time out | Rhino is showing a modal dialog | Dismiss the dialog in Rhino, then retry |
| Tools work but no skills | Plugin not installed in Claude Code | [Install the plugin](/rook-release/plugin/overview/) |

## Next

Once everything passes, head to
[Your First Conversation](/rook-release/start/first-conversation/) — or skim the
[Skills That Ship](/rook-release/plugin/skills/) to see what you can ask for.
