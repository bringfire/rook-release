---
name: design-grasshopper
description: |
  Collaborative Grasshopper definition design through exploration, Q&A, and
  incremental validation. Use when the user wants to build a GH definition,
  parametric model, or visual programming workflow. Triggers on: "design
  grasshopper", "create GH definition", "build parametric", "grasshopper
  workflow", or any request for a multi-component Grasshopper definition.
  Produces a design document that feeds into plan-grasshopper.
argument-hint: "<description of what to build>"
---

# Design Grasshopper Definition

Co-design a Grasshopper definition through natural collaborative dialogue, grounded in Rook's knowledge store and the project's actual state.

Start by exploring what exists (knowledge store, canvas state, Rhino scene), then ask questions one at a time to refine the idea. Once the design is clear, present it in small sections, checking after each section whether it looks right. Write the validated design to a plan file.

## The Process

### 1. Explore — Project Context

Before asking the user anything, gather context silently using MCP tools.

**Knowledge store (always query for each major concept):**
```python
gh_knowledge_query(intent="<concept from user request>", depth="context")
```
Run this for each distinct concept in the user's request (e.g., if they want "a spiral staircase with adjustable radius", query for spiral/helix patterns, staircase patterns, and radius-controlled geometry separately).

**Follow related concepts:** When a knowledge result mentions related components or patterns, query for those too — A-MEM semantic neighbors typically go together and surface relevant primitives you'd otherwise miss.

**Component structure (always query once):**
```python
gh_structure_query()  # Families, similar pairs, shared behaviors, I/O patterns
```
Use this to:
- Find **alternative components** via similar pairs (e.g., Pipe ↔ Sweep1)
- Check **shared behaviors** — gotchas that apply across an entire family
- Identify **I/O patterns** — common wiring conventions for the component type
- Look up a specific component's family: `gh_structure_query(guid="<guid>")`

**Canvas state:**
```python
gh_snapshot()  # What's already on the canvas?
```

**Rhino scene (if the definition references existing geometry):**
```python
rhino_objects()  # Or scene graph query for spatial context
```

**Component library (if specific plugins or unusual components are needed):**
```python
gh_library(search="<component name>")
```

**Present findings as a brief summary:**
```
Project context:
- Knowledge store has 3 relevant notes: Helix pattern, Point Sequence, Sweep
- Canvas is empty (fresh document)
- Rhino scene has 2 curves on "Rails" layer
- Gotcha: Sweep1 requires open curves, fails silently on closed curves
```

### 2. Ask Clarifying Questions

Based on exploration findings, ask the user **one question at a time**.

**Question triggers:**
- Parametric ranges (what should be adjustable? what ranges?)
- Output type (baked geometry? live preview? data output?)
- Domain constraints (structural, aesthetic, fabrication requirements)
- Data tree structure (single item? list? tree branches?)
- Missing information the knowledge store couldn't resolve

**Prefer multiple-choice when possible:**
```
The knowledge store shows two approaches for spiral geometry:
(a) Helix component + Sweep — cleaner, single component chain
(b) Trigonometric expressions + Interpolate Curve — more control over shape
(c) Divide Curve + Rotate — works with existing rail curves

Which approach fits your needs?
```

**Continue until no remaining ambiguities.** Two questions is fine for simple definitions. Ten is fine for complex ones.

### 3. Explore Approaches

Propose 2-3 different approaches with trade-offs. Lead with the recommended option and explain why.

```
Approach A (recommended): Helix + Pipe + Array
- Uses native Helix component (known GUID, well-tested)
- Pipe for the rail geometry, Array for step placement
- Knowledge store confirms: Pipe gotcha — Cap must be "Flat" not "Round" for steps

Approach B: Expression-based spiral
- Full control via math expressions
- More complex, harder to adjust parameters
- No knowledge store coverage (untested pattern)
```

### 4. Present the Design

Present in sections of 200-300 words. Ask after each section whether it looks right.

**Section order:**
1. **Components** — each GH component needed, with GUID or knowledge note reference
2. **Inputs** — Number Sliders, Panels, Boolean Toggles with name, default, min, max
3. **Wiring** — connections between components (source.param → target.param)
4. **Constraints** — gotchas from knowledge store, data tree considerations, domain rules
5. **Layout** — logical grouping on canvas (input group, processing group, output group)
6. **Success Criteria** — what the user should see when the definition works correctly

After each section, ask: "Does this section look right, or should I adjust anything?"

Be ready to go back and revise earlier sections based on later feedback.

### 5. Write the Design Document

Once all sections are validated, write the design to:
```
docs/plans/YYYY-MM-DD-<name>-design.md
```

**Document structure:**
```markdown
# <Definition Name> Design

> **For Claude:** Use /plan-grasshopper to create the implementation plan for this design.

**Goal:** [One sentence]
**Approach:** [Which approach was chosen]

## Components
| # | Component | GUID / Knowledge Note | Purpose |
|---|-----------|----------------------|---------|
| 1 | Sphere | {...} | Main geometry |
| 2 | Number Slider | {...} | Radius control |

## Inputs
| Name | Type | Default | Min | Max | Purpose |
|------|------|---------|-----|-----|---------|
| Radius | Slider | 5.0 | 0.1 | 50.0 | Sphere radius |

## Wiring
| From (component.param) | To (component.param) | Notes |
|------------------------|---------------------|-------|
| Slider.output | Sphere.R | Radius input |

## Constraints
- [Gotchas from knowledge store]
- [Data tree considerations]
- [Domain-specific rules]

## Layout
- **Input Group (x=100):** Sliders and panels
- **Processing Group (x=400):** Core components
- **Output Group (x=700):** Final geometry / bake targets

## Success Criteria
- [What the user should see when it works]

## Knowledge Applied
- [Which knowledge notes were used and why]
```

### 6. Handoff

After writing the design document:

**Announce:** "Design saved to `docs/plans/<filename>`. Proceeding to create the implementation plan."

**REQUIRED:** Invoke the plan skill to continue the cascade:
```python
Skill(skill="plan-grasshopper", args="docs/plans/<filename>")
```

Do not wait for the user to manually invoke the next skill — proceed automatically.
If the user wants to pause, they can interrupt.

## Integration

**Cascades into:**
- **plan-grasshopper** (REQUIRED) — automatically invoked after design is validated

**Called by:**
- Direct user invocation (`/design-grasshopper`)

## Invariants

- **Never skip explore** — always query the knowledge store before designing, even for simple definitions
- **Every component must have a known GUID** — from `gh_knowledge_query` or `gh_library` lookup; never guess component names
- **Design doc is the single source of truth** — the plan phase reads only this document, so it must be complete and unambiguous

## Key Principles

- **One question at a time** — don't overwhelm with multiple questions
- **Multiple choice preferred** — easier to answer than open-ended
- **YAGNI ruthlessly** — remove unnecessary components from designs
- **Knowledge-grounded** — every design decision should reference what the knowledge store knows
- **Follow related concepts** — A-MEM semantic neighbors are your guide to related patterns
- **Incremental validation** — present design in sections, validate each
- **Be flexible** — go back and revise when something doesn't make sense

## References

- See [explore-checklist.md](./references/explore-checklist.md) for detailed explore phase guidance
- See [wasp-domain-context.md](./references/wasp-domain-context.md) for Wasp discrete aggregation — load during explore when intent involves modular assembly, discrete parts, aggregation rules, or any Wasp trigger phrase
- See [wasp-rhino-scaffold.md](./references/wasp-rhino-scaffold.md) for Rhino scene preparation — load during explore when Wasp intent requires geometry inspection, layer organization, connection analysis, or part creation
