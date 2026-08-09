# Design Exploration Checklist

Use only the evidence relevant to the brief. This checklist is read-only.

## Live evidence

- Use `gh_snapshot` to identify the active Grasshopper document, current components, connections, and groups.
- Use Rhino read tools only when the Rhino scene materially affects the design.
- Resolve candidate component identities with `gh_library` and confirm exact GUID and port metadata with `gh_batch_component_info`.
- When those tools are hidden in a lean catalog, use `rook_tools_search`, `rook_tools_read`, and `rook_tools_call`.
- Treat live component metadata as authoritative when it conflicts with stored notes.

## Advisory context

- Query knowledge only when it helps compare approaches or identify a known risk.
- Treat knowledge as optional advisory context, never as proof that a component or port exists in the current host.
- Record missing or ambiguous evidence instead of inventing an identity, port, or behavior.

## Decisions to resolve

- What outcome will count as success?
- Which inputs and outputs are authoritative?
- What data flow and constraints matter?
- Which existing documents, components, connections, geometry, or conventions must be preserved?
- Is direct execution bounded and safe, or would optional planning materially reduce risk?

Do not create executable batches, store an epoch, or mutate Rhino, Grasshopper, project files, or knowledge during design.
