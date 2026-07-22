---
title: Many Providers
description: One typed seam carries any image, video, or 3D model from any vendor — bring your own key.
sidebar:
  order: 5
---

Beyond language models, Rook's generation features (image, video, 3D) run through a
single **typed seam** that can carry any model from any vendor — with per-model
pricing and per-route capability flags. A new model is a registration, not a
release.

## Providers

| Provider | Lifecycle | Coverage | Billing |
|----------|-----------|----------|---------|
| **Gemini** (direct) | sync | image · text | per-token |
| **Veo** (direct) | async | video | per-second |
| **fal.ai** (aggregator) | sync · queue | image · video · 3D | per-MP · per-call |
| **Replicate** (aggregator) | prediction · poll | image · video · 3D | per-compute-sec |
| **Tencent Hunyuan** (planned) | async | 3D generation | per-call · tiered |

## A curated roster

You don't have to wade through hundreds of models — Rook curates a working set:

- **Image** — Nano Banana (Gemini) · Flux 2 Pro · GPT-Image-2 Edit
- **Video** — Veo · Seedance 2.0 · Kling v3
- **3D** — Hunyuan 3D 3.1 and mesh cleanup are planned roadmap lanes

## Built to absorb new models

The seam was designed around six realities of working with many vendors —
sync vs. queued lifecycles, per-route capabilities, mixed pricing models,
per-provider options, URL-or-inline results, and different secret schemes — so
adding a model is routine.

## Bring your own key

BYOK throughout — one keyring, separate vaults. You use your own provider accounts;
Rook just routes to them.

:::tip[Try it — paste to your agent]
```text
Which image, video, and 3D providers can Rook use, and which ones do I currently
have API keys configured for?
```
:::

## Related

- [Image Round-Trip](/rook-release/modules/image-round-trip/) · [RookVision](/rook-release/modules/rookvision/) · [Hunyuan 3D](/rook-release/modules/hunyuan-3d/)
