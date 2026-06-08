---
title: Claude Code & Desktop
description: Setting up Rook with Claude Code — the client that gets the full feature set.
sidebar:
  order: 3
---

**Claude Code is the recommended client** — and the only one that gets *everything*:
MCP tools, skills, hooks, and subagents.

:::caution[Claude Code ≠ the old Claude Desktop chat app]
"Claude Code" (the [CLI](https://code.claude.com/docs/en/overview),
[Desktop app](https://code.claude.com/docs/en/desktop), or
[VS Code extension](https://code.claude.com/docs/en/vs-code)) supports plugins,
skills, and hooks — the full Rook experience.

The older **claude.ai download** chat app supports *MCP servers only*. You'll get
the tools but none of the skills or the session-start hook. If you're on that app,
install [Claude Code](https://code.claude.com/docs/en/desktop-quickstart) instead.
:::

## The easy path

Run the Rook installer ([Install Rook](/rook-release/start/install/)). It registers the MCP
server for Claude Code automatically and copies the skills, agents, and hooks into
place. Restart Rhino, then [verify](/rook-release/start/setup-verify/).

## Loading the plugin

To manage Rook as a Claude Code plugin (so skills and hooks stay updatable):

:::tip[Paste this to your agent]
```text
/plugin marketplace add bringfire/rook-release
/plugin install rook@rook
```
:::

## Manual MCP configuration

If you need to register the server by hand, add this to `~/.claude.json` under
`mcpServers`:

```json
{
  "mcpServers": {
    "rook": {
      "type": "stdio",
      "command": "<path-to-python>",
      "args": ["-m", "rook"],
      "cwd": "<path-to-mcp_server-directory>",
      "env": {
        "PYTHONPATH": "",
        "PYTHONHOME": "",
        "ROOK_INSTALL_ROOT": "<install-root>",
        "ROOK_DATA_DIR": "<data-directory>",
        "ROOK_MODE": "release"
      }
    }
  }
}
```

For a **release** install:

| Placeholder | Value |
|-------------|-------|
| `<path-to-python>` | `%LOCALAPPDATA%\Rook\venv\Scripts\python.exe` |
| `<path-to-mcp_server-directory>` | `%LOCALAPPDATA%\Rook\app\mcp_server` |
| `<install-root>` | `%LOCALAPPDATA%\Rook\app` |
| `<data-directory>` | `%LOCALAPPDATA%\Rook\data` |
| `ROOK_MODE` | `release` |

:::note
The `env` block is **required**. Without `ROOK_INSTALL_ROOT` and `ROOK_DATA_DIR`,
the server can't locate its data on a release install.
:::

Claude Desktop (the Claude Code desktop app) uses the same structure in its config.

## Verify

Hand your agent the [Set Up & Verify](/rook-release/start/setup-verify/) page.
