---
title: What is Rook
description: Rook gives your AI assistant hundreds of tools to help you design in Rhino and Grasshopper — at any stage, however you choose.
sidebar:
  order: 1
---

Rook gives your AI assistant **nearly 400 specialized tools** for operating Rhino
3D and Grasshopper — and they go deep. Geometry creation and analysis, complex
scripted operations, full Grasshopper definitions, layers, blocks, materials, and
whole-document workflows: if Rhino and Grasshopper can do it, there's very likely a
Rook tool for it.

But capable doesn't mean autopilot. A designer rarely wants to hand the whole
design to a machine — so Rook isn't built to design *for* you. It's built to **help
you design**, at whatever stage you're in, and it's flexible enough that *you*
decide what that help looks like.

A few of the ways designers put it to work:

- **Heavy geometry & analysis** — run a curvature or draft-angle study across a set
  of surfaces, or a complex scripted operation you'd otherwise hand-write in
  RhinoScript.
- **Scripting inside Grasshopper** — generate a Python or C# script component that
  does exactly what your definition needs.
- **Layers & blocks** — sort objects onto sensible layers, find and purge duplicate
  blocks, rename and restructure.
- **Document-level work** — units and settings, references, import/export, and
  batch operations across the whole file.
- **Getting set up** — grids, reference geometry, arrays: scaffolding you take over
  and build on.

Some designers lean on Rook for one of these; others for all of them. It meets you
where you are in the process.

## The shift

The old way to use Rhino is to learn it — hundreds of commands and options, built
up over years. With Rook, you talk to an assistant you already use (Claude Desktop,
Codex, or one inside your code editor) and *it* drives Rhino for you. You stay the
designer and stay in the conversation; Rook handles the mechanics.

> **You:** “Run a curvature analysis on these surfaces and flag anything too sharp,
> then sort the results onto their own layer.”
>
> **Rook:** Runs the analysis, tags the problem areas, and organizes them — ready
> for you to act on.

## A few workflows

The same conversation can reach across Rook's modules. A few examples:

**BIM coordination** — with [RookBIM](/rook-release/modules/rookbim/)

> **You:** “List every door on Level 2 with its fire rating, and select the ones
> that are missing one.”
>
> **Rook:** Queries the model's BIM elements, pulls each door's parameters, reports
> the list, and selects the doors with no rating set — ready for you to fix.

**Visualization** — with [RookVision](/rook-release/modules/rookvision/)

> **You:** “Capture the north elevation and render it as a dawn watercolour with
> faint mist — give me a few options and bring the one I pick back in.”
>
> **Rook:** Captures the viewport, enriches the prompt with the scene context,
> generates several variants, and drops the one you approve back into the document
> as a PictureFrame.

**Flythrough** — with the [Director](/rook-release/modules/director/) (RookVisionDirector)

> **You:** “Fly the camera along this curve, hold focus on the tower, and package
> an MP4.”
>
> **Rook:** Resolves an explicit camera at every frame, renders the sequence as
> clean per-frame transactions, and assembles it into an H.264 MP4.

## Why it works

Behind the scenes, Rook draws on a library of real Rhino and Grasshopper knowledge
— how components fit together, which commands do what, and the patterns experienced
users rely on. You get the benefit of that expertise without having to learn it.

## What you need

- **Rhino 8** on **Windows**
- An **AI assistant that supports MCP** — Claude Desktop, Codex, or an MCP-capable
  assistant in your IDE
- An account/key for whichever AI model you prefer — Claude, GPT, or a local model

Ready? → [Install Rook](/rook-release/start/install/)
