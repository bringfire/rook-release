# Czech Road Standards Reference

Quick reference for road categories, crossfall, and lane widening used by RoadCreator.
Use `rc_standards()` MCP tool for the authoritative list at runtime.

---

## Road Categories (ČSN 73 6101)

### Undivided Roads
| Category | Half-Width (m) | Category Width (m) | Typical Use |
|----------|----------------|---------------------|-------------|
| **S 6.5** | 2.75 | 6.5 | Minor local road |
| **S 7.5** | 3.25 | 7.5 | Standard two-lane ← **most common** |
| **S 9.5** | 4.25 | 9.5 | Wide two-lane |
| **S 11.5** | 5.25 | 11.5 | Four-lane undivided |

Note: Category width (e.g., "7.5" in S 7.5) is the design carriageway width including
margins/shoulders. Half-width (3.25m) is the lane width from centerline used by
`rc_cross_section` for profile computation. `2 × half_width` gives paved lane width only.

### Divided Roads (with median)
| Category | Half-Width (m) | Median (m) | Total Width (m) | Typical Use |
|----------|----------------|------------|------------------|-------------|
| **S 20.75** | 10.25 | 1.25 (narrow) | 20.75 | Divided highway |
| **S 24.5** | 10.75 | 3.00 | 24.50 | Wide divided highway |

### Motorways
| Category | Half-Width (m) | Median (m) | Total Width (m) | Typical Use |
|----------|----------------|------------|------------------|-------------|
| **D 25.5** | 11.25 | 3.00 | 25.50 | Standard motorway |
| **D 27.5** | 12.00 | 3.50 | 27.50 | Wide motorway |
| **D 33.5** | 15.00 | 3.50 | 33.50 | Multi-lane motorway |
| **D 4/8** | 8.00 | 4.00 | varies | Special motorway |

### MCP Tool Category Codes
Use these exact strings with `rc_road_3d` and `rc_cross_section` — must match `RoadCategory.Code` exactly (space + dots):
```
"S 6.5", "S 7.5", "S 9.5", "S 11.5", "S 20.75", "S 24.5", "D 25.5", "D 27.5", "D 33.5", "D 4/8"
```
Always call `rc_standards()` at runtime to confirm — codes are case-insensitive but format-sensitive.

---

## Crossfall (Banking)

Cross-section tilt for drainage and safety.

| Section Type | Default | Range | Direction |
|-------------|---------|-------|-----------|
| **Straight** | 2.5% | 2.0–4.0% | Roof profile (slopes both sides from center) |
| **Full curve** | 4.0% | 4.0–20.0% | One-sided superelevation (banked) |
| **Transition (LM/PM)** | blended | — | Linear blend between straight and curve values |

**Blend formula:**
```
M = 1 - |direction|
Z_edge = ((M × (-p) + pmax × direction) / 100) × (half_width + widening)
```

Where:
- `direction` = 0 (straight), +1 (right curve), -1 (left curve)
- `p` = straight crossfall (%)
- `pmax` = curve crossfall (%)

**Typical values for rc_road_3d:**
```python
rc_road_3d(
    road="Road_1",
    category="S 7.5",
    crossfallStraight=2.5,  # standard drainage slope
    crossfallCurve=4.0,     # standard superelevation
)
```

---

## Lane Widening (Curve Radius)

Extra width added to lanes in curves for vehicle swept path.

| Radius Range | Widening (m) |
|-------------|-------------|
| ≥ 250 m | 0.00 |
| 200–249 m | 0.20 |
| 170–199 m | 0.25 |
| 141–169 m | 0.30 |
| 125–140 m | 0.35 |
| 110–124 m | 0.40 |
| < 110 m | 0.50 |

**Category corrections:**
- S 6.5: add +0.30 m to widening
- S 7.5: add +0.05 m to widening

**Example:** R=150m curve on S 7.5 → base widening 0.30 + category correction 0.05 = 0.35m per side.

---

## Verge (Shoulder)

Optional shoulder strip added outside the road edge.

- **Slope:** 8% outward (steeper than road surface)
- **Width:** depends on equipment:
  - Guardrail: ~1.5m
  - Road poles: ~1.0m
  - No equipment: ~0.5m

```python
rc_road_3d(
    road="Road_1",
    category="S 7.5",
    crossfallStraight=2.5,
    crossfallCurve=4.0,
    includeVerge=True  # adds shoulder strip
)
```

---

## Slope Ratios (Earthworks)

| Type | Default Ratio | Description |
|------|---------------|-------------|
| **Fill (embankment)** | 1:1.75 | Road above terrain |
| **Cut** | 1:1.75 | Road below terrain |
| **Ditch depth** | 0.4 m | Drainage channel |
| **Ditch width** | 0.5 m | Drainage channel |

---

## Quick Decision Guide

| User Says | Recommended Category | Crossfall | Notes |
|-----------|---------------------|-----------|-------|
| "a road" / "basic road" | S 7.5 | 2.5/4.0 | Safe default |
| "narrow road" / "path" | S 6.5 | 2.5/4.0 | Minimum standard |
| "wide road" / "four lane" | S 11.5 | 2.5/4.0 | Undivided four-lane |
| "highway" / "divided" | S 24.5 | 2.5/4.0 | With median |
| "motorway" / "freeway" | D 25.5 | 2.5/4.0 | Standard motorway |
| "urban" / "city street" | S 7.5 + sidewalk | 2.5/4.0 | Add RC_Sidewalk |
| "mountain road" | S 7.5, tight curves | 2.5/6.0 | Higher superelevation |
