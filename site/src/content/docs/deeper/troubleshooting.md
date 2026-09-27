---
title: Troubleshooting
description: Common issues with Rook and how to fix them.
sidebar:
  order: 2
---

Most problems are quick to fix. Here are the common ones.

## My assistant doesn't see Rook

The Rook installer connects Rook to Claude and the ChatGPT desktop app. After every
Rook install or update, **fully quit** your app (from its icon near the clock, not
just the window) and reopen it. If Rook still doesn't appear, the app may have been
installed after Rook: run the Rook installer again.

For a step-by-step diagnosis, paste the
[troubleshooting prompt](/rook-release/start/setup-verify/#3-if-something-fails)
into your assistant. It reads Rook's logs and tells you what to fix.

## Rook isn't responding / everything hangs

This usually means **Rhino is waiting on a dialog box**. Switch to the Rhino
window and look for an open prompt (a file picker, a "Save changes?" box, a
command asking for input) and dismiss it. Then ask your assistant to try again.

## I asked for something and nothing appeared

Usually the request was missing a detail Rook needed — most often size, position,
or units. Try again with specifics:

> “Make a box **2 by 2 by 2 metres at the origin**.”

If it still doesn't appear, ask Rook directly: *“Did that work? If not, what went
wrong?”* — it can report the error.

## A Grasshopper component is missing or red

Just describe what you want again and let Rook rebuild it — it looks up the
correct components for your install rather than guessing names. You can also ask:
*“Why is this component erroring?”*

## Rook made the wrong thing

Tell it what's wrong, the way you would a colleague:

> “That's too tall — make it half the height.”
>
> “Wrong layer — move it to *Site*.”

You can always say *“undo that”* or *“delete everything you just made.”*

## Still stuck?

Open an issue at
[github.com/bringfire/rook-release/issues](https://github.com/bringfire/rook-release/issues) with
what you asked and what happened.
