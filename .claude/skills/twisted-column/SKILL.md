---
name: twisted-column
description: |
  Creates parametric twisted architectural columns in Rhino by lofting through
  rotated profile curves. Use when user mentions: twisted columns, spiraling
  structures, rotated profile lofts, helical forms, or architectural columns
  with twist. Can optionally hollow the column to create a shell.
---

# Twisted Column Workflow

Create dramatic twisted architectural forms by lofting through incrementally rotated profiles.

## Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `base_width` | Width of rectangular profile | 10 |
| `base_height` | Height of rectangular profile | 10 |
| `column_height` | Total height of column | 40 |
| `num_profiles` | Number of profile curves | 5 |
| `total_twist` | Total rotation in degrees | 60 |
| `hollow` | Create hollow shell | false |
| `wall_thickness` | Shell wall thickness (if hollow) | 0.3 (as scale factor) |

## Workflow Steps

### Step 1: Create Base Profile

Create the first rectangular profile at the origin.

```python
rhino_execute_intent(intent=f"create rectangle at 0,0,0 width {base_width} height {base_height}")
```

**Note:** Rectangle is created on XY plane at Z=0.

### Step 2: Copy Profiles to Heights

Copy the base profile to each height level. For 5 profiles over 40 units:
- Heights: 0, 10, 20, 30, 40

```python
# Copy base profile to each height
for i in range(1, num_profiles):
    z_offset = (column_height / (num_profiles - 1)) * i
    rhino_copy(ids=[base_profile_id], offset=[0, 0, z_offset])
```

### Step 3: Rotate Each Profile

Rotate each profile incrementally around the Z-axis at its center.

```python
# Rotation per level
twist_per_level = total_twist / (num_profiles - 1)

# Rotate each profile (skip first at 0°)
for i, profile_id in enumerate(profile_ids):
    if i == 0:
        continue  # Base profile stays at 0°
    angle = twist_per_level * i
    # Get profile center for rotation
    centroid = rhino_measure_centroid(id=profile_id)
    rhino_transform(
        ids=[profile_id],
        operation="rotate",
        angle=angle,
        axis=[0, 0, 1],
        center=centroid["point"]
    )
```

### Step 4: Loft Through Profiles

Select all profiles and loft to create the twisted surface.

```python
# Select all profile curves
rhino_select(ids=all_profile_ids)

# Loft through selected curves
rhino_execute_intent(intent="loft through selected curves")
```

**Gotcha:** Loft creates an OPEN surface, not a solid. See Step 5.

### Step 5: Cap the Loft

Cap the open ends to create a closed solid.

```python
rhino_execute_intent(intent="cap the selected surface")
```

**Note:** Cap modifies the object in place. `objects_created=0` is normal.

### Step 6 (Optional): Hollow the Column

To create a hollow shell, use boolean difference with a scaled inner copy.

**Critical Discovery:** Boolean difference fails when cutter is fully contained inside target. The cutter must extend through at least one surface.

```python
# Copy the solid column
inner_id = rhino_copy(ids=[column_id], offset=[0, 0, 0])

# Scale smaller in XY but LARGER in Z (extends through top/bottom)
# This ensures boolean intersection
rhino_execute(code=f"""
import rhinoscriptsyntax as rs
center = rs.SurfaceVolumeCentroid('{inner_id}')[0]
rs.ScaleObject('{inner_id}', center, (0.7, 0.7, 1.3))
""")

# Boolean difference to hollow
rhino_execute_intent(intent="boolean difference between outer and inner solids")
```

See [hollowing-gotchas.md](./references/hollowing-gotchas.md) for details.

## Complete Example

For a column with:
- 10x10 base profile
- 40 unit height
- 5 profiles
- 60° total twist

```python
# Step 1: Base profile
rhino_execute_intent(intent="create rectangle at 0,0,0 width 10 height 10")
base_id = get_last_created_id()

# Step 2: Copy to heights
heights = [10, 20, 30, 40]
profile_ids = [base_id]
for h in heights:
    result = rhino_copy(ids=[base_id], offset=[0, 0, h])
    profile_ids.append(result["ids"][0])

# Step 3: Rotate profiles (15° increments for 60° total over 4 steps)
for i, pid in enumerate(profile_ids[1:], 1):
    angle = 15 * i
    centroid = rhino_measure_centroid(id=pid)
    rhino_transform(ids=[pid], operation="rotate", angle=angle, axis=[0,0,1], center=centroid["point"])

# Step 4: Loft
rhino_select(ids=profile_ids)
rhino_execute_intent(intent="loft through selected curves")
loft_id = get_last_created_id()

# Step 5: Cap
rhino_select(ids=[loft_id])
rhino_execute_intent(intent="cap selected surface")
```

## Variations

### More Dramatic Twist
Increase `total_twist` to 90°, 180°, or beyond. Loft handles extreme rotations gracefully.

### Tapered Column
Scale each profile progressively smaller as height increases before lofting.

### Non-Rectangular Profiles
Use circles, polygons, or any closed curve for different effects.

## Gotchas Summary

1. **Loft creates OPEN surface** - Always cap after lofting to create solid
2. **Cap returns objectsCreated=0** - This is normal; it modifies in place
3. **Boolean difference fails with contained cutter** - Cutter must extend through target
4. **Profile order doesn't matter** - Loft auto-orders by position
5. **Rotation center matters** - Rotate around profile centroid, not origin

## References

- [hollowing-gotchas.md](./references/hollowing-gotchas.md) - Boolean operation details
- [knowledge-integration.md](../_template/references/knowledge-integration.md) - Using the knowledge system
