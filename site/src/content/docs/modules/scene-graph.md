---
title: Scene Graph
description: A real-time spatial model of every Rhino object — so Rook knows where everything is and how it touches.
sidebar:
  order: 5
---

Rook keeps a **real-time shadow graph of every object in your Rhino model** — a
spatial sense of the scene. It's how Rook can answer questions about *where*
things are and *how* they relate, not just *what* they are.

> “Rook knows where everything is, and how it touches.”

## What it tracks

- **Shape classification** — each object sorted into a recognizable type
- **Bounding-box metrics** — size and extent of everything
- **Relationships** — how objects sit relative to one another

It updates on a background thread using lock-free immutable snapshots, so reading
the scene never blocks your modelling.

## Classification profiles

- **Architecture** — wall · floor · column · beam · slab
- **General** — vertical-planar · horizontal-slab · thin-vertical · compact

## Eight relationships

`supports` · `contains` · `adjacent` · `near` · `above` · `intersects` ·
`inside` · `surrounds`

## What it enables

Because Rook understands the scene spatially, you can ask things like:

> “Which columns support this beam?”
>
> “What's near the entrance, and what's inside the atrium?”
>
> “Select everything above level 2.”

:::tip[Try it — paste to your agent]
```text
Look at my current Rhino model and describe the scene: what kinds of objects are
here, roughly where they sit, and which ones touch or contain others.
```
:::

## Related

- [Rhino Geometry](/rook-release/modules/rhino-geometry/)
- [RookBIM](/rook-release/modules/rookbim/) — structured BIM data alongside the spatial graph
