# Hollowing Gotchas

Critical knowledge for creating hollow shells using boolean operations.

## The Problem

Boolean difference fails silently when the cutter (inner solid) is **fully contained** inside the target (outer solid).

```
FAILS:
┌─────────────┐
│  ┌───────┐  │
│  │ inner │  │  ← Inner fully contained
│  └───────┘  │
└─────────────┘

WORKS:
┌─────────────┐
│  ┌───────┼──┤
│  │ inner │  │  ← Inner extends through surface
│  └───────┼──┤
└─────────────┘
```

## Why It Fails

Boolean difference requires surface-to-surface intersection. When the cutter is fully contained, there's no intersection line for the algorithm to work with.

## The Solution

Scale the inner solid so it extends through at least one surface of the outer solid.

### Non-Uniform Scaling

For vertical extrusions (like columns), scale:
- **XY smaller** (0.7 = 70% of original) - creates wall thickness
- **Z larger** (1.3 = 130% of original) - extends through top/bottom

```python
import rhinoscriptsyntax as rs

# Get centroid for scaling
center = rs.SurfaceVolumeCentroid(inner_id)[0]

# Scale: 70% in XY, 130% in Z
rs.ScaleObject(inner_id, center, (0.7, 0.7, 1.3))
```

### Via rhino_execute

```python
rhino_execute(code=f"""
import rhinoscriptsyntax as rs
center = rs.SurfaceVolumeCentroid('{inner_id}')[0]
rs.ScaleObject('{inner_id}', center, (0.7, 0.7, 1.3))
""")
```

## Wall Thickness Calculation

The wall thickness is determined by the XY scale factor:

| Scale | Wall Thickness (for 10 unit width) |
|-------|-----------------------------------|
| 0.9 | 0.5 units |
| 0.8 | 1.0 units |
| 0.7 | 1.5 units |
| 0.6 | 2.0 units |

Formula: `wall_thickness = (original_width / 2) * (1 - scale_factor)`

## Alternative: Offset Surface

For more complex shapes, consider using `_OffsetSrf` instead:

```python
rhino_execute_intent(intent="offset surface inward by 1.5 units")
```

This creates a true offset but may fail on tight corners.

## Verification

After boolean difference, verify the result:

```python
# Check volume decreased (hollow should have less volume)
original_volume = rhino_measure_volume(id=outer_id)
result_volume = rhino_measure_volume(id=result_id)

if result_volume < original_volume:
    print("Successfully hollowed!")
else:
    print("Boolean may have failed - volumes equal")
```

## Query Knowledge System

For the latest boolean gotchas:

```python
knowledge_query(intent="boolean difference", depth="errors")
```
