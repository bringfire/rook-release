---
name: design-grasshopper
description: >
  Use when a Grasshopper request is ambiguous or open-ended and the user needs
  alternatives, constraints, or acceptance criteria clarified.
---

# Design a Grasshopper Definition

## Purpose

Turn an ambiguous Grasshopper brief into a clear, reviewable design decision. This stage is Rhino, Grasshopper, and knowledge read-only. It may inspect current state and discuss alternatives, but it does not mutate either host or write to the knowledge store. When durability adds value, it may write only the authorized design artifact under `docs/plans/`.

Use this stage only when material design choices remain unresolved. A clear, bounded build request can proceed directly to execution. Planning is optional and adds value when work is large, destructive, cross-session, preservation-sensitive, or otherwise high risk.

## Inspect Current State

Use `gh_snapshot` to understand the active document and canvas. Use Rhino read tools only when scene context is relevant. Do not infer document identity, component identity, topology, or parameter ports from prose alone.

Knowledge results are optional advisory context. They can suggest terminology, precedents, or risks, but live document and component metadata outrank stored knowledge.

Resolve technical identity with `gh_library` and `gh_batch_component_info`. In a lean catalog, reach hidden admitted tools through `rook_tools_search`, inspect their current schemas with `rook_tools_read`, and invoke them through `rook_tools_call`. If live evidence is missing or ambiguous, record the uncertainty instead of guessing.

For Wasp work, follow [Wasp admission](references/wasp-admission.md) before treating a design as executable.

The [explore checklist](references/explore-checklist.md) is a compact reminder of the evidence to collect.

## Clarify the Brief

Ask one material question at a time. Focus on decisions that change the definition, such as:

- intended outcome and acceptance criteria;
- authoritative inputs and expected outputs;
- controlling variables and useful ranges;
- data-flow, data-tree, geometry, and solver constraints;
- existing content that must be preserved; and
- acceptable failure, review, and handoff boundaries.

When alternatives are useful, present two or three viable approaches with concrete tradeoffs. Confirm intent and success criteria before recording the design.

## Record the Design

When durability adds value, write the authorized design artifact under `docs/plans/`. Otherwise, return the record in the current task. In either form, include:

- user intent and success criteria;
- inputs, outputs, and conceptual data flow;
- relevant live-state observations;
- preservation and ownership boundaries;
- accepted constraints and rejected alternatives;
- unresolved decisions or admission gaps; and
- whether optional planning adds enough safety or coordination value.

Keep the record conceptual. Do not include volatile epochs, guessed or fixed GUIDs, fixed canvas positions, or executable mutation batches.

## Complete the Stage

Return the design record and stop. Offer the user two appropriate next choices:

- direct execution for clear, bounded work; or
- optional planning for large, destructive, cross-session, or high-risk work.

Do not invoke another skill. A user decision controls the next stage.
