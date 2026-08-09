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

For a full post-install check your agent can run end-to-end, see [Post-Install Agent Setup](/rook-release/start/agent-post-install/).

:::tip[Paste this to your agent]
```text
You're helping me verify a fresh Rook installation (the Rhino + Grasshopper
plugin). Please run these checks in order and report what you find. Don't mark a
step PASS without showing me the tool output.

1. Connection — confirm the Rook tools are available (rhino_ping, gh_status). If
   your client can't list MCP servers, just try calling rhino_ping. If no rook
   tools exist at all, the MCP config isn't registered. A small tool count is not
   a failure on its own — some profiles advertise a compact set.

2. Live Rhino — make sure Rhino 8 is running, then call rhino_ping. You should get
   "pong". If it fails: Rhino isn't running; the RookNative plugin didn't load (I
   can run ShowRookChat in Rhino to check); or the port discovery file is stale —
   restarting Rhino rewrites it. If the call HANGS rather than failing, Rhino is
   showing a modal dialog — tell me to switch to the Rhino window and dismiss it.
   Don't try to dismiss it with keyboard automation.

3. Geometry round-trip — first call rhino_document and tell me the units and object
   count, so I know whether you're about to touch live work. Then create a red
   sphere at the origin with radius 5 (in document units) and confirm it exists by
   listing the objects. This proves the whole chain works:
   you → MCP server → HTTP bridge → RookNative → Rhino.

4. Grasshopper — call gh_status. If it comes back available: false saying the
   Grasshopper assembly isn't loaded, that only means Grasshopper isn't open — ask
   me to open it and retry rather than marking this FAILED. Once it reports
   available, tell me the version and canvas state.

5. Skills (Claude Code only) — check whether the Rook skills are available (for
   example /design-grasshopper, /execute-grasshopper, /chirp). If they aren't, the Rook
   marketplace plugin may not be installed yet — walk me through running
   `/plugin marketplace add bringfire/rook-release` then `/plugin install rook@rook`.

6. Clean up — delete the test sphere and confirm the object count is back to what
   it was in step 3, so my document is left exactly as it was.

Give me a short PASS/FAIL summary for each step, and for anything that failed,
the most likely cause and the fix.
```
:::

That's it — your agent will tell you whether Rook is healthy and walk you through
any gaps. The rest of this page explains what those checks mean.

## What each check confirms

### 1. The MCP connection
Rook reaches your assistant through an **MCP server** named `rook`. When you run
`/mcp` (or your agent lists its servers), `rook` should appear. If it's missing, the
MCP configuration wasn't registered — re-run the installer, or see
[Claude Code & Desktop](/rook-release/plugin/claude/) for manual setup.

Don't treat the tool count as the test. Rook ships hundreds of tools, but the active
profile may advertise a compact set and reach the rest through
`rook_tools_search` / `rook_tools_call`. The reliable check is whether `rhino_ping`
can be called at all.

### 2. The live Rhino bridge
`rhino_ping` returns `pong` when the assistant can reach the **RookNative plugin**
running inside Rhino. This only works when:

- Rhino 8 is running
- The RookNative plugin is loaded (run `ShowRookChat` in Rhino to confirm)

The plugin binds to an OS-assigned port and writes a discovery file to
`%LOCALAPPDATA%\Rook\discovery\` (older builds used `%TEMP%\rook\`, which is still
read for compatibility); the MCP server reads it to find Rhino. If Rhino was moved,
reinstalled, or hard-killed, that file can go stale — restarting Rhino rewrites it.

A ping that **hangs** rather than erroring means something different: Rhino is
showing a modal dialog and its UI thread is blocked. Only you can dismiss it, by
switching to the Rhino window.

### 3. The geometry round-trip
Creating a sphere and reading it back exercises the full stack:

```
your agent → MCP server (Python) → HTTP bridge → RookNative (C++) → Rhino
```

If the sphere appears, every layer is working.

Asking for `rhino_document` first is deliberate: it reports the document's units (so
`radius 5` means what you expect) and its object count, which is what step 6 checks
the cleanup against. It also warns the agent if you're running this against a
document with real work in it.

### 4. Grasshopper
`gh_status` reports whether the Grasshopper side is live, along with the assembly
version and canvas state. If Grasshopper simply isn't open, it returns
`available: false` with `Grasshopper assembly is not loaded` — that's expected, not
an install problem. Open Grasshopper and run it again.

Grasshopper is bridged by a separate managed companion, so a genuine failure here
(Grasshopper open, still unavailable) is independent of the Rhino bridge passing.

### 5. The skills (Claude Code only)
Skills like `/design-grasshopper` and `/chirp` come from the **Rook marketplace
plugin** ([Plugin Overview](/rook-release/plugin/overview/)), not the MCP server. If
your agent has the tools but not the skills, the plugin isn't installed yet — run
`/plugin marketplace add bringfire/rook-release` then `/plugin install rook@rook` in
Claude Code.

**Codex users:** the curated skills are delivered by the installer to `~/.codex/skills`
— no marketplace step needed.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| `rook` not in the MCP list | MCP config missing or wrong path | Re-run the installer, or add it manually ([Claude Code](/rook-release/plugin/claude/)) |
| `rhino_ping` errors | Rhino not running, or plugin not loaded | Start Rhino 8; run `ShowRookChat` to confirm the plugin |
| "Connection refused" | Plugin port not discovered | Check `%LOCALAPPDATA%\Rook\discovery\` (or legacy `%TEMP%\rook\`) for discovery JSON files; restarting Rhino rewrites them |
| Tools hang instead of erroring | Rhino is showing a modal dialog | Switch to the Rhino window and dismiss the dialog, then retry |
| `gh_status` returns `available: false` | Grasshopper isn't open (assembly not loaded) | Open Grasshopper in Rhino, then retry — this is not an install failure |
| Geometry lands in the wrong document | More than one Rhino window is open | Call `rhino_sessions` and bind the intended one with `rhino_set_active_instance` |
| Tools work but no skills | Marketplace plugin not installed (Claude Code) | Run `/plugin marketplace add bringfire/rook-release` then `/plugin install rook@rook` — see [Plugin Overview](/rook-release/plugin/overview/) |

## Next

Once everything passes, head to
[Your First Conversation](/rook-release/start/first-conversation/) — or skim the
[Skills That Ship](/rook-release/plugin/skills/) to see what you can ask for.
