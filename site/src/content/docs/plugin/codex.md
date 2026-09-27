---
title: ChatGPT & Other Clients
description: Using Rook in the ChatGPT desktop app (with Codex), and in other MCP clients.
sidebar:
  order: 4
---

## ChatGPT desktop app (Codex)

The Codex app is now part of the **ChatGPT desktop app** for Windows. Install it from
[OpenAI's Windows page](https://learn.chatgpt.com/docs/windows/windows-app), or
search the Microsoft Store for the ID `9PLM9XGG6VKS`; a plain name search can find
unrelated apps.

The Rook installer sets everything up, with nothing to type:

- It connects Rook to Codex.
- It installs the same nine Rook skills that Claude gets from the plugin.
- It adds Rook's operating guidance (an `AGENTS.md` file).

After installing or updating Rook, quit the ChatGPT app completely and reopen it.
Then check it with the prompts on [Set Up & Verify](/rook-release/start/setup-verify/),
in a new conversation. You don't need to open a project folder.

### Approvals

ChatGPT asks how its actions should be approved:

- **Ask for approval** (the default) asks before each Rook tool is used. Start here.
- **Approve for me** only asks about actions it detects as potentially unsafe.
- **Full access** never asks. Use it only if you understand what that allows.

See [Choosing approvals](/rook-release/start/setup-verify/#choosing-approvals).

## Cursor, Windsurf, and other MCP clients

Other apps that support MCP can use Rook's tools, but not its skills. They need Rook
added to their MCP settings by hand; see
[Command Line & Manual Setup](/rook-release/deeper/manual-setup/) for the exact
entry.

| App | Rook's tools | Rook's skills | Setup |
|---|:---:|:---:|---|
| **Claude** (Chat, Cowork, Code) | ✅ | ✅ | Installer + plugin, no terminal. See [Claude](/rook-release/plugin/claude/) |
| **ChatGPT desktop app** (Codex) | ✅ | ✅ | Installer, no terminal |
| **Cursor, Windsurf, others** | ✅ | — | Manual MCP entry |
