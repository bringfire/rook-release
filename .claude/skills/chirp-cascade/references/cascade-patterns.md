# Cascade Patterns

Pre-built topologies for common Chirp reasoning cascades. Choose a pattern, then customize
the signatures for the specific project.

## 1. Design Language (Fan-out)

One Planner interprets a design brief. Its Reasoning fans out to N domain interpreters.
Best for: multi-discipline projects where one intent drives all systems.

```
[Brief Panel]
      |
  * Planner
      |
      +-- Reasoning --> * Structure
      +-- Reasoning --> * Envelope
      +-- Reasoning --> * Environment
```

**Planner signature example:**
```
pins_in:  ["DesignBrief:string"]
pins_out: ["CeilingHeight:float", "BaySpacing:float", "GlazingRatio:float"]
signature: "design_brief -> ceiling_height, bay_spacing, glazing_ratio"
```

**Downstream signature example (Structure):**
```
pins_in:  ["PlannerReasoning:string", "Span:float"]
pins_out: ["BeamDepth:float", "ColumnDiameter:float", "SystemType:string"]
signature: "planner_reasoning, span -> beam_depth, column_diameter, system_type"
```

## 2. Brief-to-Build (Chain)

Linear cascade where each component reads the previous one's Reasoning.
Best for: sequential design processes where each decision constrains the next.

```
[Brief Panel]
      |
  * Massing --> Reasoning --> * Structure --> Reasoning --> * Envelope --> Reasoning --> * Critic
```

Each component's reasoning accumulates context. The Critic at the end evaluates
the full chain. Note: later components in the chain have richer context because
they receive reasoning that already incorporates upstream decisions.

## 3. Wasp Aggregation Config

Specialized pattern for discrete design with Wasp plugin.
Best for: modular architecture, aggregation-based workflows.

```
[Intent Panel]
      |
  * Aggregation Config
      |
      +-- wall_ratio, opening_ratio --> [Wasp Parts Catalog]
      +-- field_direction, field_strength --> [Wasp Field]
      +-- constraint_mode, target_parts --> [Wasp Aggregation]
      +-- Reasoning --> * Post-Aggregation Critic
```

**Aggregation Config signature:**
```
pins_in:  ["DesignIntent:string", "PartTypes:string", "SiteConstraints:string"]
pins_out: ["WallRatio:float", "OpeningRatio:float", "RoofRatio:float",
           "FieldDirectionX:float", "FieldDirectionY:float", "FieldDirectionZ:float",
           "FieldStrength:float", "ConstraintMode:int", "TargetParts:int"]
signature: "design_intent, part_types, site_constraints -> wall_ratio, opening_ratio, roof_ratio, field_direction_x, field_direction_y, field_direction_z, field_strength, constraint_mode, target_parts"
```

## 4. Multi-Option Exploration

Parallel Planners generate contrasting options from the same brief.
A Comparator reads all Reasoning outputs to evaluate trade-offs.
Best for: early design exploration, presenting options to clients.

```
[Brief Panel]
      |
      +----> * Planner (Conservative)  --> Reasoning --+
      +----> * Planner (Moderate)      --> Reasoning --+--> * Comparator
      +----> * Planner (Bold)          --> Reasoning --+
```

Each planner has the same output pins but different signature phrasing:
- Conservative: `"design_brief -> conservative_ceiling_height, conservative_bay_spacing, ..."`
- Bold: `"design_brief -> ambitious_ceiling_height, generous_bay_spacing, ..."`

The field names in the signature steer the LLM's interpretation. Same inputs, different
semantic framing, different numerical outputs.

## 5. Hybrid (Fan-out + Critic)

Combines fan-out with a downstream Critic that reads ALL Reasoning outputs.
Best for: quality assurance, catching incoherences.

```
[Brief Panel]
      |
  * Planner
      |
      +-- Reasoning --> * Structure  --> Reasoning --+
      +-- Reasoning --> * Envelope   --> Reasoning --+--> * Critic
      +-- Planner Reasoning -------------------------+
```

The Critic receives three Reasoning inputs and cross-checks them:
```
pins_in:  ["PlannerReasoning:string", "StructureReasoning:string", "EnvelopeReasoning:string"]
pins_out: ["Coherent:bool", "Issues:string", "Suggestions:string"]
signature: "planner_reasoning, structure_reasoning, envelope_reasoning -> coherent, issues, suggestions"
```

## 6. Grammar Authoring (Gated Chain)

A chain where a Gate can reject and refine. The Interpreter authors Wasp graph-grammar
production rules; the Critic evaluates; the Gate approves or sends corrections back.
Best for: deterministic construction sequences, architectural assembly grammars, Wasp
Graph-Grammar Aggregation.

```
[Brief Panel]  [Part Types Panel]  [Grammar Syntax Panel]
      |               |                    |
  * Planner ----------+                    |
      |                                    |
      +-- Reasoning --> * Interpreter -----+
                             |
                             +-- ProductionRules ---+----> [Grammar Panel] --> [Wasp Graph-Grammar Aggregation]
                             +-- Reasoning -------->|
                                                    |
                                                * Critic
                                                    |
                                                    +-- Reasoning --> * Gate
                                                    +-- Viable ----> * Gate
                                                                       |
                                                                       +-- FinalGrammar --> [Grammar Panel]
                                                                       +-- CorrectionNeeded --> [Correction Panel]
                                                                                                     |
                                                              (manual feedback loop back to Interpreter.Correction)
```

**Planner signature (category: planner):**
```
pins_in:  ["DesignBrief:string", "PartTypes:string", "SiteConstraints:string"]
pins_out: ["AssemblyStrategy:string", "GrammarDepth:int", "BranchingFactor:int"]
signature: "design_brief, part_types, site_constraints -> assembly_strategy, grammar_depth, branching_factor"
```

**Interpreter signature (category: interpreter):**
```
pins_in:  ["PlannerReasoning:string", "PartTypes:string", "WaspGrammarSyntax:string"]
pins_out: ["ProductionRules:string", "RuleCount:int", "IsRecursive:bool"]
signature: "planner_reasoning, part_types, wasp_grammar_syntax -> production_rules, rule_count, is_recursive"
```

**Critic signature (category: critic):**
```
pins_in:  ["InterpreterReasoning:string", "ProductionRules:string", "StructuralRequirements:string"]
pins_out: ["Viable:bool", "StructuralIssues:string", "AestheticScore:float", "Suggestions:string"]
signature: "interpreter_reasoning, production_rules, structural_requirements -> viable, structural_issues, aesthetic_score, suggestions"
```

**Gate signature (category: gate):**
```
pins_in:  ["CriticReasoning:string", "Viable:bool", "ProductionRules:string"]
pins_out: ["Approved:bool", "FinalGrammar:string", "CorrectionNeeded:string"]
signature: "critic_reasoning, viable, production_rules -> approved, final_grammar, correction_needed"
```

**Gated refinement:** The Gate's `CorrectionNeeded` output wires to a Panel. If the Gate
rejects (`Approved=false`), the user (or a future automation) copies the correction text
to the Interpreter's Correction input pin. The Interpreter reconciles its upstream Reasoning
with the correction and produces revised ProductionRules. This is a manual feedback loop
in GH (not an automatic retry) because GH has no cyclic wiring.

**Wasp integration:** The Gate's `FinalGrammar` output wires through a Panel to the Wasp
Graph-Grammar Aggregation component's grammar input (GR parameter). See
[wasp-grammar-authoring.md](wasp-grammar-authoring.md) for the full wiring guide.

**Reference:** See `plan-grasshopper/references/wasp/wasp-grammar-aggregate.md` for the
Wasp side of this integration.
