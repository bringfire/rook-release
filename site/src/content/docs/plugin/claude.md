---
title: Claude
description: Using Rook in the Claude desktop app — Chat, Cowork, and the Code tab — with no terminal.
sidebar:
  order: 3
---

Rook works in all three tabs of the **[Claude desktop app](https://claude.ai/download)**:
**Chat**, **Cowork**, and **Code**. You set it up once, without a terminal.

| | Rook's tools | Rook's skills | Asks before using a tool |
|---|:---:|:---:|---|
| **Chat** | ✅ | ✅ | Yes: Allow once, Always allow (per tool), or Deny |
| **Cowork** (tasks on your computer) | ✅ | ✅ | No |
| **Code** tab | ✅ | ✅ | Follows the Code tab's permission mode |

## How it's set up

1. **The Rook installer connects Rook to Claude.** It registers Rook in Claude's
   settings, and all three tabs share that one connection. Install Claude before
   Rook; if you install Claude later, run the Rook installer again.
2. **You add the skills from Claude itself:** **Customize → Plugins → Add → Add
   marketplace**, type `bringfire/rook-release`, select **Sync**, then add **Rook**.
   The plugin is saved to your Claude account, so the skills appear in Chat, Cowork,
   and the Code tab.

[Install Rook](/rook-release/start/install/) walks through both, and
[Set Up & Verify](/rook-release/start/setup-verify/) has the prompts that check
them.

## Good to know

- **Fully quit Claude after installing or updating Rook.** Right-click the Claude
  icon near the clock and choose **Quit**, then reopen it. Claude reads its
  connections when it starts.
- **Cowork doesn't ask before using Rook's tools.** Work on a saved copy of your
  model; Rhino's **Undo** reverses model changes but not exported files. Rook works
  in Cowork tasks that run on your computer, not in cloud sessions.
- **The Code tab doesn't need Git** for ordinary sessions. Anthropic only requires
  Git for worktree sessions.
- **You never need screen-control extensions.** Rook works entirely through its own
  tools, so don't turn on computer-use or "Windows control" extensions for it.
- **Updates:** after a Rook release, the plugin updates from its marketplace. To
  check now, open **Customize → Plugins → Rook** and choose **Check for updates**.

## To see Rook's tools in Claude

In a Chat conversation, select **+** (Add files, connectors, and more) at the
bottom left of the message box, then **Connectors → Manage connectors**. **rook**
is listed there with its tools.

## Command line

If you use the Claude Code command line instead of the desktop app, see
[Command Line & Manual Setup](/rook-release/deeper/manual-setup/).
