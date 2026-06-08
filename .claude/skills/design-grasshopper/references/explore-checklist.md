# Explore Phase Checklist

## Knowledge Store Queries

For each major concept in the user's request, run:

```python
gh_knowledge_query(intent="<concept>", depth="context")
```

**Depth tiers:**
- `quick` (~20 tokens) — essential facts only, use for peripheral concepts
- `context` (~50 tokens) — specific rules for the use case (DEFAULT)
- `errors` (~30 tokens) — failure modes and why, use when something seems risky
- `raw` (~500+ tokens) — full patterns, use sparingly for core components

**Common concept queries:**
| Domain | Query Examples |
|--------|---------------|
| Curves | "circle", "line", "interpolate curve", "nurbs curve", "divide curve" |
| Surfaces | "loft", "sweep", "extrude", "boundary surface", "patch" |
| Transforms | "move", "rotate", "scale", "orient", "mirror" |
| Math | "expression", "range", "series", "remap", "graph mapper" |
| Data Trees | "graft", "flatten", "path mapper", "merge", "entwine" |
| Geometry | "brep", "mesh", "point", "vector", "plane" |
| Params | "number slider", "panel", "boolean toggle", "value list" |

## Component Structure Query

Always run once during explore to access the consolidated knowledge graph:

```python
gh_structure_query()  # Overview: families, similar pairs, shared behaviors, I/O patterns
```

Use the structure to:
- **Find alternatives** — similar pairs surface components you might not consider (e.g., Pipe ↔ Sweep1)
- **Check family-wide gotchas** — shared behaviors flag issues that apply to every component in a family
- **Verify I/O compatibility** — I/O patterns reveal common wiring conventions
- **Look up a specific component:** `gh_structure_query(guid="<guid>")` for its family and relationships

## Following Related Concepts

When a knowledge result mentions related components or patterns, query for those too — they represent A-MEM semantic neighbors:

```python
# Initial query
gh_knowledge_query(intent="helix pattern", depth="context")
# Result mentions trigonometric patterns and pipe/sweep

# Follow related concepts
gh_knowledge_query(intent="trigonometric patterns", depth="context")
gh_knowledge_query(intent="pipe sweep patterns", depth="context")
```

## Canvas State Analysis

After `gh_query()`, check for:
- **Empty canvas** — fresh start, no constraints
- **Existing components** — may need to wire into them, not duplicate
- **Existing sliders** — may reuse rather than create new ones
- **Error components** — pre-existing issues to be aware of

## Rhino Scene Context

If the GH definition references Rhino geometry:
```python
rhino_objects()  # List all objects
# Or use scene graph for spatial context:
# GET /scene/graph/query with layer or type filters
```

Check for:
- Referenced curves, surfaces, or points
- Layer organization (may inform GH grouping)
- Units and scale (affects slider ranges)

## Question Templates

**Parametric range:**
```
What range should the <parameter> slider have?
(a) 0 to 10 (small/detailed scale)
(b) 0 to 100 (room/furniture scale)
(c) 0 to 1000 (building/site scale)
```

**Output type:**
```
What should the definition produce?
(a) Live preview geometry (stays parametric)
(b) Baked geometry to Rhino (one-time output)
(c) Data output (numbers, points, curves for downstream use)
```

**Data structure:**
```
Should the definition work with:
(a) Single geometry (one curve, one surface)
(b) A list of geometries (multiple curves, array of points)
(c) A tree of geometries (branches for each floor/segment/panel)
```
