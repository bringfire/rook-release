---
title: Codex & Other Clients
description: Setting up Rook with Codex CLI, Cursor, Windsurf, and other MCP clients.
sidebar:
  order: 4
---

Codex and other MCP clients use Rook's MCP tools. The curated skill workflow ships to Claude Code via the marketplace plugin and to Codex via the installer (the same 11 user skills). Maintainer/dev-only skills ship to neither client.

| Client | MCP tools | Skills | Hooks / Plugins / Agents |
|--------|:---------:|:------:|:------------------------:|
| **Codex CLI** | ✅ | ✅ (curated, 11; installer-delivered) | — |
| **Cursor** | ✅ | — | — |
| **Windsurf** | ✅ | — | — |
| **Any MCP client** | ✅ | — | — |

Hooks and Claude Code plugins remain Claude-only.

## Codex CLI

### The easy path
Run the Rook installer — it sets up the Rhino plug-ins, the local MCP server,
generates a user-level `~/.codex/config.toml`, and copies the curated 11 user
skills to `~/.codex/skills`. It also installs `AGENTS.md` with Rook's operating
guidance. No extra step needed for skills. See
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
