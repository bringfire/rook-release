# Signature Design Guide

How to write effective Chirp component signatures and pin definitions.

## Pin Type Reference

Supported input/output types and how they serialize:

| Chirp Type | C# Type | JSON Wire | LLM Sees | Use For |
|------------|---------|-----------|----------|---------|
| `string`   | string  | string    | The text | Design intent, descriptions, reasoning |
| `int`      | int     | number    | Integer  | Counts, indices, modes |
| `float`    | double  | number    | Decimal  | Ratios, dimensions, angles |
| `bool`     | bool    | boolean   | true/false | Toggles, pass/fail |

Geometry types (`Point3d`, `Curve`, `Brep`, etc.) are supported as pins but serialize
as `.ToString()` -- the LLM gets the type name, not useful geometry data. For geometry
context, extract properties with traditional GH components and pass as numbers/strings.

## Signature Syntax

```
"field_a, field_b -> output_x, output_y, output_z"
```

- Left of `->`: input field names (snake_case of pin names)
- Right of `->`: output field names (snake_case of pin names)
- Field names ARE the prompt -- they carry semantic meaning to the LLM
- The Reasoning output is auto-added; do not include it in the signature

## Field Naming Principles

Field names are the primary way the LLM understands what to produce. Choose names
that convey design intent, not just data type.

**Good names** (convey intent):
```
beam_depth         -- LLM knows this is a structural dimension
glazing_ratio      -- LLM knows this is a proportion of glass
design_language    -- LLM knows this describes an aesthetic
massing_rationale  -- LLM knows to explain massing decisions
```

**Weak names** (ambiguous):
```
depth              -- depth of what?
ratio              -- ratio of what to what?
text               -- what kind of text?
value              -- meaningless
```

## Reasoning as Input

When a downstream component receives upstream Reasoning, name the input pin
to convey what domain the reasoning comes from:

```
PlannerReasoning:string     -- generic but clear
MassingRationale:string     -- more specific, better LLM interpretation
StructuralLogic:string      -- tells LLM to focus on structural aspects
ClimateAnalysis:string      -- tells LLM the reasoning is about climate
```

The more specific the name, the better the downstream LLM interprets the reasoning
through the right domain lens.

## Common Signature Patterns

**Intent-to-parameters (most common):**
```
"design_brief -> ceiling_height, bay_spacing, glazing_ratio"
```

**Reasoning-informed domain interpretation:**
```
"planner_reasoning, span -> beam_depth, column_diameter, system_type"
```

**Multi-context decision:**
```
"design_intent, orientation, climate_zone -> shading_depth, louver_angle, glazing_tint"
```

**Critic/evaluator:**
```
"planner_reasoning, structure_reasoning, envelope_reasoning -> coherent, issues, suggestions"
```

## Sizing Guidelines

- **Inputs**: 2-4 per component. More than 4 dilutes the LLM's focus.
- **Outputs**: 3-6 per component. More than 6 means the component is doing too much -- split it.
- **Signature length**: Keep under ~20 fields total. Long signatures produce less focused reasoning.
- **Reasoning input**: Counts as 1 input but carries rich context. Don't also duplicate upstream outputs as separate inputs unless the Reasoning alone is insufficient.
