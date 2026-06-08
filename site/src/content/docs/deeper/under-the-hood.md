---
title: Under the Hood
description: How Rook works for the curious — architecture, tools, and the knowledge store.
sidebar:
  order: 1
---

You don't need any of this to use Rook. But if you're technical and want to know
what's actually happening when you talk to it, here's the shape of the system.

## The path of a request

When you say *“make me a box”* to your assistant:

1. Your **AI assistant** turns your words into a tool call over **MCP** (the
   protocol that lets assistants reach external tools).
2. Rook's **MCP server** (Python) receives it and routes it.
3. A **native Rhino plugin** (C++) executes the operation in your live Rhino
   session and returns a structured result.
4. Grasshopper operations are handled by a **companion plugin** (C#).

You see geometry appear; the assistant sees a result it can reason about for your
next request.

## How the assistant works the canvas

You'll never invoke tools by name — your assistant does — but it's worth knowing
which path it prefers.

**Grasshopper — the batch path (default).** The fast, reliable way to work a
definition is a paired batch: `gh_snapshot` reads the whole canvas in one call (and
returns a version `epoch`), then `gh_edit` applies every change — create, delete,
set values, connect, group — in one atomic call. One read, one write: deterministic
and quick.

**Rhino geometry — typed routes.** Operations resolve to dedicated, validated
endpoints (`rhino_create`, `rhino_transform`, `rhino_boolean`, `rhino_loft`, and so
on) that return structured results.

**The intent tools — a viable convenience.** `rhino_execute_intent` and
`gh_execute_intent` take a plain-language intent, consult the knowledge store, and
resolve it to the right command or components. They're handy for quick, one-off
natural-language creation — `rhino_execute_intent` simply routes to the typed routes
above. They're not the default for sustained work: the intent tools add knowledge
resolution and, for Grasshopper, more round trips than the batch path, so they're
slower. Useful option, not the starting point.

There are hundreds of more specific tools too (querying objects, layers, blocks,
BIM elements, rendering, and more). Assistants discover them progressively: a small
core is always available, named groups load on demand, and the rest are searchable.

## The knowledge store

This is what makes Rook more than a thin wrapper. It holds:

- **Components** — Grasshopper nodes with their inputs, outputs, and quirks
- **Recipes** — compositions extracted from real definitions
- **Patterns** — reusable techniques (attractors, data-tree handling, remapping)
- **Command knowledge** — Rhino commands with observations about what works

It's a *graph*: notes link to related notes. Ask for a "spiral staircase" and you
won't find a finished one — you'll find helix, point-sequence, and sweep patterns
and their links, which the assistant composes into the result.

## Any model, any provider

Rook routes model calls through LiteLLM, so it works with Claude (Anthropic), GPT
(OpenAI), or local models via Ollama / LM Studio. You choose; Rook doesn't assume.

## Questions & support

The implementation — the MCP server, the native and companion plug-ins, the chat
server, the knowledge graph, and the agent runtime — is something you never have to
touch to use Rook. The source repository remains private; the public repo contains
docs, plugin metadata, and release assets only. The installer includes runtime
implementation files required for the local MCP server and Python-based components
to run on your machine.

Found a bug, have a question, or want to request a feature? Open an issue on the
[Rook repository](https://github.com/bringfire/rook-release/issues) or email
[bringfiregames@gmail.com](mailto:bringfiregames@gmail.com).
