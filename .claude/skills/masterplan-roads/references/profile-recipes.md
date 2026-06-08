# Profile Recipes for Road Types

Standard profile recipes for `/masterplan-roads`. Each recipe is passed to
`rc_build_profile` (Mode B — semantic recipe) and then stored with
`rc_store_road_profile`.

## Collector Road (urban)

```json
{
  "name": "collector_urban",
  "laneWidth": 4.75,
  "lanesPerDirection": 1,
  "curb": { "height": 0.2, "topWidth": 0.3 },
  "sidewalk": { "width": 3.0 },
  "guardrail": true
}
```

Profile produces: centerline, edge_of_pavement at ±4.75m, curb_face at
±5.05m, sidewalk_outer at ±8.05m, carriageway pavement surface, sidewalk
surfaces, curb elements, guardrail elements.

## Local Street (urban)

```json
{
  "name": "local_urban",
  "laneWidth": 3.75,
  "lanesPerDirection": 1,
  "curb": { "height": 0.2, "topWidth": 0.3 },
  "sidewalk": { "width": 2.0 }
}
```

Profile produces: centerline, edge_of_pavement at ±3.75m, curb_face at
±4.05m, sidewalk_outer at ±6.05m, carriageway pavement surface, sidewalk
surfaces, curb elements.

## Cul-de-sac

```json
{
  "name": "cul_de_sac",
  "laneWidth": 3.25,
  "lanesPerDirection": 1
}
```

Minimal profile: centerline, edge_of_pavement at ±3.25m, carriageway
pavement surface only. No curb, sidewalk, or accessories.

## Multi-lane Collector

```json
{
  "name": "collector_multi_lane",
  "laneWidth": 3.75,
  "lanesPerDirection": 2,
  "curb": { "height": 0.2, "topWidth": 0.3 },
  "sidewalk": { "width": 3.0 },
  "guardrail": { "postSpacing": 4.0 }
}
```

Edge of pavement at ±7.5m (3.75 × 2 lanes).

## Boulevard with Shoulder

```json
{
  "name": "boulevard_shoulder",
  "laneWidth": 3.75,
  "lanesPerDirection": 1,
  "shoulder": { "width": 2.0 },
  "guardrail": true
}
```

No curb or sidewalk — rural-style with paved shoulder.

## Adjusting Recipes

The user can ask to change any parameter. Common adjustments:

- **Wider lanes:** increase `laneWidth` (e.g., 5.0m for truck routes)
- **Add sidewalk to cul-de-sac:** add `curb` and `sidewalk` fields
- **Remove guardrails from collector:** omit `guardrail` field
- **Custom crossfall:** after building, store with `crossSectionDefaults`
  overrides in the profile JSON

## Using Built Profiles

After `rc_build_profile` returns a profile, store it:

```python
result = rc_build_profile(name="collector_urban", laneWidth=4.75, ...)
# result.data.profile contains the full RoadProfileDefinition
rc_store_road_profile(profile=result["profile"])
```

Then reference by name in all downstream calls:
- `rc_road_3d(road="Road_1", profileName="collector_urban")`
- `rc_get_road_profile(name="collector_urban")` to read edge offsets
- `rc_project_offset_profile(name="collector_urban")` for 2D footprint
- `road_intersection_resolve(..., profileA="collector_urban", ...)`
