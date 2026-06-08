---
title: 3D Pipeline
description: Three crafts that turn a raw generated mesh into usable geometry — retopology, segmentation, texturing.
sidebar:
  order: 2
---

A raw mesh is the *start* of the work, not the end. The 3D Pipeline gives you three
crafts that turn generated geometry into something you can actually model and
render with. Each composes with the others.

## Three crafts

### SmartTopology — retopology
Rewrites a noisy triangle soup into clean edge-flow quads.
- **In:** dense triangle mesh
- **Out:** quad mesh
- **Downstream:** SubD · clean booleans

### Segmentation — parts
Breaks a single mesh into named, indexable pieces.
- **In:** one mesh
- **Out:** named parts (e.g. *back · seat · legs*)
- **Downstream:** layers · blocks · selection

### Texture & UV — unwrap
Clothes the mesh with UV islands and a PBR material set.
- **In:** untextured mesh
- **Out:** UV islands · PBR maps (albedo, normal, roughness, metal)
- **Downstream:** render · visualization · export

## Why it matters

These steps are what make a generated volume genuinely useful in Rhino —
quad topology you can SubD, parts you can organize onto layers, and materials you
can render. Ask for the ones you need.

:::tip[Try it — paste to your agent]
```text
Take this generated mesh, retopologize it to clean quads, then split it into
named parts I can sort onto layers.
```
:::

## Related

- [Hunyuan 3D](/rook-release/modules/hunyuan-3d/) — where the raw mesh comes from
- [RookSplat](/rook-release/modules/rooksplat/)
