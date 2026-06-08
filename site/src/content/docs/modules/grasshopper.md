---
title: Rook in Grasshopper
description: Build, wire, and tidy parametric definitions by describing them to Rook.
sidebar:
  order: 2
---

Grasshopper is full of repetitive setup — placing components, wiring them,
relabelling, cleaning up a tangled canvas. Rook handles that side so you can focus
on the logic of your definition.

## Scaffold a definition

> “Set up a sphere driven by a radius slider, then I'll build from there.”

Rook places the right components and wires them. You don't name components or hunt
the ribbon — you describe what the definition should *do*, and take over when it's
set up.

## Tidy and reorganize

> “Clean up this canvas — group related components and straighten the wires.”
>
> “Relabel these sliders so I can tell them apart.”

The kind of housekeeping that's tedious by hand, done in one ask.

## Understand what's there

> “What does this definition do?”
>
> “Is anything erroring, and why?”

Rook reads the canvas and explains it — useful when you inherit someone else's
file.

## Reach for the right pattern

When you do want help with the logic, describe the *effect* rather than the
mechanics:

> “Make the panels smaller near that point and larger further away.”

Rook draws on real Grasshopper patterns — attractors, data trees, remapping — and
wires in a starting point you can refine.

:::tip[Try it — paste to your agent]
```text
In Grasshopper, set up a sphere driven by a radius slider, then add a slider for a
count and array the sphere in a row. Group and label the components so it's tidy.
```
:::

## Related

- [Chirp](/rook-release/modules/chirp/) — embed AI reasoning as components on the canvas
- [How to Ask for Things](/rook-release/working/asking-rook/)
