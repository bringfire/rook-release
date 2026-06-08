---
name: chirp-cascade
description: >
  Build reasoning cascades of Chirp components from natural language design briefs.
  Creates multiple LLM-embedded Grasshopper components with Reasoning pin fan-out
  for multi-discipline design coherence. Triggers: "chirp cascade", "reasoning cascade",
  "design language cascade", "chirp pattern", building multiple Chirp components that
  share reasoning context, setting up Wasp aggregation with semantic configuration,
  Wasp grammar authoring, graph-grammar cascade, production rule generation,
  or any workflow requiring coordinated LLM reasoning across GH components.
---

# Chirp Cascade

Build a coordinated set of Chirp components where Reasoning pins propagate design
intent across disciplines. Each component is an LLM-embedded GH node created via
the `chirp_create` MCP tool.

## Prerequisites

- Rhino + Grasshopper open (`rhino_ping` responds)
- Chirp adapter (auto-started by Rook's chirp_manager via CHIRP_HOME)
- Rook MCP server connected

## Workflow

### Step 0: Preflight

Before any design work, verify all services are up:

1. **Rhino**: Call `rhino_ping`. If no response, tell the user to open Rhino.
2. **Chirp adapter**: Chirp is auto-managed by Rook's chirp_manager — it starts automatically when needed via CHIRP_HOME discovery. If `chirp_create` calls fail, tell the user to check their Chirp installation.
3. **Grasshopper**: Verify GH is open (attempt `gh_snapshot` or similar). If not, tell the user.

All three must be confirmed before moving to Step 1.

### Step 1: Decompose

Ask the user for a design brief if not provided. Then decompose into domains:

1. Identify which disciplines matter for this brief (structure, envelope, environment, landscape, MEP, etc.)
2. Determine the cascade topology — see [references/cascade-patterns.md](references/cascade-patterns.md) for pre-built patterns:
   - **Fan-out**: One Planner, multiple downstream interpreters (most common)
   - **Chain**: Linear reasoning propagation A -> B -> C
   - **Hybrid**: Fan-out with a downstream Critic that reads all Reasoning outputs
3. Present the proposed decomposition and get user approval before building

### Step 2: Design Signatures

For each component in the cascade, design:

1. **Input pins**: What data enters (strings for semantic, numbers for quantitative)
2. **Output pins**: What typed values exit (int, float, string, bool)
3. **DSPy signature**: The `"input_a, input_b -> output_x, output_y"` string
4. **Reasoning routing**: Which components receive this component's Reasoning output

See [references/signature-guide.md](references/signature-guide.md) for pin types, naming conventions, and examples.

Signature design rules:
- Planner always takes a text brief as primary input
- Downstream components take upstream Reasoning as a string input pin (e.g., `PlannerReasoning:string`)
- Output pin names become DSPy field names (snake_cased) -- they ARE the prompt
- Keep signatures focused: 2-4 inputs, 3-6 outputs per component

### Step 3: Build

For each component in dependency order (upstream first):

1. Call `chirp_create` MCP tool with `pins_in`, `pins_out`, `signature`
2. Note the component GUID from the creation result
3. After all components exist, wire Reasoning outputs to downstream inputs using `gh_edit`
4. Place Panel components on each Reasoning output for visibility
5. Place a Panel for the design brief input text

### Step 4: Test

1. Set the brief text in the input Panel
2. Read all Reasoning Panel outputs after solve
3. Check coherence:
   - Does each downstream component reference the upstream reasoning?
   - Are domain interpretations consistent with the brief?
   - Do numerical outputs make sense for the stated intent?
4. If incoherent: adjust signatures (field names carry semantic weight) or add explicit input pins for information that Reasoning alone doesn't convey

### Step 5: Iterate

1. Change the brief text to a contrasting scenario
2. Verify all outputs shift coherently
3. If a downstream component ignores upstream reasoning, rename its reasoning input pin to something more descriptive (e.g., `massing_rationale` instead of generic `reasoning`)

## Key Principles

- **Reasoning is a shared context bus**, not a debug output. It propagates design intent through the graph.
- **Fan-out of reasoning = fan-out of intent.** Each downstream LLM interprets through its own domain lens.
- **Numbers drive geometry. Reasoning drives coherence.** Two parallel data streams in the graph.
- **Signatures are prompts.** Field names like `beam_depth` communicate differently than `depth_mm`. Choose names that convey design intent.
- **Start without geometry.** Validate the reasoning cascade with Panels first. Wire to geometry second.
- **The Reasoning pin is always auto-added.** Every Chirp component gets one. The pin name "Reasoning" is reserved and cannot be used for user-defined output pins.

## References

- See [cascade-patterns.md](references/cascade-patterns.md) for pre-built topologies (Patterns 1-6)
- See [signature-guide.md](references/signature-guide.md) for pin types, naming conventions, and examples
- See [wasp-grammar-authoring.md](references/wasp-grammar-authoring.md) for Pattern 6 detailed wiring guide — Chirp cascade → Wasp Graph-Grammar Aggregation
