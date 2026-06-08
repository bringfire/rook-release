# RC Tools Reference — MCP Tools & Scripted Commands

Two ways to drive RoadCreator:
1. **MCP tools** (`rc_*`) — pure computation, return data (no document changes)
2. **Scripted commands** (`rhino_command("RC_*")`) — execute in Rhino, create/modify geometry

Use MCP tools when you need to compute something (clothoid math, cross-section profile).
Use scripted commands when you need to create geometry in the document.

---

## MCP Tools (via RookRoads)

### System
| Tool | Purpose |
|------|---------|
| `rc_ping()` | Health check — RookRoads loaded? |
| `rc_standards()` | List all road categories with dimensions |
| `rc_roads()` | List roads in current document |

### Computation (pure math, no document changes)
| Tool | Purpose | Key Inputs | Returns |
|------|---------|------------|---------|
| `rc_clothoid(L, R)` | Euler spiral transition points | L=transition length, R=radius | points[], largeTangent, shift, xs |
| `rc_cubic_parabola(L, R)` | Cubic parabola transition | L (must be < 2R), R | points[], largeTangent, shift, xs |
| `rc_vertical_curve(R, grade1, grade2, vertexChainage, vertexElevation)` | Parabolic grade curve | R=radius, grades in % |
| `rc_assemble_route(horizontalPoints, elevations)` | Merge H+V into 3D points | Point arrays |
| `rc_cross_section(category, crossfallStraight, crossfallCurve, curveDirection, ...)` | Profile in local space | Category code, crossfall % |

### Document Operations (create geometry in Rhino)
| Tool | Purpose | Key Inputs |
|------|---------|------------|
| `rc_road_3d(road, category, crossfallStraight, crossfallCurve, includeVerge)` | Generate 3D road surface | Road name, category code |
| `rc_extract_offsets(centerlineId, curveIds)` | Measure perpendicular offsets at midpoint | GUIDs (note: evaluates at arc-length midpoint only, not multi-station) |

### Intersection (via RookNative C++)
| Tool | Purpose | Key Inputs |
|------|---------|------------|
| `road_intersection_candidates(...)` | Find intersection points | Two centerline curves |
| `road_intersection_resolve(...)` | Realize intersection geometry | Selected candidate |

---

## Scripted Commands (via rhino_command)

All RC_* commands support `RunMode.Scripted`. Drive them via `rhino_command` with underscore prefixes for language-independent mode.

### Pattern
```python
# Simple command with Enter to accept defaults
rhino_command(command="_-RC_CommandName _Enter")

# Command with parameters
rhino_command(command="_-RC_Clothoid 70 150 _Enter")

# Pre-select objects, then run command
rhino_select(ids=["guid1", "guid2"])
rhino_command(command="_-RC_Clothoid 70 150 _Enter")
```

### Alignment Commands
```python
# Create tangent polygon from clicked points (interactive — user must click)
rhino_command(command="_-RC_TangentPolygon")

# Insert clothoid between two tangent segments
# First pre-select the two segments:
rhino_select(ids=[segment1_guid, segment2_guid])
rhino_command(command="_-RC_Clothoid 70 150 _Enter")
# Parameters: L (transition length), R (radius)

# Insert cubic parabola
rhino_select(ids=[segment1_guid, segment2_guid])
rhino_command(command="_-RC_CubicParabola 60 200 _Enter")

# Create elevation polygon (interactive)
rhino_command(command="_-RC_ElevationPolygon")

# Insert parabolic vertical curve
rhino_select(ids=[grade1_guid, grade2_guid])
rhino_command(command="_-RC_ParabolicCurve 2000 _Enter")

# Assemble 3D route (auto-detects from layers)
rhino_command(command="_-RC_Assemble3DRoute _Enter")
```

### Road Surface Commands
```python
# Generate full 3D road (prefer rc_road_3d MCP tool instead)
rhino_command(command="_-RC_Road3D _Enter")

# Generate road section (subset of route)
rhino_command(command="_-RC_Road3DSection _Enter")
```

### Terrain Commands
```python
# Longitudinal profile (needs terrain surface)
rhino_command(command="_-RC_LongitudinalProfile _Enter")

# Contour lines from terrain
rhino_command(command="_-RC_ContourLines _Enter")

# Earthwork slopes — requires pre-selection of terrain + both boundary curves
rhino_select(ids=[terrain_guid, left_boundary_guid, right_boundary_guid])
rhino_command(command="_-RC_Slopes _Enter")

# Export longitudinal profile to Excel
rhino_command(command="_-RC_LongitudinalProfileExport _Enter")
```

### Accessory Commands
```python
# Guardrails
rhino_select(ids=[boundary_curve_guid])
rhino_command(command="_-RC_GuardrailSingle _Enter")

rhino_select(ids=[centerline_guid])
rhino_command(command="_-RC_GuardrailDouble _Enter")

# Barriers
rhino_select(ids=[guide_curve_guid])
rhino_command(command="_-RC_ConcreteBarrier _Enter")

rhino_select(ids=[guide_curve_guid])
rhino_command(command="_-RC_DeltaBlokBarrier _Enter")

# Delineator poles
rhino_select(ids=[edge_curve_guid])
rhino_command(command="_-RC_RoadPolesSingle _Enter")

# Both sides (two edge curves)
rhino_select(ids=[left_edge_guid, right_edge_guid])
rhino_command(command="_-RC_RoadPolesDouble _Enter")

# Sidewalk
rhino_select(ids=[edge_curve_guid])
rhino_command(command="_-RC_Sidewalk _Enter")

# Pedestrian crossing — RC_CrossingArea splits road surface FIRST, then RC_ZebraCrossing adds stripes
rhino_command(command="_-RC_CrossingArea _Enter")
rhino_command(command="_-RC_ZebraCrossing _Enter")

# Roundabout / Intersection
rhino_command(command="_-RC_Roundabout _Enter")
rhino_command(command="_-RC_SimpleIntersection _Enter")

# Forest / trees along road edge
rhino_command(command="_-RC_ForestSilhouette _Enter")
rhino_command(command="_-RC_ForestSilhouetteCurve _Enter")  # Along arbitrary curve
rhino_command(command="_-RC_Forest _Enter")                  # Grid-based placement

# Utility poles
rhino_select(ids=[guide_curve_guid])
rhino_command(command="_-RC_UtilityPoles _Enter")

# Copy objects along curve (generic)
rhino_command(command="_-RC_CopyAlongCurve _Enter")

# Verge as standalone surface
rhino_command(command="_-RC_Verge _Enter")

# Junction connecting side road to main road
rhino_command(command="_-RC_Junction _Enter")
```

### Footprint / Markings Commands
```python
# Store a cross-section profile (JSON on one line)
rhino_command(command='_-RC_StoreProfile {"name":"standard","baseline":"centerline","features":[...]}')

# Store a style set
rhino_command(command='_-RC_StoreStyleSet {"name":"default","entries":[...]}')

# Generate 2D footprint from stored profile
rhino_command(command="_-RC_RoadFootprint _Enter")
```

---

## When to Use Which

| Situation | Use | Why |
|-----------|-----|-----|
| Need clothoid/parabola math | `rc_clothoid`, `rc_vertical_curve` | Pure computation, inspect results first |
| Need cross-section dimensions | `rc_cross_section` | Returns profile points for analysis |
| Create road surface | `rc_road_3d` | MCP tool, direct document operation |
| Create tangent polygon | `rhino_command("_-RC_TangentPolygon")` | No MCP equivalent |
| Insert transitions | Pre-select + `rhino_command("_-RC_Clothoid ...")` | Needs geometry selection |
| Assemble 3D route | `rhino_command("_-RC_Assemble3DRoute")` | Auto-detects from layers |
| Add accessories | Pre-select + `rhino_command("_-RC_*")` | All scripted commands |
| Compute offsets | `rc_extract_offsets` | Analysis tool |
| Check available roads | `rc_roads()` | Query tool |

---

## Gotchas

1. **Layer names are sacred** — RC commands expect `RoadCreator::Road_N::*`. Don't rename layers.
2. **Phase order matters** — Tangent Polygon → Transitions → Grade Line → Vertical Curves → Assemble → Road3D. Skipping phases causes failures.
3. **Pre-selection required** — Many scripted commands need objects pre-selected. Use `rhino_select(ids=[...])` before `rhino_command`.
4. **10:1 vertical exaggeration** — Profile space Y = elevation × 10. This is a Czech road design convention.
5. **Stationing layers are locked** — RC locks stationing/legend layers after creation. Unlock before modifying.
6. **RC_Assemble3DRoute auto-detects** — Reads from Tangent Polygon and Grade Line layers. Ensure both are populated.
7. **rc_road_3d needs the 3D route** — Run Phase 3 first. The tool reads the route from the document.
8. **Category codes** — Use `rc_standards()` to get valid codes. Common: `"S 7.5"`, `"S 9.5"`, `"S 11.5"`, `"D 25.5"`. Format matters — spaces and dots required.
