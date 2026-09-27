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
- ⬇️ **Download** — **[Rook-Setup-1.6.1.exe](https://github.com/bringfire/rook-release/releases/download/v1.6.1/Rook-Setup-1.6.1.exe)** (direct) · [latest release](https://github.com/bringfire/rook-release/releases/latest) · [all releases](https://github.com/bringfire/rook-release/releases)
- 💬 **Support** — [Issues](https://github.com/bringfire/rook-release/issues) · bringfiregames@gmail.com

## What is Rook?

Rook gives your AI assistant direct, capable access to Rhino&nbsp;3D and
Grasshopper. You describe what you need; Rook does it in your live model. It's not
an autopilot that designs *for* you — it's a collaborator that helps at whatever
stage you're in, and it's flexible enough that you decide what that help looks
like: heavy geometry and analysis, Python/C# Grasshopper scripts, layer and block
management, document-level operations, visualization, and more.

Works with the Claude and ChatGPT desktop apps, and other MCP-capable assistants,
with any model provider (Claude, GPT, or local models): **bring your own key**.

## Install

No terminal, Git, or config files needed.

1. Install the **Claude** or **ChatGPT** desktop app first.
2. Download and run the installer: [Rook-Setup-1.6.1.exe](https://github.com/bringfire/rook-release/releases/download/v1.6.1/Rook-Setup-1.6.1.exe), or the [latest release](https://github.com/bringfire/rook-release/releases/latest). It adds Rook to Rhino and Grasshopper and connects it to your app.
3. Start Rhino, fully quit and reopen your app, and paste the connection check from the docs.

Full, step-by-step instructions: **https://bringfire.github.io/rook-release/start/install/**

## Rook's skills in Claude

In the Claude desktop app, open **Customize → Plugins → Add → Add marketplace**,
enter `bringfire/rook-release`, and add **Rook**. The skills then appear in Chat,
Cowork, and the Code tab. The ChatGPT app gets the same skills from the installer.
Command-line users can run `/plugin marketplace add bringfire/rook-release` and
`/plugin install rook@rook` in Claude Code.

## Privacy

Rook is local-first and bring-your-own-key — your designs, prompts, and results
stay on your machine. See [PRIVACY.md](PRIVACY.md).

---

© 2026 Bringfire Games, LLC. Rook is open source under the [MIT License](LICENSE); the source repository is [bringfire/Rook](https://github.com/bringfire/Rook). This repo contains docs, plugin metadata, and release assets. The installer includes runtime implementation files required for the local MCP server and Python-based components to run on your machine.
