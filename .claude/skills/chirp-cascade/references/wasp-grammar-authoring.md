# Wasp Grammar Authoring — Chirp Cascade Reference

Detailed guide for building a Pattern 6 (Grammar Authoring) cascade and wiring it to
Wasp's Graph-Grammar Aggregation component. This separates **design reasoning**
(Chirp, LLM-driven) from **assembly execution** (Wasp, rule-driven, deterministic).

## When to Use This Pattern

- User wants a **deterministic construction sequence** driven by design intent
- Assembly logic is too complex for manual grammar authoring
- The grammar should respond to design briefs, site constraints, or programmatic requirements
- Architectural grammars: steel frames, curtain walls, modular cluster housing

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│ Chirp Cascade (Reasoning Layer)                          │
│                                                          │
│  Planner ──→ "This site needs 3 bays, 4 stories"        │
│       │                                                  │
│       ▼                                                  │
│  Interpreter ──→ Production rules as text                │
│       │              "column > beam"                     │
│       │              "beam > connector"                  │
│       │              "connector > column"                │
│       ▼                                                  │
│  Critic ──→ "Rules produce stable structure? Yes/No"     │
│       │                                                  │
│       ▼                                                  │
│  Gate ──→ Approve grammar or send corrections back       │
└──────────┬──────────────────────────────────────────────┘
           │
           │ FinalGrammar (text)
           ▼
┌─────────────────────────────────────────────────────────┐
│ Wasp Graph-Grammar Aggregation (Execution Layer)         │
│                                                          │
│  Grammar rules from Chirp drive deterministic assembly   │
│  Constraints (series 4) enforce structural validity      │
│  Result: buildable, documented, reproducible assembly    │
└─────────────────────────────────────────────────────────┘
```

## Component Design

### 1. Grammar Planner (category: planner)

Interprets the design brief into a high-level assembly strategy. Decides grammar
structure, not specific rules.

```python
chirp_create(
    category="planner",
    name="Grammar Planner",
    pins_in=[
        "DesignBrief:string",        # "3-bay steel frame, 4 stories"
        "PartTypes:string",          # "column, beam, connector, bracing"
        "SiteConstraints:string"     # "rectangular footprint, 60m x 20m"
    ],
    pins_out=[
        "AssemblyStrategy:string",   # "repeat bay module along long axis"
        "GrammarDepth:int",          # 3 (levels of nesting in grammar)
        "BranchingFactor:int"        # 4 (typical children per non-terminal)
    ],
    signature="design_brief, part_types, site_constraints -> assembly_strategy, grammar_depth, branching_factor"
)
```

**Key design choice:** The Planner outputs *strategy*, not *rules*. Strategy is
"repeat bay module along long axis" — the Interpreter translates that into Wasp
production rule syntax.

### 2. Grammar Interpreter (category: interpreter)

Translates the Planner's strategy into concrete Wasp grammar production rules.
This is the component that requires Wasp-specific knowledge.

```python
chirp_create(
    category="interpreter",
    name="Grammar Interpreter",
    pins_in=[
        "PlannerReasoning:string",     # Full reasoning from Planner
        "PartTypes:string",            # Same part types (for rule syntax)
        "WaspGrammarSyntax:string"     # Reference syntax: "part_a > part_b"
    ],
    pins_out=[
        "ProductionRules:string",      # "column > beam\nbeam > connector\n..."
        "RuleCount:int",               # Number of production rules
        "IsRecursive:bool"             # Whether grammar has recursive rules
    ],
    signature="planner_reasoning, part_types, wasp_grammar_syntax -> production_rules, rule_count, is_recursive"
)
```

**The WaspGrammarSyntax input** is critical — it provides the Interpreter with the
exact text format Wasp expects. Wire this to a Panel containing grammar syntax examples.

**Grammar syntax reference (for the Panel):**
```
Wasp production rule syntax:
- Each line is one rule: source_part > target_part
- Parts are referenced by name (must match Part component names)
- Multiple rules can fire from the same source
- Rules execute in order during aggregation
Example:
column > beam
beam > connector
connector > column
beam > bracing
```

### 3. Grammar Critic (category: critic)

Evaluates whether the produced grammar will create viable architecture.

```python
chirp_create(
    category="critic",
    name="Grammar Critic",
    pins_in=[
        "InterpreterReasoning:string",       # How the grammar was authored
        "ProductionRules:string",            # The actual rules to evaluate
        "StructuralRequirements:string"      # "gravity-stable, lateral bracing"
    ],
    pins_out=[
        "Viable:bool",                # Does this grammar produce stable structure?
        "StructuralIssues:string",    # "no bracing rule for wind loads"
        "AestheticScore:float",       # 0.0-1.0 subjective quality estimate
        "Suggestions:string"          # "add bracing rule after every 3rd bay"
    ],
    signature="interpreter_reasoning, production_rules, structural_requirements -> viable, structural_issues, aesthetic_score, suggestions"
)
```

### 4. Grammar Gate (category: gate)

Final approval checkpoint. If the Critic says viable=false, the Gate produces
correction text for the Interpreter.

```python
chirp_create(
    category="gate",
    name="Grammar Gate",
    pins_in=[
        "CriticReasoning:string",    # Full critic evaluation
        "Viable:bool",               # Pass/fail from critic
        "ProductionRules:string"     # The rules being evaluated
    ],
    pins_out=[
        "Approved:bool",             # true → grammar is ready for Wasp
        "FinalGrammar:string",       # The approved grammar text
        "CorrectionNeeded:string"    # If not approved, what to fix
    ],
    signature="critic_reasoning, viable, production_rules -> approved, final_grammar, correction_needed"
)
```

## Wiring: Chirp → Wasp

### Step-by-Step Wiring Plan

```python
# Phase A: Create Chirp components (upstream first)

# A1: Input panels
gh_execute_intent(intent="create panel", x=100, y=100)   # → $BRIEF_PANEL
gh_execute_intent(intent="create panel", x=100, y=200)   # → $PARTS_PANEL
gh_execute_intent(intent="create panel", x=100, y=300)   # → $SITE_PANEL
gh_execute_intent(intent="create panel", x=100, y=600)   # → $GRAMMAR_SYNTAX_PANEL
gh_execute_intent(intent="create panel", x=100, y=700)   # → $STRUCTURAL_REQ_PANEL

# A2: Planner
chirp_create(category="planner", name="Grammar Planner", ...)  # → $PLANNER
# Wire: $BRIEF_PANEL → Planner.DesignBrief
# Wire: $PARTS_PANEL → Planner.PartTypes
# Wire: $SITE_PANEL → Planner.SiteConstraints

# A3: Interpreter
chirp_create(category="interpreter", name="Grammar Interpreter", ...)  # → $INTERPRETER
# Wire: $PLANNER.Reasoning → Interpreter.PlannerReasoning
# Wire: $PARTS_PANEL → Interpreter.PartTypes
# Wire: $GRAMMAR_SYNTAX_PANEL → Interpreter.WaspGrammarSyntax

# A4: Critic
chirp_create(category="critic", name="Grammar Critic", ...)  # → $CRITIC
# Wire: $INTERPRETER.Reasoning → Critic.InterpreterReasoning
# Wire: $INTERPRETER.ProductionRules → Critic.ProductionRules
# Wire: $STRUCTURAL_REQ_PANEL → Critic.StructuralRequirements

# A5: Gate
chirp_create(category="gate", name="Grammar Gate", ...)  # → $GATE
# Wire: $CRITIC.Reasoning → Gate.CriticReasoning
# Wire: $CRITIC.Viable → Gate.Viable
# Wire: $INTERPRETER.ProductionRules → Gate.ProductionRules

# A6: Correction feedback panel (for manual refinement loop)
gh_execute_intent(intent="create panel", x=700, y=400)   # → $CORRECTION_PANEL
# Display: $GATE.CorrectionNeeded → $CORRECTION_PANEL
# User manually copies correction to Interpreter's Correction pin if needed

# Phase B: Wire Gate output to Wasp Graph-Grammar Aggregation

# B1: Grammar output panel (bridges Chirp → Wasp)
gh_execute_intent(intent="create panel", x=900, y=300)   # → $GRAMMAR_OUTPUT
# Wire: $GATE.FinalGrammar → $GRAMMAR_OUTPUT

# B2: Wire to Wasp (assumes wasp-grammar-aggregate sub-skill has created the component)
gh_connect(sourceGuid=$GRAMMAR_OUTPUT, targetGuid=$GRAMMAR_AGG, targetParam="GR")
```

### Canvas Layout

```
x=100         x=400           x=700            x=900         x=1200
Panels        Chirp Chain     Chirp Chain      Bridge        Wasp
              (upstream)      (downstream)

Brief ─────→ Planner ──R──→ Interpreter ──R──→ Critic ──R──→ Gate
Parts ──┬──→            └──→              │                    │
Site ───┘                                 │         FinalGrammar ──→ [Panel] ──→ Grammar Agg
Syntax ───────────────→                   │         CorrectionNeeded → [Panel]
Requirements ──────────────────────────→  │
                                                              │
                                                     [Correction Panel]
                                                    (manual feedback to
                                                    Interpreter.Correction)
```

## Feedback Loop: How Refinement Works

GH has no cyclic wiring, so the "loop back" is manual:

1. Gate outputs `Approved=false` and `CorrectionNeeded="add bracing rule after beam"`
2. CorrectionNeeded text appears in a Panel on canvas
3. User reads the correction and copies it to a Panel connected to Interpreter's
   Correction input pin (the universal Correction pin on every Chirp component)
4. Interpreter reconciles its upstream PlannerReasoning with the correction
5. Interpreter produces revised ProductionRules
6. Critic re-evaluates → Gate re-evaluates → hopefully `Approved=true`

**Future automation opportunity:** A GH timer + Python script could automate this
copy step, creating an auto-refinement loop. But for now, manual is appropriate —
it keeps the architect in the loop for grammar design decisions.

## Architectural Grammar Examples

### Steel Frame (3-Bay, 4-Story)

**Brief:** "Design a 3-bay, 4-story steel frame with diagonal bracing"
**Part Types:** "column, beam, connector, diagonal_brace"

Expected Interpreter output:
```
column > beam
beam > connector
connector > column
beam > diagonal_brace
diagonal_brace > beam
```

### Curtain Wall (Modular Panels)

**Brief:** "Curtain wall with alternating glass and spandrel panels between mullions"
**Part Types:** "mullion_v, mullion_h, glass_panel, spandrel_panel"

Expected Interpreter output:
```
mullion_v > mullion_h
mullion_h > glass_panel
glass_panel > mullion_h
mullion_h > spandrel_panel
spandrel_panel > mullion_h
mullion_h > mullion_v
```

### Modular Cluster Housing

**Brief:** "Stacked residential units with shared circulation cores"
**Part Types:** "unit_a, unit_b, core, bridge, roof_garden"

Expected Interpreter output:
```
core > unit_a
core > unit_b
unit_a > unit_b
unit_b > unit_a
unit_a > bridge
bridge > unit_a
unit_b > roof_garden
```

## Integration with Other Sub-Skills

This cascade integrates with the Wasp sub-skill chain at the grammar input:

```
wasp-parts → wasp-rules → [Chirp Grammar Cascade] → wasp-grammar-aggregate
                                                          ↑
                                              FinalGrammar feeds GR param
```

The Chirp cascade **replaces the static grammar text panel** in wasp-grammar-aggregate's
tool call pattern (Step 1). Everything else in the Wasp chain remains identical.

## Gotchas

1. **Grammar syntax must match Wasp exactly** — the Interpreter's WaspGrammarSyntax
   input pin must contain reference syntax. Without it, the LLM may invent formats.
2. **Part names in grammar must match Part component names** — if the grammar says
   "column > beam" but the Part is named "Column_A", aggregation fails silently.
3. **Solve order matters** — Chirp components solve sequentially (data dependencies).
   The full cascade solves before the grammar reaches Wasp. Allow extra solve time.
4. **One cascade per grammar** — don't share a cascade across multiple Graph-Grammar
   Aggregation components. Each aggregation needs its own grammar.
5. **Correction pin is per-component** — correcting the Interpreter doesn't affect
   the Planner. Each component's Correction input is independent.
6. **Test the cascade with Panels first** — validate reasoning outputs before wiring
   to Wasp. A bad grammar text silently produces wrong aggregations.
