---
name: execute-grasshopper
description: >
  Use when the user asks to build or modify a Grasshopper definition through
  Rook.
---

# Execute Grasshopper Work

## Authorization

A direct build or edit request authorizes the bounded mutations needed to produce the requested result. Ask again only when the request is ambiguous, destructive, would change pre-existing content outside the admitted boundary, or would materially expand scope.

Execution owns mutation. It may consume a clear brief, an approved design, or an optional technical plan.

## Admit the Live Target

Before mutation:

1. Confirm the intended host and document identity.
2. Capture a fresh gh_snapshot and take its fresh epoch for the immediate batch.
3. Resolve every unfamiliar component identity with `gh_library` and every required port with `gh_batch_component_info`.
4. When a needed admitted tool is hidden, use `rook_tools_search`, `rook_tools_read`, and `rook_tools_call`.
5. Compare any optional structural baseline with the live document.
6. Start an execution-owned ID ledger containing temporary IDs, committed IDs, authorized pre-existing IDs, and operation outcomes.

For Wasp work, apply `../design-grasshopper/references/wasp-admission.md`. Failed admission stops before mutation with the missing component or port evidence reported.

If no admitted host, mutation tool, or required live component can be reached, stop without mutation. Preserve useful design or plan artifacts and report the unavailable boundary.

## Admit Drift

Refresh volatile component identities and ports when their meaning is unchanged. Omit operations already satisfied by the live graph.

Stop for approval when drift changes semantics, topology, ownership, or preservation obligations. A missing or stale structural baseline is advisory only; re-admit the live state before acting.

## Apply Bounded Batches

Use `gh_edit` for ordered batch mutation. It may return `partial_success`: earlier operations may commit before a later operation fails.

For every result:

- inspect per-operation results, verification state, errors, returned topology, and `edit_summary.temp_id_map`;
- enter every already committed creation and applied operation in the execution-owned ledger;
- preserve the operation order when classifying failed or unapplied work; and
- never assume the whole batch rolled back.

After partial success, capture a new snapshot and fresh epoch. Retry only failed or unapplied operations that remain authorized and semantically unchanged. Never replay work already committed. Omit any operation now already satisfied.

Group, move, disconnect, retry, or delete only execution-owned state unless the user explicitly authorized specific pre-existing state.

## Checkpoint and Recover

After each bounded batch, poll `gh_status` only to a fixed timeout. Continue only when the solver is enabled, the solution is ready for edit, and its state is understood. Then use `gh_errors` and inspect the relevant outputs and connections.

If a batch has a resolvable defect, make one bounded correction from current live evidence:

1. inspect the affected component and ports;
2. capture refreshed state and epoch;
3. apply only the missing or incorrect owned operations; and
4. repeat the relevant verification.

If the correction fails or an unresolved dependency blocks downstream work, stop. Report completed operations, failed or unapplied operations, current IDs, and the decision required from the user. Do not continue through a broken dependency.

See [checkpoint protocol](references/checkpoint-protocol.md) for the compact result and recovery contract.

## Finalize and Return

Do not run global cleanup. Apply requested grouping or layout only to execution-owned components.

Capture a final fresh snapshot, inspect errors, and verify the requested outputs and connections. Return a concise report of created and changed state, remaining warnings or failures, and cleanup of any disposable execution-owned fixtures.

Successful execution is terminal. Do not start any automatic knowledge-write or post-execution learning stage.
