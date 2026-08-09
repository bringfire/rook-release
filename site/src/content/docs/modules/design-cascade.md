---
title: The Design Cascade
description: Route Grasshopper work through design, planning, and execution only when each stage adds value.
sidebar:
  order: 4
---

Rook provides three Grasshopper skills, but they are not a mandatory sequence.
A clear, bounded request can go directly to execution. Design resolves ambiguity;
planning creates a durable artifact when scale, risk, or handoff needs justify one.
No skill invokes the next stage automatically.

## Three routed skills

| Phase | Skill | What it does |
|-------|-------|--------------|
| **Design** | `/design-grasshopper` | **Explore.** Read-only in Rhino, Grasshopper, and knowledge state; clarifies material choices and may write an authorized design artifact. |
| **Plan** | `/plan-grasshopper` | **Prepare.** Optionally records exact operations and preservation constraints for large, destructive, cross-session, or review-sensitive work. |
| **Execute** | `/execute-grasshopper` | **Build.** Admits the live document, mutates only owned state in bounded batches, and verifies the result. |

## Why phases

The routing keeps ceremony proportional to the work. Ambiguous or risky requests
get an explicit decision or plan; ordinary well-scoped work can begin after live
admission without manufacturing documents that add no value.

## When to use it

- Use **design** when the brief is open-ended or materially ambiguous.
- Add **planning** for destructive, cross-session, preservation-sensitive, or
  review-sensitive work.
- Use **execution directly** when the requested mutation is clear and bounded.

For quick, one-off canvas work, just ask directly — see
[Grasshopper](/rook-release/modules/grasshopper/).

:::tip[Try it — paste to your agent]
```text
Help me design a parametric façade driven by attractor points. Start with
/design-grasshopper because the brief is still open-ended, and ask before planning.
```
:::
