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

## Video

RookVision also generates video with **Veo 3.1** (Standard, Fast, and Lite):
text-to-video, image-to-video, and first/last-frame video.

- **Source framing** — a source image is prepared automatically to fit the output
  shape. **Fit** keeps the whole image and pads it; **Fill** crops to the shape. You
  see the prepared image before you confirm.
- **Quotes and cost caps** — every job is quoted before it runs, and your cost cap
  applies.

## Providers and fallback

Google is the primary provider for Nano Banana images and Veo video. You can use it
with your own Google AI Studio key, or through **Google Enterprise**: your
organization's own Google Cloud project (Vertex AI), billed to that project. Sign
in with a Google account or a Microsoft 365 / Entra identity in RookChat Settings →
Enterprise Google, then choose a "Google Enterprise" model.

If you store a **fal.ai** key, RookVision falls back to fal.ai for Nano Banana
images, prompt enhancement, and Veo 3.1 video in two cases:

- no Google key is stored, or Google rejects the stored key;
- for video, Google could not be reached before it accepted the job.

A job Google has already accepted is never sent a second time. Video from
reference images and Veo 2.0 / 3.0 have no fal.ai fallback.

## Status

- Image — **live**
- Video — **live**
- 3D — **roadmap** (see [Hunyuan 3D](/rook-release/modules/hunyuan-3d/))

:::tip[Try it — paste to your agent]
```text
Capture my current Rhino view and render it as a watercolour at dawn with faint
mist. Show me a few variants, and bring the one I pick back into the document.
```
:::

## Related

- [Image Round-Trip](/rook-release/modules/image-round-trip/) — the round-trip in detail
- [Many Providers](/rook-release/modules/multi-provider/) — the models behind it
