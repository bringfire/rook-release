# Grasshopper Execution Checkpoint Protocol

## Owned-state ledger

Before the first mutation, record:

- execution-owned temporary and committed component IDs;
- specifically authorized pre-existing IDs;
- expected connections and outputs; and
- each ordered operation's pending, committed, failed, or unapplied state.

Update the ledger from every `edit_summary.temp_id_map` and per-operation result.

## Batch result

`gh_edit` operations are ordered. A response can report `partial_success` after earlier operations have committed. Never treat a failed batch as an automatic rollback.

For value changes, rewiring, or removal, use the `gh_edit` arrays:

```python
gh_edit(
    epoch="<fresh epoch>",
    set_values=[{"id": "<owned id>", "value": 12.5}],
    disconnect=["<owned id>.O0><authorized target>.I0"],
    connect=["<owned id>.O0><authorized target>.I1"],
    delete=["<owned id>"],
)
```

Do not move, disconnect, group, retry, or delete pre-existing state unless its exact identity and modification were authorized.

## Solve and verify

After a mutation schedules a solution:

1. Poll `gh_status` only to a fixed timeout.
2. Require the solver to be enabled, ready for edit, and in an understood solved state.
3. Inspect `gh_errors`.
4. Inspect the outputs and connections relevant to the batch.

Stop if the timeout expires, the solver is disabled, the state is unknown, or a dependency needed by later work remains unresolved.

## One bounded correction

When live evidence identifies a correctable problem:

1. Record operations already committed and already satisfied.
2. Refresh the snapshot, epoch, affected component metadata, and ports.
3. Apply only failed or unapplied operations whose semantics, topology, ownership, and preservation boundary are unchanged.
4. Re-run the relevant solve, error, output, and connection checks.

If verification still fails, stop and report the completed and failed operations. Never replay already committed work, and never continue through an unresolved dependency.

## Final checkpoint

Use a fresh snapshot and `gh_errors` to prove the requested graph and outputs. Report the execution-owned IDs and exact state changed. There is no global cleanup step.
