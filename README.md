<h1 align="center">ROOK</h1>

<p align="center">
  <img src="docs/Images/Rook_02.png" alt="Rook Logo" width="345">
</p>

<p align="center"><strong>AI agents for Rhino&nbsp;3D and Grasshopper.</strong></p>

<p align="center">
  Operate Rhino and Grasshopper by talking to your AI assistant — nearly 400 MCP
  tools for geometry, analysis, scripting, layers, blocks, documents,
  vision, BIM, and more.
</p>

---

- 📖 **Documentation** — https://bringfire.github.io/rook-release/
- ⬇️ **Download** — **[Rook-Setup-1.5.16.exe](https://github.com/bringfire/rook-release/releases/download/v1.5.16/Rook-Setup-1.5.16.exe)** (direct) · [latest release](https://github.com/bringfire/rook-release/releases/latest) · [all releases](https://github.com/bringfire/rook-release/releases)
- 💬 **Support** — [Issues](https://github.com/bringfire/rook-release/issues) · bringfiregames@gmail.com

## What is Rook?

Rook gives your AI assistant direct, capable access to Rhino&nbsp;3D and
Grasshopper. You describe what you need; Rook does it in your live model. It's not
an autopilot that designs *for* you — it's a collaborator that helps at whatever
stage you're in, and it's flexible enough that you decide what that help looks
like: heavy geometry and analysis, Python/C# Grasshopper scripts, layer and block
management, document-level operations, visualization, and more.

Works with any MCP-capable assistant (Claude Code, Codex, and others) and any
model provider (Claude, GPT, or local models) — **bring your own key**.

## Install

1. Download the installer — [Rook-Setup-1.5.16.exe](https://github.com/bringfire/rook-release/releases/download/v1.5.16/Rook-Setup-1.5.16.exe) — or the [latest release](https://github.com/bringfire/rook-release/releases/latest).
2. Run it — it adds Rook to Rhino and Grasshopper and sets up the MCP server.
3. Start Rhino, connect your AI assistant, and say hello.

Full, step-by-step instructions: **https://bringfire.github.io/rook-release/start/install/**

## The Claude Code plugin

Rook also ships as a Claude Code plugin (guided skills + a session hook). After
installing, you can manage it via the marketplace:

```
/plugin marketplace add bringfire/rook-release
/plugin install rook@rook
```

## Privacy

Rook is local-first and bring-your-own-key — your designs, prompts, and results
stay on your machine. See [PRIVACY.md](PRIVACY.md).

---

© 2026 Bringfire Games, LLC. All rights reserved.
The source repository remains private. This public repo contains docs, plugin metadata, and release assets. The installer includes runtime implementation files required for the local MCP server and Python-based components to run on your machine.
