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
result = rhino_create(
    type="RECTANGLE",
    origin=[0, 0, 0],
    width=base_width,
    height=base_height,
)
base_profile_id = result["id"]
rhino_geometry(id=base_profile_id)
```

**Note:** Rectangle is created on XY plane at Z=0.

### Step 2: Copy Profiles to Heights

Copy the base profile to each height level. For 5 profiles over 40 units:
- Heights: 0, 10, 20, 30, 40

```python
# Copy base profile to each height
profile_ids = [base_profile_id]
for i in range(1, num_profiles):
    z_offset = (column_height / (num_profiles - 1)) * i
    copy_result = rhino_copy(
        ids=[base_profile_id],
        offset=[0, 0, z_offset],
    )
    if copy_result.get("copiedCount") != 1:
        raise Exception("profile copy did not return exactly one object")
    profile_ids.append(copy_result["copies"][0]["newId"])
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
    centroid_result = rhino_measure_centroid(id=profile_id)
    rhino_transform(
        ids=[profile_id],
        operation="rotate",
        angle=angle,
        axis=[0, 0, 1],
        center=centroid_result["centroid"],
    )
```

### Step 4: Loft Through Profiles

Loft the explicit profile IDs to create the twisted surface.

```python
loft = rhino_create_loft(curveIds=profile_ids, loftType="Normal")
loft_id = loft["objects"][0]["id"]
rhino_geometry(id=loft_id)
```

**Gotcha:** Loft creates an OPEN surface, not a solid. See Step 5.

### Step 5: Cap the Loft

Cap the open ends to create a closed solid.

```python
rhino_execute(code=f"""
import System
import Rhino
doc = Rhino.RhinoDoc.ActiveDoc
obj = doc.Objects.FindId(System.Guid('{loft_id}'))
if obj is None:
    raise Exception('loft object not found')
capped = obj.Geometry.CapPlanarHoles(doc.ModelAbsoluteTolerance)
if capped is None:
    raise Exception('planar cap failed')
if not doc.Objects.Replace(obj.Id, capped):
    raise Exception('failed to replace loft with capped brep')
doc.Views.Redraw()
""")
rhino_geometry(id=loft_id)
```

**Note:** Cap modifies the object in place. `objects_created=0` is normal.

### Step 6 (Optional): Hollow the Column

To create a hollow shell, use boolean difference with a scaled inner copy.

**Critical Discovery:** Boolean difference fails when cutter is fully contained inside target. The cutter must extend through at least one surface.

```python
# Copy the solid column
copy_result = rhino_copy(ids=[loft_id], offset=[0, 0, 0])
if copy_result.get("copiedCount") != 1:
    raise Exception("inner-solid copy did not return exactly one object")
inner_id = copy_result["copies"][0]["newId"]

# Scale smaller in XY but LARGER in Z (extends through top/bottom)
# This ensures boolean intersection
rhino_execute(code=f"""
import rhinoscriptsyntax as rs
center = rs.SurfaceVolumeCentroid('{inner_id}')[0]
rs.ScaleObject('{inner_id}', center, (0.7, 0.7, 1.3))
""")

# Boolean difference to hollow, then verify the returned result object
hollow = rhino_boolean(
    operation="difference",
    targetId=loft_id,
    toolIds=[inner_id],
    deleteInputs=True,
)
hollow_ids = hollow.get("resultIds", [])
if not hollow_ids:
    raise Exception("boolean difference returned no result solids")
hollow_id = hollow_ids[0]
rhino_geometry(id=hollow_id)
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
base = rhino_create(type="RECTANGLE", origin=[0,0,0], width=10, height=10)
base_id = base["id"]

# Step 2: Copy to heights
heights = [10, 20, 30, 40]
profile_ids = [base_id]
for h in heights:
    copy_result = rhino_copy(ids=[base_id], offset=[0, 0, h])
    if copy_result.get("copiedCount") != 1:
        raise Exception("profile copy did not return exactly one object")
    profile_ids.append(copy_result["copies"][0]["newId"])

# Step 3: Rotate profiles (15° increments for 60° total over 4 steps)
for i, pid in enumerate(profile_ids[1:], 1):
    angle = 15 * i
    centroid_result = rhino_measure_centroid(id=pid)
    rhino_transform(
        ids=[pid],
        operation="rotate",
        angle=angle,
        axis=[0,0,1],
        center=centroid_result["centroid"],
    )

# Step 4: Loft
loft = rhino_create_loft(curveIds=profile_ids, loftType="Normal")
loft_id = loft["objects"][0]["id"]

# Step 5: Cap
rhino_execute(code=f"""
import System
import Rhino
doc = Rhino.RhinoDoc.ActiveDoc
obj = doc.Objects.FindId(System.Guid('{loft_id}'))
capped = obj.Geometry.CapPlanarHoles(doc.ModelAbsoluteTolerance)
if capped is None or not doc.Objects.Replace(obj.Id, capped):
    raise Exception('failed to cap loft')
doc.Views.Redraw()
""")
rhino_geometry(id=loft_id)
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
