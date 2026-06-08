---
name: masterplan-roads
description: |
  Build a complete road network from centerline curves — 3D surfaces,
  intersections, sidewalks, crossings, guardrails, slopes, and 2D footprints.
  Orchestrates the full pipeline through six phases with user confirmation at
  decision points. Triggers on: "masterplan roads", "road network", "set up
  roads from centerlines", "create roads from curves", "build road network",
  "roads from these curves", or any request involving multiple road centerlines
  that need to become a coordinated road network with accessories. Use this
  skill instead of /design-road when the user has multiple curves that form a
  connected road network, not just a single road.
argument-hint: "<layer name or 'from selected curves'>"
---

# Masterplan Roads

Build a road network from centerline curves through a phase-batched pipeline.
The user draws curves, confirms a few design choices, and gets a complete road
network with 3D surfaces, intersections, sidewalks, crossings, guardrails,
and 2D footprints.

This skill orchestrates existing tools — it does not create new geometry
primitives or computation. Everything runs through Rook MCP tools.

## Prerequisites

Before anything else, verify both plugins are running:

```python
rc_ping()      # RookRoads plugin
rhino_ping()   # RookNative plugin
```

If either fails, stop and tell the user which plugin is missing. Both are
required — road tools route through RookRoads, intersection tools through
RookNative.

## The Road Registry

Maintain a mental registry for each road throughout all phases. This is the
single source of truth — every downstream tool call reads from it.

```
Per road:
  sourceId        — GUID of the original input curve (never moved/deleted)
  roadName        — "Road_1", "Road_2", etc.
  profileName     — stored RC_RoadProfile name
  routeCurveId    — GUID of the copy on RoadCreator layer
  surfaceIds      — GUIDs of created road surfaces
  leftEdgeId      — GUID of left edge offset curve
  rightEdgeId     — GUID of right edge offset curve
  status          — pending | surface_done | complete | failed
  urbanFeatures   — "none" | "sidewalks" | "full_urban"
  accessories     — "none" | "basic" | "full"

Per intersection:
  roadA, roadB    — road names
  point           — intersection location [x, y, z]
  resolvedIds     — GUIDs of created intersection geometry
  targetLayer     — layer root used
```

Update this registry after every tool call. If a road fails at any phase,
mark it as `failed` and continue with the others — never stop the entire
pipeline for one road's failure.

---

## Phase 1: Discovery

Gather scene context silently — no questions yet.

**Steps:**
1. `rhino_objects()` on the user's specified layer (or selected curves)
2. `rhino_layers()` to understand the scene structure
3. `rc_roads()` to check for any existing RoadCreator roads
4. For each curve: `rhino_measure_length()` to get length

**Classify each curve:**
- By length/shape: collector (longest, sweeping), local streets (medium),
  cul-de-sac (short, dead-end shape)
- By smoothness: can it be used directly as a 3D route?

**Smoothness gate:** Check if the curve has sharp direction changes that
would produce a bad road surface. Be conservative — if uncertain, ask the
user rather than guessing. Curves that are too angular for the shortcut
path should be flagged and skipped in v1, with a note that full alignment
processing would be needed.

**Check for terrain:** Look for mesh/surface on layers named "Terrain",
"TERRAIN", "terrain", "Ground", or similar.

**Present findings:**
```
Found 4 curves on "Centerlines" layer:
  (a) Curve A — 487m, smooth → collector
  (b) Curve B — 152m, smooth → local street
  (c) Curve C — 198m, smooth → local street
  (d) Curve D — 89m, smooth → cul-de-sac

Terrain mesh available on "Terrain" layer.
```

---

## Phase 2: Assignment + Design Decisions

Present the full network plan as **one compact summary** with sensible
defaults. The user confirms or adjusts — this is not four separate
mini-interviews.

```
Road network plan:
  Road_1 (Curve A, 487m): collector — lane 4.75m, curb + sidewalk 3m
  Road_2 (Curve B, 152m): local — lane 3.75m, curb + sidewalk 2m
  Road_3 (Curve C, 198m): local — lane 3.75m, curb + sidewalk 2m
  Road_4 (Curve D, 89m): cul-de-sac — lane 3.25m, no sidewalk

Intersections: resolved with curb returns where roads cross
Accessories: guardrails + poles on collector, poles on locals

Confirm, or tell me what to change?
```

**Default assignments by road type:**

| Type | Lane width | Curb | Sidewalk | Accessories |
|------|-----------|------|----------|-------------|
| Collector | 4.75m | 0.2m height, 0.3m top | 3.0m both sides | Guardrails + poles |
| Local | 3.75m | 0.2m height, 0.3m top | 2.0m both sides | Poles only |
| Cul-de-sac | 3.25m | None | None | None |

After user confirms, build and store profiles. See
[references/profile-recipes.md](references/profile-recipes.md) for the
exact `rc_build_profile` call patterns.

```python
# For each unique road type, build once and store:
rc_build_profile(name="collector_urban", laneWidth=4.75,
    curb={"height": 0.2, "topWidth": 0.3}, sidewalk={"width": 3.0})
# → take the profile from the response
rc_store_road_profile(profile=<the profile from build response>)
```

---

## Phase 3: Road Surface Batch

Process each road sequentially. For each road:

### Step 1: Place route curve on RoadCreator layer

Copy the original curve (do NOT move it — you need the original for
intersection discovery later):

```python
rhino_copy(ids=[sourceId])  # → newCurveId
# Create route layer first:
rhino_layer_create_batch(layers=[...], rootParent="RoadCreator")
# Move the copy to the correct layer:
rhino_select(ids=[newCurveId])
rhino_command(command='_-ChangeLayer "RoadCreator::Road_1::3D Route"')
```

Store `newCurveId` as `routeCurveId` in the registry.

### Step 2: Generate 3D surface

```python
rc_road_3d(road="Road_1", profileName="collector_urban")
```

The response includes `objectsCreated` and `layer`. Store surface info in
the registry.

### Step 3: Derive edge curves from profile

Read the stored profile to find the edge offsets, then create offset curves:

```python
rc_get_road_profile(name="collector_urban")
# → find edge_of_pavement features, get their offsets (e.g., -4.75 and +4.75)

# Create edge curves at EoP offset (positive and negative)
rhino_offset_curve(curveId=routeCurveId, distance=4.75)
# → edgePlusId
rhino_offset_curve(curveId=routeCurveId, distance=-4.75)
# → edgeMinusId
```

If the profile has no `edge_of_pavement`, try `carriageway_edge`. If
neither exists, mark the road as accessory-ineligible and continue.

Store both edge IDs in the registry. Note: which is "left" vs "right"
depends on the curve direction — the offset sign convention determines
the geometric side, not a named "left"/"right" parameter.

### Summary checkpoint

After all roads are processed, report:
```
Road surfaces: 4 created, 0 failed
  Road_1: 487m collector, profile "collector_urban"
  Road_2: 152m local, profile "local_urban"
  Road_3: 198m local, profile "local_urban"
  Road_4: 89m cul-de-sac, profile "cul_de_sac"
Edge curves: 8 created (4 roads × 2 sides)
Proceeding to intersections?
```

---

## Phase 4: Intersection Batch

For each pair of roads whose source curves might cross:

```python
road_intersection_resolve(
    centerlineA=sourceIdA,
    centerlineB=sourceIdB,
    profileA=profileNameA,
    profileB=profileNameB,
    targetLayerRoot="RoadCreator::Intersections::Road_1_x_Road_2",
    candidateMode="all"   # Important: roads may cross at multiple points
)
```

**Target layer root convention:**
`RoadCreator::Intersections::{RoadA}_x_{RoadB}`

**Road label convention:** `road_intersection_resolve` labels roads as "A"
and "B" (from `centerlineA`/`centerlineB`). These labels must be used
consistently in Phase 5 for `rc_apply_sidewalk_ownership`.

From each result, store in the intersection registry:
- `boundaryId` — the realized boundary curve GUID
- `surfaceId` — the realized intersection surface GUID
- `candidateId` — "cand-0", "cand-1", etc.
- `point` — intersection location
- `joinContract` — persisted on the boundary object for downstream use

### Step 2: Apply intersection ownership (carriageway)

Split each road's carriageway surface against the intersection boundaries.
This removes the overlapping carriageway area inside each intersection,
leaving only the road-approach fragments.

```python
rc_apply_intersection_ownership(
    roads=[
        {"roadName": "Road_1", "surfaceIds": [surfaceId1]},
        {"roadName": "Road_2", "surfaceIds": [surfaceId2]}
    ],
    intersections=[
        {"intersectionId": "cand-0", "boundaryId": boundaryId0},
        {"intersectionId": "cand-1", "boundaryId": boundaryId1}
    ]
)
```

Each road surface is split into approach fragments (kept) and interior
fragments (discarded). Update the registry with the new `createdIds`
as the road's surface fragments.

Roads with no intersection: keep surfaces as-is, continue normally.

### Summary checkpoint

```
Intersections: 3 resolved, 0 ambiguous
  Road_1 × Road_2 at (123.4, 567.8) — 2 crossings
Carriageway ownership: Road_1 → 3 fragments, Road_2 → 3 fragments
Proceeding to urban elements?
```

---

## Phase 5: Urban + Accessories Batch

Apply urban elements and accessories based on Phase 2 assignments, using
the edge curve IDs from the road registry.

### Sidewalks (3 steps)

**Step 1: Generate full-length sidewalks on both edges.**

For each road assigned sidewalks, call `rc_sidewalk` on both edge curves.
These are generated on the FULL unsplit edge curves — ownership trimming
happens in Step 2.

```python
# The referencePoint should be OUTSIDE the road — away from centerline.
# Compute it: get edge curve midpoint via rhino_curve_point_at(param=0.5),
# then get route curve midpoint. The vector from route to edge, extended,
# gives the outward direction.
rc_sidewalk(curveId=edgePlusId, referencePoint=<point outside edge>,
    width=1.8)
rc_sidewalk(curveId=edgeMinusId, referencePoint=<point outside edge>,
    width=1.8)
```

Each call creates 2 surfaces (curb + sidewalk). Store all 8 surface IDs
(4 edges × 2 surfaces each).

**Step 2: Apply sidewalk ownership.**

Trim the full-length sidewalks at intersection arm-end edges. This is the
sidewalk analogue of `rc_apply_intersection_ownership`.

CRITICAL: Pass `centerlines` mapping road labels ("A"/"B") to the
original centerline curve GUIDs. Without centerlines, the tool falls back
to boundary-only splitting which produces incorrect results.

```python
rc_apply_sidewalk_ownership(
    surfaces=[
        {"surfaceId": sw1_curb, "road": "A"},
        {"surfaceId": sw1_surface, "road": "A"},
        {"surfaceId": sw2_curb, "road": "A"},
        {"surfaceId": sw2_surface, "road": "A"},
        {"surfaceId": sw3_curb, "road": "B"},
        {"surfaceId": sw3_surface, "road": "B"},
        {"surfaceId": sw4_curb, "road": "B"},
        {"surfaceId": sw4_surface, "road": "B"},
    ],
    intersections=[
        {"intersectionId": "cand-0", "boundaryId": boundaryId0},
        {"intersectionId": "cand-1", "boundaryId": boundaryId1}
    ],
    centerlines=[
        {"road": "A", "curveId": sourceIdA},
        {"road": "B", "curveId": sourceIdB}
    ]
)
```

Road labels "A"/"B" must match `road_intersection_resolve`'s convention:
"A" = `centerlineA`, "B" = `centerlineB`.

Each surface produces 3 kept fragments (with 2 intersections) — the
midblock segments. Intersection-interior fragments are discarded.

**Step 3: Corner sidewalks (optional).**

For each intersection, generate corner sidewalks using the join contract:

```python
rc_sidewalk_corners(
    intersectionId="cand-0",
    boundaryId=boundaryId0,
    joinContract=<from resolve result>
)
```

### Crossings at Intersections

For each intersection record from Phase 4:

1. Find the road surface fragment nearest the intersection point:
   `rhino_objects()` on the road's 3D Road layer, then pick the brep
   closest to the intersection `candidatePoint`
2. Compute crossing start/end perpendicular to the road at the intersection:
   use the left/right edge positions at that chainage
3. Call `rc_crossing(surfaceId=fragmentId, startPoint=leftEdgePt,
   endPoint=rightEdgePt, crossingWidth=4.0)`

If surface identification fails, skip and warn.

### Guardrails

For roads assigned guardrails:
```python
rc_guardrail(curveId=leftEdgeId, referencePoint=<point outside left edge>)
rc_guardrail(curveId=rightEdgeId, referencePoint=<point outside right edge>)
```

### Slopes

Where terrain exists:
```python
rc_slopes(terrainId=terrainId, leftEdgeId=leftEdgeId,
    rightEdgeId=rightEdgeId)
```

### Summary checkpoint

```
Urban elements:
  Sidewalks: 6 created (collector both sides, 2 locals both sides)
  Crossings: 3 created (zebra at each intersection)
Accessories:
  Guardrails: 2 created (collector edges)
  Slopes: 4 created (2 roads × 2 sides)
```

---

## Phase 6: Deliverables

### 2D Footprints

For each road type, project the profile and apply it:

```python
# 1. Project to OffsetProfile
result = rc_project_offset_profile(name="collector_urban")
offset_json = result["offsetProfile"]  # OffsetProfile JSON

# 2. Store the offset profile for RC_RoadFootprint
rhino_command(command='_-RC_StoreProfile ' + json.dumps(offset_json))

# 3. Select the route curve and apply footprint
rhino_select(ids=[routeCurveId])
rhino_command(command="_-RC_RoadFootprint")
```

### Longitudinal Profiles

For the collector road (if terrain is available):
```python
rc_longitudinal_profile(road="Road_1", terrainId=terrainId,
    origin=[x, y, z], labelSpacing=20.0)
```

### Final Summary

```
Road network complete:
  - 4 roads (487m collector + 3 local/cul-de-sac)
  - 3 resolved intersections
  - 6 sidewalks (1.8km total)
  - 3 pedestrian crossings
  - 2 guardrails (collector edges)
  - 4 slope surfaces
  - 4 road footprints (2D)
  - 1 longitudinal profile

Layers: RoadCreator::Road_1 through Road_4
Intersections: RoadCreator::Intersections::*

Want me to adjust anything?
```

---

## Error Handling

The skill never stops the pipeline for a single failure. Each phase reports
what succeeded, what failed, and what was skipped.

| Failure | Recovery |
|---------|----------|
| Curve too angular | Warn, skip road, suggest manual alignment |
| `rc_road_3d` fails | Mark road as failed, continue |
| Edge offset fails | Mark road as accessory-ineligible, continue |
| Intersection empty | Report "no crossing found", skip pair |
| Sidewalk/guardrail fails | Report, continue with next |
| Terrain not available | Skip slopes + longitudinal profile |
| Profile build fails | Report errors, ask user to adjust |

---

## What This Skill Does NOT Do

- **Full civil alignment** — no tangent polygons, transitions, or vertical
  curves. This is masterplan-level design using smooth curves directly.
- **Roundabouts** — complex multi-arm workflow, deferred.
- **New endpoints** — this skill calls existing MCP tools only.
- **Grasshopper** — this runs in Claude Code, not GH.

For single-road civil design with full alignment control, use `/design-road`
instead.
