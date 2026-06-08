---
title: Rhino Geometry
description: 250+ tools covering the whole Rhino geometry engine, reached by describing what you want.
sidebar:
  order: 2
---

Rook covers the **whole Rhino geometry engine** — more than 250 tools, from a
single point to a lofted SubD to a block instance. You don't reach for them by
name; you describe the result and Rook routes to the right one.

> “Loft these curves into a SubD and fillet the seams.”

## What's covered

| Area | Examples |
|------|----------|
| **Creation** | Point · Line · Polyline · Curve · Arc · Ellipse · Box · Sphere · Cone · Torus · Surface · Extrusion · Loft · Sweep |
| **Transforms** | Move · Rotate · Scale · Mirror · Copy |
| **Booleans** | Union · Difference · Intersection |
| **Topology** | Fillet · Chamfer · Offset · Trim · Split · Project · Pull |
| **SubD** | Box · Sphere · Cylinder · From mesh/surface · Subdivide · Crease · Convert |
| **Mesh** | From Brep · Primitives · Boolean · Reduce · QuadRemesh · Repair · Smooth · Weld |
| **Blocks** | 49 tools — create, insert, explode, link, rename, nested queries, batch transform & distribute |
| **Analysis** | Area · Volume · Length · Curvature · Draft angle · Closest point · Normals |
| **I/O** | DWG · DXF · OBJ · STL · 3DM · STEP · IGES · Materials · Textures |

## How it routes

Most operations have a dedicated, typed endpoint that validates inputs and returns
a structured result — so when you ask for a box or a boolean, Rook runs the safe
path rather than scripting blindly. You get the breadth of Rhino without learning
the command palette.

:::tip[Try it — paste to your agent]
```text
With Rhino open, loft these three curves into a surface, then fillet the edges at
2mm. If I don't have curves yet, make three offset circles to loft first.
```
:::

## Related

- [The Design Cascade](/rook-release/modules/design-cascade/) — for larger, planned builds
- [Scene Graph](/rook-release/modules/scene-graph/) — how Rook keeps track of what's there
