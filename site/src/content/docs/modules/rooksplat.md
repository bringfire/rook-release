---
title: RookSplat
description: Lift a mesh into a 3D Gaussian splat — the look of captured reality from the model you already have.
sidebar:
  order: 3
---

:::caution[Coming soon]
RookSplat is not yet shipping. This page previews what's coming.
:::

**RookSplat** turns geometry into a *radiance field*. A headless converter lifts a
mesh into a 3D Gaussian splat — the look of captured reality, rendered from the
model you already have.

> “Turn this massing into a splat I can fly through.”

## The converter

A one-shot, headless tool (`mesh2splat`):

- **In** — a `.glb` mesh, from [Hunyuan 3D](/rook-release/modules/hunyuan-3d/), the scene,
  or any artifact
- **Convert** — an offscreen GL context runs a single synchronous pass and returns
  a structured result
- **Out** — a `.ply` 3D Gaussian splat: the durable artifact, handed downstream

## The idea

The compute is disposable; the splat is what you keep. A throwaway converter
produces an enduring artifact you can view and fly through — bringing a
captured-reality look to purely modelled geometry.

## Related

- [Hunyuan 3D](/rook-release/modules/hunyuan-3d/) · [3D Pipeline](/rook-release/modules/3d-pipeline/)
