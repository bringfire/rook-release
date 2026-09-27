---
title: Command Line & Manual Setup
description: For developers and other MCP clients — the Claude Code command line, and the exact MCP entry for adding Rook by hand.
sidebar:
  order: 4
---

**Most people never need this page.** The Rook installer connects Claude and the
ChatGPT desktop app for you, and Claude's skills install from **Customize →
Plugins** (see [Install Rook](/rook-release/start/install/)). This page is for the
Claude Code command line, for other MCP clients such as Cursor and Windsurf, and
for repairing a connection by hand.

## Claude Code command line

The desktop app's Code tab picks up the Rook plugin from your Claude account. In the
`claude` command line, you can also add it inside a session:

```text
/plugin marketplace add bringfire/rook-release
/plugin install rook@rook
```

The command line reads Rook's MCP entry from `%USERPROFILE%\.claude.json`, which the
installer writes.

## The MCP entry

Every MCP client starts Rook the same way: run Rook's Python with `-m rook`, and
pass four environment variables. Use your own Windows user name in the paths, or
the expanded value of `%LOCALAPPDATA%`.

| Setting | Value on a standard install |
|---|---|
| Command | `%LOCALAPPDATA%\Rook\venv\Scripts\python.exe` |
| Arguments | `-m rook` |
| `ROOK_INSTALL_ROOT` | `%LOCALAPPDATA%\Rook\app` |
| `ROOK_DATA_DIR` | `%LOCALAPPDATA%\Rook\data` |
| `ROOK_MODE` | `release` |
| `PYTHONPATH` and `PYTHONHOME` | empty strings |

The environment variables are **required**: without them Rook can't find its
install. A working directory (`cwd`) isn't needed.

### Claude

The installer writes this under `mcpServers` in both
`%APPDATA%\Claude\claude_desktop_config.json` (the desktop app) and
`%USERPROFILE%\.claude.json` (the command line):

```json
{
  "mcpServers": {
    "rook": {
      "command": "C:/Users/YOU/AppData/Local/Rook/venv/Scripts/python.exe",
      "args": ["-m", "rook"],
      "env": {
        "PYTHONPATH": "",
        "PYTHONHOME": "",
        "ROOK_INSTALL_ROOT": "C:/Users/YOU/AppData/Local/Rook/app",
        "ROOK_DATA_DIR": "C:/Users/YOU/AppData/Local/Rook/data",
        "ROOK_MODE": "release"
      }
    }
  }
}
```

Claude Desktop rewrites this file when it saves its own settings, and may drop keys
it doesn't use, such as `type` and `cwd`. Rook doesn't need them. Fully quit and
reopen Claude after any change.

### ChatGPT desktop app (Codex), Codex command line, and IDE extension

They share `%USERPROFILE%\.codex\config.toml`:

```toml
[mcp_servers.rook]
command = "C:/Users/YOU/AppData/Local/Rook/venv/Scripts/python.exe"
args = ["-m", "rook"]
startup_timeout_sec = 30
tool_timeout_sec = 120

[mcp_servers.rook.env]
PYTHONPATH = ""
PYTHONHOME = ""
ROOK_INSTALL_ROOT = "C:/Users/YOU/AppData/Local/Rook/app"
ROOK_DATA_DIR = "C:/Users/YOU/AppData/Local/Rook/data"
ROOK_MODE = "release"
ROOK_MCP_TOOL_PROFILE = "lean"
```

Use forward slashes in the paths, as above. The ChatGPT app can also add a server
from **Settings → MCP servers → Add server** (type **STDIO**), then restart.

### Cursor, Windsurf, and others

Add the same command, arguments, and environment variables in the client's MCP
settings. These clients get Rook's tools but not its skills.
