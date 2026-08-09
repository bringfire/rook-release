# Wasp Admission

Status: optional experimental pending admission.

Wasp designs may reason conceptually about parts, connections, rules, aggregation, fields, constraints, hierarchy, persistence, and export. These concepts do not prove that an installed component or port is available.

## Live admission

Before describing a Wasp design as executable:

1. Confirm a reachable Rhino and Grasshopper host using current read-only status evidence.
2. Use `gh_library` to find the exact installed Wasp components required by the proposed workflow.
3. Use `gh_batch_component_info` to confirm their exact GUIDs, input ports, and output ports.
4. Fail closed when any component or port is missing, ambiguous, or inconsistent with the live host.

If an admitted tool is hidden in the current catalog, use `rook_tools_search`, `rook_tools_read`, and `rook_tools_call` rather than assuming direct availability.

Failed admission means zero mutation. Return a non-executable design that records the missing evidence and the decision needed from the user. Static recipes and stored knowledge cannot substitute for live admission.

Rhino scaffold preparation, reference geometry, aggregation construction, and export are deferred to an authorized execution. This design reference contains no component-name guesses, pin assumptions, GUID placeholders, executable recipes, or Rhino mutation calls.
