---
title: Director
description: Author a camera move over the live model, render an exact frame sequence, and assemble a video.
sidebar:
  order: 3
---

**Director** turns your model into film. Author a camera move over the live scene,
render an exact sequence of frames, and assemble them into a video — with every
frame rendered as a clean, fully restored Rhino transaction.

> “Follow this curve, hold focus on the tower, render the frames, package the film.”

## How a frame is made

Each frame is one atomic Rhino transaction, so nothing leaks between frames:

1. Snapshot objects and viewport
2. Apply per-frame transforms
3. Set an explicit camera and display mode
4. Capture the PNG frame
5. Restore state and return evidence

## What ships today

| Capability | Status |
|------------|--------|
| **Camera planning** — keyframe strategies resolve an explicit camera at every frame (named views, active view, interpolated paths) | shipping |
| **Timeline authoring** — FPS, duration, and endpoints resolve to a canonical frame count before a frame is drawn | shipping |
| **Video assembly** — frame runs assemble to a local H.264 MP4 | shipping |

## Coming next

- **Curve-follow target** — sample a Rhino curve as the camera path, hold a focus
  point, and the film authors itself.

:::tip[Try it — paste to your agent]
```text
Author a camera move that follows this curve while holding focus on the tower,
render the frames, and assemble an MP4.
```
:::

## Related

- [RookVision](/rook-release/modules/rookvision/) — stills, where Director does motion
