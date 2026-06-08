---
title: Image Round-Trip
description: Capture a viewport, enhance the prompt, generate across any image model, and return the result to the document.
sidebar:
  order: 2
---

The image round-trip is the path a picture takes through Rook: out of Rhino as a
captured view, through any image model, and back into the document as a first-class
artifact — shared by reference, not re-derived each time.

## The four stops

1. **Capture** — a PNG grabbed in memory from a chosen view (e.g. *North
   elevation*, *Raytraced*, at a set resolution).
2. **Enhance** — your short instruction is expanded with scene context.
   > **You:** “watercolour, dawn light, faint mist”
   >
   > **Enhanced:** “North elevation, watercolour wash, dawn light, faint coastal
   > mist, 1:200…”
3. **Generate** — run across image models (Nano Banana, Flux 2 Pro, GPT-Image-2),
   typically several seeded variants at once.
4. **Return** — approve the ones you like; they land back in the document as a
   PictureFrame on a construction plane, tracked as artifacts.

## Why artifacts matter

Each result is a durable artifact with an id. You share it by reference rather than
regenerating it — so a good image stays put and can be reused downstream.

:::tip[Try it — paste to your agent]
```text
Capture my current view, turn it into a watercolour at dawn across a couple of
image models, and bring the one I pick back into the document.
```
:::

## Related

- [RookVision](/rook-release/modules/rookvision/) — the capability this belongs to
- [Many Providers](/rook-release/modules/multi-provider/) — the image models available
