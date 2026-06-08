---
name: design-road
description: |
  Design and create 3D roads in Rhino using the RoadCreator plugin, orchestrated
  through Rook's MCP tools and scripted commands. Triggers on: "create road",
  "3D road", "road design", "highway", "alignment", "road surface", "road from
  curve", or any request involving road centerlines, horizontal/vertical alignment,
  cross-sections, or road accessories (guardrails, slopes, markings).
  Bridges Rook's Rhino geometry tools with RookRoads computation tools and
  RoadCreator's scripted commands for a complete road design pipeline.
argument-hint: "<road description or 'from curve'>"
---

# Design Road

Create 3D roads by orchestrating three systems: Rook (Rhino geometry tools), RookRoads (road computation MCP tools), and RoadCreator (scripted Rhino commands). The skill handles everything from a bare description to a finished 3D road surface with accessories.

## Prerequisites

Before starting, verify the toolchain is available:

```python
rc_ping()  # RookRoads plugin loaded?
```

If `rc_ping` fails, RookRoads is not running. The user needs Rhino open with the RookRC plugin loaded. Do NOT proceed without it — tell the user what's missing.

Also verify Rook's native plugin: `rhino_ping()`. Both RookNative and RookRC must be running. Intersection tools (`road_intersection_*`) route through RookNative, not RookRoads.

## The Pipeline

Road creation follows a 6-phase pipeline. Phases 1-3 are mandatory; 4-6 are progressive enhancements. See [road-workflow.md](./references/road-workflow.md) for the full phase reference.

```
Phase 1: Horizontal Alignment    (2D plan, Z=0)
Phase 2: Vertical Alignment      (profile space)
Phase 3: 3D Route Assembly        (merge H+V into 3D centerline)
Phase 4: 3D Road Surface          (sweep cross-sections along route)
Phase 5: Terrain & Slopes         (earthworks, contours)
Phase 6: Accessories & Landscape  (guardrails, barriers, markings, trees)
```

## The Process

### 1. Explore — Scene & Intent

Before asking the user anything, gather context silently.

**Check what exists:**
```python
rc_roads()           # Any roads already in the document?
rhino_objects()      # What geometry exists?
rhino_layers()       # Layer structure?
```

**Classify the starting point:**

| Scene State | Path | What to Do |
|-------------|------|------------|
| Curve exists, user points to it | **Path A** | Use as centerline, skip to alignment |
| Multiple curves exist | **Path A+** | Ask which is the centerline |
| No geometry, user describes road | **Path B** | Create centerline from description |
| RoadCreator layers already exist | **Path C** | Resume — check which phases are done |
| Terrain mesh/surface exists | Note it | Available for Phase 5 later |

**For Path B — Creating geometry from scratch:**
See [road-rhino-scaffold.md](./references/road-rhino-scaffold.md) for how to create road geometry using Rook's Rhino tools before entering the road pipeline.

**Present findings:**
```
Scene context:
- Found 1 curve on "Centerlines" layer (length: 342m)
- No existing RoadCreator roads
- Terrain mesh on "Terrain" layer (available for slopes later)
- RookRoads: connected
```

### 2. Ask Clarifying Questions

Based on what was found, ask **one question at a time**.

**Always determine these (if not obvious from context):**

1. **Centerline** — Which curve? Or describe the path?
2. **Road category** — What kind of road? (Present options from `rc_standards()`)
3. **Terrain** — Is there a terrain surface? (Determines if vertical alignment matters)
4. **Scope** — Just the road surface, or also accessories?

**Use multiple choice with sensible defaults:**
```
What type of road do you need?
(a) S 7.5 — Standard two-lane road (7.5m wide) ← most common
(b) S 9.5 — Wide two-lane (9.5m)
(c) S 11.5 — Four-lane undivided (11.5m)
(d) D 25.5 — Divided highway with median (25.5m)
(e) Other — I'll describe the requirements

Default: (a) S 7.5 if you're unsure.
```

**Stop asking when you have enough to start Phase 1.** Don't front-load all questions — accessories can be decided after the road surface exists.

### 3. Execute — Phase by Phase

Work through the phases sequentially. After each phase, briefly report what was created and ask if the user wants to continue to the next phase.

**Phase 1: Horizontal Alignment**
See [road-workflow.md](./references/road-workflow.md) § Phase 1.

Two sub-paths:
- **Simple (no transitions):** Use the centerline curve directly as the horizontal alignment. Copy to `RoadCreator::Road_N::Tangent Polygon` layer.
- **With transitions:** Create tangent polygon, then insert clothoid or cubic parabola transitions at each PI. Use `rc_clothoid` or `rc_cubic_parabola` to compute geometry, then create curves via `rhino_create`.

For scripted command execution, see [rc-tools-reference.md](./references/rc-tools-reference.md).

**Phase 2: Vertical Alignment**
See [road-workflow.md](./references/road-workflow.md) § Phase 2.

- If terrain exists: sample elevations along the horizontal alignment to create a natural grade line, then smooth with `rc_vertical_curve` at grade change points.
- If no terrain: ask user for desired grades (e.g., "flat", "2% uphill", or specific elevation points). Create grade line geometry in profile space (X=chainage, Y=elevation×10).

**Phase 3: 3D Route Assembly**
```python
# Drive RC_Assemble3DRoute in scripted mode — it auto-detects from layers
rhino_command(command="_-RC_Assemble3DRoute _Enter")
```

Or use the computation tool if you have the point arrays:
```python
rc_assemble_route(horizontalPoints=[...], elevations=[...])
```

**Phase 4: 3D Road Surface**

Two options — choose based on whether accessories (guardrails, poles) are needed:

**Option A — MCP tool** (basic surface only, no boundary curves):
```python
rc_road_3d(
    road="Road_1",
    category="S 7.5",      # Exact format from rc_standards() — spaces + dots required
    crossfallStraight=2.5,
    crossfallCurve=4.0,
    includeVerge=False
)
```

**Option B — Scripted command** (full output with boundary curves for accessories):
```python
rhino_command(command="_-RC_Road3D _Enter")
```
Use Option B if Phase 6 accessories are planned — boundary curves are required for guardrails, poles, slopes.

**After Phase 4, check results:**
```python
rhino_objects(layer="RoadCreator::Road_1::3D Road")  # Verify surface was created
```

Report to user: road name, category, length, and ask about accessories.

**Phase 5: Terrain & Slopes** (if terrain exists)
```python
# Pre-select terrain + both boundary curves (from scripted RC_Road3D only)
rhino_select(ids=[terrain_guid, left_boundary_guid, right_boundary_guid])
rhino_command(command="_-RC_Slopes _Enter")
```

**Phase 6: Accessories**
Ask which accessories the user wants, then execute via scripted commands. See [rc-tools-reference.md](./references/rc-tools-reference.md) § Accessories for the full command list.

### 4. Verify & Report

After each major phase:
```python
rhino_objects(layer="RoadCreator::Road_1::*")  # Check what was created
```

**Final summary:**
```
Road_1 complete:
- Category: S 7.5 (7.5m wide, two-lane)
- Length: 342m
- Horizontal: 2 clothoid transitions (R=150m, L=70m)
- Vertical: 1 parabolic curve (R=2000m, crest)
- Surface: 3D road with 2.5%/4.0% crossfall
- Accessories: guardrails (both sides), delineator poles
- Layers: RoadCreator::Road_1::* (7 sublayers)
```

## Integration

**Requires (running in Rhino):**
- RookNative plugin (Rook's C++ HTTP server)
- RookRC plugin (RookRoads HTTP server)
- RoadCreator plugin (RC_* commands)

**MCP tools used:**
- `rc_*` tools — road computation (via RookRoads)
- `rhino_*` tools — geometry creation and inspection (via RookNative)
- `rhino_command` — driving RC_* commands in scripted mode

**Does NOT cascade into other skills.** This is a self-contained design-and-execute skill (unlike the GH pipeline which splits design → plan → execute).

## Key Principles

- **Phase by phase** — never skip ahead. Each phase depends on the previous one.
- **Verify after each phase** — check that geometry was actually created before proceeding.
- **Use MCP tools for computation, scripted commands for document operations** — `rc_clothoid` returns math; `rhino_command("RC_Clothoid")` creates geometry in the document.
- **Layer hierarchy is sacred** — RoadCreator expects specific layer names. Don't rename or restructure.
- **Ask about scope early, details late** — determine road type and extent first; accessories can wait.
- **Default to S 7.5** — most common road category for general use.
- **Crossfall defaults: 2.5% straight, 4.0% curve** — standard Czech values, work for most cases.

## References

- See [road-workflow.md](./references/road-workflow.md) for the complete 6-phase pipeline with geometry details
- See [rc-tools-reference.md](./references/rc-tools-reference.md) for MCP tools and scripted RC_* command patterns
- See [road-rhino-scaffold.md](./references/road-rhino-scaffold.md) for creating road geometry from scratch (Path B)
- See [road-standards.md](./references/road-standards.md) for Czech road categories, crossfall, and lane widening tables
