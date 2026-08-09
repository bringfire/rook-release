# Grasshopper Plan Serialization Patterns

These examples describe future `gh_edit` payloads. They are written into a plan and are not executed during planning.

## Resolve live identity first

For every unfamiliar component:

1. Use `gh_library` to resolve an exact installed component identity.
2. Use `gh_batch_component_info` to confirm the exact GUID and input/output indices.
3. If either tool is hidden, discover, read, and invoke it through `rook_tools_search`, `rook_tools_read`, and `rook_tools_call`.
4. Stop when identity or ports are missing or ambiguous. Stored knowledge is not a GUID fallback.

## Serialize an ordered creation batch

```python
gh_edit(
    epoch="<fresh execution-time epoch>",
    create=[
        {"temp_id": "T1", "type": "slider", "nick": "Radius", "min": 0.1, "max": 50.0, "value": 5.0, "pos": [100, 100]},
        {"temp_id": "T2", "guid": "<live exact GUID>", "pos": [400, 100]},
    ],
    connect=["T1.O0>T2.I0"],
)
```

The plan must identify the expected committed IDs from `edit_summary.temp_id_map` and the connection evidence to verify after solving.

## Serialize values, rewiring, grouping, and removal

Use the same ordered batch contract with only the required arrays:

```python
gh_edit(
    epoch="<fresh execution-time epoch>",
    set_values=[{"id": "<owned id>", "value": 12.5}],
    disconnect=["<owned id>.O0><authorized target>.I0"],
    connect=["<owned id>.O0><authorized target>.I1"],
    groups=[
        {
            "action": "create",
            "nick": "<group>",
            "members": ["<owned id>"],
        }
    ],
    delete=["<owned id>"],
)
```

Only serialize disconnect, grouping, movement, or deletion of execution-owned state unless the plan identifies specific pre-existing state whose modification the user authorized.

## Partial-success handling

Operations are ordered. A response may report `partial_success` after earlier operations have committed. The plan must require execution to:

1. record committed temporary-ID mappings and per-operation results;
2. refresh the live snapshot and epoch;
3. omit operations already satisfied or already committed;
4. retry only failed or unapplied operations when live evidence supports the same semantics and topology; and
5. stop for approval when preservation, ownership, semantics, or topology changed.

Every batch ends with bounded solve readiness, error inspection, and the relevant output or connection checks. An unresolved dependency stops the sequence.
