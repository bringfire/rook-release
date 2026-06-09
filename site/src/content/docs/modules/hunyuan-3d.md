---
title: Hunyuan 3D
description: Turn a single image into a watertight mesh that lands directly on the Rhino canvas.
sidebar:
  order: 1
---

<span class="rook-status rook-status--soon">Shipping soon</span>

:::caution[Shipping soon]
Hunyuan 3D is not yet shipping. This page previews what's coming.
:::

**Hunyuan 3D** takes you from flat to solid. Using Tencent's *Hunyuan 3D 3.1*, a
single image — or a sparse set of views — becomes a watertight mesh that lands
directly on the Rhino canvas, ready for SubD conversion, blocks, or downstream
Grasshopper.

> “Take this concept sketch — give me the volume.”

## The pipeline

1. **Reference image** — a [RookVision](/rook-release/modules/rookvision/) capture, an
   upload, or any artifact already in the store.
2. **Geometry generation** — the model lifts a watertight mesh out of the pixels.
3. **Materialize** — written to the artifact store as OBJ · GLB · STL · FBX with a
   full manifest.
4. **Land in Rhino** — placed as a mesh, SubD-ready, or a block instance, on a
   construction plane chosen for you.

## Two tiers

| Tier | Time | Use |
|------|------|-----|
| **Standard** | ~3–5 min | maximum fidelity |
| **Rapid** | ~30–60 s | fast iteration |

## Where it leads

A generated mesh is a *starting point*, not the finished work. Clean it up and
build on it with the [3D Pipeline](/rook-release/modules/3d-pipeline/).

:::tip[Try it — paste to your agent]
```text
Take this reference image and generate a watertight mesh from it with Hunyuan 3D
(rapid tier for a first look), then place it on the canvas so I can inspect it.
```
:::

## Related

- [3D Pipeline](/rook-release/modules/3d-pipeline/) · [RookSplat](/rook-release/modules/rooksplat/)
