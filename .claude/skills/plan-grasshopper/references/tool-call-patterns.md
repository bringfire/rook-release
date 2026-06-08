# Tool Call Patterns Reference

Common MCP tool call sequences for Grasshopper definition construction.

## Pattern: Slider-Controlled Component

The most common pattern — a number slider feeding into a component parameter.

```python
# 1. Create the slider
gh_execute_intent(intent="create number slider named Radius", x=100, y=100)
# → Record as $RADIUS_SLIDER

# 2. Set range immediately
gh_set_value(guid=$RADIUS_SLIDER, value=5.0, min=0.1, max=50.0)

# 3. Create the target component
gh_execute_intent(intent="create sphere component", x=400, y=100)
# → Record as $SPHERE

# 4. Wire slider to component
gh_edit(epoch=<current>, connect=["$RADIUS_SLIDER.O0>$SPHERE.I0"])
```

**Gotcha:** Always set slider value/range BEFORE wiring. Some components compute immediately on connection and may error with default 0-1 range.

## Pattern: Multi-Input Component

Component with several inputs from different sources.

```python
# Create inputs
gh_execute_intent(intent="create point parameter", x=100, y=100)  # → $CENTER
gh_execute_intent(intent="create number slider named Radius", x=100, y=200)  # → $RADIUS
gh_execute_intent(intent="create number slider named Height", x=100, y=300)  # → $HEIGHT

# Set slider ranges
gh_set_value(guid=$RADIUS, value=5.0, min=0.1, max=50.0)
gh_set_value(guid=$HEIGHT, value=10.0, min=1.0, max=100.0)

# Create component
gh_execute_intent(intent="create cylinder component", x=400, y=200)  # → $CYLINDER

# Wire all inputs in a single batch edit
gh_edit(epoch=<current>, connect=[
  "$CENTER.O0>$CYLINDER.I0",   # Base plane
  "$RADIUS.O0>$CYLINDER.I1",   # Radius
  "$HEIGHT.O0>$CYLINDER.I2"    # Length
])
```

## Pattern: Component Chain

Sequential processing: output of one feeds input of next.

```python
# Step 1: Create curve
gh_execute_intent(intent="create circle component", x=100, y=100)  # → $CIRCLE

# Step 2: Extrude it
gh_execute_intent(intent="create extrude component", x=400, y=100)  # → $EXTRUDE

# Step 3: Cap it
gh_execute_intent(intent="create cap holes component", x=700, y=100)  # → $CAP

# Wire the chain in one edit
gh_edit(epoch=<current>, connect=[
  "$CIRCLE.O0>$EXTRUDE.I0",
  "$EXTRUDE.O0>$CAP.I0"
])

# Checkpoint after chain
gh_solve(delay=500)
gh_errors()
```

## Pattern: Data Tree Manipulation

When components produce trees but downstream expects flat lists.

```python
# Create component that outputs a tree
gh_execute_intent(intent="create divide curve component", x=400, y=100)  # → $DIVIDE

# Create flatten component
gh_execute_intent(intent="create flatten tree component", x=600, y=100)  # → $FLATTEN

# Wire with flatten in between
gh_edit(epoch=<current>, connect=[
  "$DIVIDE.O0>$FLATTEN.I0",
  "$FLATTEN.O0>$DOWNSTREAM.I0"
])
```

**Gotcha:** Many components silently produce tree output. If downstream complains about "path mismatch", insert Flatten/Graft between them.

## Pattern: Boolean Toggle Control

For enabling/disabling parts of the definition.

```python
# Create toggle
gh_execute_intent(intent="create boolean toggle", x=100, y=400)  # → $TOGGLE
gh_set_value(guid=$TOGGLE, value="true")

# Create gate component (Stream Filter or similar)
gh_execute_intent(intent="create stream filter", x=400, y=400)  # → $GATE
gh_edit(epoch=<current>, connect=["$TOGGLE.O0>$GATE.I0"])
```

## Pattern: Python Script Component

For custom logic that doesn't have a native component.

```python
# Create Python 3 Script component
gh_execute_intent(intent="create python 3 script component", x=400, y=300)  # → $SCRIPT

# Set the code
gh_set_script(guid=$SCRIPT, script="import Rhino.Geometry as rg\n\na = x * 2\n")

# Wire inputs
gh_edit(epoch=<current>, connect=["$INPUT.O0>$SCRIPT.I0"])
```

## Checkpoint Protocol

After every 3-5 component creations:

```python
# 1. Trigger solution
gh_solve(delay=500)

# 2. Check for errors
gh_errors()
```

**Interpreting errors:**
- `"Null"` on an input — missing upstream connection
- `"Data conversion failed"` — wrong parameter type, check wiring
- `"1. Solution exception"` — component internal error, check parameter values
- Warnings (yellow) — usually acceptable, verify visually

**If errors found:**
1. Check if error matches a known gotcha from the plan
2. If yes: apply the documented fix
3. If no: inspect the failing component with `gh_batch_component_info(names=[<component_name>])`
4. If still failing after one fix attempt: stop and report to user

## Canvas Position Arithmetic

```
Input Column    Processing 1    Processing 2    Output
x=100           x=400           x=700           x=1000

y=100 ─── Slider ──── Component ──── Component ──── Output
y=250 ─── Slider ──── Component ──── Component
y=400 ─── Toggle ──── Gate
```

- **Horizontal spacing:** 300px between connected components
- **Vertical spacing:** 150px between parallel items
- **Group gap:** 100px between logical groups
