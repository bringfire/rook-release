---
name: plan-grasshopper
description: >
  Use when Grasshopper work is large, destructive, cross-session, or
  review-sensitive enough to need a durable technical artifact.
---

# Plan Grasshopper Work

## Purpose

Convert an approved design, clear specification, or equivalent artifact into a durable technical plan. This stage is Rhino, Grasshopper, and knowledge read-only. It inspects current evidence and serializes future work; it may write only the authorized plan artifact under `docs/plans/` and does not mutate either host or the knowledge store.

Planning is optional. Use it when size, destructive potential, cross-session handoff, existing-canvas preservation, or review risk justifies a durable artifact. Skipping the durable plan is valid when execution can perform the same bounded preflight in the current task.

## Admit the Planning Inputs

Confirm that the source artifact resolves material design decisions and identifies the intended outcome. If semantics, topology, ownership, or preservation remain ambiguous, return those questions for approval rather than burying decisions in executable steps.

Inspect current tool schemas and live component metadata. Use `gh_library` for exact installed component identity and `gh_batch_component_info` for exact input and output ports. When a needed admitted tool is hidden, use `rook_tools_search`, `rook_tools_read`, and `rook_tools_call`. Treat knowledge as optional advisory context; live schemas and host metadata are authoritative.

For Wasp work, apply the compact admission contract in `../design-grasshopper/references/wasp-admission.md`. A plan is not executable unless its required Wasp components and ports pass live admission.

## Capture the Structural Baseline

For existing-canvas work, record a structural baseline containing:

- target host and document identity;
- relevant component identities and current parameter metadata;
- relevant existing connections and groups;
- the ownership boundary for new and pre-existing state; and
- explicit preservation constraints.

The durable baseline does not store an epoch. Epochs are volatile execution-time concurrency tokens. If the structural baseline is absent or stale, the plan is advisory: execution must re-admit live state and obtain approval for semantic, topology, ownership, or preservation changes.

## Serialize Future Mutation

Express all proposed Grasshopper mutation through ordered `gh_edit` batches using only these arrays:

- `create`
- `set_values`
- `connect`
- `disconnect`
- `groups`
- `delete`

Use a fresh execution-time epoch placeholder, never a persisted numeric epoch. Assign batch-local temporary IDs to new components and record which committed IDs are expected from each result. Grouping and layout may target only execution-owned components. Do not prescribe global canvas cleanup.

Each bounded batch must state:

- its preconditions and owned targets;
- ordered operations and expected committed-ID mappings;
- the result fields that prove each operation applied;
- solve, error, output, and connection verification;
- how `partial_success` is interpreted in operation order; and
- stop conditions for drift, ambiguity, failed admission, or an unresolved dependency.

After partial success, already committed operations must be recorded and never replayed. A later execution may refresh state and retry only failed or unapplied operations.

See [tool-call patterns](references/tool-call-patterns.md) for non-executed plan serialization examples.

## Complete the Stage

Write the authorized plan artifact under `docs/plans/` and return its path for review. Identify any approval still required before mutation and offer execution after that approval. Do not invoke execution automatically; the user controls the next stage.
