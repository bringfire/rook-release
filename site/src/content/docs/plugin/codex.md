---
title: Codex & Other Clients
description: Setting up Rook with Codex CLI, Cursor, Windsurf, and other MCP clients.
sidebar:
  order: 4
---

Rook works with any MCP-capable client. What you get depends on the client.

| Client | MCP tools | Skills | Hooks / Plugins / Agents |
|--------|:---------:|:------:|:------------------------:|
| **Codex CLI** | ✅ | ✅ (packaged set) | — |
| **Cursor** | ✅ | — | — |
| **Windsurf** | ✅ | — | — |
| **Any MCP client** | ✅ | — | — |

Skills marked ✅ for Codex come from Rook's packaged skill set (`.agents/skills/`).
Hooks, Claude Code plugins, and Claude subagents remain Claude-only.

## Codex CLI

### The easy path
Run the installer with Codex support — it generates a user-level
`~/.codex/config.toml` and copies the packaged skills. See
[Install Rook](/rook-release/start/install/).

### Manual configuration
Add this to `~/.codex/config.toml`:

```toml
[mcp_servers.rook]
command = "<path-to-python>"
args = ["-m", "rook"]
cwd = "<path-to-mcp_server-directory>"

[mcp_servers.rook.env]
PYTHONPATH = ""
PYTHONHOME = ""
ROOK_INSTALL_ROOT = "<install-root>"
ROOK_DATA_DIR = "<data-directory>"
ROOK_MODE = "release"
```

Use the same placeholder values as the
[Claude Code release table](/rook-release/plugin/claude/#manual-mcp-configuration).

Codex also reads an `AGENTS.md` file (the Codex counterpart to `CLAUDE.md`),
installed to `%LOCALAPPDATA%\Rook\AGENTS.md`, which carries Rook's operating
guidance.

## Cursor, Windsurf & others

These clients support MCP servers. Add Rook using the same stdio command, args,
`cwd`, and `env` shown above, in the client's MCP configuration. You'll get the
full tool set; skills and hooks won't be available.

## Verify

Whatever the client, hand your agent the
[Set Up & Verify](/rook-release/start/setup-verify/) page — the MCP and Rhino checks work
everywhere. (The skills check only applies to Claude Code and Codex.)
