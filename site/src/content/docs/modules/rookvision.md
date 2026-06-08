---
title: RookVision
description: A second sight — round-trip image generation from inside Rhino.
sidebar:
  order: 1
---

**RookVision** gives Rook a second sight. The viewport becomes a canvas and the
canvas a viewport: you can generate imagery *from inside Rhino* — capture a view,
describe the look you want, and bring the result back into the model.

> “Render this elevation as a watercolour, dawn light, faint mist.”

## The loop

RookVision works as a round-trip:

1. **Capture** — an in-memory grab of a viewport: a named view, a display mode, a
   raytraced render.
2. **Enhance** — a prompt enhancer composes the scene context, view direction,
   units, and your intent into a strong prompt.
3. **Generate** — provider-agnostic image generation: multiple models, multiple
   keys, bring-your-own-key.
4. **Return** — approved results come back into the document as a PictureFrame,
   a material, or a reference.

## What it's for

- **Presentation** — turn a working view into a rendered image without leaving Rhino
- **Exploration** — try several looks for the same elevation, fast
- **Communication** — produce something to share or react to

## Status

- Image — **live**
- Video — **queued** ([Director](/rook-release/modules/director/) is shipping)
- 3D — **arriving** (see [Hunyuan 3D](/rook-release/modules/hunyuan-3d/))

:::tip[Try it — paste to your agent]
```text
Capture my current Rhino view and render it as a watercolour at dawn with faint
mist. Show me a few variants, and bring the one I pick back into the document.
```
:::

## Related

- [Image Round-Trip](/rook-release/modules/image-round-trip/) — the round-trip in detail
- [Many Providers](/rook-release/modules/multi-provider/) — the models behind it
