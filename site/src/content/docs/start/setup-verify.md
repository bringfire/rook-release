---
title: Set Up & Verify
description: Three prompts to paste into Claude or ChatGPT — check the connection, check the skills, and fix anything that's wrong — plus how to choose approvals.
sidebar:
  order: 3
---

After [installing Rook](/rook-release/start/install/), you check it by pasting a
prompt into your assistant. Each prompt below was tested in Claude (Chat, Cowork, and
the Code tab) and in the ChatGPT desktop app. Start a **new conversation** for each
one.

## 1. Check the connection

This only reads from Rhino; it changes nothing.

:::tip[Paste this to your assistant]
```text
Rook connection check. Use only the Rook tools (Rhino/Grasshopper MCP), never any screen-control, computer-use or Windows-control tool, and change nothing.
1. Call rhino_ping and report the result.
2. Call rhino_document and report the document name and object count.
3. Call gh_status and report whether Grasshopper is available.
4. List any Rook skills you have (from plugins or skills), by name, or say "none".
Report each step as PASS or FAIL, with the exact error text for any failure.
```
:::

**What a pass looks like:** `rhino_ping` returns `pong`, the document name and
object count match what you see in Rhino, Grasshopper shows as available, and step 4
lists nine skills: `capture-convention`, `chirp`, `chirp-cascade`, `clean-layers`,
`design-grasshopper`, `execute-grasshopper`, `plan-grasshopper`, `project-setup`,
and `twisted-column`. In Claude they're shown with a `rook:` prefix.

- If step 3 says Grasshopper isn't available, Grasshopper simply isn't open. Open
  it in Rhino and try again.
- If step 4 says "none" in Claude, add the plugin: see
  [Install Rook, Step 3](/rook-release/start/install/#step-3--add-rooks-skills).

## 2. Check the skills

This confirms a Rook skill actually opens, not just that it's listed.

:::tip[Paste this to your assistant]
```text
Rook skill check. You may read skill files, but don't call any Rook or Rhino tools and change nothing.
Which Rook skill would you use to build a new Grasshopper definition from a clear, specific brief? Open its SKILL.md and tell me: its name, the plugin it comes from, and the first three steps it tells you to follow, quoted exactly.
```
:::

It should pick `execute-grasshopper` and quote steps that start by taking a fresh
snapshot of the Grasshopper canvas. In Claude Chat, reading skills needs Claude's
code execution to be turned on in its settings.

## 3. If something fails

Paste this, together with the failing answer. It reads Rook's own logs and tells
you, in plain words, what is wrong and what to do.

:::tip[Paste this to your assistant]
```text
Rook troubleshooting. My Rook connection check failed (the result is below). Help me find out why. Change nothing, and don't use any screen-control, computer-use or Windows-control tool.
If you can read files on this computer, read these (skip any that don't exist) and tell me what they show:
- %LOCALAPPDATA%\Rook\logs\post_install_summary.json: did the installer's final outcome succeed?
- The end of %LOCALAPPDATA%\Rook\logs\post_install.log
- For Claude: the end of %LOCALAPPDATA%\Claude\logs\mcp-server-rook.log and mcp.log (older Claude versions use %APPDATA%\Claude\logs), and whether %APPDATA%\Claude\claude_desktop_config.json has a "rook" entry under "mcpServers"
- For ChatGPT/Codex: whether %USERPROFILE%\.codex\config.toml has a [mcp_servers.rook] section
- Whether %LOCALAPPDATA%\Rook\discovery contains files, which appear while Rhino is running with Rook loaded
If you can't read files on this computer, tell me which of these files to open in File Explorer and exactly what to look for.
Then give me the most likely cause and the fix, in plain words, without asking me to use a terminal.
My failing result:
```
:::

Claude Cowork, the Code tab, and ChatGPT can read files on your computer. Claude
Chat usually can't (unless you've added a file-access connector). When it can't,
the prompt asks it to tell you what to open in File Explorer instead.

### Common causes

| What you see | Likely cause | What to do |
|---|---|---|
| The assistant has no Rook tools at all | The app wasn't fully restarted, or it was installed after Rook | Fully quit the app (from the icon near the clock) and reopen it. If that doesn't help, run the Rook installer again with the app already installed |
| `rhino_ping` fails | Rhino isn't running, or Rook didn't load in it | Start Rhino 8 from the Start menu. In Rhino, type `ShowRookChat`: if the panel opens, Rook is loaded |
| Every Rook call hangs | Rhino is showing a dialog box | Switch to Rhino and close the dialog (a file picker, "Save changes?", or a command prompt) |
| `gh_status` says not available | Grasshopper isn't open | Open Grasshopper and try again. This isn't an install problem |
| Tools work but step 4 lists no skills | Claude: the plugin isn't added. ChatGPT: the Codex component wasn't installed | Claude: [add the plugin](/rook-release/start/install/#step-3--add-rooks-skills). ChatGPT: run the Rook installer again with the Codex component ticked |
| Claude says **Failed to add marketplace** | A temporary failure | Select **Sync** again |
| Changes land in the wrong model | More than one Rhino window is open | Close the extra windows, or tell your assistant which one to use |

Still stuck? Open an issue at
[github.com/bringfire/rook-release/issues](https://github.com/bringfire/rook-release/issues)
and include what the troubleshooting prompt reported.

## Choosing approvals

Whether your app asks before the assistant uses a Rook tool depends on the app and
its approval setting.

**Claude Chat** asks the first time each tool is used, with **Allow once**,
**Always allow**, and **Deny**. **Always allow** applies to that one tool.

- Choose **Always allow** only for tools that only read, such as `rhino_ping`,
  `rhino_document`, `rhino_objects`, `gh_status`, `gh_snapshot`, and `gh_errors`.
- Choose **Allow once** for anything that creates, changes, deletes, or exports,
  or runs a script, until you're comfortable with how your assistant works.
- Treat **`rook_tools_call`** as one of those. It's Rook's gateway to its full
  tool list: one call can run any Rook tool, including ones that change or delete.
  **Always allow** on it would allow all of them, so choose **Allow once**.
  Assistants that see a shorter tool list use it more often, which is normal.

**Claude Cowork** doesn't ask before using Rook's tools. Claude can change,
delete, or export in Rhino without checking with you, so work on a saved copy of
your model. **Undo** in Rhino reverses model changes, but not files that were
exported.

**The Code tab** follows its own permission mode, which you choose in the
Code tab.

**ChatGPT** asks, under **How should ChatGPT actions be approved?**:

- **Ask for approval** (the default) asks before each tool, like Claude Chat. Start
  here, with the same rule: only tools that just read, and never `rook_tools_call`,
  should get a permanent approval.
- **Approve for me** only asks about actions it detects as potentially unsafe.
- **Full access** never asks. Use it only if you understand what that allows.

:::caution[Rook never needs screen control]
Rook works entirely through its own tools. Don't turn on computer-use, screen-control,
or "Windows control" extensions to make Rook work. They let an assistant act on
anything on your computer, including your email, and Rook gains nothing from them.
:::

## What the checks confirm

- **`rhino_ping`** reaches the Rook plug-in running inside Rhino. When Rhino starts
  with Rook loaded, the plug-in writes a small discovery file to
  `%LOCALAPPDATA%\Rook\discovery\`; that is how your assistant finds it.
- **`rhino_document`** proves Rook can read your live model.
- **`gh_status`** checks the Grasshopper side, which Rook reaches through a separate
  companion plug-in. It can fail on its own even when Rhino passes.
- **The skills** come from the Rook plugin in Claude, and from the installer in
  ChatGPT. The tools work without them; the skills add the guided workflows. See
  [Skills That Ship](/rook-release/plugin/skills/).

For a deeper end-to-end test that creates and removes a test object, see
[Post-Install Agent Setup](/rook-release/start/agent-post-install/).

## Next

Once everything passes, head to
[Your First Conversation](/rook-release/start/first-conversation/).
